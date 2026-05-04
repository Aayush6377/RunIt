import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { uploadImage, deleteImage } from "@/lib/upload";
import { z } from "zod";
import { Language, TerminalPosition } from "@prisma/client";

const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional().or(z.literal("")),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .optional().or(z.literal("")),
  autoSave: z.boolean().optional(),
  defaultLanguage: z.nativeEnum(Language).optional(),
  theme: z.string().optional(),
  vimMode: z.boolean().optional(),
  terminalPosition: z.nativeEnum(TerminalPosition).optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const { user, error } = await getUser();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    const rawData = {
      name: formData.get("name")?.toString(),
      username: formData.get("username")?.toString(),
      theme: formData.get("theme")?.toString(),
      defaultLanguage: formData.get("defaultLanguage")?.toString(),
      terminalPosition: formData.get("terminalPosition")?.toString().toUpperCase() as TerminalPosition,
      autoSave: formData.has("autoSave") ? formData.get("autoSave") === "true" : undefined,
      vimMode: formData.has("vimMode") ? formData.get("vimMode") === "true" : undefined,
    };

    const cleanData = Object.fromEntries(Object.entries(rawData).filter(([_, v]) => v !== undefined));

    const parsedData = profileUpdateSchema.safeParse(cleanData);

    if (!parsedData.success) {
      return NextResponse.json({ success: false, message: parsedData.error.issues[0].message }, { status: 400 });
    }

    const { name, username, autoSave, defaultLanguage, theme, vimMode, terminalPosition } = parsedData.data;

    if (username && username !== user.username) {
      const existingUser = await prisma.user.findUnique({ where: { username }, select: { id: true } });
      if (existingUser) {
        return NextResponse.json({ success: false, message: "Username is already taken" }, { status: 409 });
      }
    }

    let newImageUrl = user.image;

    if (imageFile && imageFile.size > 0) {
      if (user.image) await deleteImage(user.image);

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`;

      newImageUrl = await uploadImage(base64Image);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name && { name }),
        ...(username && { username }),
        ...(newImageUrl !== undefined && { image: newImageUrl }),
        ...(autoSave !== undefined && { autoSave }),
        ...(defaultLanguage !== undefined && { defaultLanguage: defaultLanguage as Language }),
        ...(theme !== undefined && { theme }),
        ...(vimMode !== undefined && { vimMode }),
        ...(terminalPosition !== undefined && { terminalPosition: terminalPosition as TerminalPosition }),
      },
    });

    return NextResponse.json({ success: true, message: "Profile updated successfully" }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}