import { Unit } from '../types';

export const MM_PER_INCH = 25.4;
export const CM_PER_INCH = 2.54;
export const DEFAULT_DPI = 300; // Standard photo printing DPI

/**
 * Converts a dimension from one unit to another, given a DPI representation
 */
export function convertDimension(
  value: number,
  from: Unit,
  to: Unit,
  dpi: number = DEFAULT_DPI
): number {
  if (from === to) return value;

  // First convert from 'from' to inches
  let inches = 0;
  switch (from) {
    case 'inch':
      inches = value;
      break;
    case 'mm':
      inches = value / MM_PER_INCH;
      break;
    case 'cm':
      inches = value / CM_PER_INCH;
      break;
    case 'px':
      inches = value / dpi;
      break;
  }

  // Then convert from inches to 'to'
  switch (to) {
    case 'inch':
      return Math.round(inches * 1000) / 1000;
    case 'mm':
      return Math.round(inches * MM_PER_INCH * 10) / 10;
    case 'cm':
      return Math.round(inches * CM_PER_INCH * 100) / 100;
    case 'px':
      return Math.round(inches * dpi);
  }
}

/**
 * Clean UI string representation of dimensions
 */
export function formatDimensions(width: number, height: number, unit: Unit): string {
  if (unit === 'px') {
    return `${width} x ${height} px`;
  }
  return `${width}${unit} x ${height}${unit}`;
}
