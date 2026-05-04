import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateCodeHelp(prompt: string, currentCode: string, language: string, output: string) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: `You are 'RunIt AI', an expert programming assistant built into a sleek code editor.
    The user is currently writing in: ${language.toUpperCase()}.
    
    Here is their current code context:
    \`\`\`${language}
    ${currentCode}
    \`\`\`
    
    ${output && output !== "No output" ? `Here is their most recent console output / execution error:\n\`\`\`\n${output}\n\`\`\`\n` : ''}
    
    Guidelines:
    1. Be concise, direct, and helpful.
    2. If providing code, use standard markdown code blocks.
    3. If there is an error in the output, focus on explaining what caused it and how to fix it.
    4. Do not rewrite their entire code unless they ask you to. Suggest specific fixes or snippets.
    5. Maintain a friendly, expert tone.`
  });

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e){
    console.error(e);
    throw new Error("Failed to generate AI response.");
  }
}