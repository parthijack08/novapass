import React from 'react';
import { 
  Download, Printer, FileImage, FileCode, CheckCircle, Info, Settings 
} from 'lucide-react';

interface DownloadPanelProps {
  onDownloadSingle: (format: 'png' | 'jpeg') => void;
  onDownloadPDF: () => void;
  onPrintSheet: () => void;
  format: 'png' | 'jpeg';
  onFormatChange: (fmt: 'png' | 'jpeg') => void;
  quality: 'high' | 'medium' | 'low';
  onQualityChange: (q: 'high' | 'medium' | 'low') => void;
  hasPhoto: boolean;
}

export const DownloadPanel: React.FC<DownloadPanelProps> = ({
  onDownloadSingle,
  onDownloadPDF,
  onPrintSheet,
  format,
  onFormatChange,
  quality,
  onQualityChange,
  hasPhoto,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900" id="download-panel-box">
      
      {/* Title */}
      <div className="flex items-center gap-2 pb-2.5 border-b border-gray-50 dark:border-zinc-850 mb-4 animate-fade-in">
        <Download className="h-4.5 w-4.5 text-indigo-500" />
        <span className="text-xs font-bold text-gray-900 uppercase tracking-wider dark:text-zinc-100">
          Publish & Export Console
        </span>
      </div>

      <div className="space-y-4">
        {/* File Format selectors */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Image Format</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onFormatChange('png')}
              disabled={!hasPhoto}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border transition ${
                format === 'png'
                  ? 'border-indigo-600 bg-indigo-50/10 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/20 dark:text-indigo-400'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-zinc-850 dark:bg-zinc-850 dark:text-zinc-400'
              }`}
            >
              <FileImage className="h-4 w-4" />
              Lossless PNG
            </button>
            <button
              onClick={() => onFormatChange('jpeg')}
              disabled={!hasPhoto}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border transition ${
                format === 'jpeg'
                  ? 'border-indigo-600 bg-indigo-50/10 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/20 dark:text-indigo-400'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-zinc-850 dark:bg-zinc-850 dark:text-zinc-400'
              }`}
            >
              <FileCode className="h-4 w-4" />
              Standard JPEG
            </button>
          </div>
        </div>

        {/* Export Quality profile */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Image Compress Quality</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'high', label: 'Maximum', desc: 'No compression' },
              { id: 'medium', label: 'Balanced', desc: 'Slight comp' },
              { id: 'low', label: 'Compressed', desc: 'Lightweight' },
            ].map((q) => {
              const isActive = quality === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => onQualityChange(q.id as any)}
                  disabled={!hasPhoto}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 border text-[10px] font-bold rounded-lg transition ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50/10 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/20'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-zinc-855 dark:bg-zinc-850'
                  }`}
                  title={q.desc}
                >
                  <span>{q.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Triggers */}
        <div className="border-t border-gray-100 pt-4 space-y-2 dark:border-zinc-850">
          {/* Download Single */}
          <button
            onClick={() => onDownloadSingle(format)}
            disabled={!hasPhoto}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-xs font-bold text-white transition-all hover:bg-black focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed dark:bg-zinc-800 dark:hover:bg-zinc-700 shadow-md shadow-zinc-900/10"
            id="download-single-action-btn"
          >
            <Download className="h-4 w-4" />
            Download Single Photo ({format.toUpperCase()})
          </button>

          {/* Download A4 Sheet PDF */}
          <button
            onClick={onDownloadPDF}
            disabled={!hasPhoto}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white transition-all hover:bg-indigo-700 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md shadow-indigo-600/10"
            id="download-pdf-action-btn"
          >
            <Printer className="h-4 w-4" />
            Download Print-Ready A4 PDF
          </button>

          {/* Print directly */}
          <button
            onClick={onPrintSheet}
            disabled={!hasPhoto}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-xs font-bold text-gray-700 transition-all hover:bg-gray-50 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-850"
            id="direct-print-action-btn"
          >
            <Printer className="h-4 w-4 animate-bounce" style={{ animationDuration: '3s' }} />
            Print Now (Browser Dialog)
          </button>
        </div>

        {/* Sizing Help Status Label */}
        <div className="flex gap-2.5 items-start rounded-lg bg-gray-50 p-3 text-[10px] text-gray-400 dark:bg-zinc-950/20 dark:text-zinc-500">
          <Info className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
          <p className="leading-relaxed">
            Standard operating system dialogue will prompt scaling configurations. For dimensional coherence, always check and set "Scale: 100%" or "Actual Size" in your browser print dialogue.
          </p>
        </div>
      </div>
    </div>
  );
};
