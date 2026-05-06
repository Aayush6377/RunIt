import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getUser } from "@/lib/auth";

type Props = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    
    const { user, error } = await getUser();
    if (error || !user) {
        return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const snippet = await prisma.snippet.findUnique({
      where: { id },
      include: { collaborators: true }
    });

    if (!snippet){
        return NextResponse.json({ success: false, message: "Snippet not found" }, { status: 404 });
    }

    const isOwner = snippet.ownerId === user.id;
    const userCollab = snippet.collaborators.find(c => c.userId === user.id);

    if (!isOwner && !userCollab) {
      return NextResponse.json({ success: false, message: "You are not a part of this snippet" }, { status: 400 });
    }

    let actionTaken = "";

    await prisma.$transaction(async (tx) => {
      
      if (isOwner) {
        const coOwner = snippet.collaborators.find(c => c.role === Role.CO_OWNER);

        if (coOwner) {

          await tx.snippet.update({
            where: { id: snippet.id },
            data: { ownerId: coOwner.userId }
          });

          await tx.collaboration.delete({ where: { id: coOwner.id } });
          actionTaken = "Left snippet and transferred ownership to a Co-Owner";
          
        } else {

          await tx.snippet.delete({ where: { id: snippet.id } });
          actionTaken = "Snippet deleted because there were no Co-Owners to transfer ownership to";
        }
      } else {

        await tx.collaboration.delete({ where: { id: userCollab!.id } });
        actionTaken = "Left snippet successfully";
      }
    });

    return NextResponse.json({ success: true, message: actionTaken }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}