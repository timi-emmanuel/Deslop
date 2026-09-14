import { Zorveus } from "@zorveus/sdk";
import { ColorToken, GeometrySpec, TypographySpec } from "@/types/tokens";
import { generateDesignMarkdown } from "../exporters/design-md";

/**
 * Initializes the Zorveus AI gateway client.
 * Uses ZORVEUS_INFERENCE_KEY from environment variables.
 */
function getZorveusClient(): Zorveus | null {
  const apiKey = process.env.ZORVEUS_INFERENCE_KEY;
  if (!apiKey) return null;
  return new Zorveus({ apiKey });
}

export function isZorveusConfigured(): boolean {
  return Boolean(process.env.ZORVEUS_INFERENCE_KEY);
}

export interface AiSynthesisParams {
  domain: string;
  url: string;
  colors: ColorToken[];
  typography: TypographySpec;
  geometry: GeometrySpec;
  customPrompt?: string;
}

export interface AiSynthesisResult {
  success: boolean;
  source: "zorveus" | "deterministic-fallback";
  markdown: string;
  modelUsed?: string;
  brandArchetype?: string;
}

/**
 * Synthesizes and enriches extracted design tokens using the Zorveus AI Gateway.
 * Routes inference through Zorveus to compile high-craft design rules, anti-slop constraints,
 * and exact Tailwind component recipes.
 */
export async function synthesizeWithZorveus(
  params: AiSynthesisParams
): Promise<AiSynthesisResult> {
  const { domain, url, colors, typography, geometry, customPrompt } = params;
  const client = getZorveusClient();

  // If no Zorveus key is configured, return the deterministic baseline instantly
  if (!client) {
    return {
      success: true,
      source: "deterministic-fallback",
      markdown: generateDesignMarkdown({ domain, colors, typography, geometry, url }),
    };
  }

  const colorSummary = colors
    .map((c) => `- ${c.name}: ${c.hex} (role: ${c.role}, WCAG: ${c.wcagRating})`)
    .join("\n");

  const prompt = `You are a Principal Design Systems Architect and Senior Frontend Engineer specializing in eliminating "AI Slop" (generic purple glows, mismatched radii, arbitrary 13px paddings, centered hero clichés).

We have extracted real computed tokens from ${url} (${domain}):
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

Generate an authoritative, production-grade \`design.md\` file that will be dropped into \`.cursorrules\` or Claude Code project instructions.

Structure your output cleanly in Markdown:
1. # [Domain] — Production Design System & AI Guidelines
2. ## 1. Brand Visual Identity & Archetype (Identify what makes this site's design unique and disciplined)
3. ## 2. Semantic Color Token Matrix (Locked hex codes with semantic roles)
4. ## 3. Anti-Slop Negative Constraints (5 strict "NEVER" rules tailored specifically to this brand)
5. ## 4. Concrete Component Recipes (Exact Tailwind CSS class strings for Primary Button, Secondary Button, Card Container, Form Input, and Pill Tag)
6. ## 5. Cursor / Claude Drop-In System Directive (A ready-to-paste prompt block for AI coding tools)

Output ONLY the markdown content without preamble or conversational filler.`;

  try {
    // Model prioritized for high-craft frontend design understanding
    const model = process.env.ZORVEUS_MODEL || "anthropic/claude-3-5-sonnet-latest";

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are the Deslop AI Synthesis Engine. You compile mathematically extracted web tokens into hardened, opinionated design system markdown files for AI coding tools. Never generate generic AI tropes.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      zorveusMetadata: {
        externalUserId: "deslop-web",
        metadata: {
          feature: "design-synthesis",
          targetDomain: domain,
        },
      },
    });

    const responseContent = completion.choices?.[0]?.message?.content;

    if (responseContent && typeof responseContent === "string") {
      return {
        success: true,
        source: "zorveus",
        markdown: responseContent.trim(),
        modelUsed: model,
      };
    }

    throw new Error("Empty response from Zorveus AI gateway");
  } catch (error: unknown) {
    console.warn(
      "[Zorveus AI Agent] Gateway inference notice, falling back to deterministic synthesis:",
      error
    );

    return {
      success: true,
      source: "deterministic-fallback",
      markdown: generateDesignMarkdown({ domain, colors, typography, geometry, url }),
    };
  }
}
