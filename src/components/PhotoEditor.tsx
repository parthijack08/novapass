import React, { useRef, useEffect, useState } from 'react';
import { 
  ZoomIn, ZoomOut, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, 
  Grid3X3, Eye, ShieldAlert, Minimize, Move, Sparkles, RefreshCcw, Maximize2 
} from 'lucide-react';
import { PhotoEnhancements, PhotoFrameSettings, PhotoSizePreset } from '../types';
import { drawGuidelines } from '../utils/canvasUtils';

interface PhotoEditorProps {
  imageSrc: string;
  sizePreset: PhotoSizePreset;
  scale: number;
  onScaleChange: (scale: number) => void;
  translateX: number;
  translateY: number;
  onTranslateChange: (x: number, y: number) => void;
  rotation: number; // degrees
  onRotationChange: (deg: number) => void;
  flipH: boolean;
  onToggleFlipH: () => void;
  flipV: boolean;
  onToggleFlipV: () => void;
  enhancements: PhotoEnhancements;
  onEnhancementChange: (key: keyof PhotoEnhancements, val: number) => void;
  frame: PhotoFrameSettings;
  onFrameChange: (key: keyof PhotoFrameSettings, val: any) => void;
  backgroundColor: string;
  replaceBgOn: boolean;
  bgSampleColor: { r: number; g: number; b: number } | null;
  onBgColorSampled: (color: { r: number; g: number; b: number }) => void;
  bgTolerance: number;
  pickingModeActive: boolean;
  onTogglePickingMode: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const PhotoEditor: React.FC<PhotoEditorProps> = ({
  imageSrc,
  sizePreset,
  scale,
  onScaleChange,
  translateX,
  translateY,
  onTranslateChange,
  rotation,
  onRotationChange,
  flipH,
  onToggleFlipH,
  flipV,
  onToggleFlipV,
  enhancements,
  onEnhancementChange,
  frame,
  onFrameChange,
  backgroundColor,
  replaceBgOn,
  bgSampleColor,
  onBgColorSampled,
  bgTolerance,
  pickingModeActive,
  onTogglePickingMode,
  canvasRef,
}) => {
  const guideCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States for interactive panning
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Guide toggle states
  const [gridOn, setGridOn] = useState(true);
  const [faceOverlayOn, setFaceOverlayOn] = useState(true);
  const [safeAreaOn, setSafeAreaOn] = useState(true);

  // Load natural dimensions of current image preset
  const [imageObject, setImageObject] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageObject(img);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Main rendering loop containing direct canvas draws
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObject) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Output Dimensions (High Resolution 300 DPI layout bounds)
    // To fit within standard sizes: mm to pixels (e.g. 35mm * 6 = ~210px, let's multiply mm by 8 for premium preview resolution)
    const factor = 8;
    const w = sizePreset.width * factor;
    const h = sizePreset.height * factor;

    canvas.width = w;
    canvas.height = h;

    // Render transparent guide canvas dimensions matching standard output
    const guideCanvas = guideCanvasRef.current;
    if (guideCanvas) {
      guideCanvas.width = w;
      guideCanvas.height = h;
      drawGuidelines(guideCanvas, gridOn, faceOverlayOn, safeAreaOn);
    }

    // 1. Draw backdrop background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, w, h);

    // 2. Set Up GPU-accelerated Filters
    const bFactor = 100 + enhancements.brightness + (enhancements.exposure * 0.5);
    const cFactor = 100 + enhancements.contrast;
    const sFactor = 100 + enhancements.saturation;
    ctx.filter = `brightness(${bFactor}%) contrast(${cFactor}%) saturate(${sFactor}%)`;

    ctx.save();
    // Translate context to center plus current panning displacement offsets
    ctx.translate(w / 2 + translateX * factor, h / 2 + translateY * factor);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale * (flipH ? -1 : 1), scale * (flipV ? -1 : 1));

    // Centered crop calculation
    const imgAspect = imageObject.width / imageObject.height;
    let drawW = w;
    let drawH = w / imgAspect;

    if (drawH < h) {
      drawH = h;
      drawW = h * imgAspect;
    }

    ctx.drawImage(imageObject, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // 3. direct pixel manipulation (Backdrop Chroma-Key, Temperature Warmth, Sharpness Laplacian)
    let imgData = ctx.getImageData(0, 0, w, h);
    
    // Apply temperature & sharpness
    // Temperature warmth adjustments
    if (enhancements.temperature !== 0) {
      const tempFactor = enhancements.temperature / 180;
      for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + tempFactor * 45)); // red
        imgData.data[i + 2] = Math.min(255, Math.max(0, imgData.data[i + 2] - tempFactor * 45)); // blue
      }
    }

    // Sharpness Laplacian convolution matrix option
    if (enhancements.sharpness > 0) {
      const sAmt = enhancements.sharpness / 100;
      const d = imgData.data;
      const copy = new Uint8ClampedArray(d);
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = (y * w + x) * 4;
          for (let c = 0; c < 3; c++) {
            const center = copy[idx + c];
            const laplacian = 5 * center - (
              copy[((y - 1) * w + x) * 4 + c] +
              copy[((y + 1) * w + x) * 4 + c] +
              copy[(y * w + (x - 1)) * 4 + c] +
              copy[(y * w + (x + 1)) * 4 + c]
            );
            d[idx + c] = Math.min(255, Math.max(0, center + sAmt * (laplacian - center)));
          }
        }
      }
    }

    // Chroma key background replacement algorithm if active
    if (replaceBgOn && bgSampleColor) {
      const d = imgData.data;
      const rThreshold = (bgTolerance / 100) * 255;
      
      // Convert target template hex to RGB values
      const targetHex = backgroundColor.replace('#', '');
      const tarR = parseInt(targetHex.substring(0, 2), 16) || 255;
      const tarG = parseInt(targetHex.substring(2, 4), 16) || 255;
      const tarB = parseInt(targetHex.substring(4, 6), 16) || 255;

      for (let i = 0; i < d.length; i += 4) {
        const sr = d[i];
        const sg = d[i + 1];
        const sb = d[i + 2];

        // Core Euclidean color distance formula
        const dist = Math.sqrt(
          Math.pow(sr - bgSampleColor.r, 2) +
          Math.pow(sg - bgSampleColor.g, 2) +
          Math.pow(sb - bgSampleColor.b, 2)
        );

        if (dist <= rThreshold) {
          d[i] = tarR;
          d[i + 1] = tarG;
          d[i + 2] = tarB;
          d[i + 3] = 255;
        } else if (dist <= rThreshold + 12) {
          // Soft blending feathered margins
          const blendFactor = (dist - rThreshold) / 12;
          d[i] = Math.round(tarR * (1 - blendFactor) + sr * blendFactor);
          d[i + 1] = Math.round(tarG * (1 - blendFactor) + sg * blendFactor);
          d[i + 2] = Math.round(tarB * (1 - blendFactor) + sb * blendFactor);
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // 4. Overlap borders, shadows elements if active
    if (frame.borderOn && frame.borderThickness > 0) {
      ctx.strokeStyle = frame.borderColor;
      ctx.lineWidth = frame.borderThickness * 2; // scale factor
      const halfB = (frame.borderThickness * 2) / 2;
      ctx.strokeRect(halfB, halfB, w - frame.borderThickness * 2, h - frame.borderThickness * 2);
    }
  }, [
    imageObject, sizePreset, scale, translateX, translateY, rotation,
    flipH, flipV, enhancements, frame, backgroundColor, replaceBgOn,
    bgSampleColor, bgTolerance, gridOn, faceOverlayOn, safeAreaOn
  ]);

  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pickingModeActive) {
      handleBackdropColorPick(e);
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning || pickingModeActive) return;
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    onTranslateChange(translateX + dx * 0.25, translateY + dy * 0.25);
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsPanning(false);
  };

  // Mouse Wheel Zoom helper
  const handleWheelZoom = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.05 : -0.05;
    onScaleChange(Math.max(0.1, Math.min(10, scale + zoomFactor)));
  };

  // Extract pixel color under mouse coordinates for backdrop erasing
  const handleBackdropColorPick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert clicked coordinate to canvas canvas dimensions ratio
    const ratioX = canvas.width / rect.width;
    const ratioY = canvas.height / rect.height;

    const sampleX = Math.round(clickX * ratioX);
    const sampleY = Math.round(clickY * ratioY);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const data = ctx.getImageData(sampleX, sampleY, 1, 1).data;
      onBgColorSampled({ r: data[0], g: data[1], b: data[2] });
    } catch (err) {
      console.error('Failed to sample color:', err);
    }

    onTogglePickingMode(); // deactivate picking mode
  };

  const resetAllCoordinates = () => {
    onScaleChange(1.0);
    onTranslateChange(0, 0);
    onRotationChange(0);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900" id="photo-editor-panel">
      {/* Visual Alignment Area & Canvases */}
      <div className="relative flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 rounded-2xl p-6 border border-gray-100 dark:border-zinc-850 overflow-hidden">
        
        {/* Helper Tip */}
        <div className="absolute top-3 left-4 flex items-center gap-1.5 font-mono text-[9px] text-gray-400 dark:text-zinc-500">
          <Move className="h-3.5 w-3.5" />
          <span>DRAG TO PAN • SCROLL WHEEL TO ZOOM</span>
        </div>

        {/* Action picker status badge */}
        {pickingModeActive && (
          <div className="absolute top-3.5 right-4 z-20 flex animate-pulse items-center gap-1 bg-amber-500 px-3 py-1 text-[10px] font-bold text-white rounded-full">
            <span>Click Background to Sample Color</span>
          </div>
        )}

        {/* Stacked Canvas Wrappers */}
        <div 
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheelZoom}
          className={`relative max-w-sm rounded-lg shadow-md border border-gray-200 transition-all select-none overflow-hidden ${
            pickingModeActive ? 'cursor-cell ring-2 ring-amber-500' : isPanning ? 'cursor-grabbing scale-99' : 'cursor-grab hover:shadow-lg'
          }`}
          style={{ 
            aspectRatio: `${sizePreset.width} / ${sizePreset.height}`,
            maxHeight: '380px',
            width: '100%',
          }}
          id="canvas-gesture-container"
        >
          {/* 1. Underlying main filtered Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain pointer-events-none"
            id="rendering-photo-canvas"
          />

          {/* 2. Overlaid transparent Guideline Canvas */}
          <canvas
            ref={guideCanvasRef}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
            id="guideline-overlay-canvas"
          />
        </div>

        {/* Mini guideline selectors */}
        <div className="mt-4 flex flex-wrap justify-center gap-3 border-t border-gray-100 pt-3.5 w-full dark:border-zinc-850">
          <button
            onClick={() => setGridOn(!gridOn)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg transition ${
              gridOn
                ? 'bg-indigo-50 border border-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/40 dark:text-indigo-400'
                : 'border border-gray-200 text-gray-400 dark:border-zinc-805'
            }`}
            title="Rule of thirds alignment matrix grid"
          >
            <Grid3X3 className="h-3.5 w-3.5" />
            Grid Guidelines
          </button>
          <button
            onClick={() => setFaceOverlayOn(!faceOverlayOn)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg transition ${
              faceOverlayOn
                ? 'bg-indigo-50 border border-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/40 dark:text-indigo-400'
                : 'border border-gray-200 text-gray-400 dark:border-zinc-805'
            }`}
            title="Face Center & Pupil Level Circle Guides"
          >
            <Eye className="h-3.5 w-3.5" />
            Face Centering
          </button>
          <button
            onClick={() => setSafeAreaOn(!safeAreaOn)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg transition ${
              safeAreaOn
                ? 'bg-indigo-50 border border-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/40 dark:text-indigo-400'
                : 'border border-gray-200 text-gray-400 dark:border-zinc-805'
            }`}
            title="5% Margin Area Limit Warning"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Safe Area Lines
          </button>
        </div>
      </div>

      {/* Editor Sliders & Fine Rotation Controls */}
      <div className="space-y-4">
        {/* Core Zoom Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-zinc-300">
            <span className="flex items-center gap-1">
              <Maximize2 className="h-3.5 w-3.5" /> Scale Factor
            </span>
            <span className="font-mono text-[10px]">{Math.round(scale * 100)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <ZoomOut className="h-4 w-4 text-gray-400 cursor-pointer" onClick={() => onScaleChange(scale - 0.1)} />
            <input
              type="range"
              min="0.4"
              max="4.0"
              step="0.05"
              value={scale}
              onChange={(e) => onScaleChange(parseFloat(e.target.value))}
              className="flex-1 accent-indigo-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-800"
            />
            <ZoomIn className="h-4 w-4 text-gray-400 cursor-pointer" onClick={() => onScaleChange(scale + 0.1)} />
          </div>
        </div>

        {/* rotation Align leveler slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-zinc-300">
            <span className="flex items-center gap-1">
              <RotateCw className="h-3.5 w-3.5" /> Level Rotation
            </span>
            <span className="font-mono text-[10px]">{rotation}°</span>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw className="h-4 w-4 text-gray-400 cursor-pointer" onClick={() => onRotationChange(rotation - 1)} />
            <input
              type="range"
              min="-45"
              max="45"
              step="0.5"
              value={rotation}
              onChange={(e) => onRotationChange(parseFloat(e.target.value))}
              className="flex-1 accent-indigo-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-800"
            />
            <RotateCw className="h-4 w-4 text-gray-400 cursor-pointer" onClick={() => onRotationChange(rotation + 1)} />
          </div>
        </div>

        {/* Geometry mirroring button bar */}
        <div className="flex justify-between items-center gap-2 border-t border-gray-100 pt-3 dark:border-zinc-850">
          <div className="flex gap-2">
            <button
              onClick={onToggleFlipH}
              className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold border rounded-lg transition ${
                flipH 
                  ? 'bg-indigo-50 border-indigo-100 text-indigo-700' 
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              id="flip-horizontal-btn"
            >
              <FlipHorizontal className="h-3.5 w-3.5" />
              Mirror H
            </button>
            <button
              onClick={onToggleFlipV}
              className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold border rounded-lg transition ${
                flipV 
                  ? 'bg-indigo-50 border-indigo-100 text-indigo-700' 
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              id="flip-vertical-btn"
            >
              <FlipVertical className="h-3.5 w-3.5" />
              Mirror V
            </button>
          </div>

          <button
            onClick={resetAllCoordinates}
            className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-gray-500 border border-gray-200 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition"
            title="Reset zoom, rotates, and pan translates"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Reset Crop
          </button>
        </div>
      </div>
    </div>
  );
};
