import React from 'react';

interface HeaderProps {
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="w-full py-8 px-6 md:px-12 flex justify-between items-end bg-transparent relative z-50">
      <button 
        onClick={onLogoClick}
        className="flex flex-col text-left group cursor-pointer"
        aria-label="Go to homepage"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tighter leading-none text-ink group-hover:text-gray-600 transition-colors">
          EasyInkLab
        </h1>
        <span className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase mt-1 opacity-60 group-hover:opacity-80 transition-opacity">
          Digital Stencil Lab
        </span>
      </button>
      <nav className="hidden md:block">
        <span className="text-xs font-sans font-bold border border-ink px-3 py-1 rounded-full hover:bg-ink hover:text-white transition-colors cursor-pointer">
          BETA v1.0
        </span>
      </nav>
    </header>
  );
};