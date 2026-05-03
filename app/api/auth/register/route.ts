import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import z from "zod";
import { generateUniqueUsername } from "@/lib/username"; 

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be 8+ chars"),
  code: z.string().length(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error.issues[0].message }, { status: 400 });
    }

    const { name, email, password, code } = result.data;

    const otpRecord = await prisma.otp.findUnique({ where: { email } });
    if (!otpRecord || otpRecord.code !== code || otpRecord.type !== "REGISTER") {
      return NextResponse.json({ success: false, message: "Invalid or expired OTP" }, { status: 400 });
    }

    const generatedUsername = await generateUniqueUsername(name);
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.create({
        data: { 
          name, 
          username: generatedUsername, 
          email, 
          password: hashedPassword, 
          lastLoginMethod: "CREDENTIALS" 
        }
      }),
      prisma.otp.delete({ where: { email } })
    ]);

    return NextResponse.json({ success: true, message: "Account created successfully" });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to create account" }, { status: 400 });
  }
}