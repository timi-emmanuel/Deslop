"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, CaretRight, Terminal, ArrowsClockwise } from "@phosphor-icons/react";

const WORKFLOW_STAGES = [
  {
    id: "ingest",
    step: "01",
    action: "DOM SCAN & AST INGESTION",
    title: "Inspect live computed styles and layout trees",
    description:
      "Deslop crawls rendered websites, evaluates live computed CSS variables, measures bounding-box geometry, and detects real runtime font stacks instead of guessing from unrendered source files.",
    codeSample: `// Stage 01: Live Computed Stylesheet Extraction
const computed = window.getComputedStyle(document.body);
const extractionReport = {
  canvasBackground: computed.backgroundColor, // "rgb(10, 13, 20)"
  activeAccent: computed.getPropertyValue("--color-primary"), // "#FF4800"
  detectedFontStack: computed.fontFamily, // "Plus Jakarta Sans, sans-serif"
  typographyRamp: [12, 14, 16, 20, 24, 32, 48, 64]
};`,
  },
  {
    id: "purge",
    step: "02",
    action: "PURGE SLOP & CALIBRATE",
    title: "Deduplicate unmapped hex codes into strict token ramps",
    description:
      "Modern websites often suffer from 40+ accidental hex codes and random 13px padding hacks. Deslop clusters near-identical colors into a disciplined semantic scale and enforces strict 8pt modular geometry.",
    codeSample: `// Stage 02: Semantic Normalization & Grid Enforcement
const desloppedSystem = deslop.calibrate({
  rawColorsScanned: 84,
  prunedToTokens: 12, // Canvas, Surface, Keyline, Locked Accent
  contrastVerification: "WCAG AAA Verified (Contrast Ratio: 7.8:1)",
  modularSpacing: "8pt strict baseline [4, 8, 16, 24, 32, 48, 64]",
  cornerGeometry: { button: "6px", card: "8px", modal: "12px" }
});`,
  },
  {
    id: "export",
    step: "03",
    action: "OUTPUT PRODUCTION DESIGN.MD",
    title: "Generate hardened markdown rules for AI workflows",
    description:
      "Deslop generates a clean, authoritative design.md ready for .cursorrules, Claude Code, or v0 system prompts. Your AI assistants will strictly adhere to your design system without hallucinating slop.",
    codeSample: `# design.md // Production Constraint File
## AI Generation Rules
- NEVER invent unmapped hex codes outside the locked palette
- Primary Button: bg-[#FF4800] text-white rounded-[6px] shadow-sm
- Spacing: Strictly use 8pt scale (p-2, p-4, p-6, p-8)
- Headings: font-extrabold tracking-[-0.035em] text-[#0A0D14]`,
  },
];

export function HowItWorks() {
  const [activeStage, setActiveStage] = useState(0);
  const current = WORKFLOW_STAGES[activeStage];

  return (
    <section id="how-it-works" className="py-20 border-b border-[#E2E4E9] bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-6 border-b border-[#E2E4E9]">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#FF4800]">
              <ArrowsClockwise size={15} weight="bold" />
              <span>INSPECTION PIPELINE</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0A0D14]">
              How Deslop purges frontend slop in 3 steps.
            </h2>
          </div>
          <p className="text-xs font-mono text-[#868C98]">
            PROTOCOL_VERSION: 2.4 // FULL_AUTOMATION
          </p>
        </div>

        {/* 3 Step Interactive Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stage Buttons */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {WORKFLOW_STAGES.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(idx)}
                  className={`text-left p-4 rounded-[6px] border transition-all ${
                    isActive
                      ? "border-[#FF4800] bg-[#FFF1EB] shadow-sm"
                      : "border-[#E2E4E9] bg-[#FAFAFA] hover:border-[#CDD0D5] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-mono text-xs font-bold ${
                        isActive ? "text-[#FF4800]" : "text-[#868C98]"
                      }`}
                    >
                      [{stage.step} // {stage.action}]
                    </span>
                    {isActive ? (
                      <CheckCircle size={16} weight="fill" className="text-[#FF4800]" />
                    ) : (
                      <CaretRight size={14} className="text-[#868C98]" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-[#0A0D14]">{stage.title}</h3>
                  <p className="mt-1 text-xs text-[#525866] line-clamp-2 leading-relaxed">
                    {stage.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Code & Terminal Inspector */}
          <div className="lg:col-span-7 flex flex-col rounded-[6px] border border-[#E2E4E9] bg-[#0A0D14] text-white shadow-keyline overflow-hidden">
            {/* Terminal Top Chrome */}
            <div className="flex items-center justify-between border-b border-[#22252D] bg-[#12151D] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-[#FF4800]" />
                <span className="font-mono text-[11px] text-[#A1A7B3]">
                  pipeline_stage_{current.step}.ts
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#EF4444]/80" />
                <span className="h-2 w-2 rounded-full bg-[#F59E0B]/80" />
                <span className="h-2 w-2 rounded-full bg-[#10B981]/80" />
              </div>
            </div>

            {/* Code Output */}
            <div className="p-4 sm:p-6 flex-1 font-mono text-xs overflow-x-auto text-[#E2E4E9] leading-relaxed">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={current.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  {current.codeSample}
                </motion.pre>
              </AnimatePresence>
            </div>

            {/* Terminal Footer */}
            <div className="border-t border-[#22252D] bg-[#12151D] px-4 py-2 flex items-center justify-between font-mono text-[10px] text-[#868C98]">
              <span>STATUS: READY</span>
              <span>SYNTHESIZED IN 42ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
