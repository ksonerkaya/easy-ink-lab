// services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

export async function generateTattooStencil(base64Image: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
Convert this tattoo photo into a clean black-line stencil.
Remove skin, shadows, background.
Keep only the tattoo lines.
Output a high-contrast black ink stencil.
Return ONLY the processed image.
`;

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.replace("data:image/png;base64,", "")
                               .replace("data:image/jpeg;base64,", ""),
            },
          },
          { text: prompt }
        ]
      }
    ]
  });

  const response = await result.response;

  const image = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

  if (!image) throw new Error("No image returned from Gemini");

  return "data:image/png;base64," + image;
}
