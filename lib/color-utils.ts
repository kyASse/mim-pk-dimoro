/**
 * lib/color-utils.ts
 *
 * Utility functions for color calculations, including WCAG 2.1 contrast ratio.
 */

export interface HSLColor {
  h: number; // Hue: 0–360
  s: number; // Saturation: 0–100
  l: number; // Lightness: 0–100
}

/**
 * Convert HSL color to linear RGB values (0–1 range each).
 * Uses the standard HSL-to-RGB algorithm.
 */
function hslToLinearRGB(hsl: HSLColor): [number, number, number] {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    // Achromatic
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      let tt = t;
      if (tt < 0) tt += 1;
      if (tt > 1) tt -= 1;
      if (tt < 1 / 6) return p + (q - p) * 6 * tt;
      if (tt < 1 / 2) return q;
      if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r, g, b];
}

/**
 * Convert a sRGB channel value (0–1) to linear light value
 * using the WCAG 2.1 / IEC 61966-2-1 formula.
 */
function sRGBToLinear(channel: number): number {
  if (channel <= 0.04045) {
    return channel / 12.92;
  }
  return Math.pow((channel + 0.055) / 1.055, 2.4);
}

/**
 * Calculate the relative luminance of an HSL color
 * per WCAG 2.1 (https://www.w3.org/TR/WCAG21/#dfn-relative-luminance).
 *
 * L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 * where R, G, B are linearized sRGB values.
 */
export function relativeLuminance(hsl: HSLColor): number {
  const [r, g, b] = hslToLinearRGB(hsl);
  const R = sRGBToLinear(r);
  const G = sRGBToLinear(g);
  const B = sRGBToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculate the WCAG 2.1 contrast ratio between two HSL colors.
 *
 * Contrast ratio = (L1 + 0.05) / (L2 + 0.05)
 * where L1 is the relative luminance of the lighter color
 * and L2 is the relative luminance of the darker color.
 *
 * WCAG AA requires ≥ 4.5:1 for normal text.
 * WCAG AAA requires ≥ 7:1 for normal text.
 */
export function calculateContrastRatio(hsl1: HSLColor, hsl2: HSLColor): number {
  const lum1 = relativeLuminance(hsl1);
  const lum2 = relativeLuminance(hsl2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}
