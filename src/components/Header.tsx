import React from 'react';
import { Camera, Sun, Moon, Sparkles, Sliders, Smartphone } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  theme: 'light' | 'dark' | 'system';
  setTheme: (t: 'light' | 'dark' | 'system') => void;
  onNavigate: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, theme, setTheme, onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/95 px-6 shadow-sm backdrop-blur-sm transition-colors duration-200 dark:border-zinc-800 dark:bg-zinc-900/95">
      {/* Branding Column */}
      <div 
        onClick={() => onNavigate('dashboard')}
        className="flex cursor-pointer items-center gap-3 transition-transform duration-200 hover:scale-101"
        id="header-brand-logo"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 dark:bg-primary">
          <Camera className="h-5.5 w-5.5 text-white" />
        </div>
        <div>
          <h1 className="font-sans text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
            NovaPass Studio
          </h1>
          <span className="font-mono text-[10px] uppercase tracking-wider text-primary dark:text-ui-element">
            Professional Photo Engine
          </span>
        </div>
      </div>

      {/* Navigation Indicators */}
      <div className="hidden items-center gap-2 rounded-lg bg-gray-50 p-1 dark:bg-zinc-800/60 md:flex">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            currentTab === 'dashboard'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
          id="nav-btn-dashboard"
        >
          Dashboard
        </button>
        <button
          onClick={() => onNavigate('editor')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            currentTab === 'editor'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
          id="nav-btn-editor"
        >
          Photo Lab
        </button>
        <button
          onClick={() => onNavigate('print')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            currentTab === 'print'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
          id="nav-btn-print"
        >
          Print Engine
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            currentTab === 'settings'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
          id="nav-btn-settings"
        >
          Settings
        </button>
      </div>

      {/* Action Column */}
      <div className="flex items-center gap-4">
        {/* Connection status indicator */}
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-[10px] font-medium text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          LOCAL ENGINE
        </div>

        {/* Theme Toggler */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-xs transition-all hover:bg-gray-100 hover:text-gray-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
          title="Toggle Color Theme"
          id="theme-toggler-btn"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
};
