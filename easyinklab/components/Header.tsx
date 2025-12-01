import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-8 px-6 md:px-12 flex justify-between items-end bg-transparent relative z-50">
      <div className="flex flex-col">
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tighter leading-none text-ink">
          EasyInkLab
        </h1>
        <span className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase mt-1 opacity-60">
          Digital Stencil Lab
        </span>
      </div>
      <nav className="hidden md:block">
        <span className="text-xs font-sans font-bold border border-ink px-3 py-1 rounded-full hover:bg-ink hover:text-white transition-colors cursor-pointer">
          BETA v1.0
        </span>
      </nav>
    </header>
  );
};