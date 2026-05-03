import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ token: string }> };

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { token } = await params;

    const snippet = await prisma.snippet.findUnique({
      where: { shareToken: token },
      include: {
        owner: { select: { name: true, username: true, image: true } },
      }
    });

    if (!snippet) {
      return NextResponse.json({ success: false, message: "Invalid or expired link" }, { status: 404 });
    }

    if (snippet.visibility === "PRIVATE") {
      return NextResponse.json({ success: false, message: "This snippet is private" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: snippet }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}