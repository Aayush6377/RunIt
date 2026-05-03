import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

type Props = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const { user, error } = await getUser();
    if (error || !user) {
        return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const snippet = await prisma.snippet.findUnique({
      where: { id },
      include: {
        collaborators: {
          include: { user: { select: { id: true, name: true, username: true, image: true, email: true } } }
        }
      }
    });

    if (!snippet){
        return NextResponse.json({ success: false, message: "Snippet not found" }, { status: 404 });
    }

    const isOwner = snippet.ownerId === user.id;
    const isCollaborator = snippet.collaborators.some(c => c.userId === user.id);

    if (!isOwner && !isCollaborator) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: snippet.collaborators }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}