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
    .map(
      (c) =>
        `- \`--${c.name}\`: \`${c.hex}\` // Role: ${c.role}${c.role === "canvas" ? "" : ` (WCAG: ${c.wcagRating}, Contrast: ${c.contrastAgainstCanvas}:1)`}`
    )
    .join("\n");

  const spacingList = geometry.spacingRampPx.map((s) => `${s}px`).join(", ");

  return `# ${domain} — Production Design System & AI Guidelines
> Extracted from ${url} by Deslop.
> Drop this file into your workspace or reference in .cursorrules / CLAUDE.md to constrain generative frontend code.

---

## 1. Color Palette Tokens
${colorRows}

### AI Color Rules:
- NEVER invent unmapped hex codes outside this locked palette.
- Use \`--bg-canvas\` for body background and \`--bg-surface\` for elevated cards/modals.
- Reserve primary accent exclusively for key actions and active focus indicators.

---

## 2. Typography Specification
- **Display / Headings**: \`${typography.displayFamily}\`
- **Body / Microcopy**: \`${typography.bodyFamily}\`
- **Monospace / Code**: \`${typography.monoFamily}\`
- **Scale Factor**: \`${typography.scaleName}\` (\`${typography.scaleRatio}\`)

### AI Typography Rules:
- Headings must use tight letter-spacing (\`tracking-tight\` or \`-0.03em\`).
- Maintain a minimum 1.5 line-height on all body paragraphs.

---

## 3. Spatial & Geometry Constraints
- **Modular Baseline Grid**: \`${geometry.baseGridPx}pt\` (Strict multiples: \`${spacingList}\`)
- **Control Border Radius**: \`${geometry.radii.controlPx}px\` (Buttons, Form Inputs)
- **Container Border Radius**: \`${geometry.radii.cardPx}px\` (Cards, Modals, Panels)
- **Badge / Pill Radius**: \`${geometry.radii.pillPx}px\` (Status Badges, Filter Chips)

### AI Spatial Rules:
- Forbid arbitrary margins/paddings (e.g., \`p-[13px]\`). Snap strictly to 8pt/4pt tokens.
- Apply subtle 1px border strokes with inset highlights instead of heavy blurry drop-shadows.
`;
}
