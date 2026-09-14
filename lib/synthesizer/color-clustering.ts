import { ColorToken, SemanticColorRole } from "@/types/tokens";

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RgbColor {
  const sanitized = hex.replace("#", "");
  const fullHex =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((c) => c + c)
          .join("")
      : sanitized;

  const num = parseInt(fullHex, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.min(255, Math.max(0, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Calculates standard relative luminance per WCAG 2.1 specs.
 */
export function getRelativeLuminance(rgb: RgbColor): number {
  const toLinear = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b);
}

/**
 * Computes WCAG 2.1 contrast ratio between two hex colors (returns 1 to 21).
 */
export function calculateContrastRatio(hexA: string, hexB: string): number {
  const lumA = getRelativeLuminance(hexToRgb(hexA));
  const lumB = getRelativeLuminance(hexToRgb(hexB));
  const brightest = Math.max(lumA, lumB);
  const darkest = Math.min(lumA, lumB);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

/**
 * Computes color distance in RGB space.
 */
function colorDistance(a: RgbColor, b: RgbColor): number {
  return Math.sqrt(
    Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2)
  );
}

export interface RawColorOccurence {
  hex: string;
  count: number;
}

/**
 * Clusters an arbitrary list of scanned hex codes into a normalized,
 * deduplicated semantic palette.
 */
export function synthesizeColorPalette(rawOccurences: RawColorOccurence[]): ColorToken[] {
  if (!rawOccurences || rawOccurences.length === 0) {
    return [];
  }

  // Sort by frequency
  const sorted = [...rawOccurences].sort((a, b) => b.count - a.count);
  const totalCount = sorted.reduce((sum, item) => sum + item.count, 0) || 1;

  // Cluster nearby colors (distance threshold < 32 in RGB space)
  const CLUSTER_THRESHOLD = 32;
  const clusters: { hex: string; count: number; rgb: RgbColor }[] = [];

  for (const item of sorted) {
    const rgb = hexToRgb(item.hex);
    const existing = clusters.find((c) => colorDistance(c.rgb, rgb) < CLUSTER_THRESHOLD);

    if (existing) {
      existing.count += item.count;
    } else {
      clusters.push({ hex: item.hex.toUpperCase(), count: item.count, rgb });
    }
  }

  // Sort clusters by frequency
  clusters.sort((a, b) => b.count - a.count);

  // Identify canvas (typically the most frequent surface background color)
  const primaryBackground = clusters[0]?.hex || "#FFFFFF";
  const bgLuminance = getRelativeLuminance(hexToRgb(primaryBackground));
  const isDarkCanvas = bgLuminance < 0.2;

  // Build semantic roles
  const tokens: ColorToken[] = [];

  clusters.slice(0, 8).forEach((cluster, idx) => {
    let role: SemanticColorRole = "surface";
    let name = `color-token-${idx + 1}`;

    const contrast = calculateContrastRatio(cluster.hex, primaryBackground);
    const lum = getRelativeLuminance(cluster.rgb);

    if (idx === 0) {
      role = "canvas";
      name = "bg-canvas";
    } else if (contrast > 4.5 && (isDarkCanvas ? lum > 0.6 : lum < 0.3)) {
      role = "text-primary";
      name = "text-primary";
    } else if (contrast > 2.5 && contrast <= 4.5) {
      role = "text-muted";
      name = "text-muted";
    } else if (Math.abs(lum - bgLuminance) < 0.15 && idx < 3) {
      role = "surface";
      name = "bg-surface";
    } else {
      role = "accent";
      name = "brand-accent";
    }

    const wcagRating = contrast >= 7.0 ? "AAA" : contrast >= 4.5 ? "AA" : "FAIL";

    tokens.push({
      id: `token-${idx}-${cluster.hex.replace("#", "")}`,
      name,
      hex: cluster.hex,
      role,
      contrastAgainstCanvas: contrast,
      wcagRating,
      frequencyPercentage: Number(((cluster.count / totalCount) * 100).toFixed(1)),
    });
  });

  return tokens;
}
