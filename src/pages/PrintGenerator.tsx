import React, { useState } from 'react';
import { 
  Printer, Layers, Image as ImageIcon, Sliders, CheckCircle2, ChevronDown 
} from 'lucide-react';
import { PhotoPreview } from '../components/PhotoPreview';
import { PrintSheetPreview } from '../components/PrintSheetPreview';
import { MultiCopyGenerator } from '../components/MultiCopyGenerator';
import { DownloadPanel } from '../components/DownloadPanel';
import { PhotoSizePreset, AppSettings } from '../types';
import { generateA4SheetPDF } from '../utils/pdfGenerator';

interface PrintGeneratorProps {
  photoBase64: string | null;
  sizePreset: PhotoSizePreset;
  appSettings: AppSettings;
}

export const PrintGenerator: React.FC<PrintGeneratorProps> = ({
  photoBase64,
  sizePreset,
  appSettings,
}) => {
  const [activeLayout, setActiveLayout] = useState<'single' | 'sheet'>('sheet');
  const [copiesCount, setCopiesCount] = useState(8);
  const [cols, setCols] = useState(appSettings.defaultLayoutCols);
  const [rows, setRows] = useState(appSettings.defaultLayoutRows);
  const [marginMm, setMarginMm] = useState(appSettings.printMargins);
  
  // Custom Overlays states
  const [watermarkOn, setWatermarkOn] = useState(appSettings.watermarkOn);
  const [watermarkText, setWatermarkText] = useState(appSettings.watermarkText);
  const [sheetNumberingOn, setSheetNumberingOn] = useState(appSettings.sheetNumberingOn);
  const [showSafeArea, setShowSafeArea] = useState(true);

  // File download formatting states
  const [format, setFormat] = useState<'png' | 'jpeg'>(appSettings.defaultFileFormat);
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');

  // Trigger file download directly client-side
  const handleDownloadSingle = (fmt: 'png' | 'jpeg') => {
    if (!photoBase64) return;
    const link = document.createElement('a');
    link.href = photoBase64;
    link.download = `passport_single_${sizePreset.id}_${Date.now()}.${fmt}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compile PDF document using jsPDF
  const handleDownloadPDF = () => {
    if (!photoBase64) return;

    try {
      const doc = generateA4SheetPDF({
        photosBase64: photoBase64,
        sizePreset: sizePreset,
        copiesCount: copiesCount,
        columnsOnSheet: cols,
        rowsOnSheet: rows,
        marginMm: marginMm,
        watermarkOn: watermarkOn,
        watermarkText: watermarkText,
        sheetNumberingOn: sheetNumberingOn,
      });

      doc.save(`passport_A4_print_${sizePreset.id}_${Date.now()}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    }
  };

  // Trigger browser print dialog cleanly using CSS media styles
  const handlePrintSheet = () => {
    window.print();
  };

  const maxSlots = cols * rows;

  return (
    <div className="space-y-6 animate-fade-in" id="print-workspace">
      
      {/* Intro Header status column */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4 dark:border-zinc-850">
        <div>
          <h2 className="text-lg font-black uppercase text-gray-950 tracking-wide dark:text-white">
            Studio Print Engine
          </h2>
          <span className="text-xs text-gray-400">
            Preview single portrait exports and compiled multi-copy A4 grid compilations.
          </span>
        </div>

        {/* View tabs toggler */}
        <div className="flex rounded-lg bg-gray-50 p-1 dark:bg-zinc-850 self-start md:self-auto">
          <button
            onClick={() => setActiveLayout('single')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition ${
              activeLayout === 'single'
                ? 'bg-white text-gray-900 shadow-3xs dark:bg-zinc-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Single Photo preview
          </button>
          <button
            onClick={() => {
              setActiveLayout('sheet');
              // Automatically match templates boundaries
              if (copiesCount > cols * rows) {
                setCopiesCount(cols * rows);
              }
            }}
            className={`px-4 py-2 text-xs font-bold rounded-md transition ${
              activeLayout === 'sheet'
                ? 'bg-white text-gray-900 shadow-3xs dark:bg-zinc-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            A4 layout Grid compiler
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* Left Side (3/4 Grid Area): Active Preview View */}
        <div className="xl:col-span-3 space-y-6">
          
          {activeLayout === 'single' ? (
            <PhotoPreview photoBase64={photoBase64} sizePreset={sizePreset} />
          ) : (
            <PrintSheetPreview
              photoBase64={photoBase64}
              sizePreset={sizePreset}
              copiesCount={copiesCount}
              cols={cols}
              onColsChange={(c) => {
                setCols(c);
                if (copiesCount > c * rows) setCopiesCount(c * rows);
              }}
              rows={rows}
              onRowsChange={(r) => {
                setRows(r);
                if (copiesCount > cols * r) setCopiesCount(cols * r);
              }}
              marginMm={marginMm}
              onMarginMmChange={setMarginMm}
              watermarkOn={watermarkOn}
              onWatermarkToggle={setWatermarkOn}
              watermarkText={watermarkText}
              onWatermarkTextChange={setWatermarkText}
              sheetNumberingOn={sheetNumberingOn}
              onSheetNumberingToggle={setSheetNumberingOn}
              showSafeArea={showSafeArea}
              onShowSafeAreaToggle={setShowSafeArea}
            />
          )}

        </div>

        {/* Right Side (1/4 Column): Quantifier & Publisher Controllers */}
        <div className="space-y-6">
          {photoBase64 && activeLayout === 'sheet' && (
            <MultiCopyGenerator
              selectedCopies={copiesCount}
              onCopiesChange={setCopiesCount}
              maxSlots={maxSlots}
            />
          )}

          <DownloadPanel
            onDownloadSingle={handleDownloadSingle}
            onDownloadPDF={handleDownloadPDF}
            onPrintSheet={handlePrintSheet}
            format={format}
            onFormatChange={setFormat}
            quality={quality}
            onQualityChange={setQuality}
            hasPhoto={!!photoBase64}
          />
        </div>

      </div>
    </div>
  );
};
