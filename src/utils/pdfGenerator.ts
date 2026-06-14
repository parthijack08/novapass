import { jsPDF } from 'jspdf';
import { PhotoSizePreset } from '../types';

interface PDFSheetOptions {
  photosBase64: string; // The rendered single photo in JPEG/PNG format
  sizePreset: PhotoSizePreset;
  copiesCount: number;
  columnsOnSheet: number;
  rowsOnSheet: number;
  marginMm: number;
  watermarkText?: string;
  watermarkOn?: boolean;
  sheetNumberingOn?: boolean;
}

/**
 * Compiles a professional high-resolution PDF document representing A4-size sheet grid prints
 */
export function generateA4SheetPDF(options: PDFSheetOptions): jsPDF {
  const {
    photosBase64,
    sizePreset,
    copiesCount,
    columnsOnSheet,
    rowsOnSheet,
    marginMm,
    watermarkText = 'PASSPORT PRO STUDIO',
    watermarkOn = false,
    sheetNumberingOn = false,
  } = options;

  // Standard A4 sizes in mm
  const a4Width = 210;
  const a4Height = 297;

  // Create a portrait-oriented, mm-unit PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Calculate coordinates
  const photoW = sizePreset.width;
  const photoH = sizePreset.height;

  // Grid layout calculations
  const cols = columnsOnSheet;
  const rows = rowsOnSheet;
  const totalSlots = cols * rows;

  // Dimensions of grid block inside margins
  const printableWidth = a4Width - marginMm * 2;
  const printableHeight = a4Height - marginMm * 2;

  // Standard spacings (mm)
  const cellGapX = cols > 1 ? (printableWidth - cols * photoW) / (cols - 1) : 0;
  const cellGapY = rows > 1 ? (printableHeight - rows * photoH) / (rows - 1) : 0;

  // Let's safe-guard the grid from overflowing. If gaps are extremely negative or wide, recalculate
  const actualGapX = Math.max(2, cellGapX < 0 ? 4 : cellGapX);
  const actualGapY = Math.max(2, cellGapY < 0 ? 4 : cellGapY);

  // Auto center grid on page
  const totalGridW = cols * photoW + (cols - 1) * actualGapX;
  const totalGridH = rows * photoH + (rows - 1) * actualGapY;

  const startX = (a4Width - totalGridW) / 2;
  const startY = (a4Height - totalGridH) / 2;

  // 1. Draw Page Background/Border if desirable
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);

  // Header/Title line
  doc.text('PASSPORT PRO STUDIO - PROFESSIONAL PRINT SHEET', a4Width / 2, startY - 8, { align: 'center' });

  // Draw each photo slot
  let copyIndex = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (copyIndex >= copiesCount) break;

      const posX = startX + c * (photoW + actualGapX);
      const posY = startY + r * (photoH + actualGapY);

      // Draw Cutting Guidelines / Helper crop marks around the slot in gray
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.15);

      // Top-Left crop mark ticks
      doc.line(posX - 2, posY, posX + 1, posY);
      doc.line(posX, posY - 2, posX, posY + 1);

      // Top-Right crop mark ticks
      doc.line(posX + photoW - 1, posY, posX + photoW + 2, posY);
      doc.line(posX + photoW, posY - 2, posX + photoW, posY + 1);

      // Bottom-Left crop mark ticks
      doc.line(posX - 2, posY + photoH, posX + 1, posY + photoH);
      doc.line(posX, posY + photoH - 1, posX, posY + photoH + 2);

      // Bottom-Right crop mark
      doc.line(posX + photoW - 1, posY + photoH, posX + photoW + 2, posY + photoH);
      doc.line(posX + photoW, posY + photoH - 1, posX + photoW, posY + photoH + 2);

      // Insert photo directly
      try {
        doc.addImage(photosBase64, 'JPEG', posX, posY, photoW, photoH);
      } catch (e) {
        console.error('Failed to add image to PDF:', e);
      }

      copyIndex++;
    }
  }

  // Draw Watermark at bottom margin if required
  if (watermarkOn && watermarkText) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(230, 230, 230);
    // Draw running background-stamp watermark rotated
    doc.saveGraphicsState();
    doc.setGState(doc.GState({ opacity: 0.2 }));
    doc.text(watermarkText, a4Width / 2, a4Height / 2, { align: 'center', angle: 45 });
    doc.restoreGraphicsState();
  }

  // Footer labels
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  const dateStr = new Date().toLocaleDateString();
  const specText = `Size: ${sizePreset.name} (${photoW}x${photoH} mm) | Prints: ${copiesCount} copies | Date: ${dateStr}`;
  doc.text(specText, a4Width / 2, a4Height - startY + totalGridH + 8, { align: 'center' });

  if (sheetNumberingOn) {
    doc.text('Sheet 1 of 1', a4Width - marginMm, a4Height - 5, { align: 'right' });
  }

  return doc;
}
