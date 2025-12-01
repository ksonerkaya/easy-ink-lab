import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ProcessingView } from './components/ProcessingView';
import { ResultView } from './components/ResultView';
import { StencilState } from './types';
import { generateTattooStencil } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<StencilState>({
    originalImage: null,
    processedImage: null,
    status: 'idle',
    errorMessage: undefined
  });

  const handleImageSelected = async (base64: string) => {
    setState({
      originalImage: base64,
      processedImage: null,
      status: 'processing'
    });

    try {
      // Call Gemini API to process the image
      const processed = await generateTattooStencil(base64);
      
      setState(prev => ({
        ...prev,
        processedImage: processed,
        status: 'success'
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: error.message || "Something went wrong while processing the image."
      }));
    }
  };

  const reset = () => {
    setState({
      originalImage: null,
      processedImage: null,
      status: 'idle'
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] opacity-[0.03]" 
           style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}>
      </div>

      <Header />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-12 flex flex-col justify-center">
        
        {/* Hero Text */}
        {state.status === 'idle' && (
          <div className="grid md:grid-cols-12 gap-12 items-end mb-20 animate-slideUp">
            <div className="md:col-span-8">
              <h2 className="text-[14vw] md:text-[8rem] font-display font-bold text-ink leading-[0.85] tracking-tighter">
                REALITY<br/>TO <span className="text-transparent stroke-text" style={{WebkitTextStroke: '2px black'}}>INK.</span>
              </h2>
            </div>
            <div className="md:col-span-4 pb-4 flex flex-col gap-6">
               <div className="border-l-2 border-black pl-6 space-y-4">
                 <p className="text-lg md:text-xl font-sans text-gray-600 leading-relaxed">
                  Transform raw photos into pristine, transfer-ready tattoo stencils using advanced clean line extraction and high-contrast conversion.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-black bg-black/5 px-2 py-1">No signup required</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-black bg-black/5 px-2 py-1">Instant stencil output</span>
                </div>
                <p className="text-sm font-sans font-medium text-black pt-2">
                  Optimized for Procreate, iPad workflows, and thermal print transfers.
                </p>
               </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="w-full animate-fadeIn delay-200">
          {state.status === 'idle' && (
             <InputSection onImageSelected={handleImageSelected} isLoading={false} />
          )}

          {state.status === 'processing' && (
            <ProcessingView />
          )}

          {state.status === 'success' && state.originalImage && state.processedImage && (
            <ResultView 
              originalImage={state.originalImage} 
              processedImage={state.processedImage} 
              onReset={reset}
            />
          )}

          {state.status === 'error' && (
            <div className="max-w-xl mx-auto text-center animate-fadeIn">
               <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
                  <h3 className="font-display font-bold text-2xl mb-2">Processing Error</h3>
                  <p className="text-gray-600 font-sans">{state.errorMessage}</p>
               </div>
               <button onClick={reset} className="font-display text-xl underline decoration-2 underline-offset-4 hover:decoration-4">Try Again</button>
            </div>
          )}
        </div>

      </main>

      <footer className="py-12 px-6 border-t border-black/10 mt-auto bg-white/50">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-12">
          
          {/* Legal / Disclaimer */}
          <div className="space-y-4">
            <h5 className="font-display font-bold text-sm uppercase">Legal & Disclaimer</h5>
            <p className="text-xs font-sans text-gray-500 leading-relaxed max-w-md">
              EasyInkLab is designed to assist artists in creating stencils from their own original imagery. 
              Users retain full responsibility for copyright compliance. We do not store, claim, or retain any uploaded or generated content. 
              This service utilizes standard cookies for essential API and hosting functionality.
            </p>
            <p className="text-xs font-sans text-gray-400 uppercase tracking-widest mt-8">
              &copy; {new Date().getFullYear()} EasyInkLab
            </p>
          </div>

          {/* Author & Support */}
          <div className="flex flex-col md:items-end space-y-6">
             <div className="text-left md:text-right">
                <p className="text-sm font-sans font-medium mb-1">Made by <a href="https://sonerkaya.art" className="underline font-bold hover:text-gray-600">Soner Kaya</a></p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Multidisciplinary Creative • SONER.ART</p>
             </div>

             <div className="text-left md:text-right">
                <p className="text-xs font-bold font-display uppercase mb-3">Support me ❤</p>
                <div className="flex flex-col md:items-end gap-2">
                   <a 
                     href="https://buymeacoffee.com/sonerkaya" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-xs font-sans border border-black px-3 py-2 hover:bg-black hover:text-white transition-all inline-block"
                   >
                     buymeacoffee.com/sonerkaya
                   </a>
                   <a 
                     href="https://paypal.com/paypalme/ksonerkayaa" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-xs font-sans border border-black px-3 py-2 hover:bg-black hover:text-white transition-all inline-block"
                   >
                     paypal.com/paypalme/ksonerkayaa
                   </a>
                   <a 
                     href="https://instagram.com/sonerkaya.art" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-xs font-sans text-gray-500 hover:text-black mt-1 inline-block"
                   >
                     instagram.com/sonerkaya.art
                   </a>
                </div>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;