import React, { useEffect, useState } from 'react';
import { 
  Sliders, RefreshCcw, Crop, Palette, Sun, SlidersHorizontal, Square, 
  Sparkles, CheckCircle2, ChevronRight, CornerDownRight, RotateCcw, RotateCw, Undo, Redo
} from 'lucide-react';
import { PhotoEditor } from '../components/PhotoEditor';
import { SizeSelector } from '../components/SizeSelector';
import { BackgroundSelector } from '../components/BackgroundSelector';
import { PhotoSizePreset, PhotoEnhancements, PhotoFrameSettings, Unit, RecentPhoto } from '../types';

interface EditorProps {
  imageSrc: string;
  sizePreset: PhotoSizePreset;
  onSizeChange: (preset: PhotoSizePreset) => void;
  customSize: { width: number; height: number; unit: Unit };
  onCustomSizeChange: (size: { width: number; height: number; unit: Unit }) => void;
  editorState: any; // from useImageEditor
  setPhotoBase64: (base64: string) => void;
  onNavigate: (tab: string) => void;
  addRecentPhoto: (photo: RecentPhoto) => void;
}

export const Editor: React.FC<EditorProps> = ({
  imageSrc,
  sizePreset,
  onSizeChange,
  customSize,
  onCustomSizeChange,
  editorState,
  setPhotoBase64,
  onNavigate,
  addRecentPhoto,
}) => {
  const [activeTab, setActiveTab] = useState<'size' | 'background' | 'lighting' | 'borders'>('size');
  const [compiling, setCompiling] = useState(false);
  const [compiledSuccess, setCompiledSuccess] = useState(false);
  const [pickingModeActive, setPickingModeActive] = useState(false);
  
  const {
    state,
    setScale,
    setTranslate,
    setRotation,
    toggleFlipH,
    toggleFlipV,
    updateEnhancement,
    updateFrame,
    updateStateValue,
    resetAll,
    resetPosition,
    resetEnhancements,
    undo,
    redo,
    canUndo,
    canRedo,
  } = editorState;

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Keyboard Shortcuts (Ctrl+Z / Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (canUndo) undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  const handleCompilePhoto = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setCompiling(true);
    setCompiledSuccess(false);

    // Simulate high-DPI rendering and compile base64 output
    setTimeout(() => {
      try {
        const qualityVal = state.imageQuality === 'high' ? 0.98 : state.imageQuality === 'medium' ? 0.82 : 0.6;
        const b64 = canvas.toDataURL('image/jpeg', qualityVal);
        setPhotoBase64(b64);
        
        // Add to historical recently generated list
        const uniqueId = Math.random().toString(36).substring(2, 9);
        const dateNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });
        
        addRecentPhoto({
          id: uniqueId,
          date: dateNow,
          sizeName: sizePreset.name,
          sizeDims: `${sizePreset.width}x${sizePreset.height} ${sizePreset.unit}`,
          thumbnail: b64,
        });

        setCompiling(false);
        setCompiledSuccess(true);
      } catch (e) {
        console.error('Failed to compile dataUrl:', e);
        setCompiling(false);
      }
    }, 700);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="editor-workspace">
      
      {/* Undo/Redo & Utility bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900 shadow-3xs">
        <div className="flex items-center gap-2">
          {/* Back button */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-3 py-1.5 text-[11px] font-bold text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition dark:bg-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100"
            id="editor-back-to-dash-btn"
          >
            ← Back to Dashboard
          </button>
          
          <div className="h-4 w-px bg-gray-250 dark:bg-zinc-801" />

          {/* Undo/Redo tools */}
          <button
            onClick={undo}
            disabled={!canUndo}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-150 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Undo (Ctrl+Z)"
            id="undo-action-btn"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-150 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Redo (Ctrl+Y)"
            id="redo-action-btn"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Quality options */}
        <div className="flex items-center gap-2 font-mono text-[10px] text-gray-400">
          <span>Image Quality Selector:</span>
          <select
            value={state.imageQuality}
            onChange={(e) => updateStateValue('imageQuality', e.target.value)}
            className="rounded border border-gray-200 bg-white px-2 py-1 text-[10px] text-gray-700 focus:outline-none focus:border-primary dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-200"
            id="editor-quality-select"
          >
            <option value="high">High (Maximum 300 DPI)</option>
            <option value="medium">Medium (Compress JPEG)</option>
            <option value="low">Low (Web Compression)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side (5/12 Columns): Sizing / Palette / Filter Accordions */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Visual Accordion Buttons */}
          <div className="flex rounded-lg bg-gray-50 p-1 dark:bg-zinc-850" id="editor-accordion-bar">
            {[
              { id: 'size', label: 'Preset', icon: Crop },
              { id: 'background', label: 'Backdrop', icon: Palette },
              { id: 'lighting', label: 'Enhance', icon: Sun },
              { id: 'borders', label: 'Border', icon: Square },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id !== 'background') setPickingModeActive(false);
                  }}
                  className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  id={`editor-tab-trigger-${tab.id}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Accordion Panels Container */}
          <div className="min-h-[200px]" id="editor-accordion-panels-display">
            {activeTab === 'size' && (
              <SizeSelector
                selectedSizeId={sizePreset.id}
                onSizeChange={onSizeChange}
                customSize={customSize}
                onCustomSizeChange={onCustomSizeChange}
              />
            )}

            {activeTab === 'background' && (
              <BackgroundSelector
                selectedBgColor={state.backgroundColor}
                onBgColorChange={(color) => updateStateValue('backgroundColor', color)}
                replaceBgOn={state.replaceBgOn}
                onReplaceBgToggle={(val) => updateStateValue('replaceBgOn', val)}
                bgSampleColor={state.bgSampleColor}
                bgTolerance={state.bgTolerance}
                onBgToleranceChange={(val) => updateStateValue('bgTolerance', val)}
                pickingModeActive={pickingModeActive}
                onTogglePickingMode={() => setPickingModeActive(!pickingModeActive)}
              />
            )}

            {activeTab === 'lighting' && (
              <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900" id="lighting-panel">
                <div className="flex items-center justify-between pb-3 border-b border-gray-50 dark:border-zinc-850 mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
                    Lighting & Filters
                  </h3>
                  <button
                    onClick={resetEnhancements}
                    className="flex items-center gap-1 text-[10px] font-mono text-gray-400 hover:text-red-500 transition"
                  >
                    <RefreshCcw className="h-3 w-3" />
                    Reset Sliders
                  </button>
                </div>

                {/* Lighting Sliders Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Brightness */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-zinc-300">
                      <span>Brightness</span>
                      <span className="font-mono">{state.enhancements.brightness}</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="1"
                      value={state.enhancements.brightness}
                      onChange={(e) => updateEnhancement('brightness', parseInt(e.target.value))}
                      className="w-full accent-primary h-1 bg-gray-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-zinc-300">
                      <span>Contrast</span>
                      <span className="font-mono">{state.enhancements.contrast}</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="1"
                      value={state.enhancements.contrast}
                      onChange={(e) => updateEnhancement('contrast', parseInt(e.target.value))}
                      className="w-full accent-primary h-1 bg-gray-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-zinc-300">
                      <span>Saturation</span>
                      <span className="font-mono">{state.enhancements.saturation}</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="1"
                      value={state.enhancements.saturation}
                      onChange={(e) => updateEnhancement('saturation', parseInt(e.target.value))}
                      className="w-full accent-primary h-1 bg-gray-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Exposure */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-zinc-300">
                      <span>Exposure</span>
                      <span className="font-mono">{state.enhancements.exposure}</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="1"
                      value={state.enhancements.exposure}
                      onChange={(e) => updateEnhancement('exposure', parseInt(e.target.value))}
                      className="w-full accent-primary h-1 bg-gray-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Temperature */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-zinc-300">
                      <span>Color Temperature</span>
                      <span className="font-mono">{state.enhancements.temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="-60"
                      max="60"
                      step="1"
                      value={state.enhancements.temperature}
                      onChange={(e) => updateEnhancement('temperature', parseInt(e.target.value))}
                      className="w-full accent-primary h-1 bg-gray-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Sharpness */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-zinc-300">
                      <span>Sharpness</span>
                      <span className="font-mono">{state.enhancements.sharpness}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={state.enhancements.sharpness}
                      onChange={(e) => updateEnhancement('sharpness', parseInt(e.target.value))}
                      className="w-full accent-primary h-1 bg-gray-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <p className="text-[8px] text-gray-400 dark:text-zinc-500 mt-2 text-center md:text-left">
                  *Sliders apply hardware-accelerated brightness, contrast, saturations, warmth temperature filters.
                </p>
              </div>
            )}

            {activeTab === 'borders' && (
              <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900" id="borders-panel">
                <div className="flex items-center justify-between pb-3 border-b border-gray-50 dark:border-zinc-850 mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
                    Borders & Frames
                  </h3>
                  <div className="flex items-center gap-1.5 focus:outline-none">
                    <input
                      type="checkbox"
                      id="enable-border-frame"
                      checked={state.frame.borderOn}
                      onChange={(e) => updateFrame('borderOn', e.target.checked)}
                      className="h-3.5 w-3.5 rounded-sm text-primary focus:ring-primary"
                    />
                    <label htmlFor="enable-border-frame" className="text-[10px] font-bold text-gray-600 dark:text-zinc-300 cursor-pointer">
                      Enable Border
                    </label>
                  </div>
                </div>

                {state.frame.borderOn && (
                  <div className="space-y-4 pt-1">
                    {/* Thickness Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-zinc-300">
                        <span>Border Thickness</span>
                        <span className="font-mono">{state.frame.borderThickness} px</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="1"
                        value={state.frame.borderThickness}
                        onChange={(e) => updateFrame('borderThickness', parseInt(e.target.value))}
                        className="w-full accent-primary h-1 bg-gray-200 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Color Swatch / Pickers */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-600 dark:text-zinc-300">Border Color Accent</label>
                      <div className="flex flex-wrap gap-2">
                        {['#000000', '#FFFFFF', '#1E3A8A', '#7F1D1D', '#047857'].map((col) => (
                          <button
                            key={col}
                            onClick={() => updateFrame('borderColor', col)}
                            className={`h-7 w-7 rounded-lg border shadow-3xs transition-transform ${
                              state.frame.borderColor === col
                                ? 'scale-110 ring-2 ring-primary border-transparent'
                                : col === '#FFFFFF' ? 'border-gray-300' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: col }}
                          />
                        ))}
                        {/* custom picker */}
                        <div className="relative h-7 w-7 rounded-lg border border-gray-300 overflow-hidden shadow-3xs">
                          <input
                            type="color"
                            value={state.frame.borderColor}
                            onChange={(e) => updateFrame('borderColor', e.target.value)}
                            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer scale-120"
                          />
                          <div className="h-full w-full" style={{ backgroundColor: state.frame.borderColor }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Middle Area (7/12 Columns): Interactive editor canvas */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <PhotoEditor
            imageSrc={imageSrc}
            sizePreset={sizePreset}
            scale={state.scale}
            onScaleChange={setScale}
            translateX={state.translateX}
            translateY={state.translateY}
            onTranslateChange={setTranslate}
            rotation={state.rotation}
            onRotationChange={setRotation}
            flipH={state.flipH}
            onToggleFlipH={toggleFlipH}
            flipV={state.flipV}
            onToggleFlipV={toggleFlipV}
            enhancements={state.enhancements}
            onEnhancementChange={updateEnhancement}
            frame={state.frame}
            onFrameChange={updateFrame}
            backgroundColor={state.backgroundColor}
            replaceBgOn={state.replaceBgOn}
            bgSampleColor={state.bgSampleColor}
            onBgColorSampled={(col) => updateStateValue('bgSampleColor', col)}
            bgTolerance={state.bgTolerance}
            pickingModeActive={pickingModeActive}
            onTogglePickingMode={() => setPickingModeActive(!pickingModeActive)}
            canvasRef={canvasRef}
          />

          {/* Action trigger Compilation Row */}
          <div className="flex flex-col gap-4 p-5 rounded-2xl border border-ui-element/30 bg-sub-active/10 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-zinc-100">
              Complete Sizing Alignment
            </h3>
            <p className="text-[10px] leading-relaxed text-gray-500 dark:text-zinc-400">
              Click "Process & Compile Photo" to compile the active canvas filters and bounding coordinates. The output registers a high DPI portrait and activates download panel panels.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCompilePhoto}
                disabled={compiling}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                id="compile-photo-btn"
              >
                {compiling ? (
                  <>
                    <span className="flex h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing & Compiling...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Process & Compile Photo (300 DPI)
                  </>
                )}
              </button>

              {compiledSuccess && (
                <button
                  onClick={() => onNavigate('print')}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500 bg-emerald-50 py-3 text-xs font-bold text-emerald-700 hover:bg-emerald-100/50 dark:bg-emerald-950/20 dark:text-emerald-400 transition"
                  id="navigate-to-print-btn"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Proceed to Print Sheet Layout →
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
