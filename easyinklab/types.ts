export interface StencilState {
  originalImage: string | null; // Base64
  processedImage: string | null; // Base64 (Clean Line Art)
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  errorMessage?: string;
}

export interface ProcessingOptions {
  contrast: number;
  thickness: number;
}

export enum FileType {
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  PDF = 'application/pdf'
}
