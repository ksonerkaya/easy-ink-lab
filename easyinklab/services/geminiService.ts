// services/geminiService.ts
// Temporary stub so the UI works without Google AI in the browser.

export type StencilResult = {
  previewUrl: string;
  downloadUrl: string;
};

export async function generateStencilFromImage(_file: File): Promise<StencilResult> {
  // TODO: connect to a backend API that calls @google/genai securely.
  // For now just return a placeholder image so the app renders.
  const placeholder =
    "https://dummyimage.com/1200x1600/ffffff/000000&text=Stencil+Preview";

  return {
    previewUrl: placeholder,
    downloadUrl: placeholder,
  };
}
