import { GoogleGenerativeAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateTattooStencil(base64: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Extract ONLY the tattoo from this image.
    Remove skin, shadows, background.
    Convert into clean black lines, high contrast.
    Output a stencil-like image, ideal for thermal printing.
  `;

  const result = await model.generateContent([
    { inlineData: { data: base64, mimeType: "image/png" } },
    { text: prompt }
  ]);

  const image = result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData;

  if (!image) throw new Error("Gemini did not return an image.");

  return `data:${image.mimeType};base64,${image.data}`;
}
