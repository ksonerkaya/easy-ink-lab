import { GoogleGenAI } from "@google/genai";

// Initialize the client
// In a real production app, this key should be kept on a backend server to prevent exposure.
// For this demo architecture, we use it directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Sends the raw image to Gemini to be converted into a clean stencil.
 * @param base64Image The raw image data (base64 string including data URI prefix)
 */
export const generateTattooStencil = async (base64Image: string): Promise<string> => {
  try {
    // Extract actual base64 data if it has the prefix
    const base64Data = base64Image.split(',')[1] || base64Image;
    const mimeType = base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';

    const model = 'gemini-2.5-flash-image';

    const prompt = `
      Act as a professional tattoo artist and graphic designer.
      Transform the attached tattoo photo into a clean, high-contrast black-and-white line art stencil suitable for transfer.
      
      Strict Requirements:
      1. Remove all skin texture, background noise, shadows, and color.
      2. The output must be PURE BLACK lines on a PURE WHITE background.
      3. Simplify complex shading into clear outlines or stippling if necessary.
      4. Ensure the lines are continuous and bold enough for a thermal printer.
      5. Do not add any extra text or commentary. Just the design.
      6. If there are multiple tattoos, focus on the most prominent one.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      // Note: responseMimeType is not supported for gemini-2.5-flash-image
    });

    // We expect the model to return an image in the parts
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No response candidates from Gemini.");
    }

    const parts = candidates[0].content.parts;
    const imagePart = parts.find(p => p.inlineData);

    if (imagePart && imagePart.inlineData) {
      return `data:image/png;base64,${imagePart.inlineData.data}`;
    }

    // Fallback: Check if it returned text (error or refusal)
    const textPart = parts.find(p => p.text);
    if (textPart) {
      console.warn("Gemini returned text instead of image:", textPart.text);
      throw new Error("The AI could not generate an image. It might have refused the request or generated text.");
    }

    throw new Error("No image data found in response.");

  } catch (error: any) {
    console.error("Gemini Stencil Generation Error:", error);
    throw new Error(error.message || "Failed to process image.");
  }
};
