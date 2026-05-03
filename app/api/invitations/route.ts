import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET() {
  try {
    const { user, error } = await getUser();
    if (error || !user) {
        return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const invitations = await prisma.invitation.findMany({
      where: { receiverId: user.id, status: "PENDING" },
      include: {
        snippet: { select: { id: true, title: true, language: true } },
        sender: { select: { id: true, name: true, username: true, image: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, data: invitations }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}