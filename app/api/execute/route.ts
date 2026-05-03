import { NextRequest, NextResponse } from "next/server";
import { executeCodeGlot } from "@/lib/glot";

export async function POST(req: NextRequest) {
  try {
    const { language, fileName, content, stdin } = await req.json();

    const result = await executeCodeGlot({
      language,
      fileName,
      content,
      stdin,
    });

    return NextResponse.json({
      success: true,
      stdout: result.stdout,
      stderr: result.stderr,
      error: result.error,
    });
  } catch {
    return NextResponse.json( { success: false, message: "Internal Server Error" }, { status: 500 } );
  }
}