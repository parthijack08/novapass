import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Palette, Grid, Save, Undo, Sparkles, HelpCircle, AlertCircle 
} from 'lucide-react';
import { PHOTO_SIZE_PRESETS, BACKGROUND_PRESETS } from '../utils/presets';
import { AppSettings, Unit, PhotoSizePreset } from '../types';

interface SettingsProps {
  appSettings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetDefaults: () => void;
  onSizeChange: (preset: PhotoSizePreset) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  appSettings,
  onSaveSettings,
  onResetDefaults,
  onSizeChange,
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(appSettings);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleValueChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const next = { ...localSettings, [key]: value };
    setLocalSettings(next);
    onSaveSettings(next); // Autosave automatically!
    
    // If user changed default portrait size, load that preset
    if (key === 'defaultSizeId') {
      const spec = PHOTO_SIZE_PRESETS.find((p) => p.id === value);
      if (spec) onSizeChange(spec);
    }

    setSuccessBanner('Changes saved and updated successfully!');
    setTimeout(() => setSuccessBanner(null), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in" id="settings-tab">
      
      {/* Page Title */}
      <div className="border-b border-gray-100 pb-3 dark:border-zinc-850 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black uppercase text-gray-950 tracking-wide dark:text-white flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            Studio Configurations
          </h2>
          <span className="text-xs text-gray-400">
            Control default presets, image download metrics, watermarks, margins, and app themes.
          </span>
        </div>
        
        {/* Autosave badge */}
        <div className="flex items-center gap-1.5 font-mono text-[9px] bg-sub-active/40 border border-ui-element/30 text-secondary px-2.5 py-1 rounded-full dark:bg-primary/20 dark:text-ui-element">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          AUTOSAVE ACTIVE
        </div>
      </div>

      {successBanner && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-950/20 dark:bg-emerald-950/20 dark:text-emerald-400">
          <CheckCircleIcon className="h-4 w-4 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Forms cards */}
      <div className="space-y-6">
        
        {/* Unit & Presets Sizing Card */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-50 dark:border-zinc-850 mb-4 text-gray-900 dark:text-zinc-100">
            <Palette className="h-4.5 w-4.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">Default Sizing & Backdrops</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Default Size ID */}
            <div className="space-y-1">
              <label htmlFor="settings-default-size" className="text-xs font-bold text-gray-600 dark:text-zinc-300">Default Portrait Sizing Presets</label>
              <select
                id="settings-default-size"
                value={localSettings.defaultSizeId}
                onChange={(e) => handleValueChange('defaultSizeId', e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-primary dark:border-zinc-755 dark:bg-zinc-850 dark:text-zinc-200"
              >
                {PHOTO_SIZE_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.width}x{p.height} {p.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* Default Background */}
            <div className="space-y-1">
              <label htmlFor="settings-default-bg" className="text-xs font-bold text-gray-600 dark:text-zinc-300">Default Background Backdrop</label>
              <select
                id="settings-default-bg"
                value={localSettings.defaultBackgroundId}
                onChange={(e) => handleValueChange('defaultBackgroundId', e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-primary dark:border-zinc-755 dark:bg-zinc-850 dark:text-zinc-200"
              >
                {BACKGROUND_PRESETS.map((b) => (
                  <option key={b.id} value={b.value}>
                    {b.name} ({b.value})
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Print Layout config */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-50 dark:border-zinc-850 mb-4 text-gray-900 dark:text-zinc-100">
            <Grid className="h-4.5 w-4.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">A4 Grid Specifications</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Columns default */}
            <div className="space-y-1">
              <label htmlFor="settings-cols" className="text-xs font-bold text-gray-600 dark:text-zinc-300">Grid Columns</label>
              <input
                type="number"
                id="settings-cols"
                min="1"
                max="6"
                value={localSettings.defaultLayoutCols}
                onChange={(e) => handleValueChange('defaultLayoutCols', parseInt(e.target.value) || 2)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-primary dark:border-zinc-755 dark:bg-zinc-850 dark:text-zinc-200"
              />
            </div>

            {/* Rows default */}
            <div className="space-y-1">
              <label htmlFor="settings-rows" className="text-xs font-bold text-gray-600 dark:text-zinc-300">Grid Rows</label>
              <input
                type="number"
                id="settings-rows"
                min="1"
                max="8"
                value={localSettings.defaultLayoutRows}
                onChange={(e) => handleValueChange('defaultLayoutRows', parseInt(e.target.value) || 4)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-primary dark:border-zinc-755 dark:bg-zinc-850 dark:text-zinc-200"
              />
            </div>

            {/* Margins default */}
            <div className="space-y-1">
              <label htmlFor="settings-margins" className="text-xs font-bold text-gray-600 dark:text-zinc-300">Outside Margins (mm)</label>
              <input
                type="number"
                id="settings-margins"
                min="5"
                max="25"
                value={localSettings.printMargins}
                onChange={(e) => handleValueChange('printMargins', parseInt(e.target.value) || 10)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-primary dark:border-zinc-755 dark:bg-zinc-850 dark:text-zinc-200"
              />
            </div>

          </div>
        </div>

        {/* Global Export Defaults */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-50 dark:border-zinc-850 mb-4 text-gray-900 dark:text-zinc-100">
            <SettingsIcon className="h-4.5 w-4.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">File & Theme Standards</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Format picker */}
            <div className="space-y-1">
               <label htmlFor="settings-format" className="text-xs font-bold text-gray-600 dark:text-zinc-300">File Output Format</label>
              <select
                id="settings-format"
                value={localSettings.defaultFileFormat}
                onChange={(e) => handleValueChange('defaultFileFormat', e.target.value as any)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-primary dark:border-zinc-755 dark:bg-zinc-850 dark:text-zinc-200"
              >
                <option value="png">Lossless PNG (.png)</option>
                <option value="jpeg">Standard Compress JPEG (.jpeg)</option>
              </select>
            </div>

            {/* Theme Preference selector */}
            <div className="space-y-1">
              <label htmlFor="settings-theme" className="text-xs font-bold text-gray-600 dark:text-zinc-300">Global Studio Color Theme</label>
              <select
                id="settings-theme"
                value={localSettings.theme}
                onChange={(e) => handleValueChange('theme', e.target.value as any)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-primary dark:border-zinc-755 dark:bg-zinc-850 dark:text-zinc-200"
              >
                <option value="light">Light Slate Studio Theme</option>
                <option value="dark">Immersive Studio Dark Canvas</option>
                <option value="system">Follow Operating System Theme</option>
              </select>
            </div>

          </div>
        </div>

        {/* Action reset options */}
        <div className="flex justify-start pt-2 border-t border-gray-50 dark:border-zinc-850">
          <button
            onClick={() => {
              onResetDefaults();
              setLocalSettings({
                defaultSizeId: 'us',
                defaultBackgroundId: '#FFFFFF',
                defaultLayoutCols: 2,
                defaultLayoutRows: 4,
                defaultFileFormat: 'png',
                theme: 'light',
                watermarkText: 'PASSPORT PRO STUDIO',
                watermarkOn: false,
                printMargins: 10,
                sheetNumberingOn: false,
              });
              setSuccessBanner('Sizing configurations restored to factory defaults!');
              setTimeout(() => setSuccessBanner(null), 2500);
            }}
            className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-rose-600 border border-rose-100 hover:bg-rose-50/50 rounded-lg transition"
            id="reset-factory-defaults-btn"
          >
            <Undo className="h-3.5 w-3.5" />
            Reset Factory Defaults
          </button>
        </div>

      </div>
    </div>
  );
};

// CheckCircle icon wrapper helper
function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
