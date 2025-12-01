import React, { useState, useCallback } from 'react';
import { fileToBase64 } from '../utils/imageUtils';

interface InputSectionProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onImageSelected, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setError(null);
        const base64 = await fileToBase64(e.target.files[0]);
        onImageSelected(base64);
      } catch (err) {
        setError("Failed to read file.");
      }
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      try {
        setError(null);
        const base64 = await fileToBase64(e.dataTransfer.files[0]);
        onImageSelected(base64);
      } catch (err) {
        setError("Failed to read dropped file.");
      }
    }
  }, [onImageSelected]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* Upload Area */}
      <div 
        className={`relative group cursor-pointer w-full h-80 transition-all duration-300 ease-out
          ${dragActive ? 'scale-[1.01]' : 'bg-white'}
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className={`absolute inset-0 border-2 border-black transition-transform duration-300 ${dragActive ? 'translate-x-0 translate-y-0' : 'translate-x-4 translate-y-4'}`}></div>
        <div className={`absolute inset-0 border-2 border-black bg-white flex flex-col items-center justify-center p-8 transition-transform duration-300 ${dragActive ? 'translate-x-0 translate-y-0 bg-gray-50' : 'translate-x-0 translate-y-0 group-hover:-translate-x-1 group-hover:-translate-y-1'}`}>
            <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            onChange={handleFileChange}
            accept="image/*"
            disabled={isLoading}
            />
            
            <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
            </div>
            <div>
                <p className="text-3xl font-display font-bold text-black uppercase tracking-tight">
                Upload Source
                </p>
                <p className="text-gray-500 font-sans mt-2 text-sm tracking-wide uppercase">JPG, PNG, WEBP supported</p>
            </div>
            </div>
        </div>
      </div>

      {error && (
        <div className="mt-8 p-4 border border-red-500 bg-red-50 text-red-600 font-mono text-sm text-center">
          ERROR: {error}
        </div>
      )}
    </div>
  );
};