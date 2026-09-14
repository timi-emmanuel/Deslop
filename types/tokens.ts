/**
 * Core Domain Models for the Deslop Design System Extractor.
 *
 * Designed around strict token semantics, accessibility validation (WCAG),
 * and modular geometry to prevent AI code generation hallucinations.
 */

export type SemanticColorRole =
  | "canvas"
  | "surface"
  | "surface-elevated"
  | "accent"
  | "accent-hover"
  | "accent-wash"
  | "text-primary"
  | "text-muted"
  | "keyline"
  | "keyline-strong";

export interface ColorToken {
  id: string;
  name: string;
  hex: string;
  oklch?: string;
  role: SemanticColorRole;
  contrastAgainstCanvas: number;
  wcagRating: "AAA" | "AA" | "FAIL";
  frequencyPercentage: number;
}

export interface FontSizeStep {
  name: string; // e.g., 'display', 'h1', 'h2', 'body', 'caption'
  sizePx: number;
  lineHeightPx: number;
  letterSpacing: string;
  sampleText?: string;
}

export interface TypographySpec {
  displayFamily: string;
  bodyFamily: string;
  monoFamily: string;
  scaleName: string; // e.g. 'Major Second (1.125)', 'Minor Third (1.200)'
  scaleRatio: number;
  steps: FontSizeStep[];
  googleFontImportUrl?: string;
}

export interface GeometrySpec {
  baseGridPx: number; // typically 4 or 8
  spacingRampPx: number[]; // e.g., [4, 8, 12, 16, 24, 32, 48, 64]
  radii: {
    controlPx: number; // buttons, inputs (e.g. 6px)
    cardPx: number; // cards, panels (e.g. 8px or 12px)
    pillPx: number; // tags, badges (e.g. 9999px)
  };
  shadows: {
    subtle: string;
    elevated: string;
    keyline: string;
  };
}

export interface InspectionDiagnostics {
  timingMs: number;
  rawColorsScanned: number;
  tokensNormalized: number;
  rawPaddingsObserved: number;
  slopScore: number; // 0 to 100 (100 = 100% disciplined, 0 = pure AI slop)
  warnings: string[];
}

export interface ExtractedDesignSystem {
  id: string;
  url: string;
  domain: string;
  pageTitle: string;
  extractedAt: string;
  colors: ColorToken[];
  typography: TypographySpec;
  geometry: GeometrySpec;
  designMd: string;
  tailwindCss: string;
  diagnostics: InspectionDiagnostics;
}

export interface UserQuota {
  ipHash: string;
  allowedScans: number;
  usedScans: number;
  remainingScans: number;
  isPro: boolean;
  resetsAt: string;
}
