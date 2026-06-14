export type Unit = 'mm' | 'cm' | 'inch' | 'px';

export interface PhotoSizePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: Unit;
  description: string;
}

export interface BackgroundPreset {
  id: string;
  name: string;
  value: string;
  description: string;
}

export interface PhotoEnhancements {
  brightness: number;   // -100 to 100, default 0
  contrast: number;     // -100 to 100, default 0
  saturation: number;   // -100 to 100, default 0
  sharpness: number;    // 0 to 100, default 0
  exposure: number;     // -100 to 100, default 0
  temperature: number;  // -100 to 100, default 0
}

export interface PhotoFrameSettings {
  borderOn: boolean;
  borderColor: string;
  borderThickness: number; // in pixels
  roundedCorners: number;   // raw pixel radius
  shadowEffect: boolean;
}

export interface CropArea {
  x: number; // normalized coordinate 0-1
  y: number; // normalized coordinate 0-1
  width: number; // normalized width 0-1
  height: number; // normalized height 0-1
}

export interface AppSettings {
  defaultSizeId: string;
  defaultBackgroundId: string;
  defaultLayoutCols: number;
  defaultLayoutRows: number;
  defaultFileFormat: 'png' | 'jpeg';
  theme: 'light' | 'dark' | 'system';
  watermarkText: string;
  watermarkOn: boolean;
  printMargins: number; // in mm
  sheetNumberingOn: boolean;
}

export interface RecentPhoto {
  id: string;
  date: string;
  sizeName: string;
  sizeDims: string;
  thumbnail: string; // base64 string
}
