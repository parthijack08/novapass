import React from 'react';
import { PhotoSizePreset, Unit } from '../types';
import { 
  Grid, Layers, Sliders, Type, Check 
} from 'lucide-react';
import { SHEET_TEMPLATES } from '../utils/presets';

interface PrintSheetPreviewProps {
  photoBase64: string | null;
  sizePreset: PhotoSizePreset;
  copiesCount: number;
  cols: number;
  onColsChange: (cols: number) => void;
  rows: number;
  onRowsChange: (rows: number) => void;
  marginMm: number;
  onMarginMmChange: (margin: number) => void;
  watermarkOn: boolean;
  onWatermarkToggle: (active: boolean) => void;
  watermarkText: string;
  onWatermarkTextChange: (txt: string) => void;
  sheetNumberingOn: boolean;
  onSheetNumberingToggle: (active: boolean) => void;
  showSafeArea: boolean;
  onShowSafeAreaToggle: (active: boolean) => void;
}

export const PrintSheetPreview: React.FC<PrintSheetPreviewProps> = ({
  photoBase64,
  sizePreset,
  copiesCount,
  cols,
  onColsChange,
  rows,
  onRowsChange,
  marginMm,
  onMarginMmChange,
  watermarkOn,
  onWatermarkToggle,
  watermarkText,
  onWatermarkTextChange,
  sheetNumberingOn,
  onSheetNumberingToggle,
  showSafeArea,
  onShowSafeAreaToggle,
}) => {
  // Standard A4 dimensions in mm
  const a4Width = 210;
  const a4Height = 297;

  // Calculate sizes and printable margins exactly matching pdfGenerator.ts
  const photoW = sizePreset.width;
  const photoH = sizePreset.height;

  const slotsCount = cols * rows;
  const photocopies = Array.from({ length: slotsCount }).slice(0, copiesCount);

  const printableWidth = a4Width - marginMm * 2;
  const printableHeight = a4Height - marginMm * 2;

  // Grid layout calculations matching pdfGenerator.ts precisely
  const cellGapX = cols > 1 ? (printableWidth - cols * photoW) / (cols - 1) : 0;
  const cellGapY = rows > 1 ? (printableHeight - rows * photoH) / (rows - 1) : 0;

  // Safeguards matching PDF generation logic
  const actualGapX = Math.max(2, cellGapX < 0 ? 4 : cellGapX);
  const actualGapY = Math.max(2, cellGapY < 0 ? 4 : cellGapY);

  const totalGridW = cols * photoW + (cols - 1) * actualGapX;
  const totalGridH = rows * photoH + (rows - 1) * actualGapY;

  // Center coordinates on inside of sheet
  const startX = (a4Width - totalGridW) / 2;
  const startY = (a4Height - totalGridH) / 2;

  // Dynamically position labels
  const headerY = Math.max(6, startY - 8);
  const footerY = Math.min(290, startY + totalGridH + 6);

  // Detect physical paper bounds violation
  const isOverflowingValue = totalGridW > (a4Width - 4) || totalGridH > (a4Height - 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="print-sheet-panel">
      
      {/* 2/3 Column: A4 Physical Sheet Preview Page */}
      <div className="lg:col-span-2 flex flex-col items-center justify-center rounded-2xl bg-gray-100 p-6 dark:bg-zinc-950/60 min-h-[500px]">
        <div className="mb-4 flex flex-col sm:flex-row items-center justify-between w-full max-w-sm gap-2">
          <div className="flex flex-col text-center sm:text-left">
            <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">A4 Portrait Sheet</span>
            <span className="text-[9px] font-mono text-gray-400">210mm x 297mm Size Standard</span>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 px-2.5 py-0.5 rounded-full dark:bg-emerald-950/30 dark:text-emerald-400">
            {photocopies.length} of {copiesCount} copies rendered
          </span>
        </div>

        {/* Overflow Alert Warning Banner */}
        {isOverflowingValue && (
          <div className="mb-4 flex items-start gap-2.5 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl p-3 text-[10px] leading-relaxed max-w-sm dark:bg-rose-955/20 dark:border-rose-950/20 dark:text-rose-400">
            <span className="font-bold uppercase tracking-wider shrink-0 text-[8px] bg-rose-500 text-white px-1.5 py-0.5 rounded mt-0.5">OVERFLOW WARNING</span>
            <span>Grid exceeds A4 borders ({totalGridW.toFixed(0)}x{totalGridH.toFixed(0)}mm vs {a4Width}x{a4Height}mm). Reduce margins or grid template rows/cols to fit nicely.</span>
          </div>
        )}

        {/* The Physical Page Block: matches 210:297 scale ratio */}
        <div 
          className="relative bg-white border border-gray-200 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden"
          style={{
            aspectRatio: '210 / 297',
            width: '100%',
            maxWidth: '380px',
          }}
          id="a4-sheet-layout-preview"
        >
          {/* Printable Outer Margins Visualization Guide (Not printed) */}
          <div 
            className="absolute border border-dashed border-indigo-200/40 dark:border-indigo-500/25 pointer-events-none no-print"
            style={{
              left: `${(marginMm / a4Width) * 100}%`,
              top: `${(marginMm / a4Height) * 100}%`,
              width: `${(printableWidth / a4Width) * 100}%`,
              height: `${(printableHeight / a4Height) * 100}%`,
            }}
          />

          {/* Print Safe Area at 10mm (Not printed) */}
          {showSafeArea && (
            <div 
              className="absolute border border-dashed border-rose-500/45 pointer-events-none no-print"
              style={{
                left: `${(10 / a4Width) * 100}%`,
                top: `${(10 / a4Height) * 100}%`,
                width: `${((a4Width - 20) / a4Width) * 100}%`,
                height: `${((a4Height - 20) / a4Height) * 100}%`,
              }}
            >
              <div className="absolute top-0.5 left-1 select-none font-mono text-[5px] text-rose-500/90 font-bold uppercase bg-white/70 dark:bg-zinc-900/70 px-1 rounded-sm">
                10mm Safe Area
              </div>
            </div>
          )}

          {/* Header standard subtitle on inside printed sheet */}
          <div 
            className="absolute w-full text-center font-mono text-[6px] text-gray-300 dark:text-zinc-600 pointer-events-none font-bold"
            style={{
              top: `${(headerY / a4Height) * 100}%`,
              left: 0,
            }}
          >
            PASSPORT PRO STUDIO — PRINT-READY DOCUMENT PREVIEW
          </div>

          {/* Sheet-wide Rotated Watermark */}
          {watermarkOn && watermarkText && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 opacity-15 overflow-hidden">
              <span className="font-sans font-extrabold text-[4vw] sm:text-[18px] tracking-widest text-indigo-900 border-2 border-indigo-900 px-4 py-2 uppercase rotate-35">
                {watermarkText}
              </span>
            </div>
          )}

          {/* Photos cells coordinate layout math */}
          {photoBase64 ? (
            Array.from({ length: slotsCount }).map((_, idx) => {
              const r = Math.floor(idx / cols);
              const c = idx % cols;
              const posX = startX + c * (photoW + actualGapX);
              const posY = startY + r * (photoH + actualGapY);

              const leftPct = (posX / a4Width) * 100;
              const topPct = (posY / a4Height) * 100;
              const widthPct = (photoW / a4Width) * 100;
              const heightPct = (photoH / a4Height) * 100;

              const hasPhoto = idx < photocopies.length;

              return (
                <div 
                  key={idx}
                  className="absolute rounded border border-gray-200/80 border-dashed bg-gray-50/50 flex items-center justify-center overflow-hidden group/cell shadow-3xs"
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: `${widthPct}%`,
                    height: `${heightPct}%`,
                    padding: '2px', // leaves fine border space inside the cell bounds
                  }}
                >
                  {hasPhoto ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={photoBase64} 
                        alt={`Grid position ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {/* Slot count tag */}
                      <div className="absolute bottom-1 right-1 bg-black/60 rounded px-1 py-0.5 text-[5px] font-mono text-white pointer-events-none no-print">
                        #{idx + 1}
                      </div>
                    </div>
                  ) : (
                    <span className="font-mono text-[7px] text-gray-300 dark:text-zinc-600 no-print">
                      Slot {idx + 1}
                    </span>
                  )}

                  {/* Studio-style cutline visual indicators */}
                  <span className="absolute -top-1 -left-1 text-[8px] font-serif text-gray-300 pointer-events-none select-none no-print">+</span>
                  <span className="absolute -top-1 -right-1 text-[8px] font-serif text-gray-300 pointer-events-none select-none no-print">+</span>
                  <span className="absolute -bottom-1 -left-1 text-[8px] font-serif text-gray-300 pointer-events-none select-none no-print">+</span>
                  <span className="absolute -bottom-1 -right-1 text-[8px] font-serif text-gray-300 pointer-events-none select-none no-print">+</span>
                </div>
              );
            })
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <span className="font-mono text-[8px] text-gray-400">NO ENHANCED PHOTO FOR MULTIPLY GRID</span>
            </div>
          )}

          {/* Page Footer labels inside A4 */}
          <div 
            className="absolute w-full flex items-center justify-between font-mono text-[5px] text-gray-300 dark:text-zinc-600 pointer-events-none px-4"
            style={{
              top: `${(footerY / a4Height) * 100}%`,
              left: 0,
            }}
          >
            <span>Preset: {sizePreset.name} ({sizePreset.width}x{sizePreset.height}mm)</span>
            {sheetNumberingOn && <span>Page 1 of 1</span>}
          </div>
        </div>
      </div>

      {/* 1/3 Column: Grid Arrange controls panel */}
      <div className="space-y-4">
        
        {/* Layout templates picker */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 pb-2.5 border-b border-gray-50 dark:border-zinc-850 mb-3">
            <Grid className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider dark:text-zinc-100">
              Arrange Grid Template
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {SHEET_TEMPLATES.map((tpl, idx) => {
              const matches = cols === tpl.cols && rows === tpl.rows;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onColsChange(tpl.cols);
                    onRowsChange(tpl.rows);
                  }}
                  className={`flex items-center justify-between rounded-lg p-2.5 text-left border text-xs transition ${
                    matches
                      ? 'border-indigo-600 bg-indigo-50/15 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/20 dark:text-indigo-400'
                      : 'border-gray-100 bg-gray-50 hover:bg-gray-100 dark:border-zinc-850 dark:bg-zinc-850'
                  }`}
                  id={`sheet-template-btn-${idx}`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-gray-800 dark:text-zinc-200">{tpl.label}</span>
                    <span className="text-[9px] font-mono text-gray-400">
                      Arrangement: {tpl.cols} Cols x {tpl.rows} Rows ({tpl.cols * tpl.rows} max copies)
                    </span>
                  </div>
                  {matches && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white dark:bg-indigo-500">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom manual grid dials and print margins */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 pb-2.5 border-b border-gray-50 dark:border-zinc-850 mb-3">
            <Sliders className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider dark:text-zinc-100">
              Fine Spacing & Alignment
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Columns Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-zinc-300">
                <span>Layout Columns</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{cols} columns</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                step="1"
                value={cols}
                onChange={(e) => onColsChange(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-1 bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rows Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-zinc-300">
                <span>Layout Rows</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{rows} rows</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={rows}
                onChange={(e) => onRowsChange(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-1 bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Margins Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-zinc-300">
                <span>Sheet Margin (Outside offset)</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">{marginMm} mm</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={marginMm}
                onChange={(e) => onMarginMmChange(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-1 bg-gray-200 rounded-lg cursor-pointer"
              />
              
              {/* Configurable quick presets margins (5mm, 10mm, 20mm) */}
              <div className="flex items-center gap-1.5 pt-1">
                {[5, 10, 20].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onMarginMmChange(m)}
                    className={`flex-1 py-1 rounded text-[8px] font-mono font-extrabold transition border ${
                      marginMm === m
                        ? 'bg-indigo-600 text-white border-transparent'
                        : 'bg-gray-50 text-gray-500 border-gray-150 hover:bg-gray-100 dark:bg-zinc-850 dark:text-zinc-300 dark:border-zinc-800'
                    }`}
                  >
                    {m}mm {m === 10 ? '(Std)' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Brand visual overlays & footer options */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 pb-2.5 border-b border-gray-50 dark:border-zinc-850 mb-3">
            <Type className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider dark:text-zinc-100">
              Visual Overlays
            </span>
          </div>

          <div className="space-y-4">
            {/* Watermark toggle */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">Sheet Watermark Overlay</span>
                <span className="text-[9px] text-gray-400 dark:text-zinc-500">Draw background protection text</span>
              </div>
              <input
                type="checkbox"
                checked={watermarkOn}
                onChange={(e) => onWatermarkToggle(e.target.checked)}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {watermarkOn && (
              <div className="space-y-1 pl-1.5 border-l-2 border-indigo-200 md:pl-2">
                <label className="text-[9px] font-bold text-gray-500 dark:text-zinc-400">Watermark Text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => onWatermarkTextChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-900 focus:border-indigo-600 focus:outline-none dark:border-zinc-705 dark:bg-zinc-850 dark:text-zinc-100"
                />
              </div>
            )}

            {/* Page number toggle */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-zinc-850">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">Render Page Indexing</span>
                <span className="text-[9px] text-gray-400 dark:text-zinc-500">Output "Sheet 1 of 1" at footer</span>
              </div>
              <input
                type="checkbox"
                checked={sheetNumberingOn}
                onChange={(e) => onSheetNumberingToggle(e.target.checked)}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {/* Show Safe Area Toggle */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-zinc-850">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">Show Safe Area Guideline</span>
                <span className="text-[9px] text-gray-400 dark:text-zinc-500">Draw 10mm red print safety border</span>
              </div>
              <input
                type="checkbox"
                checked={showSafeArea}
                onChange={(e) => onShowSafeAreaToggle(e.target.checked)}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
