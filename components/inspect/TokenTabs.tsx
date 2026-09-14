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
  Sparkle,
  ArrowClockwise,
  PaperPlaneTilt,
  Browsers,
} from "@phosphor-icons/react";
import { ExtractedDesignSystem } from "@/types/tokens";

interface TokenTabsProps {
  system: ExtractedDesignSystem;
}

export function TokenTabs({ system }: TokenTabsProps) {
  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "geometry" | "components" | "markdown" | "tailwind">("colors");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Zorveus AI synthesis state
  const [currentMarkdown, setCurrentMarkdown] = useState<string>(system.designMd);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesisBadge, setSynthesisBadge] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [showPromptInput, setShowPromptInput] = useState<boolean>(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSynthesizeWithZorveus = async (overridePrompt?: string) => {
    setIsSynthesizing(true);
    try {
      const res = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system,
          customPrompt: overridePrompt !== undefined ? overridePrompt : customPrompt.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.markdown) {
        setCurrentMarkdown(data.markdown);
        setSynthesisBadge(
          data.source === "zorveus"
            ? `ZORVEUS AI (${data.modelUsed || "CLAUDE 3.5"})`
            : "DETERMINISTIC FALLBACK"
        );
        setShowPromptInput(false);
      }
    } catch (e) {
      console.error("AI synthesis error:", e);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const primaryAccent = system.colors.find((c) => c.role === "accent") || system.colors[0] || {
    hex: "#0F7FFF",
    name: "brand-accent",
    contrastAgainstCanvas: 4.6,
    wcagRating: "AA" as const,
  };
  const primaryText = system.colors.find((c) => c.role === "text-primary") || {
    hex: "#101013",
    name: "text-primary",
    contrastAgainstCanvas: 18.2,
  };
  const surfaceColor = system.colors.find((c) => c.role === "surface") || {
    hex: "#FAFAFA",
    name: "bg-surface",
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
            onClick={() => setActiveTab("components")}
            className={`flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              activeTab === "components"
                ? "bg-white text-[#0A0D14] border border-[#E2E4E9] shadow-xs"
                : "text-[#525866] hover:text-[#0A0D14]"
            }`}
          >
            <Browsers size={14} className={activeTab === "components" ? "text-[#FF4800]" : ""} />
            <span>Live Specimens</span>
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

            {/* Visual Spacing Rhythm Scale */}
            <div className="rounded-[6px] border border-[#E2E4E9] bg-white p-4">
              <span className="font-mono text-xs font-bold text-[#0A0D14] block mb-2">
                Visual Spacing Rhythm Ramp ({system.geometry.baseGridPx}pt Multiples)
              </span>
              <div className="space-y-2 pt-1">
                {system.geometry.spacingRampPx.map((px) => (
                  <div key={px} className="flex items-center gap-3 font-mono text-xs">
                    <span className="w-12 text-[#525866] text-right font-bold shrink-0">{px}px</span>
                    <div className="flex-1 bg-[#F4F4F6] rounded h-4 overflow-hidden relative">
                      <div
                        className="h-full bg-[#FF4800]/85 rounded transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(4, (px / 64) * 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: LIVE SPECIMENS (COMPONENTS) */}
        {activeTab === "components" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-[#525866] pb-2 border-b border-[#E2E4E9]">
              <span>Real computed component specimens styled with this site&apos;s exact tokens</span>
              <span className="font-mono text-[11px] text-[#059669]">
                RADIUS: {system.geometry.radii.controlPx}px CONTROLS / {system.geometry.radii.cardPx}px CONTAINERS
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Column 1: Action Controls */}
              <div className="space-y-4 rounded-[8px] border border-[#E2E4E9] bg-[#FAFAFA] p-4">
                <span className="font-mono text-xs font-bold text-[#0A0D14] uppercase block">
                  Buttons & Controls
                </span>

                {/* Primary Button */}
                <div>
                  <div className="text-[10px] font-mono text-[#868C98] mb-1.5 flex items-center justify-between">
                    <span>PRIMARY ACTION</span>
                    <span>radius: {system.geometry.radii.controlPx}px</span>
                  </div>
                  <button
                    type="button"
                    style={{
                      backgroundColor: primaryAccent.hex,
                      color: primaryAccent.contrastAgainstCanvas > 3 ? "#FFFFFF" : "#0A0D14",
                      borderRadius: `${system.geometry.radii.controlPx}px`,
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
                    }}
                    className="w-full py-2.5 px-4 text-xs font-semibold tracking-[-0.01em] transition-transform active:scale-[0.98] cursor-pointer"
                  >
                    Start building with {system.domain}
                  </button>
                </div>

                {/* Secondary Button */}
                <div>
                  <div className="text-[10px] font-mono text-[#868C98] mb-1.5 flex items-center justify-between">
                    <span>SECONDARY / GHOST</span>
                    <span>1px keyline stroke</span>
                  </div>
                  <button
                    type="button"
                    style={{
                      borderRadius: `${system.geometry.radii.controlPx}px`,
                      borderColor: "#E2E4E9",
                      color: primaryText.hex,
                      backgroundColor: "#FFFFFF",
                    }}
                    className="w-full py-2.5 px-4 text-xs font-semibold border transition-colors hover:bg-[#F4F4F6] cursor-pointer"
                  >
                    View documentation
                  </button>
                </div>

                {/* Form Input Field */}
                <div>
                  <div className="text-[10px] font-mono text-[#868C98] mb-1.5">
                    <span>FORM INPUT WITH BRAND FOCUS</span>
                  </div>
                  <input
                    type="text"
                    defaultValue="developer@company.com"
                    style={{
                      borderRadius: `${system.geometry.radii.controlPx}px`,
                    }}
                    className="w-full border border-[#E2E4E9] bg-white px-3 py-2 text-xs text-[#0A0D14] font-mono focus:outline-none focus:ring-2 focus:ring-[#FF4800]/50"
                  />
                </div>
              </div>

              {/* Column 2: Surface Card Specimen */}
              <div className="space-y-4 rounded-[8px] border border-[#E2E4E9] bg-[#FAFAFA] p-4">
                <span className="font-mono text-xs font-bold text-[#0A0D14] uppercase block">
                  Container Card
                </span>

                <div
                  style={{
                    backgroundColor: surfaceColor.hex,
                    borderRadius: `${system.geometry.radii.cardPx}px`,
                    borderColor: "#E2E4E9",
                  }}
                  className="p-4 border shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        backgroundColor: primaryAccent.hex,
                        borderRadius: `${system.geometry.radii.pillPx}px`,
                        color: "#FFFFFF",
                      }}
                      className="px-2 py-0.5 font-mono text-[10px] font-bold"
                    >
                      LIVE SPECIMEN
                    </span>
                    <span className="font-mono text-[10px] text-[#868C98]">
                      {system.geometry.radii.cardPx}px card radius
                    </span>
                  </div>

                  <h4
                    className="font-bold text-sm leading-snug"
                    style={{
                      fontFamily: system.typography.displayFamily,
                      color: primaryText.hex,
                    }}
                  >
                    Crafted layout without arbitrary spacing
                  </h4>

                  <p
                    className="text-xs text-[#525866] leading-relaxed"
                    style={{ fontFamily: system.typography.bodyFamily }}
                  >
                    Every padding and margin aligns strictly to the {system.geometry.baseGridPx}pt baseline grid.
                  </p>

                  <div className="pt-2 border-t border-[#E2E4E9] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#868C98]">Accent: {primaryAccent.hex}</span>
                    <span className="text-[#059669] font-semibold">100% Locked</span>
                  </div>
                </div>
              </div>

              {/* Column 3: Badges, Status & Contrast Matrix */}
              <div className="space-y-4 rounded-[8px] border border-[#E2E4E9] bg-[#FAFAFA] p-4">
                <span className="font-mono text-xs font-bold text-[#0A0D14] uppercase block">
                  Pill Badges & Tags
                </span>

                <div className="flex flex-wrap gap-2">
                  {system.colors.map((c) => (
                    <span
                      key={c.id}
                      style={{
                        borderRadius: `${system.geometry.radii.pillPx}px`,
                        backgroundColor: c.hex,
                        color: c.contrastAgainstCanvas > 3 ? "#FFFFFF" : "#0A0D14",
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-[11px] font-bold shadow-xs"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                      <span>{c.name}</span>
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#E2E4E9] space-y-2">
                  <div className="text-[10px] font-mono text-[#868C98] uppercase">
                    Contrast Compliance
                  </div>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded bg-white border border-[#E2E4E9]">
                      <span className="text-[#525866]">Text on Canvas:</span>
                      <span className={`font-bold ${system.colors[1]?.wcagRating === "FAIL" ? "text-[#FF4800]" : "text-[#059669]"}`}>
                        {system.colors[1]?.contrastAgainstCanvas || 18.2}:1 ({system.colors[1]?.wcagRating || "AAA"})
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white border border-[#E2E4E9]">
                      <span className="text-[#525866]">Brand Accent on Canvas:</span>
                      <span className={`font-bold ${primaryAccent.wcagRating === "FAIL" ? "text-[#FF4800]" : "text-[#2563EB]"}`}>
                        {primaryAccent.contrastAgainstCanvas}:1 ({primaryAccent.wcagRating})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DESIGN.MD WITH ZORVEUS AI ENHANCEMENT */}
        {activeTab === "markdown" && (
          <div className="space-y-3">
            {/* Zorveus AI Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-[8px] border border-[#E2E4E9] bg-[#FAFAFA]">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#FFF1EB] border border-[#FFD6C7] text-[#FF4800]">
                  <Sparkle size={13} weight="fill" />
                </span>
                <div>
                  <span className="font-mono text-xs font-bold text-[#0A0D14] uppercase">
                    AI Design Compiler
                  </span>
                  <span className="text-[#868C98] text-[11px] ml-2 hidden sm:inline">
                    {synthesisBadge || "Deterministic Baseline"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPromptInput(!showPromptInput)}
                  className="btn-gloss-neutral h-8 px-3 text-xs font-medium cursor-pointer"
                >
                  {showPromptInput ? "Hide Prompt" : "+ Add Prompt Directive"}
                </button>

                <button
                  type="button"
                  disabled={isSynthesizing}
                  onClick={() => handleSynthesizeWithZorveus()}
                  className="btn-gloss-orange h-8 px-3.5 text-xs font-semibold gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSynthesizing ? (
                    <>
                      <ArrowClockwise size={13} className="animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkle size={13} weight="fill" />
                      <span>Synthesize with Zorveus AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Custom Prompt Input Bar */}
            {showPromptInput && (
              <div className="flex items-center gap-2 p-2 rounded-[8px] border border-[#FFD6C7] bg-[#FFF8F5]">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSynthesizeWithZorveus()}
                  placeholder="Ask Zorveus AI: e.g. 'Adapt for an e-commerce checkout' or 'Add light-mode rules'"
                  className="flex-1 bg-transparent px-2.5 py-1.5 text-xs text-[#0A0D14] placeholder-[#868C98] focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleSynthesizeWithZorveus()}
                  className="btn-gloss-orange h-7 px-3 text-xs font-semibold gap-1 cursor-pointer"
                >
                  <span>Apply</span>
                  <PaperPlaneTilt size={12} weight="bold" />
                </button>
              </div>
            )}

            {/* Markdown Display Box */}
            <div className="relative rounded-[6px] border border-[#E2E4E9] bg-[#0A0D14] p-5 font-mono text-xs text-[#F4F4F6] overflow-x-auto max-h-[500px]">
              <button
                onClick={() => copyToClipboard(currentMarkdown, "raw-markdown")}
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

              {isSynthesizing ? (
                <div className="py-12 text-center text-[#A1A7B3] flex flex-col items-center justify-center">
                  <ArrowClockwise size={20} className="animate-spin text-[#FF4800] mb-2" />
                  <span className="font-mono text-xs text-[#E2E4E9]">
                    Routing inference through Zorveus AI Gateway...
                  </span>
                  <span className="text-[11px] text-[#868C98] mt-1">
                    Compiling tailored component recipes and anti-slop negative constraints
                  </span>
                </div>
              ) : (
                <pre className="leading-relaxed whitespace-pre-wrap">{currentMarkdown}</pre>
              )}
            </div>
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
