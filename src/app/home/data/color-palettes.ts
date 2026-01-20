import type { ColorPaletteSet } from '../models/calendar.models';

export const BASE_COLORS: ColorPaletteSet = {
  blue: { bg: '#e0f0fa', border: '#4a90d9', text: '#2c5aa0' },
  green: { bg: '#faded7', border: '#e5746f', text: '#9d3c2a' },
  yellow: { bg: '#fdf3d6', border: '#d4af37', text: '#8b7500' },
  cyan: { bg: '#d6f5f2', border: '#4ab8a8', text: '#2d8076' },
  gray: { bg: '#ebe9f2', border: '#9b97d1', text: '#5d5a7f' }
};

export const DALTONISM_COLORS: ColorPaletteSet = {
  blue: { bg: '#dceef9', border: '#0072b2', text: '#0b3d91' },
  green: { bg: '#e6f7f1', border: '#009e73', text: '#056449' },
  yellow: { bg: '#fff6c2', border: '#f0e442', text: '#7a6a00' },
  cyan: { bg: '#e1f2ff', border: '#56b4e9', text: '#0b5a8f' },
  gray: { bg: '#efeff5', border: '#8e8dbe', text: '#4a4a6a' }
};
