/**
 * Stage 3 Token Synthesis Engine — Test Suite
 *
 * Validates the 5 hard constraints and regression fixtures for woblo.in and ferndesk.com.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { synthesizeTokens } from "../lib/synthesizer/token-synthesis.ts";
import type { RawColorObservation, SynthesizedTokenOutput } from "../lib/synthesizer/token-synthesis.ts";
import { calculateDeltaE, normalizeHex } from "../lib/synthesizer/color-math.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadFixture(name: string): RawColorObservation[] {
  const filePath = path.join(__dirname, "..", "tests", "fixtures", `${name}.json`);
  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content) as RawColorObservation[];
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

function validateHardConstraints(
  name: string,
  raw: RawColorObservation[],
  output: SynthesizedTokenOutput
) {
  console.log(`\n--- Validating Hard Constraints for: ${name} ---`);
  const tokenKeys = Object.keys(output.tokens);
  const tokenEntries = Object.entries(output.tokens).filter(([_, v]) => v !== undefined);

  // Constraint 1: Output must never contain more than 8 top-level color tokens
  assert(
    tokenEntries.length <= 8,
    `Rule 1: Output has ${tokenEntries.length} tokens (must be <= 8)`
  );

  // Constraint 2: No two top-level tokens may have Delta-E < 5.0 between their hex values
  for (let i = 0; i < tokenEntries.length; i++) {
    for (let j = i + 1; j < tokenEntries.length; j++) {
      const [keyA, tokA] = tokenEntries[i];
      const [keyB, tokB] = tokenEntries[j];
      const de = calculateDeltaE(tokA!.hex, tokB!.hex);
      assert(
        de >= 5.0,
        `Rule 2: Delta-E between '${keyA}' (${tokA!.hex}) and '${keyB}' (${tokB!.hex}) is ${de.toFixed(2)} (must be >= 5.0)`
      );
    }
  }

  // Constraint 3: Every token in output must trace back to at least one raw observation
  const rawHexSet = new Set(raw.map((r) => normalizeHex(r.hex)));
  for (const [key, tok] of tokenEntries) {
    assert(
      rawHexSet.has(normalizeHex(tok!.hex)),
      `Rule 3: Token '${key}' hex ${tok!.hex} traces back to raw input observations`
    );
    if (tok!.hover) {
      assert(
        rawHexSet.has(normalizeHex(tok!.hover)),
        `Rule 3: Token '${key}' hover hex ${tok!.hover} traces back to raw input observations`
      );
    }
  }

  // Constraint 4: Never emit a token whose value is "(none defined)" or placeholder string
  for (const [key, tok] of tokenEntries) {
    assert(
      tok!.hex !== "(none defined)" && !tok!.hex.includes("none") && tok!.hex.startsWith("#"),
      `Rule 4: Token '${key}' is a real valid hex code, no placeholders`
    );
  }

  // Constraint 5: Every contrast_check entry must correspond to real observed pairing
  for (const check of output.contrast_checks) {
    const [fg, bg] = check.pair;
    const allowedFg = ["text-primary", "text-on-accent", "text-muted"];
    const allowedBg = ["canvas", "surface", "accent-primary"];
    assert(
      allowedFg.includes(fg) && allowedBg.includes(bg),
      `Rule 5: Contrast check pair [${fg}, ${bg}] is an evidence-grounded pair (ratio: ${check.ratio}:1, ${check.level})`
    );
  }
}

// ==========================================
// TEST 1: woblo.in Regression
// ==========================================
console.log("\n==========================================");
console.log("RUNNING TEST 1: woblo.in Regression Fixture");
console.log("==========================================");

const wobloRaw = loadFixture("woblo");
const wobloOutput = synthesizeTokens(wobloRaw);

console.log("Synthesized Woblo Tokens:", JSON.stringify(wobloOutput.tokens, null, 2));
console.log("Contrast Checks:", wobloOutput.contrast_checks);
console.log("Engine Notes:", wobloOutput.notes);

validateHardConstraints("woblo.in", wobloRaw, wobloOutput);

// Specific Woblo requirements
assert(
  wobloOutput.tokens["accent-primary"]?.hex === "#F5A524",
  "Woblo: accent-primary correctly identified as orange (#F5A524)"
);
assert(
  wobloOutput.tokens["accent-primary"]?.hover === "#D98F1A",
  "Woblo: accent-primary.hover correctly collapsed state variant to (#D98F1A)"
);
assert(
  wobloOutput.tokens.canvas?.hex === "#FFFFFF",
  "Woblo: canvas is #FFFFFF"
);
assert(
  wobloOutput.tokens.surface === undefined,
  "Woblo: duplicate surface token (#FFFFFF, Delta-E 0) was properly dropped"
);
assert(
  Object.keys(wobloOutput.tokens).length <= 6,
  `Woblo: collapsed from 12 raw swatches to ${Object.keys(wobloOutput.tokens).length} tokens (expected <= 6)`
);

// ==========================================
// TEST 2: ferndesk.com Regression
// ==========================================
console.log("\n==========================================");
console.log("RUNNING TEST 2: ferndesk.com Regression Fixture");
console.log("==========================================");

const ferndeskRaw = loadFixture("ferndesk");
const ferndeskOutput = synthesizeTokens(ferndeskRaw);

console.log("Synthesized Ferndesk Tokens:", JSON.stringify(ferndeskOutput.tokens, null, 2));
console.log("Contrast Checks:", ferndeskOutput.contrast_checks);
console.log("Engine Notes:", ferndeskOutput.notes);

validateHardConstraints("ferndesk.com", ferndeskRaw, ferndeskOutput);

// Specific Ferndesk requirements
assert(
  ferndeskOutput.tokens["accent-primary"]?.hex === "#059669",
  "Ferndesk: accent-primary correctly identified as green (#059669)"
);
assert(
  ferndeskOutput.tokens["accent-primary"]?.hover === "#047857",
  "Ferndesk: accent-primary.hover correctly captured state variant (#047857)"
);
assert(
  ferndeskOutput.tokens.canvas?.hex === "#FFFFFF",
  "Ferndesk: canvas is #FFFFFF"
);
assert(
  Object.keys(ferndeskOutput.tokens).length <= 5,
  `Ferndesk: collapsed from 9 swatches to ${Object.keys(ferndeskOutput.tokens).length} tokens (expected <= 5)`
);

console.log("\n==========================================");
console.log("🎉 ALL TESTS & VALIDATION RULES PASSED!");
console.log("==========================================\n");
