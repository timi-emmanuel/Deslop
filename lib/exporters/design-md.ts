import { ColorToken, GeometrySpec, TypographySpec } from "@/types/tokens";

/**
 * Compiles an authoritative, version-controlled design.md file.
 * Tailored specifically for AI coding agents (.cursorrules, Claude Code, v0).
 */
export function generateDesignMarkdown(params: {
  domain: string;
  colors: ColorToken[];
  typography: TypographySpec;
  geometry: GeometrySpec;
  url: string;
}): string {
  const { domain, colors, typography, geometry, url } = params;

  const colorRows = colors
    .map((c) => {
      const targetStr = c.contrastTarget ? ` (${c.wcagRating}, ${c.contrastRatio || c.contrastAgainstCanvas}:1 ${c.contrastTarget})` : "";
      const usageStr = c.usageContext ? ` | ${c.usageContext}` : "";
      return `- \`--${c.name}\`: \`${c.hex}\` // Role: ${c.role}${usageStr}${targetStr}`;
    })
    .join("\n");

  const spacingList = geometry.spacingRampPx.map((s) => `${s}px`).join(", ");

  return `# ${domain} — Production Design System & AI Guidelines
> Extracted from ${url} by Deslop.
> Drop this file into your workspace or reference in .cursorrules / CLAUDE.md to constrain generative frontend code.

---

## 1. Semantic Color Token Matrix
${colorRows}

### AI Color Rules:
- NEVER invent unmapped hex codes outside this locked palette.
- Use \`--bg-canvas\` exclusively for root body background.
- Use \`--bg-surface\` for elevated card containers, panels, and modals.
- Use \`--accent-primary\` exclusively for primary CTA buttons and active focus indicators.
- Use \`--accent-secondary\` for ghost controls and secondary action badges.
- Use \`--accent-danger\` (if present) exclusively for destructive actions, error banners, and delete dialogs.
- Use \`--text-primary\` for high-contrast reading text, headings, and data labels.
- Forbid generic interchangeable accent usage: each accent has a locked semantic purpose.

---

## 2. Typography Specification
- **Display / Headings**: \`${typography.displayFamily}\`
- **Body / Microcopy**: \`${typography.bodyFamily}\`
- **Monospace / Code**: \`${typography.monoFamily}\`
- **Scale Factor**: \`${typography.scaleName}\` (\`${typography.scaleRatio}\`)

### AI Typography Rules:
- Headings must use tight letter-spacing (\`tracking-tight\` or \`-0.03em\`).
- Maintain a minimum 1.5 line-height on all body paragraphs.
- Never mix arbitrary font families outside the declared display, body, and mono stacks.

---

## 3. Spatial & Geometry Constraints
- **Modular Baseline Grid**: \`${geometry.baseGridPx}pt\` (Strict multiples: \`${spacingList}\`)
- **Control Border Radius**: \`${geometry.radii.controlPx}px\` (Buttons, Form Inputs)
- **Container Border Radius**: \`${geometry.radii.cardPx}px\` (Cards, Modals, Panels)
- **Badge / Pill Radius**: \`${geometry.radii.pillPx}px\` (Status Badges, Filter Chips)

### AI Spatial Rules:
- Forbid arbitrary margins/paddings (e.g., \`p-[13px]\`). Snap strictly to 8pt/4pt tokens.
- Apply subtle 1px border strokes (\`keyline\`) with inset highlights instead of heavy blurry drop-shadows.
- Never use unconstrained nested padding or centered hero clichés.
`;
}
