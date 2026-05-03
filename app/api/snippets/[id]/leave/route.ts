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

    await prisma.$transaction(async (tx) => {
      
      if (isOwner) {

        if (snippet.collaborators.length > 0) {
          
          const coOwner = snippet.collaborators.find(c => c.role === Role.CO_OWNER);
          const successor = coOwner || snippet.collaborators[0];

          await tx.snippet.update({
            where: { id: snippet.id },
            data: { ownerId: successor.userId }
          });

          await tx.collaboration.delete({ where: { id: successor.id } });

        } else {
          await tx.snippet.delete({ where: { id: snippet.id } });
        }
      } else {
        await tx.collaboration.delete({ where: { id: userCollab!.id } });
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: isOwner ? "Left snippet and transferred ownership" : "Left snippet successfully",
    }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}