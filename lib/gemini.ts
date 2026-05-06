import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    5. Maintain a friendly, expert tone.
    6. CRITICAL: Do NOT write interactive input prompts (e.g., \`cout << "Enter a number";\`, \`input("Type here:")\`, \`Scanner.nextLine()\`) in your code suggestions unless the user explicitly asks you to. The execution environment uses a headless standard input stream, so interactive TTY prompts are unnecessary and can confuse the user.`
  });

  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch {
      if (attempt === maxRetries) {
        throw new Error("Failed to generate AI response");
      }
      
      await delay(1000 * attempt); 
    }
  }
}