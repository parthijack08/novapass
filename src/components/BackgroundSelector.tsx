import React, { useState } from 'react';
import { BACKGROUND_PRESETS } from '../utils/presets';
import { Pipette, Check, Sliders } from 'lucide-react';

interface BackgroundSelectorProps {
  selectedBgColor: string;
  onBgColorChange: (color: string) => void;
  replaceBgOn: boolean;
  onReplaceBgToggle: (val: boolean) => void;
  bgSampleColor: { r: number; g: number; b: number } | null;
  bgTolerance: number;
  onBgToleranceChange: (val: number) => void;
  pickingModeActive: boolean;
  onTogglePickingMode: () => void;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  selectedBgColor,
  onBgColorChange,
  replaceBgOn,
  onReplaceBgToggle,
  bgSampleColor,
  bgTolerance,
  onBgToleranceChange,
  pickingModeActive,
  onTogglePickingMode,
}) => {
  const [customColor, setCustomColor] = useState(selectedBgColor);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomColor(val);
    onBgColorChange(val);
  };

  return (
    <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900" id="bg-selector-panel">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-50 dark:border-zinc-850">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
          Chroma Key & Backgrounds
        </h3>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-400">
          <span>MATTE DEPTH</span>
        </div>
      </div>

      {/* Preset Swatches Grid */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400">Target Backdrop Presets</span>
        <div className="grid grid-cols-4 gap-2">
          {BACKGROUND_PRESETS.map((preset) => {
            const isActive = selectedBgColor.toLowerCase() === preset.value.toLowerCase();
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onBgColorChange(preset.value);
                  setCustomColor(preset.value);
                }}
                className={`group relative flex flex-col items-center gap-1 rounded-lg p-1.5 border transition ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-50/20 dark:border-indigo-500 dark:bg-indigo-950/20'
                    : 'border-gray-100 bg-gray-50 hover:bg-gray-100 dark:border-zinc-850 dark:bg-zinc-850'
                }`}
                title={preset.description}
                id={`bg-preset-${preset.id}`}
              >
                <div
                  className={`h-7 w-full rounded-md border shadow-xs transition-transform group-hover:scale-102 ${
                    preset.value.toLowerCase() === '#ffffff' ? 'border-gray-300' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: preset.value }}
                />
                <span className="text-[9px] font-medium text-gray-700 truncate dark:text-zinc-300 w-full text-center">
                  {preset.name}
                </span>

                {isActive && (
                  <div className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-indigo-600 text-white dark:bg-indigo-500 text-[6px]">
                    <Check className="h-2 w-2" />
                  </div>
                )}
              </button>
            );
          })}

          {/* Custom Color Selector swatch */}
          <div className="flex flex-col items-center gap-1 rounded-lg p-1.5 border border-gray-100 bg-gray-50 dark:border-zinc-850 dark:bg-zinc-850">
            <div className="relative h-7 w-full overflow-hidden rounded-md border border-gray-300 shadow-xs">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer scale-150"
                id="custom-color-picker-input"
              />
              <div
                className="h-full w-full"
                style={{ backgroundColor: customColor }}
              />
            </div>
            <span className="text-[9px] font-medium text-gray-700 truncate dark:text-zinc-300 w-full text-center">
              Custom Hex
            </span>
          </div>
        </div>
      </div>

      {/* Chroma Key Auto-Removal Filter Panel */}
      <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/15 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/10">
        <div className="flex items-center justify-between pb-2 border-b border-indigo-100/30 dark:border-zinc-850">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enable-bg-keyer"
              checked={replaceBgOn}
              onChange={(e) => onReplaceBgToggle(e.target.checked)}
              className="h-3.5 w-3.5 rounded-sm text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="enable-bg-keyer" className="text-xs font-bold text-gray-800 dark:text-zinc-200 cursor-pointer">
              Erase Original Background
            </label>
          </div>
          <span className="font-mono text-[9px] text-indigo-600 dark:text-indigo-400">CHROMA KEY</span>
        </div>

        {replaceBgOn && (
          <div className="mt-3 space-y-3.5">
            {/* Color Sampling row */}
            <div className="flex items-center justify-between gap-2 rounded-lg bg-white p-2 border border-indigo-100/50 dark:bg-zinc-900 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={onTogglePickingMode}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                    pickingModeActive
                      ? 'bg-amber-500 border-amber-600 text-white animate-pulse'
                      : 'bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:border-indigo-900 dark:text-indigo-300'
                  }`}
                  title="Click to activate background color dropper sampling"
                  id="bg-sampling-dropper-btn"
                >
                  <Pipette className="h-4 w-4" />
                </button>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-800 dark:text-zinc-300">
                    {pickingModeActive ? 'Dropper Active' : 'Click Color Dropper'}
                  </span>
                  <span className="text-[9px] text-gray-400 dark:text-zinc-500">
                    {pickingModeActive ? 'Sample pixels on the left image' : 'Select color from source image'}
                  </span>
                </div>
              </div>

              {/* Sample Swatch display */}
              <div className="flex items-center gap-1.5" id="sampled-backface-display">
                <div
                  className="h-6 w-6 rounded-md border border-gray-300 shadow-3xs shrink-0"
                  style={{
                    backgroundColor: bgSampleColor
                      ? `rgb(${bgSampleColor.r}, ${bgSampleColor.g}, ${bgSampleColor.b})`
                      : 'transparent',
                  }}
                />
                <span className="font-mono text-[9px] text-gray-500 dark:text-zinc-400">
                  {bgSampleColor ? `RGB(${bgSampleColor.r},${bgSampleColor.g},${bgSampleColor.b})` : 'None'}
                </span>
              </div>
            </div>

            {/* Threshold Tolerance Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between font-mono text-[9px] text-gray-500 dark:text-zinc-400">
                <span>Erase Color Tolerance Range</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-300">{bgTolerance}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="85"
                step="1"
                value={bgTolerance}
                onChange={(e) => onBgToleranceChange(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-800 dark:accent-indigo-500"
                id="bg-tolerance-slider"
              />
              <span className="block text-[8px] leading-relaxed text-gray-400 dark:text-zinc-500 text-center">
                *Increase tolerance if patch shadows remain; decrease if clothes/elements get transparency.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
