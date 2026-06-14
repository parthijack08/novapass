import React from 'react';

interface FooterProps {
  onLegalNavigate: (subTab: 'about' | 'contact' | 'terms' | 'privacy' | 'disclaimer') => void;
}

export const Footer: React.FC<FooterProps> = ({ onLegalNavigate }) => {
  return (
    <footer className="flex h-fit py-3 w-full flex-col md:flex-row items-center justify-between gap-3 border-t border-gray-100 bg-white px-6 font-mono text-[10px] text-gray-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-550">
      <div className="flex items-center gap-1.5 text-secondary dark:text-ui-element/90 font-bold select-none">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        <span>SEVENOVA INNOVATIONS</span>
        <span className="text-gray-350 dark:text-zinc-700 font-normal">|</span>
        <span className="text-gray-400 dark:text-zinc-500 font-normal">NovaPass Studio © {new Date().getFullYear()}</span>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[9px] uppercase tracking-wider font-bold">
        <button 
          onClick={() => onLegalNavigate('about')} 
          className="hover:text-primary hover:underline transition-colors cursor-pointer"
        >
          About Us
        </button>
        <span className="text-gray-200 dark:text-zinc-800">•</span>
        <button 
          onClick={() => onLegalNavigate('contact')}
          className="hover:text-primary hover:underline transition-colors cursor-pointer"
        >
          Contact Us
        </button>
        <span className="text-gray-200 dark:text-zinc-800">•</span>
        <button 
          onClick={() => onLegalNavigate('terms')}
          className="hover:text-primary hover:underline transition-colors cursor-pointer text-gray-600 dark:text-zinc-400"
        >
          Terms
        </button>
        <span className="text-gray-200 dark:text-zinc-800">•</span>
        <button 
          onClick={() => onLegalNavigate('privacy')}
          className="hover:text-primary hover:underline transition-colors cursor-pointer text-gray-600 dark:text-zinc-400"
        >
          Privacy
        </button>
        <span className="text-gray-200 dark:text-zinc-800">•</span>
        <button 
          onClick={() => onLegalNavigate('disclaimer')}
          className="hover:text-primary hover:underline transition-colors cursor-pointer text-gray-650 dark:text-zinc-400"
        >
          Disclaimer
        </button>
      </div>
    </footer>
  );
};
