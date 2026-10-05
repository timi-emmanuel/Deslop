import { generateDesignMarkdown } from "../lib/exporters/design-md.ts";

const markdown = generateDesignMarkdown({
  domain: "istosagent.com",
  url: "https://istosagent.com/",
  colors: [
    {
      id: "1",
      name: "bg-canvas",
      hex: "#F4F4F2",
      role: "canvas",
      contrastAgainstCanvas: 1,
      contrastTarget: "vs canvas",
      wcagRating: "BASE",
      frequencyPercentage: 50,
      usageContext: "Base Page Canvas",
    },
    {
      id: "2",
      name: "text-primary",
      hex: "#171717",
      role: "text-primary",
      contrastAgainstCanvas: 16.28,
      contrastTarget: "vs canvas",
      wcagRating: "AAA",
      frequencyPercentage: 25,
      usageContext: "Primary Reading Text",
    },
    {
      id: "3",
      name: "accent-primary",
      hex: "#DCDBD6",
      role: "accent-primary",
      contrastAgainstCanvas: 1.15,
      contrastRatio: 15.15,
      contrastTarget: "vs #000000 text",
      wcagRating: "AAA",
      frequencyPercentage: 15,
      usageContext: "Primary CTA Button",
    },
    {
      id: "4",
      name: "accent-secondary",
      hex: "#B2B1AB",
      role: "accent-secondary",
      contrastAgainstCanvas: 1.95,
      contrastRatio: 1.95,
      contrastTarget: "vs canvas",
      wcagRating: "FAIL",
      frequencyPercentage: 10,
      usageContext: "Secondary Action / Link",
    },
  ],
  typography: {
    displayFamily: "Schibsted Grotesk",
    bodyFamily: "Schibsted Grotesk",
    monoFamily: "ui-monospace, monospace",
    scaleName: "Major Second",
    scaleRatio: 1.125,
    steps: [],
  },
  geometry: {
    baseGridPx: 8,
    spacingRampPx: [4, 8, 12, 16, 24, 32, 48, 64],
    radii: { controlPx: 6, cardPx: 8, pillPx: 9999 },
    shadows: { subtle: "none", elevated: "none", keyline: "none" },
  },
});

console.log("==========================================");
console.log("GENERATED DESIGN.MD FOR ISTOSAGENT.COM:");
console.log("==========================================");
console.log(markdown);

// VALIDATION: Check that EVERY token name referenced in AI Color Rules exists in the matrix
const rulesMatch = markdown.match(/### AI Color Rules:\n([\s\S]*?)(?=\n---)/);
if (rulesMatch) {
  const rulesSection = rulesMatch[1];
  const referencedTokens = [...rulesSection.matchAll(/`(--[\w-]+)`/g)].map((m) => m[1]);
  const declaredTokens = ["--bg-canvas", "--text-primary", "--accent-primary", "--accent-secondary"];

  console.log("Referenced tokens in rules:", referencedTokens);
  for (const token of referencedTokens) {
    if (!declaredTokens.includes(token)) {
      console.error(`FAIL: Dangling undeclared token referenced: ${token}`);
      process.exit(1);
    }
  }
  console.log("✓ All referenced tokens are 100% declared in the matrix! Zero dangling references.");
}
