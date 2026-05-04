import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma"; 
import { sendEmail } from "@/lib/email";
import { getInviteTemplate } from "@/lib/templates";
import { Role } from "@prisma/client";
import { getUser } from "@/lib/auth";

const sendInviteSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  snippetId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid snippet ID"),
  role: z.enum(["CO_OWNER", "EDITOR", "VIEWER"]),
});

export async function POST(req: NextRequest) {
  try {
    const { user: sender, error } = await getUser();
    if (error || !sender){
        return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = sendInviteSchema.safeParse(body);

    if (!parsed.success){
        return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 });
    }

    const { identifier, snippetId, role } = parsed.data;

    const snippet = await prisma.snippet.findUnique({
      where: { id: snippetId },
      include: { collaborators: true }
    });

    if (!snippet){
        return NextResponse.json({ success: false, message: "Snippet not found" }, { status: 404 });
    }

    const isOwner = snippet.ownerId === sender.id;
    const isCoOwner = snippet.collaborators.some(c => c.userId === sender.id && c.role === Role.CO_OWNER);

    if (!isOwner && !isCoOwner){
        return NextResponse.json({ success: false, message: "Only the owner or co-owners can invite collaborators" }, { status: 403 });
    }

    const receiver = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }]
      }
    });

    if (!receiver){
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (receiver.id === sender.id){
        return NextResponse.json({ success: false, message: "You cannot invite yourself" }, { status: 400 });
    }

    const isAlreadyCollaborator = snippet.collaborators.some(c => c.userId === receiver.id);
    if (isAlreadyCollaborator){
        return NextResponse.json({ success: false, message: "User is already a collaborator" }, { status: 400 });
    }

    const existingInvite = await prisma.invitation.findUnique({
      where: { snippetId_receiverId: { snippetId, receiverId: receiver.id } }
    });

    if (existingInvite && existingInvite.status === "PENDING") {
      return NextResponse.json({ success: false, message: "Invitation already sent to this user" }, { status: 400 });
    }

    await prisma.invitation.upsert({
      where: { snippetId_receiverId: { snippetId, receiverId: receiver.id } },
      update: { status: "PENDING", senderId: sender.id, assignedRole: role },
      create: {
        snippetId,
        senderId: sender.id,
        receiverId: receiver.id,
        status: "PENDING",
        assignedRole: role
      }
    });

    if (receiver.email) {
      const html = getInviteTemplate(sender.name || sender.username || "Someone", snippet.title);
      await sendEmail(receiver.email, "You've been invited to collaborate!", html);
    }

    return NextResponse.json({ success: true, message: "Invitation sent successfully" }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}