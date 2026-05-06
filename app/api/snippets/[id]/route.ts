import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Language, Visibility, Role } from "@prisma/client";
import { getUser } from "@/lib/auth";

type Props = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const { user } = await getUser();

    const snippet = await prisma.snippet.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, username: true, image: true } },
        collaborators: {
          include: { user: { select: { id: true, name: true, username: true, image: true } } }
        }
      }
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

    return NextResponse.json({ success: true, data: snippet }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

const updateSnippetSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
  fileName: z.string().min(1, "Filename cannot be empty").optional(),
  language: z.nativeEnum(Language).optional(),
  content: z.string().optional(),
  visibility: z.nativeEnum(Visibility).optional(),
});

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const { user, error } = await getUser();
    
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized", data: null }, { status: 401 });
    }

    const existingSnippet = await prisma.snippet.findUnique({
      where: { id },
      include: { collaborators: true }
    });

    if (!existingSnippet) {
      return NextResponse.json({ success: false, message: "Snippet not found" }, { status: 404 });
    }

    const isOwner = user.id === existingSnippet.ownerId;
    const userCollab = existingSnippet.collaborators.find(c => c.userId === user.id);
    const isCoOwner = userCollab?.role === Role.CO_OWNER;
    const isEditor = userCollab?.role === Role.EDITOR;

    if (!isOwner && !isCoOwner && !isEditor) {
      return NextResponse.json({ success: false, message: "Unauthorized: You do not have edit permissions" }, { status: 403 });
    }

    const body = await req.json();
    const parsedData = updateSnippetSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ success: false, message: parsedData.error.issues[0].message }, { status: 400 });
    }

    let dataToUpdate = parsedData.data;

    if (isEditor && !isOwner && !isCoOwner) {
      const attemptedKeys = Object.keys(dataToUpdate);
      const isTryingToChangeMetadata = attemptedKeys.some(key => key !== 'content' && dataToUpdate[key as keyof typeof dataToUpdate] !== undefined);

      if (isTryingToChangeMetadata) {
         return NextResponse.json({ 
           success: false, 
           message: "Editors are only allowed to modify code content" 
         }, { status: 403 });
      }
      
      dataToUpdate = { content: dataToUpdate.content };
    }

    await prisma.snippet.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, message: "Snippet updated successfully" }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const { user, error } = await getUser();
    
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const existingSnippet = await prisma.snippet.findUnique({
      where: { id },
      include: { collaborators: true }
    });

    if (!existingSnippet) {
      return NextResponse.json({ success: false, message: "Snippet not found" }, { status: 404 });
    }

    const isOwner = user.id === existingSnippet.ownerId;
    const isCoOwner = existingSnippet.collaborators.some(c => c.userId === user.id && c.role === Role.CO_OWNER);

    if (!isOwner && !isCoOwner) {
      return NextResponse.json({ success: false, message: "Only the owner or co-owners can delete this snippet" }, { status: 403 });
    }

    await prisma.snippet.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Snippet deleted successfully" }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}