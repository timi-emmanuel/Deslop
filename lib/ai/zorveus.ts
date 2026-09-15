import {
  Zorveus,
  ProductUserAllowanceInsufficientError,
  CapExceededError,
  RateLimitError,
  InsufficientFundsError,
  AuthenticationError,
  ZorveusBusinessError,
} from "@zorveus/sdk";
import { ColorToken, GeometrySpec, TypographySpec } from "@/types/tokens";
import { generateDesignMarkdown } from "@/lib/exporters/design-md";
import { resolveInferenceKeyForPlan, getZorveusConfig } from "@/lib/config/zorveus-env";
import { hexToRgb } from "@/lib/synthesizer/color-clustering";

/**
 * Initializes the Zorveus AI gateway inference client using the appropriate plan key.
 * Never exposes keys to browser clients.
 */
function getZorveusInferenceClient(isPro = false): Zorveus | null {
  const apiKey = resolveInferenceKeyForPlan(isPro);
  if (!apiKey) return null;

  const { gatewayBaseUrl, controlPlaneBaseUrl } = getZorveusConfig();
  return new Zorveus({
    apiKey,
    gatewayBaseURL: gatewayBaseUrl,
    baseURL: controlPlaneBaseUrl,
  });
}

export interface AiSynthesisParams {
  domain: string;
  url: string;
  colors: ColorToken[];
  typography: TypographySpec;
  geometry: GeometrySpec;
  customPrompt?: string;
  externalUserId?: string;
  isPro?: boolean;
}

export interface AiSynthesisResult {
  success: boolean;
  source: "zorveus" | "deterministic-fallback";
  markdown: string;
  modelUsed?: string;
  brandArchetype?: string;
  sanitization?: {
    hallucinationsFound: number;
    correctedHexes: string[];
  };
  error?: string;
  errorCode?: "ALLOWANCE_EXHAUSTED" | "RATE_LIMITED" | "FUNDING_UNAVAILABLE" | "AUTH_FAILED" | "INFERENCE_ERROR";
}

/**
 * Deterministic Post-Generation Validator
 * Scans markdown output and strictly guarantees no hallucinated hex codes exist.
 * If an LLM invents an unmapped hex code, it snaps it to the nearest valid palette token.
 */
export function validateAndSanitizeDesignMd(
  rawMarkdown: string,
  validPalette: ColorToken[]
): { sanitizedMarkdown: string; hallucinationsFound: number; correctedHexes: string[] } {
  if (!validPalette || validPalette.length === 0) {
    return { sanitizedMarkdown: rawMarkdown, hallucinationsFound: 0, correctedHexes: [] };
  }

  const validHexSet = new Set(validPalette.map((c) => c.hex.toUpperCase()));
  const hexRegex = /#([0-9a-fA-F]{3,8})\b/g;
  const correctedHexes: string[] = [];

  const sanitizedMarkdown = rawMarkdown.replace(hexRegex, (match) => {
    let normalized = match.toUpperCase();
    if (normalized.length === 4) {
      // expand 3-digit hex #RGB -> #RRGGBB
      normalized = `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`;
    }

    if (validHexSet.has(normalized)) {
      return match;
    }

    // Hallucination detected! Find closest extracted color by Euclidean RGB distance
    const matchRgb = hexToRgb(normalized);
    let closestToken = validPalette[0];
    let minDistance = Infinity;

    for (const token of validPalette) {
      const tokenRgb = hexToRgb(token.hex);
      const dist = Math.sqrt(
        Math.pow(matchRgb.r - tokenRgb.r, 2) +
          Math.pow(matchRgb.g - tokenRgb.g, 2) +
          Math.pow(matchRgb.b - tokenRgb.b, 2)
      );
      if (dist < minDistance) {
        minDistance = dist;
        closestToken = token;
      }
    }

    correctedHexes.push(`${match} -> ${closestToken.hex} (${closestToken.name})`);
    return closestToken.hex;
  });

  return {
    sanitizedMarkdown,
    hallucinationsFound: correctedHexes.length,
    correctedHexes,
  };
}

/**
 * Synthesizes and enriches extracted design tokens using the Zorveus AI Gateway.
 * Routes inference through Zorveus to compile high-craft design rules, anti-slop constraints,
 * and exact Tailwind component recipes.
 */
export async function synthesizeWithZorveus(
  params: AiSynthesisParams
): Promise<AiSynthesisResult> {
  const {
    domain,
    url,
    colors,
    typography,
    geometry,
    customPrompt,
    externalUserId = "usr_guest_anonymous",
    isPro = false,
  } = params;

  const client = getZorveusInferenceClient(isPro);

  // If no Zorveus key is configured, return the deterministic baseline instantly
  if (!client) {
    return {
      success: true,
      source: "deterministic-fallback",
      markdown: generateDesignMarkdown({ domain, colors, typography, geometry, url }),
    };
  }

  const { defaultModel } = getZorveusConfig();
  const model = defaultModel;

  // Build structured ground-truth evidence for the LLM reasoning layer
  const colorSummary = colors
    .map(
      (c) =>
        `- ${c.name}: ${c.hex} | Role: ${c.role} | WCAG: ${c.wcagRating} (${c.contrastRatio || c.contrastAgainstCanvas}:1 vs ${c.contrastTarget || "canvas"}) | Coverage: ${c.frequencyPercentage}%`
    )
    .join("\n");

  const prompt = `You are a Principal Design Systems Architect and Senior Frontend Engineer specializing in eliminating "AI Slop" (generic purple glows, mismatched radii, arbitrary 13px paddings, centered hero clichés).

We have extracted exact DOM computed tokens from ${url} (${domain}):
${colorSummary}

Typography:
- Display: ${typography.displayFamily}
- Body: ${typography.bodyFamily}
- Mono: ${typography.monoFamily}
- Scale: ${typography.scaleName} (${typography.scaleRatio})

Geometry:
- Base grid: ${geometry.baseGridPx}pt
- Spacing: ${geometry.spacingRampPx.join(", ")}px
- Radii: Controls ${geometry.radii.controlPx}px, Cards ${geometry.radii.cardPx}px, Pills ${geometry.radii.pillPx}px

${customPrompt ? `Special User Directive: ${customPrompt}\n` : ""}

CRITICAL GROUND-TRUTH CONSTRAINT:
You MUST strictly use the exact hex codes provided above. NEVER invent, hallucinate, or alter hex codes.

Generate an authoritative, production-grade \`design.md\` file that will be dropped into \`.cursorrules\` or Claude Code project instructions.

Structure your output cleanly in Markdown:
1. # [Domain] — Production Design System & AI Guidelines
2. ## 1. Brand Visual Identity & Archetype (Identify what makes this site's design unique and disciplined)
3. ## 2. Semantic Color Token Matrix (Locked hex codes with semantic roles: --bg-canvas, --bg-surface, --accent-primary, --text-primary, --keyline)
4. ## 3. Anti-Slop Negative Constraints (5 strict "NEVER" rules tailored specifically to this brand)
5. ## 4. Concrete Component Recipes (Exact Tailwind CSS class strings for Primary Button, Secondary Button, Card Container, Form Input, and Pill Tag. Always ensure text on buttons and tags has high WCAG contrast against the element fill background — for light accent fills use dark text, and for dark fills use light text).
6. ## 5. Cursor / Claude Drop-In System Directive (A ready-to-paste prompt block for AI coding tools)

Output ONLY the markdown content without preamble or conversational filler.`;

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are the Deslop AI Synthesis Engine. You compile mathematically extracted web tokens into hardened, opinionated design system markdown files for AI coding tools. Never generate generic AI tropes or unmapped colors.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      // Standard OpenAI user attribution for per-user allowance tracking
      user: externalUserId,
      // Rich Zorveus product-user metadata attribution
      zorveusMetadata: {
        externalUserId,
        displayName: isPro ? "Deslop Pro Designer" : "Deslop Guest User",
        metadata: {
          plan: isPro ? "pro" : "free",
          targetDomain: domain,
          source: "deslop-studio",
        },
      },
    });

    const responseContent = completion.choices?.[0]?.message?.content;

    if (responseContent && typeof responseContent === "string") {
      // Guardrail: Run deterministic anti-hallucination sanitizer
      const { sanitizedMarkdown, hallucinationsFound, correctedHexes } =
        validateAndSanitizeDesignMd(responseContent.trim(), colors);

      return {
        success: true,
        source: "zorveus",
        markdown: sanitizedMarkdown,
        modelUsed: model,
        sanitization: {
          hallucinationsFound,
          correctedHexes,
        },
      };
    }

    throw new Error("Empty response from Zorveus AI gateway");
  } catch (error: unknown) {
    // Intentional handling for product states rather than generic crashes
    if (
      error instanceof ProductUserAllowanceInsufficientError ||
      error instanceof CapExceededError
    ) {
      console.warn(`[Zorveus] User ${externalUserId} allowance cap exceeded:`, error);
      return {
        success: false,
        source: "deterministic-fallback",
        markdown: generateDesignMarkdown({ domain, colors, typography, geometry, url }),
        error: "Your monthly AI synthesis allowance has been reached.",
        errorCode: "ALLOWANCE_EXHAUSTED",
      };
    }

    if (error instanceof RateLimitError) {
      console.warn(`[Zorveus] Rate limit encountered for user ${externalUserId}:`, error);
      return {
        success: false,
        source: "deterministic-fallback",
        markdown: generateDesignMarkdown({ domain, colors, typography, geometry, url }),
        error: "Zorveus rate limit reached. Please wait a moment before re-synthesizing.",
        errorCode: "RATE_LIMITED",
      };
    }

    if (error instanceof InsufficientFundsError) {
      console.error("[Zorveus] Organization funding unavailable:", error);
      return {
        success: false,
        source: "deterministic-fallback",
        markdown: generateDesignMarkdown({ domain, colors, typography, geometry, url }),
        error: "AI synthesis service funding is currently exhausted.",
        errorCode: "FUNDING_UNAVAILABLE",
      };
    }

    if (error instanceof AuthenticationError) {
      console.error("[Zorveus] Authentication failure with Zorveus key:", error);
      return {
        success: false,
        source: "deterministic-fallback",
        markdown: generateDesignMarkdown({ domain, colors, typography, geometry, url }),
        error: "Zorveus authentication failed. Check server API keys.",
        errorCode: "AUTH_FAILED",
      };
    }

    console.warn(
      "[Zorveus AI Agent] Gateway inference notice, safely falling back to deterministic synthesis:",
      error
    );

    return {
      success: true,
      source: "deterministic-fallback",
      markdown: generateDesignMarkdown({ domain, colors, typography, geometry, url }),
    };
  }
}
