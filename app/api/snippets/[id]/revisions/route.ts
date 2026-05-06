import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { Role } from "@prisma/client";

type Props = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const { user } = await getUser();

    const snippet = await prisma.snippet.findUnique({
      where: { id },
      include: { collaborators: true }
    });

    if (!snippet) {
      return NextResponse.json({ success: false, message: "Snippet not found" }, { status: 404 });
    }

    const isOwner = user?.id === snippet.ownerId;
    const isCollaborator = snippet.collaborators.some(c => c.userId === user?.id);
    const isPublic = snippet.visibility === "PUBLIC";

    if (!isOwner && !isCollaborator && !isPublic) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const revisions = await prisma.revision.findMany({
      where: { snippetId: id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        message: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: "Revisions retrieved successfully",
      data: revisions,
    }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

const createRevisionSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  message: z.string().optional().default("Update snippet"),
});

export async function POST(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const { user, error } = await getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsedData = createRevisionSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ success: false, message: parsedData.error.issues[0].message }, { status: 400 });
    }

    const snippet = await prisma.snippet.findUnique({
      where: { id },
      include: { collaborators: true }
    });

    if (!snippet) {
      return NextResponse.json({ success: false, message: "Snippet not found" }, { status: 404 });
    }

    const isOwner = user.id === snippet.ownerId;
    const userCollab = snippet.collaborators.find(c => c.userId === user.id);
    const isCoOwner = userCollab?.role === Role.CO_OWNER;
    const isEditor = userCollab?.role === Role.EDITOR;

    if (!isOwner && !isCoOwner && !isEditor) {
      return NextResponse.json({ 
        success: false, 
        message: "You do not have permission to commit changes" 
      }, { status: 403 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.snippet.update({
        where: { id },
        data: { content: parsedData.data.content }
      });

      await tx.revision.create({
        data: {
          snippetId: id,
          content: parsedData.data.content,
          message: parsedData.data.message,
        }
      });
    });

    return NextResponse.json({ success: true, message: "Code committed successfully" }, { status: 201 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}