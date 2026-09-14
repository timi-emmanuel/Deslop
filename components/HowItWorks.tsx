"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, CaretRight, Terminal, ArrowsClockwise } from "@phosphor-icons/react";

const WORKFLOW_STAGES = [
  {
    id: "ingest",
    step: "01",
    action: "SCAN ANY WEBSITE",
    title: "Inspect real screen colors, fonts & spacing",
    description:
      "Paste any live URL you love (Linear, Stripe, Raycast). Deslop looks at how the site actually renders on a screen—pulling out the exact colors, typography, and button dimensions.",
    codeSample: `// Step 01: Scan any live website you love
const site = await deslop.scan("https://linear.app");

console.log(site.colors); 
// ["#08090A", "#5E6AD2", "#F7F8F8"]
console.log(site.fonts);  
// "Geist Sans (Headings), Inter (Body)"
console.log(site.spacing);
// "8px neat layout grid [4, 8, 16, 24px]"`,
  },
  {
    id: "purge",
    step: "02",
    action: "PURGE AI SLOP",
    title: "Clean up messy duplicate colors & weird margins",
    description:
      "Most websites have 50 accidental messy hex colors and weird 13px padding hacks. Deslop tidies everything into 5 crisp brand colors and snaps spacing to neat 8px blocks.",
    codeSample: `// Step 02: Deslop purges the clutter & AI slop
const cleanTokens = deslop.purify({
  messyColorsFound: 84, // Too many messy variations!
  cleanedToTokens: 5,   // Canvas, surface, brand accent, text, border
  bannedAIHabits: [
    "No random purple gradients",
    "No 13px or 17px padding hacks",
    "No mismatched button roundness"
  ]
});`,
  },
  {
    id: "export",
    step: "03",
    action: "DROP INTO YOUR AI",
    title: "Paste 1 file into Cursor, Claude, Lovable, or v0",
    description:
      "Deslop gives you a clean design.md file. Drop it into your project or prompt, and your AI assistant will strictly build gorgeous, on-brand interfaces on the first try.",
    codeSample: `# design.md // Copy & paste into your AI project!

## Rules for Cursor, Claude, Lovable & v0:
1. Primary Button: bg-[#FF4800] text-white rounded-[6px]
2. Spacing: Always use clean 8px, 16px, or 24px (never 13px!)
3. Dark background: #08090A (matte dark, never generic purple)
4. Fonts: Geist Sans for titles, Inter for body text`,
  },
];

export function HowItWorks() {
  const [activeStage, setActiveStage] = useState(0);
  const current = WORKFLOW_STAGES[activeStage];

  return (
    <section id="how-it-works" className="py-24 border-b border-[#E2E4E9] bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14 pb-6 border-b border-[#E2E4E9]">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0A0D14]">
              Three steps from live site to locked tokens.
            </h2>
          </div>
          <p className="text-xs text-[#868C98]">
            From any live website to clean AI code in seconds
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
                  className={`text-left p-5 rounded-[8px] border transition-all ${
                    isActive
                      ? "border-[#FF4800] bg-[#FFF1EB] shadow-xs"
                      : "border-[#E2E4E9] bg-[#FAFAFA] hover:border-[#CDD0D5] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-mono text-xs font-semibold ${
                        isActive ? "text-[#FF4800]" : "text-[#868C98]"
                      }`}
                    >
                      Step {stage.step} — {stage.action}
                    </span>
                    {isActive ? (
                      <CheckCircle size={17} weight="fill" className="text-[#FF4800]" />
                    ) : (
                      <CaretRight size={14} className="text-[#868C98]" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-[#0A0D14]">{stage.title}</h3>
                  <p className="mt-1 text-xs text-[#525866] leading-relaxed">
                    {stage.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Code & Terminal Inspector */}
          <div className="lg:col-span-7 flex flex-col rounded-[8px] border border-[#E2E4E9] bg-[#0A0D14] text-white shadow-keyline overflow-hidden">
            {/* Terminal Top Chrome */}
            <div className="flex items-center justify-between border-b border-[#22252D] bg-[#12151D] px-4 py-3">
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
            <div className="p-5 sm:p-6 flex-1 font-mono text-xs overflow-x-auto text-[#E2E4E9] leading-relaxed">
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
              <span>CALIBRATED FOR CURSOR & CLAUDE</span>
              <span className="text-[#10B981]">READY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
