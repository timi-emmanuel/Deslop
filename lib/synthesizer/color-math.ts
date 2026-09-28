/**
 * Color Science & Mathematics Utilities
 *
 * Implements standard sRGB -> CIEXYZ -> CIELAB transformations,
 * the Sharma-Wu-Dhamraj CIEDE2000 (ΔE00) perceptual color difference algorithm,
 * and WCAG 2.1 relative luminance and contrast calculations.
 */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface LabColor {
  L: number;
  a: number;
  b: number;
}

/**
 * Normalizes any 3- or 6-digit hex string into uppercase #RRGGBB.
 */
export function normalizeHex(hex: string): string {
  const sanitized = hex.trim().replace(/^#/, "");
  if (sanitized.length === 3) {
    const full = sanitized
      .split("")
      .map((c) => c + c)
      .join("");
    return `#${full.toUpperCase()}`;
  }
  return `#${sanitized.slice(0, 6).toUpperCase()}`;
}

/**
 * Converts a hex code to 8-bit sRGB channels.
 */
export function hexToRgb(hex: string): RgbColor {
  const normalized = normalizeHex(hex).replace("#", "");
  const num = parseInt(normalized, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Converts 8-bit sRGB channels to uppercase hex string.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.min(255, Math.max(0, Math.round(n)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Converts sRGB [0..255] to Linear sRGB [0..1] via gamma expansion.
 */
function sRgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * Converts sRGB to CIE XYZ (D65 standard illuminant, 2° observer).
 */
export function rgbToXyz(rgb: RgbColor): { x: number; y: number; z: number } {
  const lr = sRgbToLinear(rgb.r);
  const lg = sRgbToLinear(rgb.g);
  const lb = sRgbToLinear(rgb.b);

  // sRGB D65 matrix
  const x = (0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb) * 100;
  const y = (0.2126729 * lr + 0.7151522 * lg + 0.072175 * lb) * 100;
  const z = (0.0193339 * lr + 0.119192 * lg + 0.9503041 * lb) * 100;

  return { x, y, z };
}

/**
 * Converts CIE XYZ to CIELAB (L*, a*, b*) using D65 reference white.
 */
export function xyzToLab(xyz: { x: number; y: number; z: number }): LabColor {
  // D65 reference white points
  const Xn = 95.047;
  const Yn = 100.0;
  const Zn = 108.883;

  const xr = xyz.x / Xn;
  const yr = xyz.y / Yn;
  const zr = xyz.z / Zn;

  const epsilon = 0.008856; // (6/29)^3
  const kappa = 903.3; // (29/3)^3

  const fx = xr > epsilon ? Math.cbrt(xr) : (kappa * xr + 16) / 116;
  const fy = yr > epsilon ? Math.cbrt(yr) : (kappa * yr + 16) / 116;
  const fz = zr > epsilon ? Math.cbrt(zr) : (kappa * zr + 16) / 116;

  const L = Math.max(0, 116 * fy - 16);
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return { L, a, b };
}

/**
 * Converts a hex color string directly to CIELAB.
 */
export function hexToLab(hex: string): LabColor {
  const rgb = hexToRgb(hex);
  const xyz = rgbToXyz(rgb);
  return xyzToLab(xyz);
}

/**
 * Computes the CIEDE2000 (ΔE00) color difference between two Lab colors.
 * Implementation based on the standard Sharma-Wu-Dhamraj algorithm (2005).
 */
export function deltaE2000(lab1: LabColor, lab2: LabColor): number {
  const deg2rad = Math.PI / 180;
  const rad2deg = 180 / Math.PI;

  const { L: L1, a: a1, b: b1 } = lab1;
  const { L: L2, a: a2, b: b2 } = lab2;

  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const avgC = (C1 + C2) / 2;

  const avgC7 = Math.pow(avgC, 7);
  const G = 0.5 * (1 - Math.sqrt(avgC7 / (avgC7 + Math.pow(25, 7))));

  const a1Prime = (1 + G) * a1;
  const a2Prime = (1 + G) * a2;

  const C1Prime = Math.sqrt(a1Prime * a1Prime + b1 * b1);
  const C2Prime = Math.sqrt(a2Prime * a2Prime + b2 * b2);

  const getHPrime = (b: number, aPrime: number): number => {
    if (b === 0 && aPrime === 0) return 0;
    const deg = Math.atan2(b, aPrime) * rad2deg;
    return deg >= 0 ? deg : deg + 360;
  };

  const h1Prime = getHPrime(b1, a1Prime);
  const h2Prime = getHPrime(b2, a2Prime);

  const deltaLPrime = L2 - L1;
  const deltaCPrime = C2Prime - C1Prime;

  let deltahPrime = 0;
  if (C1Prime * C2Prime !== 0) {
    const diff = h2Prime - h1Prime;
    if (Math.abs(diff) <= 180) {
      deltahPrime = diff;
    } else if (diff > 180) {
      deltahPrime = diff - 360;
    } else {
      deltahPrime = diff + 360;
    }
  }

  const deltaHPrime =
    2 * Math.sqrt(C1Prime * C2Prime) * Math.sin((deltahPrime / 2) * deg2rad);

  const avgLPrime = (L1 + L2) / 2;
  const avgCPrime = (C1Prime + C2Prime) / 2;

  let avghPrime = 0;
  if (C1Prime * C2Prime === 0) {
    avghPrime = h1Prime + h2Prime;
  } else {
    const diff = Math.abs(h1Prime - h2Prime);
    if (diff <= 180) {
      avghPrime = (h1Prime + h2Prime) / 2;
    } else if (h1Prime + h2Prime < 360) {
      avghPrime = (h1Prime + h2Prime + 360) / 2;
    } else {
      avghPrime = (h1Prime + h2Prime - 360) / 2;
    }
  }

  const T =
    1 -
    0.17 * Math.cos((avghPrime - 30) * deg2rad) +
    0.24 * Math.cos(2 * avghPrime * deg2rad) +
    0.32 * Math.cos((3 * avghPrime + 6) * deg2rad) -
    0.2 * Math.cos((4 * avghPrime - 63) * deg2rad);

  const deltaTheta =
    30 * Math.exp(-Math.pow((avghPrime - 275) / 25, 2));

  const avgCPrime7 = Math.pow(avgCPrime, 7);
  const RC = 2 * Math.sqrt(avgCPrime7 / (avgCPrime7 + Math.pow(25, 7)));

  const SL =
    1 +
    (0.015 * Math.pow(avgLPrime - 50, 2)) /
      Math.sqrt(20 + Math.pow(avgLPrime - 50, 2));
  const SC = 1 + 0.045 * avgCPrime;
  const SH = 1 + 0.015 * avgCPrime * T;
  const RT = -Math.sin(2 * deltaTheta * deg2rad) * RC;

  const kL = 1;
  const kC = 1;
  const kH = 1;

  const termL = deltaLPrime / (kL * SL);
  const termC = deltaCPrime / (kC * SC);
  const termH = deltaHPrime / (kH * SH);

  const deltaEsq =
    termL * termL +
    termC * termC +
    termH * termH +
    RT * termC * termH;

  return Math.sqrt(Math.max(0, deltaEsq));
}

/**
 * Computes CIEDE2000 color difference directly between two hex colors.
 */
export function calculateDeltaE(hexA: string, hexB: string): number {
  if (normalizeHex(hexA) === normalizeHex(hexB)) return 0;
  const labA = hexToLab(hexA);
  const labB = hexToLab(hexB);
  return Number(deltaE2000(labA, labB).toFixed(2));
}

/**
 * Computes standard WCAG 2.1 relative luminance for an sRGB color.
 */
export function getRelativeLuminance(rgb: RgbColor): number {
  const lr = sRgbToLinear(rgb.r);
  const lg = sRgbToLinear(rgb.g);
  const lb = sRgbToLinear(rgb.b);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

/**
 * Computes WCAG 2.1 contrast ratio between two hex strings (1.0 to 21.0).
 */
export function calculateContrastRatio(hexA: string, hexB: string): number {
  const lumA = getRelativeLuminance(hexToRgb(hexA));
  const lumB = getRelativeLuminance(hexToRgb(hexB));
  const brighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return Number(((brighter + 0.05) / (darker + 0.05)).toFixed(2));
}

/**
 * Returns WCAG compliance tier based on contrast ratio.
 */
export function getWcagLevel(ratio: number): "AAA" | "AA" | "FAIL" {
  if (ratio >= 7.0) return "AAA";
  if (ratio >= 4.5) return "AA";
  return "FAIL";
}
