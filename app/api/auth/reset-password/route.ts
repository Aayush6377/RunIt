import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import z from "zod";

const resetSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "New password must be 8+ chars"),
  code: z.string().length(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = resetSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error.issues[0].message }, { status: 400 });
    }

    const { email, password, code } = result.data;

    const otpRecord = await prisma.otp.findUnique({ where: { email } });
    if (!otpRecord || otpRecord.code !== code || otpRecord.type !== "PASSWORD_RESET") {
      return NextResponse.json({ success: false, message: "Invalid or expired OTP" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
      }),
      prisma.otp.delete({ where: { email } })
    ]);

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to reset password" }, { status: 500 });
  }
}