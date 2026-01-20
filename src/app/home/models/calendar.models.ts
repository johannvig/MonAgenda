export type ColorPalette = { bg: string; border: string; text: string };

export type ColorKey = 'blue' | 'green' | 'yellow' | 'cyan' | 'gray';

export type ColorPaletteSet = Record<ColorKey, ColorPalette>;

export type CourseItem = {
  name: string;
  colorFill: string;
  colorBorder?: string;
  textColor?: string;
  checked: boolean;
  isCustomColor?: boolean;
};
