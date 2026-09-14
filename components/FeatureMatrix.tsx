"use client";

import { useState } from "react";
import {
  CursorClick,
  Palette,
  TextAa,
  Ruler,
  Intersect,
  FileCode,
  Check,
  Lightning,
} from "@phosphor-icons/react";

export function FeatureMatrix() {
  const [activeWeight, setActiveWeight] = useState(600);
  const [hoveredCardA, setHoveredCardA] = useState(false);
  const [hoveredCardB, setHoveredCardB] = useState(false);

  return (
    <section id="features" className="py-24 border-b border-[#E2E4E9] bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0A0D14]">
            Read any site like a design file.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#525866]">
            Deslop inspects the live DOM, captures exact computed CSS, and synthesizes clean, hallucination-free tokens for your AI tools.
          </p>
        </div>

        {/* 6-Card Interactive Mockup Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Element Inspector */}
          <div className="group rounded-[14px] border border-[#E2E4E9] bg-[#FAFAFA] p-4 flex flex-col justify-between shadow-xs hover:bg-white hover:border-[#CDD0D5] hover:shadow-keyline-elevated transition-all duration-300">
            <div>
              {/* Miniature Playground: Element Inspector */}
              <div className="relative h-[116px] w-full rounded-[10px] bg-[#F4F4F6] border border-[#E2E4E9] flex items-center justify-center overflow-hidden mb-4 group-hover:bg-[#FFF8F5] transition-colors">
                <div className="relative">
                  {/* Floating Measurement Tag */}
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-[#0A0D14] px-1.5 py-0.5 font-mono text-[10px] font-medium text-white shadow-sm flex items-center gap-1">
                    <span>button · 168 × 38</span>
                  </span>

                  {/* Sample Inspected Button */}
                  <button
                    type="button"
                    className="flex h-9 w-[164px] items-center justify-center rounded-full border-2 border-[#FF4800] bg-[#FFF1EB] text-[12px] font-semibold text-[#FF4800] shadow-xs cursor-default"
                  >
                    inspect element
                  </button>

                  {/* Animated SVG Cursor */}
                  <div className="absolute -bottom-2 -right-4 transition-transform duration-500 ease-out group-hover:translate-x-[-12px] group-hover:translate-y-[-8px]">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="drop-shadow-md text-[#0A0D14]"
                    >
                      <path
                        d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
                        fill="#0A0D14"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <CursorClick size={18} weight="bold" className="text-[#FF4800]" />
                <h3 className="text-base font-bold text-[#0A0D14] tracking-tight">
                  Inspect any element
                </h3>
              </div>
              <p className="text-xs text-[#525866] leading-relaxed">
                Hover to measure bounds, click to pull exact computed CSS styles, line heights, and hover states. Real values, not guesses.
              </p>
            </div>
          </div>

          {/* Card 2: Colors & Contrast */}
          <div className="group rounded-[14px] border border-[#E2E4E9] bg-[#FAFAFA] p-4 flex flex-col justify-between shadow-xs hover:bg-white hover:border-[#CDD0D5] hover:shadow-keyline-elevated transition-all duration-300">
            <div>
              {/* Miniature Playground: Swatches & WCAG Badge */}
              <div className="relative h-[116px] w-full rounded-[10px] bg-[#F4F4F6] border border-[#E2E4E9] flex flex-col items-center justify-center p-3 overflow-hidden mb-4 group-hover:bg-white transition-colors">
                <div className="w-full flex gap-1.5 mb-2.5">
                  <span className="h-7 flex-1 rounded-[5px] bg-[#FF4800] border border-black/10 shadow-xs" />
                  <span className="h-7 flex-1 rounded-[5px] bg-[#0A0D14] border border-black/10 shadow-xs" />
                  <span className="h-7 flex-1 rounded-[5px] bg-[#525866] border border-black/10 shadow-xs" />
                  <span className="h-7 flex-1 rounded-[5px] bg-[#E2E4E9] border border-black/10 shadow-xs" />
                </div>
                <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-[#525866]">
                  <span className="font-semibold text-[#0A0D14]">#FF4800 on #0A0D14</span>
                  <span className="rounded-full bg-[#059669] px-2 py-0.5 text-white font-bold text-[9px]">
                    12.4 AAA
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <Palette size={18} weight="bold" className="text-[#FF4800]" />
                <h3 className="text-base font-bold text-[#0A0D14] tracking-tight">
                  Colors & Contrast Ramps
                </h3>
              </div>
              <p className="text-xs text-[#525866] leading-relaxed">
                Extracts every hex, rgba, and CSS variable. Groups redundant noise into a unified 11-shade tonal scale with inline WCAG scores.
              </p>
            </div>
          </div>

          {/* Card 3: Typography & Scale */}
          <div className="group rounded-[14px] border border-[#E2E4E9] bg-[#FAFAFA] p-4 flex flex-col justify-between shadow-xs hover:bg-white hover:border-[#CDD0D5] hover:shadow-keyline-elevated transition-all duration-300">
            <div>
              {/* Miniature Playground: Typography Scale */}
              <div className="relative h-[116px] w-full rounded-[10px] bg-[#F4F4F6] border border-[#E2E4E9] flex flex-col items-center justify-center p-3 overflow-hidden mb-4 group-hover:bg-white transition-colors">
                <div className="flex items-baseline justify-center gap-6 mb-2">
                  <span className="flex flex-col items-center leading-none">
                    <span className="text-[32px] font-bold text-[#0A0D14]" style={{ fontWeight: activeWeight }}>
                      Aa
                    </span>
                    <span className="font-mono text-[9px] text-[#868C98]">48px</span>
                  </span>
                  <span className="flex flex-col items-center leading-none">
                    <span className="text-[20px] font-bold text-[#0A0D14]" style={{ fontWeight: activeWeight }}>
                      Aa
                    </span>
                    <span className="font-mono text-[9px] text-[#868C98]">20px</span>
                  </span>
                  <span className="flex flex-col items-center leading-none">
                    <span className="text-[14px] font-bold text-[#0A0D14]" style={{ fontWeight: activeWeight }}>
                      Aa
                    </span>
                    <span className="font-mono text-[9px] text-[#868C98]">14px</span>
                  </span>
                </div>
                {/* Font Weight Selector */}
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#868C98]">
                  <span className="font-sans font-bold text-[#0A0D14]">Inter</span>
                  <span>·</span>
                  {[400, 500, 600, 700].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setActiveWeight(w)}
                      className={`px-1 py-0.5 rounded cursor-pointer transition-colors ${
                        activeWeight === w
                          ? "bg-[#0A0D14] text-white font-bold"
                          : "hover:text-[#0A0D14]"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <TextAa size={18} weight="bold" className="text-[#FF4800]" />
                <h3 className="text-base font-bold text-[#0A0D14] tracking-tight">
                  Typography & Font Stacks
                </h3>
              </div>
              <p className="text-xs text-[#525866] leading-relaxed">
                Discovers rendered font families, active weights, modular scale multipliers, optical line-heights, and tight letter-spacing.
              </p>
            </div>
          </div>

          {/* Card 4: 8pt Spatial Rhythm */}
          <div className="group rounded-[14px] border border-[#E2E4E9] bg-[#FAFAFA] p-4 flex flex-col justify-between shadow-xs hover:bg-white hover:border-[#CDD0D5] hover:shadow-keyline-elevated transition-all duration-300">
            <div>
              {/* Miniature Playground: Box Model Diagram */}
              <div className="relative h-[116px] w-full rounded-[10px] bg-[#F4F4F6] border border-[#E2E4E9] flex items-center justify-center p-2 overflow-hidden mb-4 group-hover:bg-white transition-colors">
                <div className="w-[85%] rounded-[6px] border border-dashed border-[#FF4800]/50 bg-[#FFF1EB]/60 p-2 text-center">
                  <span className="block font-mono text-[9px] font-bold text-[#FF4800] uppercase mb-1">
                    padding: 16px (2rem)
                  </span>
                  <div className="rounded-[4px] bg-white border border-[#E2E4E9] py-1.5 shadow-xs">
                    <span className="font-mono text-[10px] font-bold text-[#0A0D14]">
                      gap: 8px · 8pt Grid
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <Ruler size={18} weight="bold" className="text-[#FF4800]" />
                <h3 className="text-base font-bold text-[#0A0D14] tracking-tight">
                  8pt Spatial Rhythm
                </h3>
              </div>
              <p className="text-xs text-[#525866] leading-relaxed">
                Snaps unaligned 13px, 17px, and 23px margins into an authoritative 8pt modular grid (4px, 8px, 12px, 16px, 24px, 32px).
              </p>
            </div>
          </div>

          {/* Card 5: Component Geometry & Tokens */}
          <div className="group rounded-[14px] border border-[#E2E4E9] bg-[#FAFAFA] p-4 flex flex-col justify-between shadow-xs hover:bg-white hover:border-[#CDD0D5] hover:shadow-keyline-elevated transition-all duration-300">
            <div>
              {/* Miniature Playground: Live Token Panel */}
              <div className="relative h-[116px] w-full rounded-[10px] bg-[#F4F4F6] border border-[#E2E4E9] flex flex-col justify-center px-4 py-2 font-mono text-[10px] leading-tight overflow-hidden mb-4 group-hover:bg-white transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#FF4800] font-semibold">--color-accent</span>
                    <span className="flex items-center gap-1.5 text-[#525866]">
                      <span className="h-2 w-2 rounded-full bg-[#FF4800]" />
                      #FF4800
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#FF4800] font-semibold">--radius-card</span>
                    <span className="text-[#525866]">8px</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#FF4800] font-semibold">--shadow-depth</span>
                    <span className="text-[#525866]">0 1px 3px</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#FF4800] font-semibold">--font-body</span>
                    <span className="text-[#525866]">Inter, sans-serif</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <Intersect size={18} weight="bold" className="text-[#FF4800]" />
                <h3 className="text-base font-bold text-[#0A0D14] tracking-tight">
                  Radii, Shadows & Elevation
                </h3>
              </div>
              <p className="text-xs text-[#525866] leading-relaxed">
                Measures corner radius curves and multi-layer elevation box-shadows, compiling them into clean, standardized design tokens.
              </p>
            </div>
          </div>

          {/* Card 6: DESIGN.md for AI */}
          <div className="group rounded-[14px] border border-[#E2E4E9] bg-[#FAFAFA] p-4 flex flex-col justify-between shadow-xs hover:bg-white hover:border-[#CDD0D5] hover:shadow-keyline-elevated transition-all duration-300">
            <div>
              {/* Miniature Playground: DESIGN.md Window */}
              <div className="relative h-[116px] w-full rounded-[10px] bg-[#0A0D14] border border-black/20 flex flex-col overflow-hidden mb-4 text-[10px] font-mono shadow-inner">
                {/* Window Header */}
                <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-1.5 bg-[#161922] text-[#868C98]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF4800]" />
                  <span className="text-white font-semibold text-[9px]">DESIGN.md</span>
                  <span className="ml-auto text-[9px] text-[#A7F3D0] bg-[#064E3B] px-1.5 rounded">
                    Cursor / Claude
                  </span>
                </div>
                {/* Code Lines */}
                <div className="p-2.5 text-white/70 leading-relaxed text-[9px]">
                  <div className="text-[#FF7B47] font-bold">## Primary Tokens</div>
                  <div>- brand: #FF4800</div>
                  <div>- font: Inter (Modular 1.25)</div>
                  <div className="text-[#A7F3D0] font-bold mt-1">## Negative Prompt</div>
                  <div className="text-white/40">DO NOT use arbitrary colors</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <FileCode size={18} weight="bold" className="text-[#FF4800]" />
                <h3 className="text-base font-bold text-[#0A0D14] tracking-tight">
                  DESIGN.md for Your AI
                </h3>
              </div>
              <p className="text-xs text-[#525866] leading-relaxed">
                A structured Markdown specification your coding agent can build from—instead of vague screenshots it can&apos;t reliably inspect.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================
            THE 3D FAN-OUT SHOWCASE CARDS (Signature Woblo Polish)
            Two wide cards that fan out on hover!
            ============================================================ */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Fan-Out Card 1: Everything Deslop Reads */}
          <div
            onMouseEnter={() => setHoveredCardA(true)}
            onMouseLeave={() => setHoveredCardA(false)}
            className="group relative rounded-[16px] border border-[#E2E4E9] bg-[#FAFAFA] p-6 overflow-hidden shadow-xs hover:bg-white hover:border-[#CDD0D5] hover:shadow-keyline-elevated transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative z-10">
              <span className="font-mono text-[10px] font-bold text-[#868C98] uppercase">
                DOM AST HARVESTER · HOVER TO EXPAND
              </span>
              <h3 className="text-xl font-bold text-[#0A0D14] tracking-tight mt-1">
                Everything it reads
              </h3>
              <p className="text-xs text-[#525866] mt-1 max-w-md">
                Colors, typography, spacing, shadows, and radii, pulled straight off the live rendered DOM.
              </p>
            </div>

            {/* The Fanned Out Layer Deck */}
            <div className="relative h-[160px] w-full flex items-center justify-center mt-6">
              {[
                { label: "Colors & Fills", bg: "#FF4800", text: "#FFFFFF", rot: -14, offset: -80 },
                { label: "Font Stacks", bg: "#0A0D14", text: "#FFFFFF", rot: -9, offset: -45 },
                { label: "8pt Spatial Grid", bg: "#525866", text: "#FFFFFF", rot: -4, offset: -15 },
                { label: "Border Radii", bg: "#E2E4E9", text: "#0A0D14", rot: 2, offset: 15 },
                { label: "Elevation Shadows", bg: "#FFF1EB", text: "#FF4800", rot: 8, offset: 48 },
                { label: "CSS Variables", bg: "#10B981", text: "#FFFFFF", rot: 14, offset: 80 },
              ].map((item, idx) => {
                const spreadRot = hoveredCardA ? item.rot * 1.6 : item.rot;
                const spreadOffset = hoveredCardA ? item.offset * 1.5 : item.offset;
                return (
                  <div
                    key={item.label}
                    className="absolute h-24 w-36 rounded-[10px] p-2.5 flex flex-col justify-between shadow-md border border-black/10 transition-all duration-500 ease-out"
                    style={{
                      backgroundColor: item.bg,
                      color: item.text,
                      transform: `translateX(${spreadOffset}px) rotate(${spreadRot}deg) translateY(${hoveredCardA ? -8 : 0}px)`,
                      zIndex: idx + 1,
                    }}
                  >
                    <span className="font-mono text-[9px] font-bold uppercase opacity-80">
                      TOKEN
                    </span>
                    <span className="text-xs font-bold leading-tight">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fan-Out Card 2: Everywhere Deslop Exports */}
          <div
            onMouseEnter={() => setHoveredCardB(true)}
            onMouseLeave={() => setHoveredCardB(false)}
            className="group relative rounded-[16px] border border-[#E2E4E9] bg-[#FAFAFA] p-6 overflow-hidden shadow-xs hover:bg-white hover:border-[#CDD0D5] hover:shadow-keyline-elevated transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative z-10">
              <span className="font-mono text-[10px] font-bold text-[#868C98] uppercase">
                EXPORT PIPELINE · HOVER TO EXPAND
              </span>
              <h3 className="text-xl font-bold text-[#0A0D14] tracking-tight mt-1">
                Everywhere it exports
              </h3>
              <p className="text-xs text-[#525866] mt-1 max-w-md">
                Production-ready code tokens and AI specifications configured for your modern workflow.
              </p>
            </div>

            {/* The Fanned Out Export Badges */}
            <div className="relative h-[160px] w-full flex items-center justify-center mt-6">
              {[
                { label: "Tailwind v4", bg: "#38BDF8", text: "#0A0D14", rot: -15, offset: -90 },
                { label: "shadcn/ui", bg: "#4F46E5", text: "#FFFFFF", rot: -10, offset: -55 },
                { label: "DESIGN.md", bg: "#FF4800", text: "#FFFFFF", rot: -4, offset: -20 },
                { label: ".cursorrules", bg: "#0A0D14", text: "#FFFFFF", rot: 2, offset: 15 },
                { label: "CSS vars", bg: "#10B981", text: "#FFFFFF", rot: 8, offset: 50 },
                { label: "DTCG JSON", bg: "#F59E0B", text: "#0A0D14", rot: 15, offset: 88 },
              ].map((pill, idx) => {
                const spreadRot = hoveredCardB ? pill.rot * 1.5 : pill.rot;
                const spreadOffset = hoveredCardB ? pill.offset * 1.5 : pill.offset;
                return (
                  <div
                    key={pill.label}
                    className="absolute whitespace-nowrap rounded-full px-3.5 py-1.5 font-mono text-xs font-bold shadow-md transition-all duration-500 ease-out"
                    style={{
                      backgroundColor: pill.bg,
                      color: pill.text,
                      transform: `translateX(${spreadOffset}px) rotate(${spreadRot}deg) translateY(${hoveredCardB ? -6 : 0}px)`,
                      zIndex: idx + 1,
                    }}
                  >
                    {pill.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
