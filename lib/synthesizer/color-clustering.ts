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
  sources?: {
    isBackground?: number;
    isText?: number;
    isBorder?: number;
    isButton?: number;
  };
}

/**
 * Derives a prescriptive, semantic accent role and name based on usage and HSL.
 */
function getSemanticAccentRole(
  hex: string,
  rgb: RgbColor,
  isFirstAccent: boolean,
  hasDanger: boolean,
  hasSuccess: boolean
): { role: SemanticColorRole; baseName: string } {
  if (isFirstAccent) {
    return { role: "accent-primary", baseName: "accent-primary" };
  }

  const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Red / Destructive
  if (!hasDanger && (h < 25 || h >= 345) && s > 40) {
    return { role: "accent-danger", baseName: "accent-danger" };
  }

  // Green / Confirmation
  if (!hasSuccess && h >= 80 && h < 165 && s > 35) {
    return { role: "accent-success", baseName: "accent-success" };
  }

  // Neutral / Subtle
  if (s < 20) {
    return { role: "accent-secondary", baseName: "accent-secondary" };
  }

  // Secondary interactive or decorative
  if (h >= 205 && h < 255) return { role: "accent", baseName: "accent-blue" };
  if (h >= 165 && h < 205) return { role: "accent", baseName: "accent-cyan" };
  if (h >= 35 && h < 80) return { role: "accent", baseName: "accent-amber" };
  if (h >= 255 && h < 320) return { role: "accent", baseName: "accent-purple" };

  return { role: "accent-secondary", baseName: "accent-secondary" };
}

/**
 * Clusters an arbitrary list of scanned hex codes into a normalized,
 * deduplicated semantic palette with role-aware WCAG accessibility audits.
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

  // Identify canvas (light or dark neutral surface with highest weighted score)
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

  // Reorder clusters:
  // 1. Canvas is first
  // 2. High-contrast text candidate is second
  // 3. Brand accents & surfaces follow
  const remainingClusters = clusters.filter((c) => c.hex !== primaryBackground);
  const orderedClusters = [primaryBackgroundCluster, ...remainingClusters];

  // First pass to discover primary text hex for contextual surface auditing
  let primaryTextCandidate = "#0A0D14";
  for (const c of orderedClusters) {
    const contrast = calculateContrastRatio(c.hex, primaryBackground);
    const hsl = rgbToHsl(c.rgb.r, c.rgb.g, c.rgb.b);
    if (contrast >= 7.0 && hsl.s < 40) {
      primaryTextCandidate = c.hex;
      break;
    }
  }

  const tokens: ColorToken[] = [];
  const usedNames = new Set<string>();
  let hasPrimaryAccent = false;
  let hasPrimaryText = false;
  let hasMutedText = false;
  let hasSurface = false;
  let hasDanger = false;
  let hasSuccess = false;

  orderedClusters.slice(0, 8).forEach((cluster, idx) => {
    let role: SemanticColorRole = "accent";
    let baseName = `color-token-${idx + 1}`;
    let usageContext = "Interactive UI Accent";

    const contrastCanvas = calculateContrastRatio(cluster.hex, primaryBackground);
    const lum = getRelativeLuminance(cluster.rgb);
    const hsl = rgbToHsl(cluster.rgb.r, cluster.rgb.g, cluster.rgb.b);

    let contrastRatio = contrastCanvas;
    let contrastTarget = "vs canvas";
    let wcagRating: "AAA" | "AA" | "PASS" | "FAIL" | "BASE" = "PASS";

    if (idx === 0) {
      role = "canvas";
      baseName = "bg-canvas";
      usageContext = "Base Page Canvas";
      contrastRatio = 1.0;
      contrastTarget = "base canvas layer";
      wcagRating = "BASE"; // Never falsely fail canvas against itself
    } else if (!hasPrimaryText && contrastCanvas >= 7.0 && hsl.s < 40) {
      role = "text-primary";
      baseName = "text-primary";
      usageContext = "Primary Reading & Heading Text";
      contrastRatio = contrastCanvas;
      contrastTarget = "vs bg-canvas";
      wcagRating = "AAA";
      hasPrimaryText = true;
    } else if (!hasMutedText && contrastCanvas >= 3.5 && contrastCanvas < 7.0 && hsl.s < 45) {
      role = "text-muted";
      baseName = "text-muted";
      usageContext = "Secondary Text & Captions";
      contrastRatio = contrastCanvas;
      contrastTarget = "vs bg-canvas";
      wcagRating = contrastCanvas >= 4.5 ? "AA" : "PASS";
      hasMutedText = true;
    } else if (Math.abs(lum - bgLuminance) < 0.20 && (hsl.s < 40 || lum > 0.88)) {
      if (!hasSurface) {
        role = "surface";
        baseName = "bg-surface";
        usageContext = "Card & Modal Container Fill";
        hasSurface = true;
      } else {
        role = "surface-elevated";
        baseName = "bg-surface-elevated";
        usageContext = "Elevated Popovers & Dropdowns";
      }
      // Context-aware audit: evaluate surface against primary text, not canvas
      const textContrast = calculateContrastRatio(primaryTextCandidate, cluster.hex);
      contrastRatio = textContrast;
      contrastTarget = "vs text-primary";
      wcagRating = textContrast >= 7.0 ? "AAA" : textContrast >= 4.5 ? "AA" : "PASS";
    } else {
      // Accent / Interactive fill role
      const accentInfo = getSemanticAccentRole(
        cluster.hex,
        cluster.rgb,
        !hasPrimaryAccent,
        hasDanger,
        hasSuccess
      );
      role = accentInfo.role;
      baseName = accentInfo.baseName;

      if (role === "accent-primary") {
        hasPrimaryAccent = true;
        usageContext = "Primary CTA Action Button";
      } else if (role === "accent-danger") {
        hasDanger = true;
        usageContext = "Destructive Actions & Alerts";
      } else if (role === "accent-success") {
        hasSuccess = true;
        usageContext = "Confirmation & Verification Badges";
      } else {
        usageContext = "Secondary Action / Focus Ring";
      }

      // Context-aware audit: test button fill against white text vs dark text
      const contrastWhite = calculateContrastRatio(cluster.hex, "#FFFFFF");
      const contrastDark = calculateContrastRatio(cluster.hex, "#0A0D14");

      if (contrastWhite >= contrastDark) {
        contrastRatio = contrastWhite;
        contrastTarget = "vs #FFFFFF text";
        wcagRating = contrastWhite >= 4.5 ? "AA" : contrastWhite >= 3.0 ? "PASS" : "FAIL";
      } else {
        contrastRatio = contrastDark;
        contrastTarget = "vs #0A0D14 text";
        wcagRating = contrastDark >= 4.5 ? "AA" : contrastDark >= 3.0 ? "PASS" : "FAIL";
      }
    }

    // Ensure token name uniqueness
    let uniqueName = baseName;
    let collisionCounter = 2;
    while (usedNames.has(uniqueName)) {
      uniqueName = `${baseName}-${collisionCounter}`;
      collisionCounter++;
    }
    usedNames.add(uniqueName);

    tokens.push({
      id: `token-${idx}-${cluster.hex.replace("#", "")}`,
      name: uniqueName,
      hex: cluster.hex,
      role,
      contrastAgainstCanvas: contrastCanvas,
      contrastRatio,
      contrastTarget,
      wcagRating,
      frequencyPercentage: Number(((cluster.count / totalCount) * 100).toFixed(1)),
      usageContext,
    });
  });

  return tokens;
}
