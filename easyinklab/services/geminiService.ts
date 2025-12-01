// services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

export async function generateTattooStencil(base64Image: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest", });

  const prompt = `
You take a real tattoo photo and convert it into a clean, printable stencil.
Strip skin, shadows, and background. Keep only crisp black outlines.
Return a high-contrast stencil, black on white.
Output ONLY the image.`;

  const result = await model.generateContent([
    {
      inlineData: {
        data: base64Image.replace("data:image/jpeg;base64,", "").replace("data:image/png;base64,", ""),
        mimeType: "image/jpeg",
      },
    },
    prompt,
  ]);

  const response = await result.response;
  const image = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!image) throw new Error("No image returned from Gemini");

  return "data:image/png;base64," + image;
}
