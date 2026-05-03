import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Visibility, Role } from "@prisma/client";
import crypto from "crypto";
import { getUser } from "@/lib/auth";

const visibilitySchema = z.object({
  visibility: z.nativeEnum(Visibility)
});

type Props = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const { user, error } = await getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsedData = visibilitySchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ success: false, message: parsedData.error.issues[0].message }, { status: 400 });
    }

    const { visibility } = parsedData.data;

    const snippet = await prisma.snippet.findUnique({
      where: { id },
      include: { collaborators: true }
    });

    if (!snippet) {
      return NextResponse.json({ success: false, message: "Snippet not found" }, { status: 404 });
    }

    const isOwner = snippet.ownerId === user.id;
    const isCoOwner = snippet.collaborators.some(c => c.userId === user.id && c.role === Role.CO_OWNER);

    if (!isOwner && !isCoOwner) {
      return NextResponse.json({ success: false, message: "Only the owner or co-owners can change snippet visibility" }, { status: 403 });
    }

    let newShareToken = snippet.shareToken;

    if ((visibility === "UNLISTED" || visibility === "PUBLIC") && !newShareToken) {
      while (!newShareToken) {
        newShareToken = crypto.randomBytes(16).toString("hex");
        const existingSnippet = await prisma.snippet.findUnique({ where: { shareToken: newShareToken } });
        if (existingSnippet) {
          newShareToken = null;
        }
      }
    } 
    else if (visibility === "PRIVATE") {
      newShareToken = null;
    }

    await prisma.snippet.update({
      where: { id },
      data: { visibility, shareToken: newShareToken },
    });

    return NextResponse.json({
      success: true,
      message: `Snippet is now ${visibility.toLowerCase()}`,
      data: { shareToken: newShareToken }
    }, { status: 200 });

  } catch {
     return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}