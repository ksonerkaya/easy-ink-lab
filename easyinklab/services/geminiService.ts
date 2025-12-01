// services/geminiService.ts
// Temporary stub so the UI works without real Google AI.

export async function generateTattooStencil(_base64: string): Promise<string> {
  // TODO: later connect this to a backend API that calls @google/genai.
  const placeholder =
    "https://dummyimage.com/1200x1600/ffffff/000000&text=Stencil+Preview";

  return placeholder; // just return an image URL for now
}
