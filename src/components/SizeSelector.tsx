import React, { useState, useEffect } from 'react';
import { PHOTO_SIZE_PRESETS } from '../utils/presets';
import { PhotoSizePreset, Unit } from '../types';
import { convertDimension, formatDimensions } from '../utils/dimensionConverter';
import { ChevronRight, Sliders, Check } from 'lucide-react';

interface SizeSelectorProps {
  selectedSizeId: string;
  onSizeChange: (preset: PhotoSizePreset) => void;
  customSize: { width: number; height: number; unit: Unit };
  onCustomSizeChange: (size: { width: number; height: number; unit: Unit }) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  selectedSizeId,
  onSizeChange,
  customSize,
  onCustomSizeChange,
}) => {
  const [isCustomMode, setIsCustomMode] = useState(selectedSizeId === 'custom');
  
  // Local inputs to hold string state while typing
  const [inpWidth, setInpWidth] = useState(customSize.width.toString());
  const [inpHeight, setInpHeight] = useState(customSize.height.toString());
  const [inpUnit, setInpUnit] = useState<Unit>(customSize.unit);

  useEffect(() => {
    if (selectedSizeId === 'custom') {
      setIsCustomMode(true);
    } else {
      setIsCustomMode(false);
      const activePreset = PHOTO_SIZE_PRESETS.find((p) => p.id === selectedSizeId);
      if (activePreset) {
        setInpWidth(activePreset.width.toString());
        setInpHeight(activePreset.height.toString());
        setInpUnit(activePreset.unit);
      }
    }
  }, [selectedSizeId]);

  const handlePresetSelect = (preset: PhotoSizePreset) => {
    setIsCustomMode(false);
    onSizeChange(preset);
  };

  const handleCustomActivate = () => {
    setIsCustomMode(true);
    // Submit custom size format
    onSizeChange({
      id: 'custom',
      name: 'Custom Dimension Sizing',
      width: parseFloat(inpWidth) || 35,
      height: parseFloat(inpHeight) || 45,
      unit: inpUnit,
      description: 'User-specified dimensions and unit ratios.',
    });
  };

  const handleCustomValueCommit = (widthVal: string, heightVal: string, unitVal: Unit) => {
    const wNum = parseFloat(widthVal) || 35;
    const hNum = parseFloat(heightVal) || 45;
    
    onCustomSizeChange({
      width: wNum,
      height: hNum,
      unit: unitVal,
    });

    onSizeChange({
      id: 'custom',
      name: 'Custom Dimension Sizing',
      width: wNum,
      height: hNum,
      unit: unitVal,
      description: 'User-specified dimensions and unit ratios.',
    });
  };

  const handleUnitConvert = (newUnit: Unit) => {
    // Convert previous numeric inputs to the new unit beautifully using dimensionConverter!
    const oldW = parseFloat(inpWidth) || 0;
    const oldH = parseFloat(inpHeight) || 0;
    
    const convertedW = convertDimension(oldW, inpUnit, newUnit);
    const convertedH = convertDimension(oldH, inpUnit, newUnit);

    const roundedW = Math.round(convertedW * 100) / 100;
    const roundedH = Math.round(convertedH * 100) / 100;

    setInpWidth(roundedW.toString());
    setInpHeight(roundedH.toString());
    setInpUnit(newUnit);

    handleCustomValueCommit(roundedW.toString(), roundedH.toString(), newUnit);
  };

  return (
    <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900" id="size-selector-panel">
      {/* Sizing presets select menu */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-50 dark:border-zinc-850">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
          Passport Size Presets
        </h3>
        <span className="font-mono text-[9px] text-gray-400 dark:text-zinc-500">STANDARD CRITERIA</span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" id="preset-spec-grid">
        {PHOTO_SIZE_PRESETS.map((preset) => {
          const isActive = !isCustomMode && selectedSizeId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className={`flex flex-col items-start rounded-xl p-3 text-left border transition ${
                isActive
                  ? 'border-indigo-600 bg-indigo-50/20 dark:border-indigo-500 dark:bg-indigo-950/20'
                  : 'border-gray-100 bg-gray-50 hover:bg-gray-100 dark:border-zinc-850 dark:bg-zinc-850'
              }`}
              id={`size-item-${preset.id}`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-[11px] font-bold text-gray-900 dark:text-zinc-100 leading-tight">
                  {preset.name}
                </span>
                {isActive && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white dark:bg-indigo-500">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                )}
              </div>
              <span className="mt-1 font-mono text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                {formatDimensions(preset.width, preset.height, preset.unit)}
              </span>
              <p className="mt-1.5 text-[9px] leading-relaxed text-gray-400 dark:text-zinc-500 line-clamp-2">
                {preset.description}
              </p>
            </button>
          );
        })}

        {/* Custom Sizing button trigger */}
        <button
          onClick={handleCustomActivate}
          className={`flex flex-col items-start rounded-xl p-3 text-left border transition ${
            isCustomMode
              ? 'border-indigo-600 bg-indigo-50/20 dark:border-indigo-500 dark:bg-indigo-950/20'
              : 'border-gray-100 bg-gray-50 hover:bg-gray-100 dark:border-zinc-850 dark:bg-zinc-850'
          }`}
          id="custom-dimensions-trigger-btn"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[11px] font-bold text-gray-900 dark:text-zinc-100 leading-tight">
              Custom Size Setup
            </span>
            {isCustomMode && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white dark:bg-indigo-500">
                <Check className="h-2.5 w-2.5" />
              </span>
            )}
          </div>
          <span className="mt-1 font-mono text-[10px] text-gray-400">
            Define custom width & height
          </span>
          <p className="mt-1.5 text-[9px] text-gray-400 dark:text-zinc-500">
            Useful for custom visa/ID parameters. Enter exact measurements in mm, cm, or inches.
          </p>
        </button>
      </div>

      {/* Custom sizing inputs (shown only when customMode is toggled) */}
      {isCustomMode && (
        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3.5 space-y-3 dark:border-zinc-800 dark:bg-zinc-850" id="custom-sizing-box">
          <div className="flex items-center gap-1 font-mono text-[9px] text-indigo-600 dark:text-indigo-400">
            <Sliders className="h-3.5 w-3.5" />
            <span>CUSTOM SPECS</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Width input */}
            <div className="space-y-1">
              <label htmlFor="custom-width" className="text-[10px] font-semibold text-gray-600 dark:text-zinc-300">
                Width
              </label>
              <input
                type="number"
                id="custom-width"
                step="0.1"
                min="1"
                value={inpWidth}
                onChange={(e) => {
                  setInpWidth(e.target.value);
                  handleCustomValueCommit(e.target.value, inpHeight, inpUnit);
                }}
                className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-900 focus:border-indigo-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>

            {/* Height input */}
            <div className="space-y-1">
              <label htmlFor="custom-height" className="text-[10px] font-semibold text-gray-600 dark:text-zinc-300">
                Height
              </label>
              <input
                type="number"
                id="custom-height"
                step="0.1"
                min="1"
                value={inpHeight}
                onChange={(e) => {
                  setInpHeight(e.target.value);
                  handleCustomValueCommit(inpWidth, e.target.value, inpUnit);
                }}
                className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-900 focus:border-indigo-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>

            {/* Sizing Unit picker */}
            <div className="space-y-1">
              <label htmlFor="custom-unit" className="text-[10px] font-semibold text-gray-600 dark:text-zinc-300">
                Unit Metric
              </label>
              <select
                id="custom-unit"
                value={inpUnit}
                onChange={(e) => handleUnitConvert(e.target.value as Unit)}
                className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-900 focus:border-indigo-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              >
                <option value="mm">mm</option>
                <option value="cm">cm</option>
                <option value="inch">inch</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
