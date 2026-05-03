export interface GlotRequest {
  language: string;
  fileName: string;
  content: string;
  stdin?: string;
}

export interface GlotResponse {
  stdout: string;
  stderr: string;
  error: string;
}

const GLOT_API_URL = "https://glot.io/api/run";

export async function executeCodeGlot({
  language,
  fileName,
  content,
  stdin = "",
}: GlotRequest): Promise<GlotResponse> {
  const token = process.env.GLOT_TOKEN;

  if (!token) {
    throw new Error("GLOT_TOKEN is missing in server environment");
  }

  const response = await fetch(`${GLOT_API_URL}/${language.toLowerCase()}/latest`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      files: [
        {
          name: fileName,
          content: content,
        },
      ],
      stdin: stdin,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Glot.io execution failed");
  }

  return await response.json();
}