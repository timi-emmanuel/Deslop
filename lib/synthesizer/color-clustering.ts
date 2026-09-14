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

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rf = r / 255;
  const gf = g / 255;
  const bf = b / 255;
  const max = Math.max(rf, gf, bf);
  const min = Math.min(rf, gf, bf);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rf:
        h = (gf - bf) / d + (gf < bf ? 6 : 0);
        break;
      case gf:
        h = (bf - rf) / d + 2;
        break;
      case bf:
        h = (rf - gf) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
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
 * Derives a human-friendly and semantic accent name based on HSL values.
 */
function getSemanticAccentName(hex: string, rgb: RgbColor, isPrimary: boolean): string {
  if (isPrimary) return "brand-accent";
  const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  if (s < 20) return "accent-neutral";
  if (h >= 170 && h < 210) return "accent-cyan";
  if (h >= 210 && h < 255) return "accent-blue";
  if (h >= 80 && h < 170) return "accent-green";
  if (h >= 35 && h < 80) return "accent-amber";
  if (h >= 255 && h < 320) return "accent-purple";
  if (h < 25 || h >= 345) return "accent-red";
  return "accent-secondary";
}

/**
 * Clusters an arbitrary list of scanned hex codes into a normalized,
 * deduplicated semantic palette with ZERO duplicate token names.
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

  if (clusters.length === 0) return [];

  // Intelligently identify canvas:
  // Canvases are almost exclusively neutral surfaces (low saturation)
  // either light (l >= 80) or dark (l <= 20).
  // Saturated badges/tags (e.g. orange, cyan) should NEVER override true canvas.
  let primaryBackgroundCluster = clusters[0];
  let maxCanvasScore = -1;

  for (const c of clusters) {
    const hsl = rgbToHsl(c.rgb.r, c.rgb.g, c.rgb.b);
    let score = c.count;

    if (hsl.s < 25) {
      if (hsl.l >= 85 || hsl.l <= 15) {
        score *= 15; // Heavy bias toward white/near-black neutral backgrounds
      } else {
        score *= 4;
      }
    } else if (hsl.s > 50) {
      score *= 0.05; // Penalize vibrant saturated colors as page background canvas
    }

    if (score > maxCanvasScore) {
      maxCanvasScore = score;
      primaryBackgroundCluster = c;
    }
  }

  const primaryBackground = primaryBackgroundCluster.hex;
  const bgLuminance = getRelativeLuminance(primaryBackgroundCluster.rgb);
  const isDarkCanvas = bgLuminance < 0.25;

  // Reorder clusters so that:
  // 1. Canvas is first
  // 2. High-contrast text candidate is second
  // 3. Brand accents & surfaces follow
  const remainingClusters = clusters.filter((c) => c.hex !== primaryBackground);
  const orderedClusters = [primaryBackgroundCluster, ...remainingClusters];

  const tokens: ColorToken[] = [];
  const usedNames = new Set<string>();
  let hasPrimaryAccent = false;
  let hasPrimaryText = false;
  let hasMutedText = false;
  let hasSurface = false;

  orderedClusters.slice(0, 8).forEach((cluster, idx) => {
    let role: SemanticColorRole = "accent";
    let baseName = `color-token-${idx + 1}`;

    const contrast = calculateContrastRatio(cluster.hex, primaryBackground);
    const lum = getRelativeLuminance(cluster.rgb);
    const hsl = rgbToHsl(cluster.rgb.r, cluster.rgb.g, cluster.rgb.b);

    if (idx === 0) {
      role = "canvas";
      baseName = "bg-canvas";
    } else if (!hasPrimaryText && contrast >= 7.0 && hsl.s < 40) {
      role = "text-primary";
      baseName = "text-primary";
      hasPrimaryText = true;
    } else if (!hasMutedText && contrast >= 3.5 && contrast < 7.0 && hsl.s < 45) {
      role = "text-muted";
      baseName = "text-muted";
      hasMutedText = true;
    } else if (Math.abs(lum - bgLuminance) < 0.20 && (hsl.s < 40 || lum > 0.88)) {
      if (!hasSurface) {
        role = "surface";
        baseName = "bg-surface";
        hasSurface = true;
      } else {
        role = "surface-elevated";
        baseName = "bg-surface-elevated";
      }
    } else {
      role = "accent";
      const isPrimary = !hasPrimaryAccent && contrast >= 2.5;
      baseName = getSemanticAccentName(cluster.hex, cluster.rgb, isPrimary);
      if (isPrimary) {
        hasPrimaryAccent = true;
      }
    }

    // Ensure every token name is 100% unique (no collisions in generated CSS/Markdown)
    let uniqueName = baseName;
    let collisionCounter = 2;
    while (usedNames.has(uniqueName)) {
      uniqueName = `${baseName}-${collisionCounter}`;
      collisionCounter++;
    }
    usedNames.add(uniqueName);

    const wcagRating = contrast >= 7.0 ? "AAA" : contrast >= 4.5 ? "AA" : "FAIL";

    tokens.push({
      id: `token-${idx}-${cluster.hex.replace("#", "")}`,
      name: uniqueName,
      hex: cluster.hex,
      role,
      contrastAgainstCanvas: contrast,
      wcagRating,
      frequencyPercentage: Number(((cluster.count / totalCount) * 100).toFixed(1)),
    });
  });

  return tokens;
}
