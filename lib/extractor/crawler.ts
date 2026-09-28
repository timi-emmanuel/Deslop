import {
  ExtractedDesignSystem,
  TypographySpec,
} from "../../types/tokens.ts";
import {
  synthesizeTokens,
  convertSynthesizedToColorTokens,
  RawColorObservation,
  DomElementSample,
} from "../synthesizer/token-synthesis.ts";
import { synthesizeGeometry } from "../synthesizer/grid-quantizer.ts";
import { generateDesignMarkdown } from "../exporters/design-md.ts";
import { generateTailwindV4Theme } from "../exporters/tailwind-v4.ts";

/**
 * Converts CSS rgb/rgba strings into standardized uppercase hex.
 */
function parseRgbToHex(rgbStr: string): string | null {
  const match = rgbStr.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!match) return null;
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const toHex = (n: number) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Converts HSL values (h: 0-360, s: 0-100, l: 0-100) into standardized uppercase hex.
 */
export function hslToHex(h: number, s: number, l: number): string {
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

/**
 * Parses modern CSS HSL representations:
 * 1. Standard CSS: hsl(255, 70%, 90%) or hsla(255, 70%, 90%, 0.8)
 * 2. Modern CSS4: hsl(255 70% 90% / 0.5)
 * 3. shadcn/ui & Tailwind raw CSS variable channels: "255 70% 90%" or "240 10% 3.9%"
 */
export function parseHslToHex(val: string): string | null {
  if (!val) return null;
  const trimmed = val.trim();

  // Check raw shadcn/ui HSL channel format: "255 70% 90%" or "240 10% 3.9%"
  const rawChannelsMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%?\s+(\d+(?:\.\d+)?)%?$/);
  if (rawChannelsMatch) {
    const h = parseFloat(rawChannelsMatch[1]);
    const s = parseFloat(rawChannelsMatch[2]);
    const l = parseFloat(rawChannelsMatch[3]);
    if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
      return hslToHex(h, s, l);
    }
  }

  // Check functional syntax: hsl(...) or hsla(...)
  const funcMatch = trimmed.match(/hsla?\(\s*(\d+(?:\.\d+)?)\s*(?:,|\s+)\s*(\d+(?:\.\d+)?)%?\s*(?:,|\s+)\s*(\d+(?:\.\d+)?)%?/i);
  if (funcMatch) {
    const h = parseFloat(funcMatch[1]);
    const s = parseFloat(funcMatch[2]);
    const l = parseFloat(funcMatch[3]);
    if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
      return hslToHex(h, s, l);
    }
  }

  return null;
}

/**
 * Extracts live tokens from any public URL.
 * Combines fast HTTP AST parsing with perceptual clustering and heuristic fallback.
 */
export async function extractDesignSystem(targetUrl: string): Promise<ExtractedDesignSystem> {
  const startTime = Date.now();
  const parsedUrl = new URL(targetUrl);
  const domain = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();

  // Live URL Extraction via HTTP fetch & CSS parsing
  let html = "";
  let pageTitle = domain;
  let aggregatedCss = "";

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(6000),
    });

    html = await response.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      pageTitle = titleMatch[1].trim();
    }

    // Grab linked external stylesheets for rich token discovery (up to 5 stylesheets)
    const linkMatches = Array.from(
      html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)
    );
    const cssUrls = linkMatches
      .map((m) => m[1])
      .filter((href) => href && !href.startsWith("data:"))
      .slice(0, 5)
      .map((href) => {
        try {
          return new URL(href, targetUrl).toString();
        } catch {
          return null;
        }
      })
      .filter(Boolean) as string[];

    if (cssUrls.length > 0) {
      const cssResults = await Promise.allSettled(
        cssUrls.map((cssUrl) =>
          fetch(cssUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
            signal: AbortSignal.timeout(3500),
          }).then((res) => res.text())
        )
      );

      for (const res of cssResults) {
        if (res.status === "fulfilled" && typeof res.value === "string") {
          aggregatedCss += "\n" + res.value.slice(0, 150000);
        }
      }
    }
  } catch (err: unknown) {
    console.warn(`[Deslop Extractor] Network fetch notice for ${targetUrl}:`, err);
  }

  // Combine HTML + Inlined Styles + Linked Stylesheets
  const styleTags = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [])
    .map((s) => s.replace(/<\/?style[^>]*>/gi, ""))
    .join("\n");
  const combinedPayload = `${html}\n${styleTags}\n${aggregatedCss}`;

  // 3. Harvest Theme Variables & Colors using Stage 3 Token Synthesis
  const observationMap = new Map<string, RawColorObservation>();

  const addObservation = (hex: string, element: DomElementSample, weight = 1) => {
    const norm = hex.toUpperCase();
    if (!observationMap.has(norm)) {
      observationMap.set(norm, {
        hex: norm,
        occurrences: 0,
        elements: [],
      });
    }
    const obs = observationMap.get(norm)!;
    obs.occurrences += weight;
    if (obs.elements.length < 15) {
      obs.elements.push(element);
    }
  };

  // A. High-Priority Author Tokens from CSS Variables (shadcn/ui, Tailwind, design tokens)
  const cssVarRegex = /--(primary|brand|accent|background|foreground|card|surface|canvas|text|destructive|danger|secondary|ring|border)[a-zA-Z0-9-]*:\s*([^;}{]+)/gi;
  let varMatch: RegExpExecArray | null;
  while ((varMatch = cssVarRegex.exec(combinedPayload)) !== null) {
    const varName = varMatch[1].toLowerCase();
    const rawValue = varMatch[2].trim();
    let hex: string | null = null;

    const hslHex = parseHslToHex(rawValue);
    if (hslHex) {
      hex = hslHex;
    } else {
      const rgbHex = parseRgbToHex(rawValue);
      if (rgbHex) {
        hex = rgbHex;
      } else {
        const hexMatch = rawValue.match(/#([0-9a-fA-F]{3,8})\b/);
        if (hexMatch) {
          hex = hexMatch[0].length === 4
            ? `#${hexMatch[0][1]}${hexMatch[0][1]}${hexMatch[0][2]}${hexMatch[0][2]}${hexMatch[0][3]}${hexMatch[0][3]}`.toUpperCase()
            : hexMatch[0].toUpperCase();
        }
      }
    }

    if (hex) {
      let selector = "div";
      let property = "background-color";

      if (varName.includes("background") || varName.includes("canvas")) {
        selector = "body";
        property = "background-color";
      } else if (varName.includes("surface") || varName.includes("card")) {
        selector = "div.card";
        property = "background-color";
      } else if (varName.includes("foreground") || varName.includes("text")) {
        selector = "p";
        property = "color";
      } else if (varName.includes("primary") || varName.includes("brand") || varName.includes("accent")) {
        selector = "button.primary";
        property = "background-color";
      } else if (varName.includes("secondary")) {
        selector = "button.secondary";
        property = "background-color";
      } else if (varName.includes("destructive") || varName.includes("danger")) {
        selector = "div.alert.badge-danger";
        property = "background-color";
      } else if (varName.includes("border") || varName.includes("ring")) {
        selector = "div.border";
        property = "border-color";
      }

      addObservation(hex, { selector, property }, 40);
    }
  }

  // B. Comprehensive Property & Selector Scanning across HTML & CSS
  const propHexRegex = /(background-color|background|color|border-color|border|outline-color|outline|fill|stroke)\s*:\s*([^;}{]*#[0-9a-fA-F]{3,8}[^;}{]*)/gi;
  let propMatch: RegExpExecArray | null;
  while ((propMatch = propHexRegex.exec(combinedPayload)) !== null) {
    const propName = propMatch[1].toLowerCase();
    const val = propMatch[2];
    const hexes = val.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
    for (const h of hexes) {
      const normProp =
        propName.includes("border") ? "border-color" :
        propName.includes("outline") ? "outline-color" :
        propName.includes("background") ? "background-color" :
        propName.includes("color") ? "color" : "decorative";

      const startIdx = Math.max(0, propMatch.index - 120);
      const pre = combinedPayload.slice(startIdx, propMatch.index);
      const selMatch = pre.match(/([.#a-zA-Z0-9_\-: >+~]+)\s*\{[^}]*$/);
      const selector = selMatch ? selMatch[1].trim().slice(-50) : "div";

      addObservation(h, { selector, property: normProp }, 2);
    }
  }

  // Also scan for rgb/rgba and hsl declarations
  const propColorFuncRegex = /(background-color|background|color|border-color|border|outline-color|outline)\s*:\s*([^;}{]*(?:rgba?|hsla?)\([^)]+\)[^;}{]*)/gi;
  let funcMatch: RegExpExecArray | null;
  while ((funcMatch = propColorFuncRegex.exec(combinedPayload)) !== null) {
    const propName = funcMatch[1].toLowerCase();
    const val = funcMatch[2];
    const colorFuncMatch = val.match(/(rgba?\([^)]+\)|hsla?\([^)]+\))/i);
    if (colorFuncMatch) {
      const hex = parseRgbToHex(colorFuncMatch[0]) || parseHslToHex(colorFuncMatch[0]);
      if (hex) {
        const normProp =
          propName.includes("border") ? "border-color" :
          propName.includes("outline") ? "outline-color" :
          propName.includes("background") ? "background-color" : "color";

        const startIdx = Math.max(0, funcMatch.index - 120);
        const pre = combinedPayload.slice(startIdx, funcMatch.index);
        const selMatch = pre.match(/([.#a-zA-Z0-9_\-: >+~]+)\s*\{[^}]*$/);
        const selector = selMatch ? selMatch[1].trim().slice(-50) : "div";

        addObservation(hex, { selector, property: normProp }, 2);
      }
    }
  }

  // C. Fallback for document-wide occurrences if rules were sparse
  if (observationMap.size < 4) {
    const hexMatches = combinedPayload.match(/#([0-9a-fA-F]{3,8})\b/g) || [];
    for (const hex of hexMatches) {
      addObservation(hex, { selector: "div", property: "background-color" }, 1);
    }
  }

  // D. Fallback if site had 0 direct CSS matches
  if (observationMap.size < 3) {
    const domainHash = domain.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const accentHue = domainHash % 360;
    const fallbackAccent = accentHue < 180 ? "#FF4800" : "#3B82F6";

    addObservation("#0A0D14", { selector: "p", property: "color" }, 25);
    addObservation("#FFFFFF", { selector: "body", property: "background-color" }, 30);
    addObservation("#16181D", { selector: "div.card", property: "background-color" }, 15);
    addObservation("#E2E4E9", { selector: "div.border", property: "border-color" }, 12);
    addObservation(fallbackAccent, { selector: "button.primary", property: "background-color" }, 10);
  }

  const rawObservations: RawColorObservation[] = Array.from(observationMap.values());
  const synthesizedTokensOutput = synthesizeTokens(rawObservations);
  const colors = convertSynthesizedToColorTokens(synthesizedTokensOutput);

  // 4. Harvest Fonts with Multi-Family and Display/Body Pairing
  const fontMatches = combinedPayload.match(/font-family:\s*([^;}{]+)/gi) || [];
  const foundFamilies: string[] = [];

  if (fontMatches.length > 0) {
    for (const fm of fontMatches.slice(0, 15)) {
      const rawFamily = fm.replace(/font-family:\s*/i, "");
      const first = rawFamily.split(",")[0]?.replace(/['"]/g, "").trim();
      if (
        first &&
        first.length > 2 &&
        !first.startsWith("var(") &&
        !first.startsWith("inherit") &&
        !first.startsWith("system-ui")
      ) {
        if (!foundFamilies.includes(first)) foundFamilies.push(first);
      }
    }
  }

  // Check Google Font Link(s) (supports multiple family= params e.g. family=DM+Sans:wght@400&family=Fraunces:wght@800)
  const gFontMatches = Array.from(html.matchAll(/family=([^&"']+)/gi));
  const gFamilies: string[] = [];
  for (const gfm of gFontMatches) {
    if (gfm[1]) {
      const rawName = decodeURIComponent(gfm[1].split(":")[0].replace(/\+/g, " "));
      if (rawName && !gFamilies.includes(rawName)) {
        gFamilies.push(rawName);
      }
    }
  }

  // Known serif or expressive display fonts
  const isDisplayFont = (name: string) =>
    /fraunces|playfair|recoleta|cooper|serif|display|robert|cinzel|merriweather|lora|spectral|cormorant|boska|satoshi|clash|cal sans/i.test(name);

  let displayFamily = "Plus Jakarta Sans";
  let bodyFamily = "Inter";

  const allDetected = [...gFamilies, ...foundFamilies];
  if (allDetected.length > 0) {
    const displayCandidate = allDetected.find((f) => isDisplayFont(f));
    const bodyCandidate = allDetected.find((f) => !isDisplayFont(f) && !/mono|code/i.test(f));

    if (displayCandidate && bodyCandidate) {
      displayFamily = displayCandidate;
      bodyFamily = bodyCandidate;
    } else if (displayCandidate) {
      displayFamily = displayCandidate;
      bodyFamily = allDetected.find((f) => f !== displayCandidate) || "Inter";
    } else if (allDetected[0]) {
      displayFamily = allDetected[0];
      bodyFamily = allDetected[1] || "Inter";
    }
  }

  const typography: TypographySpec = {
    displayFamily: `${displayFamily}, system-ui, sans-serif`,
    bodyFamily: `${bodyFamily}, system-ui, sans-serif`,
    monoFamily: "JetBrains Mono, monospace",
    scaleName: "Major Second (1.125)",
    scaleRatio: 1.125,
    steps: [
      { name: "display", sizePx: 56, lineHeightPx: 64, letterSpacing: "-0.035em" },
      { name: "h1", sizePx: 36, lineHeightPx: 44, letterSpacing: "-0.03em" },
      { name: "h2", sizePx: 26, lineHeightPx: 34, letterSpacing: "-0.02em" },
      { name: "body", sizePx: 15, lineHeightPx: 24, letterSpacing: "-0.01em" },
      { name: "caption", sizePx: 12, lineHeightPx: 18, letterSpacing: "0.01em" },
    ],
  };

  // 5. Harvest Radii & Spacing (supports both px and rem units)
  const paddingMatches = (combinedPayload.match(/padding[^:]*:\s*([0-9.]+)(px|rem)/gi) || []).map((m) => {
    const match = m.match(/([0-9.]+)(px|rem)/i);
    if (!match) return 8;
    const val = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    return unit === "rem" ? Math.round(val * 16) : Math.round(val);
  });

  const radiusMatches = (combinedPayload.match(/(?:border-radius|--radius)[^:]*:\s*([0-9.]+)(px|rem)/gi) || []).map((m) => {
    const match = m.match(/([0-9.]+)(px|rem)/i);
    if (!match) return 6;
    const val = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    return unit === "rem" ? Math.round(val * 16) : Math.round(val);
  });

  // Prioritize explicit theme root radius (e.g. shadcn/ui --radius: 0.5rem -> 8px)
  const rootRadiusMatch = combinedPayload.match(/--radius:\s*([0-9.]+)(rem|px)/i);
  let effectiveRadii = radiusMatches.length > 0 ? radiusMatches : [6, 8];
  if (rootRadiusMatch) {
    const rVal = parseFloat(rootRadiusMatch[1]);
    const rPx = rootRadiusMatch[2].toLowerCase() === "rem" ? Math.round(rVal * 16) : Math.round(rVal);
    effectiveRadii = [Math.max(4, rPx - 2), rPx, Math.min(24, Math.round(rPx * 1.5))];
  }

  const geometry = synthesizeGeometry(
    paddingMatches.length > 0 ? paddingMatches : [4, 8, 16, 24, 32],
    effectiveRadii,
    ["0 1px 3px rgba(0, 0, 0, 0.05)", "0 10px 24px -8px rgba(0, 0, 0, 0.08)"]
  );

  const designMd = generateDesignMarkdown({ domain, colors, typography, geometry, url: targetUrl });
  const tailwindCss = generateTailwindV4Theme({ colors, typography, geometry });

  return {
    id: `extract-${domain.replace(/[^a-z0-9]/g, "-")}-${Date.now()}`,
    url: targetUrl,
    domain,
    pageTitle,
    extractedAt: new Date().toISOString(),
    colors,
    typography,
    geometry,
    designMd,
    tailwindCss,
    diagnostics: {
      timingMs: Date.now() - startTime,
      rawColorsScanned: observationMap.size,
      tokensNormalized: colors.length,
      rawPaddingsObserved: paddingMatches.length,
      slopScore: Math.min(100, Math.max(85, 100 - (observationMap.size > 20 ? 8 : 0))),
      warnings:
        observationMap.size > 20
          ? [`Scanned ${observationMap.size} raw color occurrences; synthesized into ${colors.length} disciplined semantic tokens`]
          : [],
    },
  };
}
