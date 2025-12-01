import React, { useState, useEffect } from 'react';
import { createTransparentPNG, downloadImage, printImage, addBrandingToImage } from '../utils/imageUtils';

interface ResultViewProps {
  originalImage: string;
  processedImage: string;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ originalImage, processedImage, onReset }) => {
  const [activeTab, setActiveTab] = useState<'clean' | 'transparent'>('clean');
  const [transparentImage, setTransparentImage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    createTransparentPNG(processedImage).then(setTransparentImage);
  }, [processedImage]);

  const handleDownload = async (format: 'jpg' | 'png' | 'pdf') => {
    setIsExporting(true);
    try {
      if (format === 'pdf') {
        // PDF Print uses HTML logic, no canvas gen needed here
        printImage(processedImage);
      } else {
        const sourceImage = format === 'png' && transparentImage ? transparentImage : processedImage;
        const isTransparent = format === 'png';
        
        // Generate branded image
        const brandedImage = await addBrandingToImage(sourceImage, isTransparent);
        
        const ext = format === 'png' ? 'png' : 'jpg';
        downloadImage(brandedImage, `EasyInkLab-stencil.${ext}`);
      }
    } catch (e) {
      console.error("Export failed", e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full mx-auto animate-fadeIn pb-12">
      
      {/* Controls Header */}
      <div className="flex justify-between items-center mb-12 border-b border-black/10 pb-6">
        <button 
          onClick={onReset}
          className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
        >
          <span className="block w-8 h-px bg-black group-hover:w-12 transition-all"></span>
          New Project
        </button>
        <span className="font-mono text-xs text-gray-400">PROCESSED_SUCCESSFULLY</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 md:gap-16 mb-16">
        
        {/* Left: Original */}
        <div className="group relative">
           <h4 className="absolute -top-8 left-0 text-xs font-bold text-gray-400 uppercase tracking-widest">Reference</h4>
           <div className="aspect-[4/5] bg-white border border-gray-200 p-2 shadow-lg rotate-1 transition-transform duration-500 group-hover:rotate-0">
             <div className="w-full h-full bg-gray-50 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
               <img src={originalImage} alt="Original" className="absolute inset-0 w-full h-full object-cover" />
             </div>
           </div>
        </div>

        {/* Right: Result */}
        <div className="relative">
            <h4 className="absolute -top-8 left-0 text-xs font-bold text-black uppercase tracking-widest">Stencil Output</h4>
            
            <div className="flex absolute -top-10 right-0 gap-2">
                <button 
                    onClick={() => setActiveTab('clean')}
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 ${activeTab === 'clean' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                >
                    White BG
                </button>
                <button 
                    onClick={() => setActiveTab('transparent')}
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 ${activeTab === 'transparent' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                >
                    Transparent
                </button>
            </div>

            <div className="aspect-[4/5] bg-white border-2 border-black p-4 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative z-10">
                <div className="w-full h-full border border-black/5 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
                   {activeTab === 'clean' ? (
                       <img src={processedImage} alt="Clean Stencil" className="max-w-full max-h-full object-contain mix-blend-multiply p-4" />
                   ) : (
                       <img src={transparentImage || processedImage} alt="Transparent Stencil" className="max-w-full max-h-full object-contain p-4" />
                   )}
                </div>
                {/* Visual Branding Element for Preview */}
                <div className="absolute bottom-2 right-4 text-[8px] font-display font-bold text-gray-300 pointer-events-none">
                  EasyInkLab
                </div>
            </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="border-t-2 border-black pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
                onClick={() => handleDownload('jpg')}
                disabled={isExporting}
                className="h-14 border border-black font-display font-bold text-lg hover:bg-black hover:text-white transition-all uppercase flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {isExporting ? 'Preparing...' : 'Download JPG'}
            </button>
            <button 
                onClick={() => handleDownload('png')}
                disabled={isExporting}
                className="h-14 border border-black font-display font-bold text-lg hover:bg-black hover:text-white transition-all uppercase flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {isExporting ? 'Preparing...' : 'Download PNG'}
            </button>
            <button 
                onClick={() => handleDownload('pdf')}
                disabled={isExporting}
                className="h-14 bg-black text-white font-display font-bold text-lg border border-black hover:bg-white hover:text-black transition-all uppercase flex items-center justify-center gap-2 disabled:opacity-50"
            >
                Print PDF
            </button>
          </div>
          <p className="text-center mt-4 text-xs font-sans text-gray-400">
            Downloaded files include the EasyInkLab frame and license info.
          </p>
      </div>
    </div>
  );
};