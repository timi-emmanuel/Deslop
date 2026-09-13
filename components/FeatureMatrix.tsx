"use client";

import {
  SlidersHorizontal,
  GitDiff,
  ShieldCheck,
  Cpu,
  CheckCircle,
  Eye,
} from "@phosphor-icons/react";

export function FeatureMatrix() {
  return (
    <section id="features" className="py-20 border-b border-[#E2E4E9] bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-6 border-b border-[#E2E4E9]">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#FF4800]">
              <Cpu size={15} weight="bold" />
              <span>TECHNICAL SPECIFICATION</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0A0D14]">
              Engineered to terminate AI visual drift.
            </h2>
          </div>
          <p className="text-xs font-mono text-[#868C98]">
            CORE_COMPONENTS // RUNTIME_SECURITY
          </p>
        </div>

        {/* Technical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: 2-Cols Wide */}
          <div className="md:col-span-2 rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-6 flex flex-col justify-between shadow-keyline">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#FFF1EB] text-[#FF4800] border border-[#FFD6C7]">
                  <SlidersHorizontal size={18} weight="bold" />
                </div>
                <span className="font-mono text-[11px] font-bold text-[#868C98] uppercase">
                  SPEC_01 // RUNTIME EXTRACTION
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#0A0D14] tracking-tight">
                Computed DOM extraction, not minified source guessing
              </h3>
              <p className="mt-2 text-xs text-[#525866] max-w-xl leading-relaxed">
                Standard parsers choke on obfuscated Tailwind class hashes and CSS-in-JS runtimes. Deslop mounts a headless browser instance, interrogating the active render tree for true computed font metrics, optical line-heights, and physical bounding boxes.
              </p>
            </div>

            {/* Spec Matrix Table */}
            <div className="mt-6 rounded-[4px] border border-[#E2E4E9] bg-white p-3 font-mono text-xs shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E4E9] text-[10px] text-[#868C98]">
                <span>INSPECTED PROPERTY</span>
                <span>DESLOP CALIBRATION</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2 rounded bg-[#FAFAFA] border border-[#E2E4E9]">
                  <span className="text-[10px] text-[#868C98] block">Border Radius</span>
                  <span className="text-[#0A0D14] font-bold text-xs">6px / 8px uniform</span>
                </div>
                <div className="p-2 rounded bg-[#FAFAFA] border border-[#E2E4E9]">
                  <span className="text-[10px] text-[#868C98] block">Spatial Rhythm</span>
                  <span className="text-[#0A0D14] font-bold text-xs">8pt Modular Baseline</span>
                </div>
                <div className="p-2 rounded bg-[#FAFAFA] border border-[#E2E4E9]">
                  <span className="text-[10px] text-[#868C98] block">Tracking Ratio</span>
                  <span className="text-[#0A0D14] font-bold text-xs">-0.035em tight</span>
                </div>
                <div className="p-2 rounded bg-[#FAFAFA] border border-[#E2E4E9]">
                  <span className="text-[10px] text-[#868C98] block">WCAG Contrast</span>
                  <span className="text-[#059669] font-bold text-xs">14.2:1 (AAA Pass)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 1-Col Wide */}
          <div className="rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-6 flex flex-col justify-between shadow-keyline">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#FFF1EB] text-[#FF4800] border border-[#FFD6C7]">
                  <ShieldCheck size={18} weight="bold" />
                </div>
                <span className="font-mono text-[11px] font-bold text-[#868C98] uppercase">
                  SPEC_02 // AGENT ENFORCEMENT
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#0A0D14] tracking-tight">
                Hard rules for Cursor & Claude
              </h3>
              <p className="mt-2 text-xs text-[#525866] leading-relaxed">
                We generate declarative markdown instructions that force LLMs to reject hallucinated colors, arbitrary paddings, and bloated divs during code generation.
              </p>
            </div>

            <div className="mt-6 rounded-[4px] border border-[#E2E4E9] bg-[#0A0D14] p-3 font-mono text-[11px] text-[#3ECF8E]">
              <span className="text-[#868C98] block pb-1">// .cursorrules</span>
              <span>rule.forbidArbitraryColors = true;</span>
              <span className="block text-[#E2E4E9]">tokens.enforce(8pt_grid);</span>
            </div>
          </div>

          {/* Card 3: 1-Col Wide */}
          <div className="rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-6 flex flex-col justify-between shadow-keyline">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#FFF1EB] text-[#FF4800] border border-[#FFD6C7]">
                  <GitDiff size={18} weight="bold" />
                </div>
                <span className="font-mono text-[11px] font-bold text-[#868C98] uppercase">
                  SPEC_03 // VISUAL DRIFT DIFF
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#0A0D14] tracking-tight">
                Automated regression detection
              </h3>
              <p className="mt-2 text-xs text-[#525866] leading-relaxed">
                Compare your component changes against your golden design tokens before pushing code to production.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-[4px] border border-[#E2E4E9] bg-white p-3 font-mono text-xs">
              <span className="text-[#525866]">DRIFT STATUS:</span>
              <span className="font-bold text-[#059669]">0% REGRESSION</span>
            </div>
          </div>

          {/* Card 4: 2-Cols Wide */}
          <div className="md:col-span-2 rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-6 flex flex-col justify-between shadow-keyline">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#FFF1EB] text-[#FF4800] border border-[#FFD6C7]">
                  <Eye size={18} weight="bold" />
                </div>
                <span className="font-mono text-[11px] font-bold text-[#868C98] uppercase">
                  SPEC_04 // COLOR HARMONIZATION
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#0A0D14] tracking-tight">
                OKLCH wide-gamut perceptual color clustering
              </h3>
              <p className="mt-2 text-xs text-[#525866] max-w-xl leading-relaxed">
                Raw sites often have 12 slightly different shades of grey (`#111827`, `#0F172A`, `#18181B`). Deslop collapses them into a mathematically harmonious 50–950 tonal scale in OKLCH perceptual space.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { step: "50", hex: "#F9FAFB" },
                { step: "100", hex: "#F3F4F6" },
                { step: "200", hex: "#E5E7EB" },
                { step: "300", hex: "#D1D5DB" },
                { step: "400", hex: "#9CA3AF" },
                { step: "500", hex: "#6B7280" },
                { step: "600", hex: "#4B5563" },
                { step: "700", hex: "#374151" },
                { step: "800", hex: "#1F2937" },
                { step: "900", hex: "#111827" },
                { step: "950", hex: "#030712" },
              ].map((c) => (
                <div key={c.step} className="flex-1 min-w-[40px] text-center font-mono text-[9px]">
                  <div
                    className="h-8 rounded-[3px] border border-black/10 mb-1"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[#868C98]">{c.step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
