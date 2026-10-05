import type { ColorToken, GeometrySpec, TypographySpec } from "../../types/tokens.ts";

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
      const hoverStr = c.hover ? ` (hover: \`${c.hover}\`)` : "";
      const targetStr = c.contrastTarget ? ` (${c.wcagRating}, ${c.contrastRatio || c.contrastAgainstCanvas}:1 ${c.contrastTarget})` : "";
      const usageStr = c.usageContext ? ` | ${c.usageContext}` : "";
      return `- \`--${c.name}\`: \`${c.hex}\`${hoverStr} // Role: ${c.role}${usageStr}${targetStr}`;
    })
    .join("\n");

  const spacingList = geometry.spacingRampPx.map((s) => `${s}px`).join(", ");

  // Dynamically condition rules strictly on tokens actually emitted in the matrix
  const tokenNames = new Set(colors.map((c) => c.name));
  const hasSurface = tokenNames.has("bg-surface");
  const hasCanvas = tokenNames.has("bg-canvas");
  const hasBorder = tokenNames.has("border") || tokenNames.has("keyline");

  const colorRules: string[] = [
    "- NEVER invent unmapped hex codes outside this locked palette.",
  ];

  if (hasCanvas) {
    colorRules.push("- Use `--bg-canvas` exclusively for root body background.");
  }

  if (hasSurface) {
    colorRules.push("- Use `--bg-surface` for elevated card containers, panels, and modals.");
  } else if (hasCanvas) {
    if (hasBorder) {
      colorRules.push("- When no distinct surface token is declared, card containers share `--bg-canvas` with subtle stroke borders.");
    } else {
      colorRules.push("- When no distinct surface token is declared, card containers share `--bg-canvas` (distinguish layers using layout spacing and subtle shadows).");
    }
  }

  if (tokenNames.has("accent-primary")) {
    colorRules.push("- Use `--accent-primary` exclusively for primary CTA buttons and active focus indicators.");
  }

  if (tokenNames.has("accent-secondary")) {
    colorRules.push("- Use `--accent-secondary` for secondary actions and interactive links.");
  }

  if (tokenNames.has("accent-danger")) {
    colorRules.push("- Use `--accent-danger` exclusively for destructive actions and error states.");
  }

  if (tokenNames.has("text-primary")) {
    colorRules.push("- Use `--text-primary` for high-contrast reading text, headings, and data labels.");
  }

  if (tokenNames.has("text-muted")) {
    colorRules.push("- Use `--text-muted` for secondary text, metadata, and timestamps.");
  }

  colorRules.push("- Forbid generic interchangeable accent usage: each accent has a locked semantic purpose.");

  return `# ${domain} — Production Design System & AI Guidelines
> Extracted from ${url} by Deslop.
> Drop this file into your workspace or reference in .cursorrules / CLAUDE.md to constrain generative frontend code.

---

## 1. Semantic Color Token Matrix
${colorRows}

### AI Color Rules:
${colorRules.join("\n")}

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
