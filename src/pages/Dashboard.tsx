import React, { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, Sliders, Printer, Clock, Wand2, ShieldCheck, FileCheck, Layers } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { PHOTO_SIZE_PRESETS } from '../utils/presets';
import { PhotoSizePreset, RecentPhoto } from '../types';
import { formatDimensions } from '../utils/dimensionConverter';

interface DashboardProps {
  imageSrc: string | null;
  onImageUploaded: (src: string) => void;
  onClearImage: () => void;
  selectedSize: PhotoSizePreset;
  onSizeSelect: (preset: PhotoSizePreset) => void;
  onNavigate: (tab: string) => void;
  recentPhotos: RecentPhoto[];
  onClearRecentPhoto?: (id: string) => void;
  onRestoreRecentPhoto?: (photo: RecentPhoto, targetTab: 'editor' | 'print') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  imageSrc,
  onImageUploaded,
  onClearImage,
  selectedSize,
  onSizeSelect,
  onNavigate,
  recentPhotos,
  onClearRecentPhoto,
  onRestoreRecentPhoto,
}) => {
  const [restoreTargetPhoto, setRestoreTargetPhoto] = useState<RecentPhoto | null>(null);

  return (
    <div className="space-y-6 animate-fade-in" id="dashboard-tab">
      
      {/* Dynamic Intro Welcome Hero Row */}
      <div className="flex flex-col gap-2 rounded-2xl bg-linear-to-r from-secondary via-secondary/95 to-zinc-950 p-6 text-white shadow-md select-none">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ui-element text-[10px] text-secondary uppercase font-bold animate-pulse">
            NEW
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ui-element">
            NOVAPASS STUDIO ENGINE v1.2
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
          Create Studio-Grade Passport Photos in Seconds
        </h2>
        <p className="text-[11px] md:text-xs text-sub-active/85 max-w-xl leading-relaxed">
          Completely client-side photo processing. Upload, align under professional visual guides, adjust background chroma keys, and compile high-resolution 300 DPI A4 sheets instantly.
        </p>

        {/* Feature Highlights Grid */}
        <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3 border-t border-ui-element/20 pt-4 text-xs">
          <div className="flex items-center gap-2 text-sub-active/90">
            <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-ui-element" />
            <div className="flex flex-col">
              <span className="font-semibold text-[11px]">100% Offline Secured</span>
              <span className="text-[9px] text-sub-active/70">No server uploads</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sub-active/90">
            <Wand2 className="h-4.5 w-4.5 shrink-0 text-ui-element" />
            <div className="flex flex-col">
              <span className="font-semibold text-[11px]">Chroma-Key Eraser</span>
              <span className="text-[9px] text-sub-active/70 text-nowrap">Instant background swap</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sub-active/90">
            <FileCheck className="h-4.5 w-4.5 shrink-0 text-ui-element" />
            <div className="flex flex-col">
              <span className="font-semibold text-[11px]">DPI Standardized</span>
              <span className="text-[9px] text-sub-active/70">Sharp physical printouts</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sub-active/90">
            <Layers className="h-4.5 w-4.5 shrink-0 text-ui-element" />
            <div className="flex flex-col">
              <span className="font-semibold text-[11px]">A4 Layouter</span>
              <span className="text-[9px] text-sub-active/70">Grid cut lines compiled</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 size): Upload Card & Preset Selector */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Uploader section */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-zinc-100 mb-4 tracking-tight uppercase">
              1. Upload Your Portrait
            </h3>
            <ImageUploader 
              onImageSelected={onImageUploaded} 
              onClearImage={onClearImage} 
              currentImage={imageSrc} 
            />
          </div>

          {/* Quick Specifications preset card selector */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-50 dark:border-zinc-850 mb-4">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-zinc-100 tracking-tight uppercase">
                2. Select Passport Sizing Template
              </h3>
              <span className="font-mono text-[9px] text-gray-400">CHOOSE PRESET</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3" id="quick-preset-grid">
              {PHOTO_SIZE_PRESETS.map((preset) => {
                const isActive = selectedSize.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onSizeSelect(preset)}
                    className={`flex flex-col items-start rounded-xl p-3.5 border text-left transition-all hover:-translate-y-0.5 ${
                      isActive
                        ? 'border-primary bg-sub-active/20 dark:border-primary dark:bg-primary/20'
                        : 'border-gray-150 bg-gray-50 hover:bg-gray-100/70 dark:border-zinc-850 dark:bg-zinc-850'
                    }`}
                    id={`quick-preset-btn-${preset.id}`}
                  >
                    <span className="text-[10px] font-mono text-primary dark:text-ui-element uppercase font-bold tracking-wider">
                      {formatDimensions(preset.width, preset.height, preset.unit)}
                    </span>
                    <span className="mt-1 text-xs font-bold text-gray-900 dark:text-zinc-100">
                      {preset.name}
                    </span>
                    <p className="mt-1 text-[9px] leading-relaxed text-gray-400 dark:text-zinc-500 line-clamp-1">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1/3 size): Shortcuts & Recent Gallery log */}
        <div className="space-y-6">
          
          {/* Quick Actions Router */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-zinc-100 mb-4 tracking-tight uppercase">
              Lab Shortcuts Workspace
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('editor')}
                disabled={!imageSrc}
                className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3.5 hover:bg-gray-100 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed text-left transition-all dark:border-zinc-850 dark:bg-zinc-850 dark:hover:bg-zinc-800"
                id="shortcut-lab-btn"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sub-active/40 text-primary dark:bg-zinc-900 dark:text-ui-element">
                    <Sliders className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-900 dark:text-zinc-100">Open Photo Lab</span>
                    <span className="text-[10px] text-gray-400">Crop, level & enhance</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onNavigate('print')}
                disabled={!imageSrc}
                className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3.5 hover:bg-gray-100 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed text-left transition-all dark:border-zinc-850 dark:bg-zinc-850 dark:hover:bg-zinc-800"
                id="shortcut-print-btn"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sub-active/40 text-primary dark:bg-zinc-900 dark:text-ui-element">
                    <Printer className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-900 dark:text-zinc-100">A4 Print Sheet</span>
                    <span className="text-[10px] text-gray-400">Grid multicopy layouter</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Generated photos log */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between pb-3 border-b border-gray-50 dark:border-zinc-850 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-1.5 font-mono">
                <Clock className="h-4 w-4 text-primary" /> Recent Creations
              </h3>
              <span className="hidden sm:inline-block text-[9px] text-primary dark:text-ui-element font-bold bg-sub-active/40 dark:bg-primary/20 px-2 py-0.5 rounded font-mono animate-pulse">
                💡 Double Click to Edit/Print
              </span>
            </div>

            {recentPhotos && recentPhotos.length > 0 ? (
              <div className="grid grid-cols-2 gap-3" id="recent-creations-grid">
                {recentPhotos.map((photo) => (
                  <div 
                    key={photo.id}
                    onDoubleClick={() => setRestoreTargetPhoto(photo)}
                    className="group relative flex flex-col justify-between rounded-xl border border-gray-100 bg-gray-50 p-2.5 hover:shadow-xs hover:border-primary transition-all duration-200 dark:border-zinc-850 dark:bg-zinc-850 dark:hover:border-primary cursor-pointer select-none"
                    title="Double click to Edit/Print again"
                  >
                    <div className="relative mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-zinc-950 shadow-3xs">
                      <img 
                        src={photo.thumbnail} 
                        alt="Recent thumbnail preview"
                        className="h-full w-full object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] font-bold text-white uppercase bg-primary px-2 py-1 rounded shadow">
                          Double Click
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-800 truncate dark:text-zinc-200">
                        {photo.sizeName}
                      </span>
                      <span className="font-mono text-[8px] text-gray-400">
                        Size: {photo.sizeDims}
                      </span>
                      <span className="text-[7px] text-gray-400 mt-1">
                        {photo.date}
                      </span>
                    </div>

                    {onClearRecentPhoto && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClearRecentPhoto(photo.id);
                        }}
                        className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[8px] transition-opacity hover:scale-115 active:scale-95"
                        title="Remove historical log"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
                <div className="rounded-xl border border-dashed border-gray-200 p-4 mb-2.5 dark:border-zinc-800">
                  <ImageIcon className="h-5 w-5 text-gray-300" />
                </div>
                <span className="text-[11px] font-bold text-gray-500">No output logs yet</span>
                <p className="mt-1 text-[9px] text-gray-400 dark:text-zinc-500 max-w-xs">
                  Compile high DPI images in the Photo Lab tab to record logs.
                </p>
              </div>
            )}
          </div>

          {/* Restore Actions Modal dialog (Double click on Recent creation handler) */}
          {restoreTargetPhoto && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in no-print"
              onClick={() => setRestoreTargetPhoto(null)}
            >
              <div 
                className="w-full max-w-md rounded-2xl border border-gray-150 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 text-left animate-slide-up"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-gray-50 dark:border-zinc-850 pb-3 mb-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-1.5 font-mono">
                    <Clock className="h-4.5 w-4.5 text-primary" /> Recent Creation Studio
                  </h3>
                  <button 
                    onClick={() => setRestoreTargetPhoto(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 text-xl font-bold flex h-6 w-6 items-center justify-center rounded-lg hover:bg-gray-105 dark:hover:bg-zinc-800"
                  >
                    ×
                  </button>
                </div>

                <div className="flex items-center gap-3.5 mb-4 bg-gray-50 dark:bg-zinc-850 p-3 rounded-xl border border-gray-100 dark:border-zinc-800">
                  <div className="h-16 w-16 rounded-md overflow-hidden shrink-0 border border-gray-200/55 dark:border-zinc-800 bg-white shadow-3xs">
                    <img 
                      src={restoreTargetPhoto.thumbnail} 
                      alt="Recent selection thumbnail" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-black text-gray-950 dark:text-zinc-100 truncate">
                      {restoreTargetPhoto.sizeName}
                    </span>
                    <span className="font-mono text-[10px] text-primary dark:text-ui-element font-bold">
                      Dimensions: {restoreTargetPhoto.sizeDims}
                    </span>
                    <span className="text-[9px] text-gray-400 mt-0.5">
                      Compiled on {restoreTargetPhoto.date}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 dark:text-zinc-400 mb-4 leading-relaxed">
                  அசல் புகைப்படத்தின் அளவை மாற்றாமல் மீண்டும் எடிட் செய்ய அல்லது பிரிண்ட் செய்ய கீழே உள்ள செயல்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      if (onRestoreRecentPhoto) {
                        onRestoreRecentPhoto(restoreTargetPhoto, 'editor');
                      }
                      setRestoreTargetPhoto(null);
                    }}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-150 bg-white p-4 hover:bg-gray-50/70 hover:border-primary transition-all text-center dark:border-zinc-800 dark:bg-zinc-850 dark:hover:bg-zinc-800 shadow-3xs group/btn cursor-pointer"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sub-active/40 text-primary dark:bg-zinc-900 dark:text-ui-element group-hover/btn:scale-110 transition-transform">
                      <Sliders className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900 dark:text-zinc-100">Lab Edit Mode</span>
                      <span className="text-[9px] text-gray-400 mt-0.5">Adjust background color, light controls & borders</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      if (onRestoreRecentPhoto) {
                        onRestoreRecentPhoto(restoreTargetPhoto, 'print');
                      }
                      setRestoreTargetPhoto(null);
                    }}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/10 p-4 hover:bg-emerald-50/20 hover:border-emerald-400 transition-all text-center dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-850 shadow-3xs group/btn cursor-pointer"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-zinc-900 dark:text-emerald-400 group-hover/btn:scale-110 transition-transform">
                      <Printer className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-450">Prepare Print Sheet</span>
                      <span className="text-[9px] text-gray-400 mt-0.5">Customize margins, show safe areas & print A4 copy grids</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
