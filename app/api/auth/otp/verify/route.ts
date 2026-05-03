import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import z from "zod";

const verifySchema = z.object({
  email: z.string().email("Invalid email"),
  code: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = verifySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error.issues[0].message }, { status: 400 });
    }

    const { email, code } = result.data;
    const otpRecord = await prisma.otp.findUnique({ where: { email } });

    if (!otpRecord || otpRecord.code !== code) {
      return NextResponse.json({ success: false, message: "Invalid verification code" }, { status: 400 });
    }

    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ success: false, message: "Code has expired" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "OTP verified" });
  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}