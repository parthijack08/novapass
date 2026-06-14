import React from 'react';
import { Camera, ZoomIn, Image as ImageIcon } from 'lucide-react';
import { PhotoSizePreset } from '../types';

interface PhotoPreviewProps {
  photoBase64: string | null;
  sizePreset: PhotoSizePreset;
}

export const PhotoPreview: React.FC<PhotoPreviewProps> = ({ photoBase64, sizePreset }) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900" id="photo-preview-panel">
      <div className="flex items-center justify-between pb-3 border-b border-gray-50 dark:border-zinc-850">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
          Studio Preview (1x Output)
        </h3>
        <span className="font-mono text-[9px] text-gray-400 dark:text-zinc-500">300 DPI PRECISE</span>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 p-6 dark:bg-zinc-950/60 min-h-[300px]">
        {photoBase64 ? (
          <div className="flex flex-col items-center gap-4">
            {/* Renders exact user dimension boundaries as specified */}
            <div 
              className="relative rounded border border-gray-200 bg-white shadow-md p-1 dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden"
              style={{
                aspectRatio: `${sizePreset.width} / ${sizePreset.height}`,
                maxWidth: '240px',
                width: '100%',
              }}
              id="single-photo-preview-box"
            >
              <img 
                src={photoBase64} 
                alt="Active single passport output"
                className="w-full h-full object-cover rounded-xs"
                id="compiled-single-photo-element"
              />
            </div>
            
            <div className="text-center">
              <span className="font-mono text-[10px] bg-indigo-50 border border-indigo-100/40 text-indigo-700 px-3 py-1 rounded-full uppercase font-bold dark:bg-indigo-950/30 dark:text-indigo-400">
                {sizePreset.name} • {sizePreset.width}x{sizePreset.height} {sizePreset.unit}
              </span>
              <p className="mt-2 text-[10px] text-gray-400 dark:text-zinc-500 max-w-xs">
                Render compiled into a high-density print block. Fit parameters are applied cleanly.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 text-gray-400">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 p-3 mb-3 dark:bg-zinc-800 dark:text-zinc-500">
              <ImageIcon className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300">No Compiled Photo Found</span>
            <p className="mt-1 text-[10px] text-gray-500 dark:text-zinc-500 max-w-xs">
              Go to the Photo Lab tool, update adjustments, and compile the final photo template.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
