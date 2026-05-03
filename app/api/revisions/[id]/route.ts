import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

type Props = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const { user } = await getUser();

    const revision = await prisma.revision.findUnique({
      where: { id: id },
      include: {
        snippet: { include: { collaborators: true } }
      }
    });

    if (!revision) {
      return NextResponse.json({ success: false, message: "Revision not found" }, { status: 404 });
    }

    const snippet = revision.snippet;
    const isOwner = user?.id === snippet.ownerId;
    const isCollaborator = snippet.collaborators.some(c => c.userId === user?.id);
    const isPublicOrUnlisted = snippet.visibility === "PUBLIC" || snippet.visibility === "UNLISTED";

    if (!isOwner && !isCollaborator && !isPublicOrUnlisted) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 });
    }

    const formattedRevision = {
      id: revision.id,
      snippetId: revision.snippetId,
      content: revision.content,
      message: revision.message,
      createdAt: revision.createdAt,
    };

    return NextResponse.json({ success: true, data: formattedRevision }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}