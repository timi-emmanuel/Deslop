import { GeometrySpec } from "@/types/tokens";

const STANDARD_8PT_STEPS = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];

/**
 * Snaps any arbitrary pixel value to the nearest 4px or 8px modular step.
 */
export function snapToModularGrid(px: number): number {
  if (px <= 0) return 0;
  let closest = STANDARD_8PT_STEPS[0];
  let minDiff = Math.abs(px - closest);

  for (const step of STANDARD_8PT_STEPS) {
    const diff = Math.abs(px - step);
    if (diff < minDiff) {
      minDiff = diff;
      closest = step;
    }
  }
  return closest;
}

/**
 * Synthesizes an authoritative GeometrySpec from observed DOM element metrics.
 */
export function synthesizeGeometry(
  observedPaddings: number[],
  observedRadii: number[],
  observedShadows: string[]
): GeometrySpec {
  // Quantize unique observed paddings
  const uniqueSteps = new Set<number>([4, 8, 16, 24, 32, 48, 64]);
  for (const pad of observedPaddings.slice(0, 30)) {
    if (pad > 0) {
      uniqueSteps.add(snapToModularGrid(pad));
    }
  }

  const spacingRamp = Array.from(uniqueSteps).sort((a, b) => a - b);

  // Classify observed radii
  let controlPx = 6;
  let cardPx = 8;
  const pillPx = 9999;

  const validRadii = observedRadii.filter((r) => r > 0 && r < 999);
  if (validRadii.length > 0) {
    const sorted = [...validRadii].sort((a, b) => a - b);
    controlPx = sorted[0] || 6;
    cardPx = sorted[Math.floor(sorted.length / 2)] || 8;
  }

  // Filter realistic box-shadows
  const validShadows = observedShadows.filter(
    (s) => s && s !== "none" && !s.includes("rgba(0, 0, 0, 0)")
  );

  return {
    baseGridPx: 8,
    spacingRampPx: spacingRamp,
    radii: {
      controlPx: Math.min(16, controlPx),
      cardPx: Math.min(24, Math.max(controlPx, cardPx)),
      pillPx,
    },
    shadows: {
      subtle: validShadows[0] || "0 1px 3px rgba(0, 0, 0, 0.05)",
      elevated: validShadows[1] || "0 10px 24px -8px rgba(0, 0, 0, 0.08)",
      keyline: "0 1px 2px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
    },
  };
}
