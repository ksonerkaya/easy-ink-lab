// services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GOOGLE_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateTattooStencil(
  base64Image: string
): Promise<string> {
  // Detect mime type from the data URL
  const mimeType = base64Image.includes("image/png")
    ? "image/png"
    : "image/jpeg";

  // Strip "data:image/...;base64," prefix
  const data = base64Image.split(",")[1];

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash", // safe, current image-capable model
  });

  const prompt = `
You take a real tattoo photo and convert it into a clean, printable stencil.
Strip skin, shadows, and background. Keep only crisp black outlines.
Return a high-contrast stencil, black on white.
Output ONLY the stencil image.`;

  const result = await model.generateContent([
    {
      inlineData: {
        data,
        mimeType,
      },
    },
    { text: prompt },
  ]);

  const image =
    result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!image) throw new Error("No image returned from Gemini");

  return "data:image/png;base64," + image;
}
