import React from 'react';
import { Layers, Check } from 'lucide-react';

interface MultiCopyGeneratorProps {
  selectedCopies: number;
  onCopiesChange: (count: number) => void;
  maxSlots: number;
}

export const MultiCopyGenerator: React.FC<MultiCopyGeneratorProps> = ({
  selectedCopies,
  onCopiesChange,
  maxSlots,
}) => {
  const copyPresets = [1, 2, 4, 6, 8, 12, 16, 24];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900" id="multi-copy-panel">
      {/* Title */}
      <div className="flex items-center gap-2 pb-2.5 border-b border-gray-50 dark:border-zinc-850 mb-3">
        <Layers className="h-4 w-4 text-indigo-500" />
        <span className="text-xs font-bold text-gray-900 uppercase tracking-wider dark:text-zinc-100">
          Photo Copies Compiler
        </span>
      </div>

      <p className="text-[10px] text-gray-400 dark:text-zinc-500 mb-3 leading-relaxed">
        Select the target volume of photos to arrange on the A4 page sheet. Excess prints are trimmed to stay inside print boundaries.
      </p>

      {/* Copies selector buttons */}
      <div className="grid grid-cols-4 gap-2">
        {copyPresets.map((count) => {
          const isActive = selectedCopies === count;
          const isWarning = count > maxSlots; // highlight fits capacity

          return (
            <button
              key={count}
              onClick={() => onCopiesChange(count)}
              className={`flex flex-col items-center justify-center rounded-lg py-2.5 px-2 border text-center transition ${
                isActive
                  ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/20 dark:text-indigo-400'
                  : 'border-gray-100 bg-gray-50 hover:bg-gray-100 dark:border-zinc-850 dark:bg-zinc-850 dark:text-zinc-300'
              }`}
              id={`copy-count-${count}`}
            >
              <span className="text-sm font-extrabold tracking-tight">
                {count}
              </span>
              <span className="text-[8px] font-mono uppercase text-gray-400 dark:text-zinc-500">
                {count === 1 ? 'Copy' : 'Copies'}
              </span>

              {isActive && (
                <div className="mt-0.5 h-1 w-3 rounded bg-indigo-600 dark:bg-indigo-500" />
              )}
            </button>
          );
        })}
      </div>

      {selectedCopies > maxSlots && (
        <div className="mt-3 text-[9px] text-amber-600 font-mono bg-amber-50 rounded-lg p-2 leading-relaxed dark:bg-amber-950/10 dark:text-amber-500">
          *WARNING: Sheet template currently accommodates max {maxSlots} cells. Render copies will stack up sequentially or trigger multi-sheets.
        </div>
      )}
    </div>
  );
};
