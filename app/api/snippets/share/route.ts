import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { snippetId } = await req.json();
    const { user, error } = await getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const snippet = await prisma.snippet.findUnique({
      where: { id: snippetId },
      include: { collaborators: true }
    });

    if (!snippet) {
      return NextResponse.json({ success: false, message: "Snippet not found" }, { status: 404 });
    }

    const isOwner = snippet.ownerId === user.id;
    const isCoOwner = snippet.collaborators.some(c => c.userId === user.id && c.role === Role.CO_OWNER);

    if (!isOwner && !isCoOwner) {
      return NextResponse.json({ success: false, message: "Only the owner or co-owners can generate a share link" }, { status: 403 });
    }

    if (snippet.visibility === "PRIVATE") {
      return NextResponse.json({ 
        success: false, 
        message: "Cannot share a private snippet. Please change visibility to Unlisted or Public in settings." 
      }, { status: 400 });
    }

    let newShareToken = snippet.shareToken ? snippet.shareToken : null;
    while (!newShareToken) {
        newShareToken = crypto.randomBytes(16).toString("hex");
        const existingSnippet = await prisma.snippet.findFirst({ where: { shareToken: newShareToken } });
        if (existingSnippet) {
            newShareToken = null;
        }
    }
    
    const updatedSnippet = await prisma.snippet.update({
      where: { id: snippetId },
      data: { shareToken: newShareToken }
    });

    return NextResponse.json({ success: true, data: { shareToken: updatedSnippet.shareToken } }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}