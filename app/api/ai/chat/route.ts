import { NextResponse } from "next/server";
import { generateCodeHelp } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { prompt, code, language, output } = await req.json();

    if (!prompt) {
      return NextResponse.json({ success: false, message: "Prompt is required" }, { status: 400 });
    }

    const aiResponse = await generateCodeHelp(
      prompt, 
      code || "", 
      language || "javascript", 
      output || ""
    );

    return NextResponse.json({ success: true, data: aiResponse }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "AI failed to respond" }, { status: 500 });
  }
}