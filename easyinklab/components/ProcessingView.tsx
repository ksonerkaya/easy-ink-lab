import React from 'react';

export const ProcessingView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full animate-fadeIn">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 border-t-2 border-black animate-spin duration-[2s]"></div>
        <div className="absolute inset-4 border-r-2 border-black animate-spin duration-[1.5s] direction-reverse"></div>
        <div className="absolute inset-8 border-b-2 border-black animate-spin duration-[1s]"></div>
      </div>
      <h3 className="text-4xl font-display font-bold mb-4 tracking-tighter">REFINING</h3>
      <p className="text-gray-500 font-sans text-sm tracking-widest uppercase">
        Isolating ink from reality...
      </p>
    </div>
  );
};