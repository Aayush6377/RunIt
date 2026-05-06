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

    const invitation = await prisma.invitation.findUnique({
      where: { id, status: "PENDING" },
      include: {
        snippet: { select: { title: true, language: true } },
        sender: { select: { name: true, username: true, image: true } }
      }
    });

    if (!invitation || invitation.receiverId !== user.id) {
      return NextResponse.json({ success: false, message: "Invitation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: invitation }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const { user, error } = await getUser();

    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    const invitation = await prisma.invitation.findUnique({ where: { id } });
    if (!invitation || invitation.receiverId !== user.id) {
      return NextResponse.json({ success: false, message: "Invitation not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.invitation.update({ where: { id }, data: { status } });

      if (status === "ACCEPTED") {
        await tx.collaboration.upsert({
          where: { snippetId_userId: { snippetId: invitation.snippetId, userId: user.id } },
          update: { role: invitation.assignedRole },
          create: {
            snippetId: invitation.snippetId,
            userId: user.id,
            role: invitation.assignedRole
          }
        });
      }
    });

    return NextResponse.json({ success: true, message: `Invitation ${status.toLowerCase()}` });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}