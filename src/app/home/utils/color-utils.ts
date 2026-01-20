// Utility: detect if a color is too dark and return appropriate text color
export function getContrastTextColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance using relative luminance formula (WCAG)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // If luminance < 0.5, background is dark, use white text
  return luminance < 0.5 ? '#ffffff' : '#000000';
}

export function getAccentBorderColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return hexColor;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  const adjust = luminance < 0.5 ? 40 : -40;
  const clamp = (v: number) => Math.min(255, Math.max(0, v));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r + adjust)}${toHex(g + adjust)}${toHex(b + adjust)}`;
}
