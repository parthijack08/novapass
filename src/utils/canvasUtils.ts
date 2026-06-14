import { PhotoEnhancements, PhotoFrameSettings } from '../types';

/**
 * Loads an image URL into an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Applies color temperature adjustments and sharpness matrix
 */
export function applyImageDataEnhancements(
  imageData: ImageData,
  temperature: number, // -100 to 100
  sharpness: number    // 0 to 100
): ImageData {
  const data = imageData.data;
  const len = data.length;

  // Temperature adjustment (warmth / coolness)
  if (temperature !== 0) {
    const factor = temperature / 200; // factor between -0.5 and 0.5
    for (let i = 0; i < len; i += 4) {
      // Red channel
      data[i] = Math.min(255, Math.max(0, data[i] + factor * 50));
      // Blue channel (inverse to red)
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] - factor * 50));
    }
  }

  // Sharpness adjustment (Laplacian kernel convolution)
  if (sharpness > 0) {
    const w = imageData.width;
    const h = imageData.height;
    const original = new Uint8ClampedArray(data);
    const amount = sharpness / 100; // intensity factor

    // Laplacian kernel: [0, -1, 0, -1, 5, -1, 0, -1, 0]
    // Out = In + amount * (5*In - sum(neighbors))
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = (y * w + x) * 4;

        for (let c = 0; c < 3; c++) {
          const center = original[idx + c];
          const top = original[((y - 1) * w + x) * 4 + c];
          const bottom = original[((y + 1) * w + x) * 4 + c];
          const left = original[(y * w + (x - 1)) * 4 + c];
          const right = original[(y * w + (x + 1)) * 4 + c];

          // Edge values difference
          const laplacian = 5 * center - (top + bottom + left + right);
          const sharpVal = center + amount * (laplacian - center);
          data[idx + c] = Math.min(255, Math.max(0, sharpVal));
        }
      }
    }
  }

  return imageData;
}

/**
 * Core chroma-key / flood-fill background replacement algorithm.
 * Replaces a specified background color (with tolerance) with a target passport background color
 */
export function replaceBackdropColor(
  imageData: ImageData,
  sourceR: number,
  sourceG: number,
  sourceB: number,
  targetColorHex: string,
  tolerance: number // 0 to 100
): ImageData {
  // Convert target hex to RGB
  const hex = targetColorHex.replace('#', '');
  const targetR = parseInt(hex.substring(0, 2), 16) || 255;
  const targetG = parseInt(hex.substring(2, 4), 16) || 255;
  const targetB = parseInt(hex.substring(4, 6), 16) || 255;

  const data = imageData.data;
  const len = data.length;
  const rThreshold = (tolerance / 100) * 255;

  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Euclidean distance in color space
    const distance = Math.sqrt(
      Math.pow(r - sourceR, 2) + Math.pow(g - sourceG, 2) + Math.pow(b - sourceB, 2)
    );

    // If within similarity tolerance limit, blend or replace background
    if (distance <= rThreshold) {
      // Direct replacement
      data[i] = targetR;
      data[i + 1] = targetG;
      data[i + 2] = targetB;
      data[i + 3] = 255; // Ensure solid background opacity
    } else if (distance <= rThreshold + 15) {
      // Simple anti-aliasing feathering near boundaries
      const factor = (distance - rThreshold) / 15;
      data[i] = Math.round(targetR * (1 - factor) + r * factor);
      data[i + 1] = Math.round(targetG * (1 - factor) + g * factor);
      data[i + 2] = Math.round(targetB * (1 - factor) + b * factor);
    }
  }

  return imageData;
}

/**
 * Creates the high-resolution output passport photo using a canvas
 */
export function renderPassportPhoto(
  image: HTMLImageElement,
  params: {
    widthPx: number;
    heightPx: number;
    scale: number;
    translateX: number;
    translateY: number;
    rotation: number; // in degrees
    flipH: boolean;
    flipV: boolean;
    enhancements: PhotoEnhancements;
    frame: PhotoFrameSettings;
    backgroundColor: string; // hex
    replaceBgOn: boolean;
    bgSampleColor: { r: number; g: number; b: number } | null;
    bgTolerance: number;
  }
): string {
  // Create solid temporary processing canvas at high DPI size
  const canvas = document.createElement('canvas');
  canvas.width = params.widthPx;
  canvas.height = params.heightPx;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Draw Background
  ctx.fillStyle = params.backgroundColor;
  ctx.fillRect(0, 0, params.widthPx, params.heightPx);

  // Create temporary secondary canvas to isolate the transformed & filtered photo
  const photoCanvas = document.createElement('canvas');
  photoCanvas.width = params.widthPx;
  photoCanvas.height = params.heightPx;
  const pCtx = photoCanvas.getContext('2d');
  if (!pCtx) return '';

  // 2. Set Up Filters on temporary context
  // Exposure is mapped to brightness/contrast values, brightness is scaled
  const bFactor = 100 + params.enhancements.brightness + (params.enhancements.exposure * 0.5);
  const cFactor = 100 + params.enhancements.contrast;
  const sFactor = 100 + params.enhancements.saturation;
  pCtx.filter = `brightness(${bFactor}%) contrast(${cFactor}%) saturate(${sFactor}%)`;

  // Draw transformed image
  pCtx.save();
  // Move to the center of the viewport
  pCtx.translate(params.widthPx / 2 + params.translateX, params.heightPx / 2 + params.translateY);
  pCtx.rotate((params.rotation * Math.PI) / 180);
  pCtx.scale(params.scale * (params.flipH ? -1 : 1), params.scale * (params.flipV ? -1 : 1));

  // Draw natural dimensions centered
  const aspect = image.width / image.height;
  let drawW = params.widthPx;
  let drawH = params.widthPx / aspect;

  if (drawH < params.heightPx) {
    drawH = params.heightPx;
    drawW = params.heightPx * aspect;
  }

  pCtx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);
  pCtx.restore();

  // 3. Image data replacement (Backdrop Erasing, Warmth/Temperature & Sharpness matrix checks)
  let imgData = pCtx.getImageData(0, 0, params.widthPx, params.heightPx);

  // Apply temperature and sharpness
  imgData = applyImageDataEnhancements(imgData, params.enhancements.temperature, params.enhancements.sharpness);

  // Apply background keying if turned on and a sample color is present
  if (params.replaceBgOn && params.bgSampleColor) {
    imgData = replaceBackdropColor(
      imgData,
      params.bgSampleColor.r,
      params.bgSampleColor.g,
      params.bgSampleColor.b,
      params.backgroundColor,
      params.bgTolerance
    );
  }

  // Draw processed pixels back to the primary canvas.
  // Note: if replaceBgOn is not active, we draw on top of background.
  if (params.replaceBgOn) {
    ctx.putImageData(imgData, 0, 0);
  } else {
    // Just draw photoCanvas directly to support alpha blending/non-replaced overlays natively
    ctx.drawImage(photoCanvas, 0, 0);
  }

  // 4. Overlap solid frame borders, rounded corners, or shadows on final context
  if (params.frame.borderOn && params.frame.borderThickness > 0) {
    ctx.strokeStyle = params.frame.borderColor;
    ctx.lineWidth = params.frame.borderThickness;
    // Draw boundary border inset by half thickness
    const inset = params.frame.borderThickness / 2;
    ctx.strokeRect(inset, inset, params.widthPx - params.frame.borderThickness, params.heightPx - params.frame.borderThickness);
  }

  return canvas.toDataURL('image/jpeg', 0.95);
}

/**
 * Draws the technical grid alignment passport guidelines on a top canvas layer
 */
export function drawGuidelines(
  canvas: HTMLCanvasElement,
  guidelinesOn: boolean,
  faceOutlineOn: boolean,
  safeAreaOn: boolean
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Clear visual overlays
  ctx.clearRect(0, 0, w, h);

  if (!guidelinesOn && !faceOutlineOn && !safeAreaOn) return;

  ctx.save();

  // Guidelines style
  ctx.lineWidth = 1.5;

  // 1. Draw Safe Area Lines (Yellow / Gold Dash Pattern)
  if (safeAreaOn) {
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.85)'; // Amber-500
    ctx.setLineDash([4, 4]);
    // 5% inner safety margins
    const marginX = w * 0.05;
    const marginY = h * 0.05;
    ctx.strokeRect(marginX, marginY, w - marginX * 2, h - marginY * 2);
  }

  // 2. Head & Eye Centering Outline (Professional Studio Guide Overlay - Green)
  if (faceOutlineOn) {
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.9)'; // Green-500
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    // Draw central vertical axis alignment
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
    ctx.stroke();

    // Draw Face Oval (70-80% height of typical photo layout)
    const centerX = w / 2;
    const centerY = h * 0.45; // slightly elevated face center
    const radiusX = w * 0.28;
    const radiusY = h * 0.32;

    ctx.strokeStyle = 'rgba(34, 197, 94, 0.9)';
    ctx.beginPath();
    // draw oval
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw eye-line guide (Horizontal across oval center)
    const eyeY = centerY - radiusY * 0.15;
    ctx.beginPath();
    ctx.moveTo(centerX - radiusX * 1.1, eyeY);
    ctx.lineTo(centerX + radiusX * 1.1, eyeY);
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.7)';
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = 'rgba(34, 197, 94, 1)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ALIGN EYES HERE', centerX, eyeY - 6);
    ctx.fillText('CHIN LINE', centerX, centerY + radiusY * 0.85 + 12);

    // Chin alignment line
    ctx.beginPath();
    ctx.moveTo(centerX - radiusX * 0.6, centerY + radiusY * 0.85);
    ctx.lineTo(centerX + radiusX * 0.6, centerY + radiusY * 0.85);
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.75)';
    ctx.stroke();
  }

  // 3. Rule of Thirds Technical Grid Lines (Thin Blue Lines)
  if (guidelinesOn) {
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)'; // Blue-500
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(w / 3, 0);
    ctx.lineTo(w / 3, h);
    ctx.moveTo((2 * w) / 3, 0);
    ctx.lineTo((2 * w) / 3, h);

    // Horizontal lines
    ctx.moveTo(0, h / 3);
    ctx.lineTo(w, h / 3);
    ctx.moveTo(0, (2 * h) / 3);
    ctx.lineTo(w, (2 * h) / 3);
    ctx.stroke();
  }

  ctx.restore();
}
