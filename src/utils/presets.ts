import { PhotoSizePreset, BackgroundPreset } from '../types';

export const PHOTO_SIZE_PRESETS: PhotoSizePreset[] = [
  {
    id: 'us',
    name: 'US Passport / Visa',
    width: 50.8,
    height: 50.8,
    unit: 'mm',
    description: '2 x 2 inches. Required for US Passports, Visas, and dynamic IDs.',
  },
  {
    id: 'india',
    name: 'India Passport',
    width: 35,
    height: 45,
    unit: 'mm',
    description: '35 x 45 mm. Standard for Indian Passports, OCI Cards, and Visas.',
  },
  {
    id: 'uk',
    name: 'UK Passport',
    width: 35,
    height: 45,
    unit: 'mm',
    description: '35 x 45 mm. Official United Kingdom HM Passport size specification.',
  },
  {
    id: 'schengen',
    name: 'Schengen Visa / Europe',
    width: 35,
    height: 45,
    unit: 'mm',
    description: '35 x 45 mm. Required for European Union and Schengen Visa requests.',
  },
  {
    id: 'canada',
    name: 'Canada Passport',
    width: 50,
    height: 70,
    unit: 'mm',
    description: '50 x 70 mm. Official Canadian passport dimensions with spacious margins.',
  },
  {
    id: 'china',
    name: 'China Passport',
    width: 33,
    height: 48,
    unit: 'mm',
    description: '33 x 48 mm. Official Chinese passport sizing specification.',
  },
  {
    id: 'australia',
    name: 'Australian Passport',
    width: 35,
    height: 45,
    unit: 'mm',
    description: '35 x 45 mm. Australian Passport Office standard resolution target.',
  },
  {
    id: 'id-standard',
    name: 'Standard ID Card',
    width: 35,
    height: 45,
    unit: 'mm',
    description: '35 x 45 mm. Universal standard badge size for generic employee ID prints.',
  }
];

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'white',
    name: 'White',
    value: '#FFFFFF',
    description: 'Standard white requirement for US, Schengen, UK, and CN sizing.',
  },
  {
    id: 'light-blue',
    name: 'Light Blue',
    value: '#DCEBFC',
    description: 'Soft corporate light blue, often requested for office badges.',
  },
  {
    id: 'sky-blue',
    name: 'Sky Blue',
    value: '#A0C4F4',
    description: 'Bright sky blue backdrop, standard for India and other specifications.',
  },
  {
    id: 'grey',
    name: 'Dark Grey',
    value: '#6B7280',
    description: 'Matte dark slate grey for creative studio headshots.',
  },
  {
    id: 'light-grey',
    name: 'Light Grey',
    value: '#E5E7EB',
    description: 'Soft off-white light grey. Matches modern European requirements.',
  },
  {
    id: 'cream',
    name: 'Warm Cream',
    value: '#FDF6E2',
    description: 'Gentle warm cream glow, perfect for vintage or soft portraitures.',
  },
  {
    id: 'light-pink',
    name: 'Light Pink',
    value: '#FCE7F3',
    description: 'Soft pastel pink background, ideal for child identification cards.',
  }
];

export const SHEET_TEMPLATES = [
  { cols: 2, rows: 4, label: 'Standard Studio (8 Photos)' },
  { cols: 3, rows: 5, label: 'High Density (15 Photos)' },
  { cols: 4, rows: 6, label: 'Max Sheet Density (24 Photos)' },
  { cols: 1, rows: 4, label: 'Single Column (4 Photos)' },
];
