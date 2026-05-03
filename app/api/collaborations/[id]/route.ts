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

    const collaboration = await prisma.collaboration.findUnique({
      where: { id },
      include: { snippet: { include: { collaborators: true } } }
    });

    if (!collaboration){
        return NextResponse.json({ success: false, message: "Collaboration not found" }, { status: 404 });
    }

    const snippet = collaboration.snippet;

    if (collaboration.userId === user.id) {
      return NextResponse.json({ success: false, message: "You cannot remove yourself from a snippet" }, { status: 400 });
    }

    const isOwner = snippet.ownerId === user.id;
    const currentUserCollab = snippet.collaborators.find(c => c.userId === user.id);
    const isCoOwner = currentUserCollab?.role === Role.CO_OWNER;

    if (!isOwner && !isCoOwner) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    if (isCoOwner && !isOwner && collaboration.role === Role.CO_OWNER) {
      return NextResponse.json({ success: false, message: "Co-Owners cannot remove other Co-Owners" }, { status: 403 });
    }

    await prisma.collaboration.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Collaborator removed successfully" }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}