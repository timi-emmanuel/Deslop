"use client";

import { useState } from "react";
import {
  Palette,
  TextAa,
  Ruler,
  Code,
  Copy,
  CheckCircle,
  FileCode,
} from "@phosphor-icons/react";
import { ExtractedDesignSystem } from "@/types/tokens";

interface TokenTabsProps {
  system: ExtractedDesignSystem;
}

export function TokenTabs({ system }: TokenTabsProps) {
  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "geometry" | "markdown" | "tailwind">("colors");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="rounded-[8px] border border-[#E2E4E9] bg-white shadow-keyline overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-[#E2E4E9] bg-[#FAFAFA] px-4 py-2 overflow-x-auto">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("colors")}
            className={`flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              activeTab === "colors"
                ? "bg-white text-[#0A0D14] border border-[#E2E4E9] shadow-xs"
                : "text-[#525866] hover:text-[#0A0D14]"
            }`}
          >
            <Palette size={14} className={activeTab === "colors" ? "text-[#FF4800]" : ""} />
            <span>Colors ({system.colors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("typography")}
            className={`flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              activeTab === "typography"
                ? "bg-white text-[#0A0D14] border border-[#E2E4E9] shadow-xs"
                : "text-[#525866] hover:text-[#0A0D14]"
            }`}
          >
            <TextAa size={14} className={activeTab === "typography" ? "text-[#FF4800]" : ""} />
            <span>Typography</span>
          </button>

          <button
            onClick={() => setActiveTab("geometry")}
            className={`flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              activeTab === "geometry"
                ? "bg-white text-[#0A0D14] border border-[#E2E4E9] shadow-xs"
                : "text-[#525866] hover:text-[#0A0D14]"
            }`}
          >
            <Ruler size={14} className={activeTab === "geometry" ? "text-[#FF4800]" : ""} />
            <span>Geometry & Grid</span>
          </button>

          <button
            onClick={() => setActiveTab("markdown")}
            className={`flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              activeTab === "markdown"
                ? "bg-white text-[#0A0D14] border border-[#E2E4E9] shadow-xs"
                : "text-[#525866] hover:text-[#0A0D14]"
            }`}
          >
            <Code size={14} className={activeTab === "markdown" ? "text-[#FF4800]" : ""} />
            <span>design.md</span>
          </button>

          <button
            onClick={() => setActiveTab("tailwind")}
            className={`flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              activeTab === "tailwind"
                ? "bg-white text-[#0A0D14] border border-[#E2E4E9] shadow-xs"
                : "text-[#525866] hover:text-[#0A0D14]"
            }`}
          >
            <FileCode size={14} className={activeTab === "tailwind" ? "text-[#FF4800]" : ""} />
            <span>Tailwind v4</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="p-4 sm:p-6">
        {/* TAB 1: COLORS */}
        {activeTab === "colors" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#525866] pb-2 border-b border-[#E2E4E9]">
              <span>Deduplicated and clustered into semantic roles</span>
              <span className="font-mono text-[11px]">WCAG 2.1 AAA/AA AUDITED</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {system.colors.map((c) => (
                <div
                  key={c.id}
                  className="rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-3 text-xs flex flex-col justify-between"
                >
                  <div>
                    <div
                      className="h-12 w-full rounded-[4px] border border-black/10 shadow-inner mb-3 cursor-pointer group relative"
                      style={{ backgroundColor: c.hex }}
                      onClick={() => copyToClipboard(c.hex, c.id)}
                      title="Click to copy hex"
                    >
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity rounded-[4px]">
                        Copy {c.hex}
                      </span>
                    </div>

                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-[#0A0D14]">{c.hex}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          c.wcagRating === "AAA"
                            ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
                            : c.wcagRating === "AA"
                            ? "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                            : "bg-[#F4F4F6] text-[#868C98]"
                        }`}
                      >
                        {c.wcagRating} ({c.contrastAgainstCanvas}:1)
                      </span>
                    </div>

                    <div className="font-mono text-[11px] text-[#525866] mt-1">{c.name}</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#E2E4E9] flex items-center justify-between text-[10px] text-[#868C98]">
                    <span className="capitalize">{c.role}</span>
                    <span>{c.frequencyPercentage}% coverage</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TYPOGRAPHY */}
        {activeTab === "typography" && (
          <div className="space-y-6">
            {/* Font Stacks Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-4">
                <span className="font-mono text-[10px] text-[#868C98] uppercase block">Display Stack</span>
                <span className="font-bold text-[#0A0D14] text-sm mt-1 block">{system.typography.displayFamily}</span>
                <span className="font-mono text-[10px] text-[#525866] mt-1 block">Tracking: -0.035em</span>
              </div>

              <div className="rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-4">
                <span className="font-mono text-[10px] text-[#868C98] uppercase block">Body Stack</span>
                <span className="font-bold text-[#0A0D14] text-sm mt-1 block">{system.typography.bodyFamily}</span>
                <span className="font-mono text-[10px] text-[#525866] mt-1 block">Line Height: 1.55</span>
              </div>

              <div className="rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-4">
                <span className="font-mono text-[10px] text-[#868C98] uppercase block">Modular Ratio</span>
                <span className="font-bold text-[#0A0D14] text-sm mt-1 block">{system.typography.scaleName}</span>
                <span className="font-mono text-[10px] text-[#525866] mt-1 block">Factor: {system.typography.scaleRatio}</span>
              </div>
            </div>

            {/* Typography Specimen Ladder */}
            <div className="rounded-[6px] border border-[#E2E4E9] bg-white divide-y divide-[#E2E4E9]">
              {system.typography.steps.map((step) => (
                <div key={step.name} className="p-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                  <div className="w-36 shrink-0 font-mono text-xs text-[#525866]">
                    <span className="font-bold text-[#0A0D14] uppercase">{step.name}</span>
                    <span className="block text-[10px] text-[#868C98]">{step.sizePx}px / {step.lineHeightPx}px lh</span>
                  </div>

                  <div
                    className="flex-1 font-bold text-[#0A0D14] truncate"
                    style={{
                      fontSize: `${Math.min(32, step.sizePx)}px`,
                      lineHeight: `${Math.min(40, step.lineHeightPx)}px`,
                      letterSpacing: step.letterSpacing,
                    }}
                  >
                    Disciplined software delivery without AI slop
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GEOMETRY */}
        {activeTab === "geometry" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Spacing Grid */}
              <div className="rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-4">
                <span className="font-mono text-xs font-bold text-[#0A0D14] block mb-1">
                  8pt Modular Baseline Grid
                </span>
                <p className="text-xs text-[#525866] mb-3">
                  Paddings, margins, and gaps are quantized strictly to these multiples:
                </p>
                <div className="flex flex-wrap gap-2">
                  {system.geometry.spacingRampPx.map((px) => (
                    <span
                      key={px}
                      className="rounded-[4px] border border-[#E2E4E9] bg-white px-2.5 py-1 font-mono text-xs font-semibold text-[#0A0D14] shadow-xs"
                    >
                      {px}px
                    </span>
                  ))}
                </div>
              </div>

              {/* Radii System */}
              <div className="rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-4">
                <span className="font-mono text-xs font-bold text-[#0A0D14] block mb-1">
                  Border Radius Hierarchy
                </span>
                <p className="text-xs text-[#525866] mb-3">
                  Prevents arbitrary pill corners from fighting card containers:
                </p>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-white border border-[#E2E4E9]">
                    <span className="text-[#525866]">Controls (Buttons, Inputs):</span>
                    <span className="font-bold text-[#0A0D14]">{system.geometry.radii.controlPx}px</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-white border border-[#E2E4E9]">
                    <span className="text-[#525866]">Containers (Cards, Panels):</span>
                    <span className="font-bold text-[#0A0D14]">{system.geometry.radii.cardPx}px</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-white border border-[#E2E4E9]">
                    <span className="text-[#525866]">Tags & Badges:</span>
                    <span className="font-bold text-[#0A0D14]">9999px (Pill)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DESIGN.MD */}
        {activeTab === "markdown" && (
          <div className="relative rounded-[6px] border border-[#E2E4E9] bg-[#0A0D14] p-5 font-mono text-xs text-[#F4F4F6] overflow-x-auto max-h-[500px]">
            <button
              onClick={() => copyToClipboard(system.designMd, "raw-markdown")}
              className="absolute top-4 right-4 flex items-center gap-1.5 rounded-[4px] bg-white/10 hover:bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-md transition-colors"
            >
              {copiedKey === "raw-markdown" ? (
                <>
                  <CheckCircle size={13} weight="fill" className="text-[#10B981]" />
                  <span className="text-[#10B981]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
            <pre className="leading-relaxed">{system.designMd}</pre>
          </div>
        )}

        {/* TAB 5: TAILWIND V4 */}
        {activeTab === "tailwind" && (
          <div className="relative rounded-[6px] border border-[#E2E4E9] bg-[#0A0D14] p-5 font-mono text-xs text-[#F4F4F6] overflow-x-auto max-h-[500px]">
            <button
              onClick={() => copyToClipboard(system.tailwindCss, "tailwind-css")}
              className="absolute top-4 right-4 flex items-center gap-1.5 rounded-[4px] bg-white/10 hover:bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-md transition-colors"
            >
              {copiedKey === "tailwind-css" ? (
                <>
                  <CheckCircle size={13} weight="fill" className="text-[#10B981]" />
                  <span className="text-[#10B981]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy CSS</span>
                </>
              )}
            </button>
            <pre className="leading-relaxed">{system.tailwindCss}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
