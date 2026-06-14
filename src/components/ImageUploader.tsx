import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64Url: string) => void;
  onClearImage?: () => void;
  currentImage: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelected, 
  onClearImage, 
  currentImage 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMessage(null);

    // Validate if image
    if (!file.type.match('image.*')) {
      setErrorMessage('The file must be an image (PNG, JPG, JPEG, WEBP).');
      return;
    }

    // Validate size limit of 20MB
    const maxSize = 20 * 1024 * 1024; // 20 megabytes
    if (file.size > maxSize) {
      setErrorMessage('Image size exceeds 20MB limit. Please upload a smaller photo.');
      return;
    }

    // Load file reader
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setLoading(false);
      if (e.target?.result && typeof e.target.result === 'string') {
        onImageSelected(e.target.result);
      } else {
        setErrorMessage('Failed to read image content. Please try again.');
      }
    };
    reader.onerror = () => {
      setLoading(false);
      setErrorMessage('Error uploading image file. Please retry.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full" id="image-uploader-wrapper">
      {/* Hidden input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
        id="image-file-input"
      />

      {/* Main Drag-Drop Box */}
      {!currentImage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-14 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-400 dark:bg-indigo-950/20'
              : 'border-gray-200 bg-white hover:border-gray-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
          }`}
          id="dropzone-area"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-500 group-hover:scale-105 group-hover:text-indigo-600 transition-all dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:text-indigo-400">
            {loading ? (
              <RefreshCw className="h-6 w-6 animate-spin text-indigo-500" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
          </div>

          <div className="max-w-xs space-y-2">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {loading ? 'Processing Image...' : 'Drag & drop image here'}
            </p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
              Or click to browse from system repository. Supports PNG, JPG, JPEG, and WEBP.
            </p>
          </div>

          {/* Sizing requirements card */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 border-t border-gray-100 pt-5 text-[10px] font-mono text-gray-400 dark:border-zinc-800">
            <span>MAX SIZE: 20MB</span>
            <span>•</span>
            <span>HIGH RES PREFERRED</span>
            <span>•</span>
            <span>LIGHT BACKDROP RECOMMENDED</span>
          </div>
        </div>
      ) : (
        /* Preview/Manage Current Loaded Image Card */
        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900" id="uploaded-image-preview-card">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-805">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <ImageIcon className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 dark:text-zinc-100">Active Source Image</span>
                <span className="text-[10px] font-mono text-gray-400 dark:text-zinc-500">READY FOR LAB EDITING</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBrowseClick}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                title="Replace with another image"
                id="uploader-replace-btn"
              >
                <RefreshCw className="h-3 w-3" />
                Replace
              </button>
              {onClearImage && (
                <button
                  onClick={onClearImage}
                  className="flex items-center justify-center h-8 w-8 text-rose-500 border border-rose-100 rounded-lg hover:bg-rose-50/50 transition dark:border-rose-950/20 dark:text-rose-400"
                  title="Remove Image"
                  id="uploader-remove-btn"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex max-h-56 justify-center overflow-hidden rounded-xl bg-gray-50 dark:bg-zinc-950 p-2">
            <img 
              src={currentImage} 
              alt="Source Input Preview" 
              className="object-contain max-h-full rounded-lg shadow-sm"
              id="source-image-img-preview"
            />
          </div>
        </div>
      )}

      {/* Visual Error Message banner */}
      {errorMessage && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400" id="uploader-error-banner">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-bold">Upload Error</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
