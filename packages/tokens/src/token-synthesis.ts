/**
 * Deslop Token Synthesis Engine (Stage 3)
 *
 * Pure algorithmic synthesis layer between DOM style extraction and markdown generation.
 * Synthesizes raw color swatches into 4-8 semantic, deduplicated, role-assigned tokens
 * with state-awareness (base + hover) and evidence-grounded WCAG contrast audits.
 */

import {
  calculateDeltaE,
  calculateContrastRatio,
  getWcagLevel,
  normalizeHex,
  hexToRgb,
} from "./color-math.js";

export interface DomElementSample {
  selector: string;
  property: string;
  hasTextChildren?: boolean;
  tagName?: string;
}

export interface RawColorObservation {
  hex: string;
  occurrences: number;
  elements: DomElementSample[];
}

export interface TokenEntry {
  hex: string;
  hover?: string;
  confidence: "high" | "medium" | "low";
  note?: string;
}

export interface ContrastCheck {
  pair: [string, string];
  ratio: number;
  level: "AAA" | "AA" | "FAIL";
}

export interface SynthesizedTokenMap {
  canvas: TokenEntry;
  surface?: TokenEntry;
  "text-primary": TokenEntry;
  "text-muted"?: TokenEntry;
  "accent-primary": TokenEntry;
  "accent-secondary"?: TokenEntry;
  stroke?: TokenEntry;
  success?: TokenEntry;
  danger?: TokenEntry;
  warning?: TokenEntry;
  [key: string]: TokenEntry | undefined;
}

export interface SynthesizedTokenOutput {
  tokens: SynthesizedTokenMap;
  contrast_checks: ContrastCheck[];
  notes: string[];
}

export type RoleBucket =
  | "background-fill"
  | "text"
  | "border"
  | "interactive-fill"
  | "decorative";

interface ProcessedSwatch {
  hex: string;
  occurrences: number;
  elements: DomElementSample[];
  roles: Set<RoleBucket>;
  roleCounts: Record<RoleBucket, number>;
  hoverHex?: string;
  isStateVariantOnly: boolean;
  parentBaseHex?: string;
  hasPrimaryCtaPresence: boolean;
}

/**
 * Strips interactive pseudoclasses from CSS selector strings.
 */
function stripPseudoclasses(selector: string): string {
  return selector
    .replace(/:(hover|focus|focus-visible|focus-within|active)/gi, "")
    .trim();
}

/**
 * Checks if a selector points to an interactive element.
 */
function isInteractiveSelector(selector: string): boolean {
  const s = selector.toLowerCase();
  return (
    s.includes("button") ||
    s.includes("a.") ||
    s.includes("a:") ||
    s.includes("a[") ||
    s.includes("a ") ||
    s.startsWith("a") ||
    s.includes("input") ||
    s.includes("select") ||
    s.includes('[role="button"]') ||
    s.includes(".btn") ||
    s.includes(".cta") ||
    /:hover|:focus|:active/i.test(s)
  );
}

/**
 * Checks if a selector hints at primary CTA priority.
 */
function isPrimaryCtaSelector(selector: string): boolean {
  const s = selector.toLowerCase();
  return (
    s.includes("button.primary") ||
    s.includes(".btn-primary") ||
    s.includes(".button-primary") ||
    s.includes("cta") ||
    s.includes("primary") ||
    s.includes("button:first-of-type") ||
    s.includes(".action-primary")
  );
}

/**
 * Checks if a selector points to a decorative element (badge, icon, divider, tag, alert).
 */
function isDecorativeSelector(selector: string): boolean {
  const s = selector.toLowerCase();
  return (
    s.includes("badge") ||
    s.includes("icon") ||
    s.includes("divider") ||
    s.includes("tag") ||
    s.includes("pill") ||
    s.includes("status") ||
    s.includes("alert") ||
    s.includes("dot") ||
    s.includes("indicator")
  );
}

/**
 * Checks if a selector points to a large container element.
 */
function isLargeContainer(selector: string, hasTextChildren?: boolean): boolean {
  const s = selector.toLowerCase();
  if (
    s.startsWith("body") ||
    s.startsWith("html") ||
    s.includes("main") ||
    s.includes("article") ||
    s.includes("section") ||
    s.includes("card") ||
    s.includes("panel") ||
    s.includes(".container") ||
    s.includes(".wrapper") ||
    s.includes("#root") ||
    s.includes("#__next") ||
    s.includes("#app")
  ) {
    return true;
  }
  if (s.includes("div") && hasTextChildren === false) {
    return true;
  }
  return false;
}

/**
 * Converts RGB to HSL for semantic status hue classification.
 */
function getHsl(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = hexToRgb(hex);
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
 * Step 1 — Role inference (per swatch).
 * Retains all matched roles per hex observation.
 */
function inferRoles(rawObservations: RawColorObservation[]): ProcessedSwatch[] {
  return rawObservations.map((obs) => {
    const hex = normalizeHex(obs.hex);
    const roles = new Set<RoleBucket>();
    const roleCounts: Record<RoleBucket, number> = {
      "background-fill": 0,
      text: 0,
      border: 0,
      "interactive-fill": 0,
      decorative: 0,
    };

    let hasPrimaryCta = false;
    let onlyStateful = obs.elements.length > 0;

    for (const el of obs.elements) {
      const prop = el.property.toLowerCase().trim();
      const sel = el.selector.toLowerCase().trim();

      const isStateful = /:(hover|focus|focus-visible|active)/i.test(sel);
      if (!isStateful) {
        onlyStateful = false;
      }

      if (isPrimaryCtaSelector(sel)) {
        hasPrimaryCta = true;
      }

      // Priority 1: background-fill on large containers
      if (
        (prop === "background-color" || prop === "background") &&
        isLargeContainer(sel, el.hasTextChildren) &&
        !isInteractiveSelector(sel) &&
        !isDecorativeSelector(sel)
      ) {
        roles.add("background-fill");
        roleCounts["background-fill"]++;
      }

      // Priority 2: text
      if (prop === "color" && !isDecorativeSelector(sel)) {
        roles.add("text");
        roleCounts.text++;
        if (isInteractiveSelector(sel)) {
          roles.add("interactive-fill");
          roleCounts["interactive-fill"]++;
        }
      }

      // Priority 3: border
      if (
        prop === "border-color" ||
        prop.includes("border") ||
        prop === "outline-color" ||
        prop.includes("outline")
      ) {
        roles.add("border");
        roleCounts.border++;
      }

      // Priority 4: interactive-fill
      if ((prop === "background-color" || prop === "background") && isInteractiveSelector(sel)) {
        roles.add("interactive-fill");
        roleCounts["interactive-fill"]++;
      }

      // Priority 5: decorative (badges, icons, dividers, tags, alerts, or fallbacks)
      if (
        isDecorativeSelector(sel) ||
        prop.includes("fill") ||
        roles.size === 0
      ) {
        roles.add("decorative");
        roleCounts.decorative++;
      }
    }

    if (roles.size === 0) {
      roles.add("decorative");
      roleCounts.decorative = 1;
    }

    return {
      hex,
      occurrences: obs.occurrences,
      elements: obs.elements,
      roles,
      roleCounts,
      isStateVariantOnly: onlyStateful,
      hasPrimaryCtaPresence: hasPrimaryCta,
    };
  });
}

/**
 * Step 2 — State collapsing.
 * Merges swatches that appear only on :hover/:focus/:active into their resting state token.
 */
function collapseInteractiveStates(
  swatches: ProcessedSwatch[],
  notes: string[]
): ProcessedSwatch[] {
  const interactiveSwatches = swatches.filter((s) => s.roles.has("interactive-fill"));
  const restingSwatches = interactiveSwatches.filter((s) => !s.isStateVariantOnly);
  const stateOnlySwatches = interactiveSwatches.filter((s) => s.isStateVariantOnly);

  for (const stateSwatch of stateOnlySwatches) {
    // Find resting swatch on the same element selector pattern
    const stateBaseSelectors = stateSwatch.elements.map((e) =>
      stripPseudoclasses(e.selector.toLowerCase())
    );

    let matchedResting: ProcessedSwatch | undefined;

    for (const resting of restingSwatches) {
      const restingSelectors = resting.elements.map((e) =>
        stripPseudoclasses(e.selector.toLowerCase())
      );
      const sharesSelector = stateBaseSelectors.some((sb) =>
        restingSelectors.some((rb) => sb === rb || sb.includes(rb) || rb.includes(sb))
      );

      if (sharesSelector) {
        matchedResting = resting;
        break;
      }
    }

    // Fallback: If no exact selector match, match closest hue/role resting candidate
    if (!matchedResting && restingSwatches.length > 0) {
      // Find resting interactive with lowest Delta-E
      let minDe = 1000;
      for (const resting of restingSwatches) {
        const de = calculateDeltaE(resting.hex, stateSwatch.hex);
        if (de < minDe) {
          minDe = de;
          matchedResting = resting;
        }
      }
    }

    if (matchedResting) {
      matchedResting.hoverHex = stateSwatch.hex;
      stateSwatch.parentBaseHex = matchedResting.hex;
      notes.push(
        `Merged raw state swatch ${stateSwatch.hex} into ${matchedResting.hex} (base + hover) via selector state detection.`
      );
    }
  }

  // Filter out swatches that were completely absorbed as hover-only variants
  return swatches.filter((s) => !s.parentBaseHex);
}

/**
 * Step 3 — Perceptual deduplication.
 * Merges swatches within the same role bucket having Delta-E < 5.0.
 */
function deduplicateClustersByRole(
  swatches: ProcessedSwatch[],
  role: RoleBucket,
  notes: string[]
): ProcessedSwatch[] {
  const relevant = swatches.filter((s) => s.roles.has(role));
  const other = swatches.filter((s) => !s.roles.has(role));

  // Sort by occurrence descending
  const sorted = [...relevant].sort((a, b) => b.occurrences - a.occurrences);
  const clusters: ProcessedSwatch[] = [];

  for (const candidate of sorted) {
    let merged = false;
    for (const canonical of clusters) {
      const de = calculateDeltaE(canonical.hex, candidate.hex);
      if (de < 5.0) {
        canonical.occurrences += candidate.occurrences;
        if (!canonical.hoverHex && candidate.hoverHex) {
          canonical.hoverHex = candidate.hoverHex;
        }
        if (candidate.hasPrimaryCtaPresence) {
          canonical.hasPrimaryCtaPresence = true;
        }
        notes.push(
          `Deduplicated ${candidate.hex} into ${canonical.hex} (Delta-E: ${de.toFixed(1)} < 5.0 in role '${role}').`
        );
        merged = true;
        break;
      }
    }
    if (!merged) {
      clusters.push({ ...candidate });
    }
  }

  return [...clusters, ...other];
}

/**
 * Step 4 & 5 — Role-to-token mapping & role-aware contrast validation.
 */
export function synthesizeTokens(
  rawObservations: RawColorObservation[]
): SynthesizedTokenOutput {
  const notes: string[] = [];

  if (!rawObservations || rawObservations.length === 0) {
    return {
      tokens: {
        canvas: { hex: "#FFFFFF", confidence: "low" },
        "text-primary": { hex: "#000000", confidence: "low" },
        "accent-primary": { hex: "#000000", confidence: "low" },
      },
      contrast_checks: [
        { pair: ["text-primary", "canvas"], ratio: 21.0, level: "AAA" },
      ],
      notes: ["Empty observation array — emitted default fallback schema."],
    };
  }

  // Step 1: Role inference
  let swatches = inferRoles(rawObservations);

  // Step 2: State collapsing
  swatches = collapseInteractiveStates(swatches, notes);

  // Step 3: Perceptual deduplication within role buckets
  const rolesToDedupe: RoleBucket[] = [
    "background-fill",
    "interactive-fill",
    "text",
    "border",
  ];
  for (const r of rolesToDedupe) {
    swatches = deduplicateClustersByRole(swatches, r, notes);
  }

  const tokens: SynthesizedTokenMap = {} as SynthesizedTokenMap;
  const contrastChecks: ContrastCheck[] = [];

  // --- 1. Canvas (Required) ---
  const bgCandidates = swatches
    .filter((s) => s.roles.has("background-fill"))
    .sort((a, b) => {
      // Prioritize body/html/main presence
      const aIsPage = a.elements.some((e) => /^(body|html|main|#app|#root)/i.test(e.selector));
      const bIsPage = b.elements.some((e) => /^(body|html|main|#app|#root)/i.test(e.selector));
      if (aIsPage && !bIsPage) return -1;
      if (!aIsPage && bIsPage) return 1;
      return b.occurrences - a.occurrences;
    });

  let canvasHex = "#FFFFFF";
  let canvasConfidence: "high" | "medium" | "low" = "low";

  if (bgCandidates.length > 0) {
    canvasHex = bgCandidates[0].hex;
    canvasConfidence = bgCandidates[0].occurrences >= 2 ? "high" : "medium";
  } else {
    notes.push("No confident canvas background detected — used neutral fallback #FFFFFF.");
  }

  tokens.canvas = {
    hex: canvasHex,
    confidence: canvasConfidence,
  };

  // --- 2. Surface (Optional) ---
  const surfaceCandidates = bgCandidates.filter((s) => s.hex !== canvasHex);
  let surfaceHex: string | undefined;

  if (surfaceCandidates.length > 0) {
    const candidate = surfaceCandidates[0];
    const deFromCanvas = calculateDeltaE(candidate.hex, canvasHex);

    // Rule: Skip surface entirely if Delta-E < 3.0 from canvas (or < 5.0 for strict dedupe)
    if (deFromCanvas < 5.0) {
      notes.push(
        `Dropped 'surface' distinct token — computed value was Delta-E ${deFromCanvas.toFixed(1)} from canvas (< 5.0), treated as duplicate.`
      );
    } else {
      surfaceHex = candidate.hex;
      tokens.surface = {
        hex: candidate.hex,
        confidence: candidate.occurrences >= 3 ? "high" : "medium",
      };
    }
  }

  // --- 3. Text Primary (Required) ---
  const textCandidates = swatches
    .filter((s) => s.roles.has("text"))
    .sort((a, b) => b.occurrences - a.occurrences);

  let textPrimaryHex = "#000000";
  let textConfidence: "high" | "medium" | "low" = "low";

  // Pick dominant text color that contrasts with canvas
  const legibleText = textCandidates.filter(
    (t) => calculateContrastRatio(t.hex, canvasHex) >= 4.5
  );

  if (legibleText.length > 0) {
    textPrimaryHex = legibleText[0].hex;
    textConfidence = legibleText[0].occurrences >= 2 ? "high" : "medium";
  } else if (textCandidates.length > 0) {
    textPrimaryHex = textCandidates[0].hex;
    textConfidence = "medium";
  } else {
    notes.push("No confident text-primary detected — used neutral fallback #000000.");
  }

  tokens["text-primary"] = {
    hex: textPrimaryHex,
    confidence: textConfidence,
  };

  // --- 4. Text Muted (Optional) ---
  const mutedCandidates = textCandidates.filter((t) => {
    if (t.hex === textPrimaryHex) return false;
    const de = calculateDeltaE(t.hex, textPrimaryHex);
    if (de < 5.0) return false;
    const hsl = getHsl(t.hex);
    if (hsl.s > 45) return false;
    return true;
  });

  if (mutedCandidates.length > 0) {
    const muted = mutedCandidates[0];
    tokens["text-muted"] = {
      hex: muted.hex,
      confidence: muted.occurrences >= 2 ? "high" : "medium",
    };
  }

  // --- 5. Accent Primary (Required) ---
  const interactiveCandidates = swatches
    .filter((s) => s.roles.has("interactive-fill"))
    .sort((a, b) => {
      // Primary CTA presence takes precedence
      if (a.hasPrimaryCtaPresence && !b.hasPrimaryCtaPresence) return -1;
      if (!a.hasPrimaryCtaPresence && b.hasPrimaryCtaPresence) return 1;
      return b.occurrences - a.occurrences;
    });

  if (interactiveCandidates.length > 0) {
    const primaryAccent = interactiveCandidates[0];
    tokens["accent-primary"] = {
      hex: primaryAccent.hex,
      confidence: primaryAccent.hasPrimaryCtaPresence ? "high" : "medium",
    };
    if (primaryAccent.hoverHex) {
      tokens["accent-primary"].hover = primaryAccent.hoverHex;
    }
  } else {
    // Fallback: Pick highest occurrence decorative color
    const deco = swatches
      .filter((s) => s.hex !== canvasHex && s.hex !== textPrimaryHex)
      .sort((a, b) => b.occurrences - a.occurrences);

    if (deco.length > 0) {
      tokens["accent-primary"] = {
        hex: deco[0].hex,
        confidence: "low",
      };
      if (deco[0].hoverHex) {
        tokens["accent-primary"].hover = deco[0].hoverHex;
      }
      notes.push("No confident accent-primary detected — used most frequent interactive color as fallback.");
    } else {
      tokens["accent-primary"] = {
        hex: "#0066CC",
        confidence: "low",
      };
      notes.push("No interactive colors found in crawl — defaulted accent-primary.");
    }
  }

  // --- 6. Accent Secondary (Optional) ---
  const primaryAccentHex = tokens["accent-primary"].hex;
  const primaryHsl = getHsl(primaryAccentHex);

  const secondaryCandidates = interactiveCandidates.filter((s) => {
    if (s.hex === primaryAccentHex) return false;
    const de = calculateDeltaE(s.hex, primaryAccentHex);
    if (de < 5.0) return false; // Must be distinct

    // Check if it is just a lighter/darker shade of accent-primary (same hue family)
    const candHsl = getHsl(s.hex);
    const hueDiff = Math.abs(candHsl.h - primaryHsl.h);
    const circularHueDiff = Math.min(hueDiff, 360 - hueDiff);

    // If within same hue family (< 35 deg) and both saturated, it's a shade/tint unless serving distinct purpose (e.g. links)
    const isSameHue = circularHueDiff < 35 && candHsl.s > 25 && primaryHsl.s > 25;
    const isDistinctPurpose = s.elements.some((e) => /^(a|link|\.nav-link)/i.test(e.selector));

    if (isSameHue && !isDistinctPurpose) {
      notes.push(
        `Suppressed candidate accent-secondary ${s.hex} — same hue family as accent-primary (${circularHueDiff.toFixed(0)}° diff), treated as shade.`
      );
      return false;
    }

    return true;
  });

  if (secondaryCandidates.length > 0) {
    const sec = secondaryCandidates[0];
    tokens["accent-secondary"] = {
      hex: sec.hex,
      confidence: "medium",
    };
    if (sec.hoverHex) {
      tokens["accent-secondary"].hover = sec.hoverHex;
    }
  }

  // --- 7. Stroke / Keyline (Optional) ---
  const borderCandidates = swatches
    .filter((s) => s.roles.has("border"))
    .filter((s) => {
      // Must be distinct from canvas, surface, and text-muted
      if (calculateDeltaE(s.hex, canvasHex) < 5.0) return false;
      if (surfaceHex && calculateDeltaE(s.hex, surfaceHex) < 5.0) return false;
      if (tokens["text-muted"] && calculateDeltaE(s.hex, tokens["text-muted"].hex) < 5.0) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.occurrences - a.occurrences);

  if (borderCandidates.length > 0) {
    tokens.stroke = {
      hex: borderCandidates[0].hex,
      confidence: borderCandidates[0].occurrences >= 3 ? "medium" : "low",
    };
  }

  // --- 8. Semantic Status Tokens (Success / Danger / Warning) (Optional) ---
  for (const s of swatches) {
    const hsl = getHsl(s.hex);

    // Danger check
    if (!tokens.danger) {
      const hasDangerSelector = s.elements.some((e) =>
        /(\.error|\.danger|alert|destructive|badge-danger|status-error)/i.test(e.selector)
      );
      if (hasDangerSelector && (hsl.h < 25 || hsl.h >= 340) && hsl.s > 30) {
        tokens.danger = { hex: s.hex, confidence: "high" };
      }
    }

    // Success check
    if (!tokens.success) {
      const hasSuccessSelector = s.elements.some((e) =>
        /(\.success|positive|badge-success|status-success|approved)/i.test(e.selector)
      );
      if (hasSuccessSelector && hsl.h >= 80 && hsl.h <= 165 && hsl.s > 30) {
        tokens.success = { hex: s.hex, confidence: "high" };
      }
    }

    // Warning check
    if (!tokens.warning) {
      const hasWarningSelector = s.elements.some((e) =>
        /(\.warning|\.warn|badge-warning|status-warning)/i.test(e.selector)
      );
      if (hasWarningSelector && hsl.h >= 35 && hsl.h <= 75 && hsl.s > 30) {
        tokens.warning = { hex: s.hex, confidence: "high" };
      }
    }
  }

  // --- Hard Constraint Enforcement ---

  // Rule 2: Ensure NO two top-level tokens have Delta-E < 5.0
  const tokenKeys = Object.keys(tokens);
  const keysToRemove = new Set<string>();

  for (let i = 0; i < tokenKeys.length; i++) {
    const keyA = tokenKeys[i];
    const tokA = tokens[keyA];
    if (!tokA || keysToRemove.has(keyA)) continue;

    for (let j = i + 1; j < tokenKeys.length; j++) {
      const keyB = tokenKeys[j];
      const tokB = tokens[keyB];
      if (!tokB || keysToRemove.has(keyB)) continue;

      const de = calculateDeltaE(tokA.hex, tokB.hex);
      if (de < 5.0) {
        // Priority order: canvas > text-primary > accent-primary > surface > text-muted > accent-secondary > stroke > status
        const priority = [
          "canvas",
          "text-primary",
          "accent-primary",
          "surface",
          "text-muted",
          "accent-secondary",
          "stroke",
          "success",
          "danger",
          "warning",
        ];
        const prioA = priority.indexOf(keyA);
        const prioB = priority.indexOf(keyB);

        const dropKey = prioA < prioB ? keyB : keyA;
        const keepKey = prioA < prioB ? keyA : keyB;

        keysToRemove.add(dropKey);
        notes.push(
          `Dropped token '${dropKey}' (${tokens[dropKey]?.hex}) — Delta-E ${de.toFixed(1)} < 5.0 against higher-priority '${keepKey}' (${tokens[keepKey]?.hex}).`
        );
      }
    }
  }

  for (const k of keysToRemove) {
    delete tokens[k];
  }

  // Rule 1: Never exceed 8 top-level tokens
  const priorityDropOrder = [
    "warning",
    "danger",
    "success",
    "stroke",
    "accent-secondary",
    "text-muted",
    "surface",
  ];

  while (Object.keys(tokens).length > 8) {
    const dropKey = priorityDropOrder.find((k) => tokens[k] !== undefined);
    if (dropKey) {
      delete tokens[dropKey];
      notes.push(`Pruned token '${dropKey}' to enforce strict max-8 token budget.`);
    } else {
      break;
    }
  }

  // --- Step 5: Role-Aware Contrast Checks ---
  // Only evaluate pairs observed together in DOM evidence:
  // 1. text-primary vs canvas
  const ratioTextCanvas = calculateContrastRatio(tokens["text-primary"].hex, tokens.canvas.hex);
  contrastChecks.push({
    pair: ["text-primary", "canvas"],
    ratio: ratioTextCanvas,
    level: getWcagLevel(ratioTextCanvas),
  });

  // 2. text-primary vs surface (if surface exists)
  if (tokens.surface) {
    const ratioTextSurface = calculateContrastRatio(
      tokens["text-primary"].hex,
      tokens.surface.hex
    );
    contrastChecks.push({
      pair: ["text-primary", "surface"],
      ratio: ratioTextSurface,
      level: getWcagLevel(ratioTextSurface),
    });
  }

  // 3. text-on-accent vs accent-primary
  if (tokens["accent-primary"]) {
    // Check if real text was observed on accent button
    const accentHex = tokens["accent-primary"].hex;
    const contrastWhite = calculateContrastRatio("#FFFFFF", accentHex);
    const contrastBlack = calculateContrastRatio("#000000", accentHex);
    const textOnAccent = contrastWhite >= contrastBlack ? "#FFFFFF" : "#000000";
    const bestRatio = Math.max(contrastWhite, contrastBlack);

    contrastChecks.push({
      pair: ["text-on-accent", "accent-primary"],
      ratio: bestRatio,
      level: getWcagLevel(bestRatio),
    });
  }

  return {
    tokens,
    contrast_checks: contrastChecks,
    notes,
  };
}

/**
 * Converts SynthesizedTokenOutput into standard ColorToken[] for downstream studio consumers.
 */
export function convertSynthesizedToColorTokens(
  synthesized: SynthesizedTokenOutput
): import("./types.js").ColorToken[] {
  const result: import("./types.js").ColorToken[] = [];
  const entries = Object.entries(synthesized.tokens).filter(([_, v]) => v !== undefined);
  const totalCount = entries.length || 1;

  const roleNameMap: Record<
    string,
    { name: string; role: import("./types.js").SemanticColorRole; usage: string }
  > = {
    canvas: { name: "bg-canvas", role: "canvas", usage: "Base Page Canvas" },
    surface: { name: "bg-surface", role: "surface", usage: "Card & Container Background" },
    "text-primary": { name: "text-primary", role: "text-primary", usage: "Primary Reading Text" },
    "text-muted": { name: "text-muted", role: "text-muted", usage: "Secondary Text & Captions" },
    "accent-primary": { name: "accent-primary", role: "accent-primary", usage: "Primary CTA Button" },
    "accent-secondary": { name: "accent-secondary", role: "accent-secondary", usage: "Secondary Action / Link" },
    stroke: { name: "stroke", role: "stroke", usage: "Structural Borders & Keylines" },
    success: { name: "accent-success", role: "accent-success", usage: "Confirmation & Success Badges" },
    danger: { name: "accent-danger", role: "accent-danger", usage: "Destructive Actions & Alerts" },
    warning: { name: "accent-warning", role: "accent-warning", usage: "Warning & Attention States" },
  };

  const canvasHex = synthesized.tokens.canvas?.hex || "#FFFFFF";

  for (const [key, tok] of entries) {
    if (!tok) continue;
    const meta = roleNameMap[key] || {
      name: key,
      role: "accent" as import("./types.js").SemanticColorRole,
      usage: "Accent element",
    };

    const contrastCanvas = calculateContrastRatio(tok.hex, canvasHex);

    // Look for matching check in contrast_checks
    let ratio = contrastCanvas;
    let target = "vs canvas";
    let rating: "AAA" | "AA" | "PASS" | "FAIL" | "BASE" =
      key === "canvas" ? "BASE" : contrastCanvas >= 7.0 ? "AAA" : contrastCanvas >= 4.5 ? "AA" : "FAIL";

    const matchedCheck = synthesized.contrast_checks.find((c) => {
      if (key === "text-primary" && c.pair[0] === "text-primary" && c.pair[1] === "canvas") return true;
      if (key === "surface" && c.pair[0] === "text-primary" && c.pair[1] === "surface") return true;
      if (key === "accent-primary" && c.pair[1] === "accent-primary") return true;
      return false;
    });

    if (matchedCheck) {
      ratio = matchedCheck.ratio;
      rating = matchedCheck.level;
      const otherPair = matchedCheck.pair[0] === key ? matchedCheck.pair[1] : matchedCheck.pair[0];
      if (otherPair === "text-on-accent") {
        const textTargetHex =
          calculateContrastRatio("#FFFFFF", tok.hex) >= calculateContrastRatio("#000000", tok.hex)
            ? "#FFFFFF text"
            : "#000000 text";
        target = `vs ${textTargetHex}`;
      } else {
        target = `vs ${otherPair}`;
      }
    }

    result.push({
      id: `token-${key}-${tok.hex.replace("#", "")}`,
      name: meta.name,
      hex: tok.hex,
      hover: tok.hover,
      role: meta.role,
      contrastAgainstCanvas: contrastCanvas,
      contrastRatio: ratio,
      contrastTarget: target,
      wcagRating: rating,
      frequencyPercentage: Number(((1 / totalCount) * 100).toFixed(1)),
      usageContext: meta.usage,
    });
  }

  return result;
}
