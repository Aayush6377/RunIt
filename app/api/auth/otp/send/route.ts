import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { getOtpTemplate } from "@/lib/templates";
import crypto from "crypto";
import z from "zod";

const otpSchema = z.object({
  email: z.string().email("Invalid email address"),
  type: z.enum(["REGISTER", "PASSWORD_RESET"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = otpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error.issues[0].message }, { status: 400 });
    }

    const { email, type } = result.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (type === "REGISTER") {
      if (existingUser) return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
    }

    if (type === "PASSWORD_RESET") {
      if (!existingUser) return NextResponse.json({ success: false, message: "User does not exist" }, { status: 400 });
    }

    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.otp.upsert({
      where: { email },
      update: { code, type, expiresAt },
      create: { email, code, type, expiresAt },
    });

    const subject = type === "REGISTER" ? "Verify your RunIt Account" : "Reset your RunIt Password";
    const html = getOtpTemplate(code, type);

    const emailRes = await sendEmail(email, subject, html);
    if (!emailRes.success) {
      return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}