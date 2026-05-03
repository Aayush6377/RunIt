import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

const respondInviteSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED"]),
});

type Props = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const { user, error } = await getUser();
    if (error || !user) {
        return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = respondInviteSchema.safeParse(body);

    if (!parsed.success){
        return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 });
    }

    const { status } = parsed.data;

    const invitation = await prisma.invitation.findUnique({ where: { id } });
    if (!invitation || invitation.receiverId !== user.id) {
      return NextResponse.json({ success: false, message: "Invitation not found or unauthorized" }, { status: 404 });
    }

    if (invitation.status !== "PENDING") {
      return NextResponse.json({ success: false, message: "Invitation has already been responded to" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {

      await tx.invitation.update({ where: { id }, data: { status } });

      if (status === "ACCEPTED") {
        await tx.collaboration.upsert({
          where: { snippetId_userId: { snippetId: invitation.snippetId, userId: user.id } },
          update: {},
          create: {
            snippetId: invitation.snippetId,
            userId: user.id,
            role: "EDITOR"
          }
        });
      }
    });

    return NextResponse.json({ success: true, message: `Invitation ${status.toLowerCase()}` }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}