"use client";

import { useState, useEffect } from "react";
import {
  Palette,
  TextAa,
  Code,
  Copy,
  CheckCircle,
  FileCode,
  Sparkle,
  ArrowClockwise,
  PaperPlaneTilt,
  Browsers,
  DownloadSimple,
} from "@phosphor-icons/react";
import { ExtractedDesignSystem } from "@/types/tokens";

interface TokenTabsProps {
  system: ExtractedDesignSystem;
}

export function TokenTabs({ system }: TokenTabsProps) {
  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "components" | "markdown" | "tailwind">("colors");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Zorveus AI synthesis state
  const [currentMarkdown, setCurrentMarkdown] = useState<string>(system.designMd);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesisBadge, setSynthesisBadge] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [showPromptInput, setShowPromptInput] = useState<boolean>(false);

  // Typography interactive specimen state
  const [customTypePreview, setCustomTypePreview] = useState<string>("");

  // Auto-trigger Zorveus AI synthesis on load without requiring user click
  useEffect(() => {
    handleSynthesizeWithZorveus();
  }, [system.id]);

  // Dynamic Web Font Loader: Injects Google Fonts into document head for extracted typefaces
  useEffect(() => {
    // Fonts that are commercial/proprietary or system-bundled and definitely not on Google Fonts
    const NON_GOOGLE_FONTS = new Set([
      "sohne", "sohne-var", "sohne-mono", "circular", "gt america", "gt walsheim",
      "sf pro", "sf pro display", "sf pro text", "new york",
      "helvetica", "helvetica neue", "arial", "segoe ui", "proxima nova",
      "avenir", "avenir next", "gotham", "gill sans", "optima", "calibri",
      "cambria", "georgia", "times new roman", "times", "verdana", "tahoma",
      "trebuchet ms", "impact", "futura", "din", "frutiger", "univers",
      "cascadia code", "menlo", "consolas", "monaco", "geist", "geist mono",
      "system-ui", "-apple-system", "sans-serif", "serif", "monospace", "inherit"
    ]);

    const cleanFontName = (family: string) =>
      family ? family.split(",")[0].replace(/['"]/g, "").trim() : "";
    const display = cleanFontName(system.typography.displayFamily);
    const body = cleanFontName(system.typography.bodyFamily);

    const fontsToLoad = Array.from(new Set([display, body])).filter(
      (f) => f && !NON_GOOGLE_FONTS.has(f.toLowerCase()) && !f.toLowerCase().includes("sohne")
    );

    const linkId = `dynamic-google-font-${system.id}`;
    const existingLink = document.getElementById(linkId) as HTMLLinkElement | null;

    if (fontsToLoad.length > 0 && typeof document !== "undefined") {
      const familyParams = fontsToLoad
        .map((f) => `family=${encodeURIComponent(f)}:ital,wght@0,400;0,600;0,700;0,800;1,400`)
        .join("&");
      let link = existingLink;
      if (!link) {
        link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.onerror = () => {
          // If Google Fonts doesn't host this font, silently remove the link tag
          link?.remove();
        };
        document.head.appendChild(link);
      }
      link.href = `https://fonts.googleapis.com/css2?${familyParams}&display=swap`;
    } else if (existingLink) {
      existingLink.remove();
    }
  }, [system.id, system.typography.displayFamily, system.typography.bodyFamily]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    <div className="rounded-[8px] border border-keyline bg-white shadow-keyline overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-keyline bg-canvas px-4 py-2 overflow-x-auto">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("colors")}
            className={`flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              activeTab === "colors"
                ? "bg-white text-ink border border-keyline shadow-xs"
                : "text-ink-muted hover:text-accent cursor-pointer"
            }`}
          >
            <Palette size={14} className={activeTab === "colors" ? "text-accent" : ""} />
            <span>Colors ({system.colors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("typography")}
            className={`flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              activeTab === "typography"
                ? "bg-white text-ink border border-keyline shadow-xs"
                : "text-ink-muted hover:text-accent cursor-pointer"
            }`}
          >
            <TextAa size={14} className={activeTab === "typography" ? "text-accent" : ""} />
            <span>Typography</span>
          </button>

          <button
            onClick={() => setActiveTab("components")}
            className={`flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              activeTab === "components"
                ? "bg-white text-ink border border-keyline shadow-xs"
                : "text-ink-muted hover:text-accent cursor-pointer"
            }`}
          >
            <Browsers size={14} className={activeTab === "components" ? "text-accent" : ""} />
            <span>Live Specimens</span>
          </button>

          <button
            onClick={() => setActiveTab("markdown")}
            className={`flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              activeTab === "markdown"
                ? "bg-white text-ink border border-keyline shadow-xs"
                : "text-ink-muted hover:text-accent cursor-pointer"
            }`}
          >
            <Code size={14} className={activeTab === "markdown" ? "text-accent" : ""} />
            <span>design.md</span>
            {isSynthesizing && (
              <span className="flex h-1.5 w-1.5 rounded-full bg-accent animate-ping ml-0.5" title="AI synthesis running..." />
            )}
            {synthesisBadge?.includes("ZORVEUS") && !isSynthesizing && (
              <span className="text-[9px] font-bold text-pass bg-pass-wash border border-[#A7F3D0] px-1 rounded ml-0.5">
                AI
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("tailwind")}
            className={`flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              activeTab === "tailwind"
                ? "bg-white text-ink border border-keyline shadow-xs"
                : "text-ink-muted hover:text-accent cursor-pointer"
            }`}
          >
            <FileCode size={14} className={activeTab === "tailwind" ? "text-accent" : ""} />
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
                  className="rounded-[6px] border border-keyline bg-canvas p-3 text-xs flex flex-col justify-between"
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
                            : c.wcagRating === "BASE"
                            ? "bg-[#F4F4F6] text-[#525866] border border-[#E2E4E9]"
                            : c.wcagRating === "PASS"
                            ? "bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]"
                            : "bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]"
                        }`}
                      >
                        {c.wcagRating === "BASE"
                          ? "BASE"
                          : `${c.wcagRating} (${c.contrastRatio || c.contrastAgainstCanvas}:1)`}
                      </span>
                    </div>

                    <div className="font-mono text-[11px] text-[#525866] mt-1">{c.name}</div>
                    {c.usageContext && (
                      <div className="text-[10px] text-[#868C98] mt-0.5 truncate" title={c.usageContext}>
                        {c.usageContext}
                      </div>
                    )}
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

        {/* TAB 2: TYPOGRAPHY WITH LIVE DYNAMIC FONT RENDERING */}
        {activeTab === "typography" && (
          <div className="space-y-6">
            {/* Font Stacks Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-[6px] border border-keyline bg-canvas p-4">
                <span className="font-mono text-[10px] text-ink-subtle uppercase block">Display Stack</span>
                <span
                  style={{ fontFamily: system.typography.displayFamily }}
                  className="font-bold text-ink text-base mt-1 block truncate"
                >
                  {system.typography.displayFamily.split(",")[0].replace(/['"]/g, "")}
                </span>
                <span className="font-mono text-[10px] text-ink-muted mt-1 block truncate">
                  Full stack: {system.typography.displayFamily}
                </span>
              </div>

              <div className="rounded-[6px] border border-keyline bg-canvas p-4">
                <span className="font-mono text-[10px] text-ink-subtle uppercase block">Body Stack</span>
                <span
                  style={{ fontFamily: system.typography.bodyFamily }}
                  className="font-bold text-ink text-base mt-1 block truncate"
                >
                  {system.typography.bodyFamily.split(",")[0].replace(/['"]/g, "")}
                </span>
                <span className="font-mono text-[10px] text-ink-muted mt-1 block truncate">
                  Full stack: {system.typography.bodyFamily}
                </span>
              </div>

              <div className="rounded-[6px] border border-keyline bg-canvas p-4">
                <span className="font-mono text-[10px] text-ink-subtle uppercase block">Modular Ratio</span>
                <span className="font-bold text-ink text-base mt-1 block">
                  {system.typography.scaleName}
                </span>
                <span className="font-mono text-[10px] text-ink-muted mt-1 block">
                  Factor: {system.typography.scaleRatio}
                </span>
              </div>
            </div>

            {/* Interactive Preview Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-[6px] border border-keyline bg-canvas">
              <span className="font-mono text-xs text-[#525866] shrink-0">
                Interactive Specimen Test:
              </span>
              <input
                type="text"
                value={customTypePreview}
                onChange={(e) => setCustomTypePreview(e.target.value)}
                placeholder="Type custom text to preview in the extracted typeface..."
                className="w-full sm:flex-1 bg-white border border-[#E2E4E9] rounded-[4px] px-3 py-1.5 text-xs text-[#0A0D14] focus:outline-none focus:ring-1 focus:ring-[#FF4800]"
              />
              {customTypePreview && (
                <button
                  type="button"
                  onClick={() => setCustomTypePreview("")}
                  className="text-[11px] text-[#868C98] hover:text-[#0A0D14] font-mono shrink-0 cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Typography Specimen Ladder */}
            <div className="rounded-[6px] border border-[#E2E4E9] bg-white divide-y divide-[#E2E4E9] overflow-hidden">
              {system.typography.steps.map((step) => {
                const isDisplayOrHeading = ["display", "h1", "h2"].includes(step.name);
                const activeFontFamily = isDisplayOrHeading
                  ? system.typography.displayFamily
                  : system.typography.bodyFamily;
                const activeWeight = step.name === "display" ? 800 : step.name === "h1" ? 700 : step.name === "h2" ? 600 : 400;

                const displaySizePx =
                  step.name === "display"
                    ? 44
                    : step.name === "h1"
                    ? 32
                    : step.name === "h2"
                    ? 24
                    : step.name === "body"
                    ? 15
                    : 12;

                const displayLhPx =
                  step.name === "display"
                    ? 52
                    : step.name === "h1"
                    ? 40
                    : step.name === "h2"
                    ? 32
                    : step.name === "body"
                    ? 24
                    : 18;

                return (
                  <div key={step.name} className="p-4 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                    <div className="w-40 shrink-0 font-mono text-xs text-[#525866]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#0A0D14] uppercase">{step.name}</span>
                        <span className="text-[10px] px-1 py-0.5 rounded bg-[#F4F4F6] text-[#868C98]">
                          {isDisplayOrHeading ? "Display" : "Body"}
                        </span>
                      </div>
                      <span className="block text-[10px] text-[#868C98] mt-0.5">
                        {step.sizePx}px / {step.lineHeightPx}px lh
                      </span>
                    </div>

                    <div
                      className="flex-1 text-[#0A0D14] transition-all"
                      style={{
                        fontFamily: activeFontFamily,
                        fontSize: `${displaySizePx}px`,
                        lineHeight: `${displayLhPx}px`,
                        fontWeight: activeWeight,
                        letterSpacing: step.letterSpacing,
                      }}
                    >
                      {customTypePreview.trim() || (
                        step.name === "display"
                          ? "Your library of free, consistent vector illustrations"
                          : step.name === "h1"
                          ? "Choose an illustration style that fits your product"
                          : step.name === "h2"
                          ? "Work consistently within a single visual design system"
                          : step.name === "body"
                          ? "Designed for presentations, empty states, onboarding, errors, and landing pages with mathematical token precision."
                          : "© 2026 Studio. All rights reserved. Built with anti-slop tokens."
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Glyphs & Character Set Specimen */}
            <div className="rounded-[6px] border border-keyline bg-canvas p-4 space-y-2">
              <span className="font-mono text-[10px] text-ink-subtle uppercase block">
                Extracted Typeface Character Glyphs ({system.typography.displayFamily.split(",")[0].replace(/['"]/g, "")})
              </span>
              <div
                style={{ fontFamily: system.typography.displayFamily, fontWeight: 700 }}
                className="text-lg text-ink tracking-wider leading-relaxed select-all"
              >
                A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
              </div>
              <div
                style={{ fontFamily: system.typography.displayFamily }}
                className="text-base text-ink-muted tracking-wider leading-relaxed select-all"
              >
                a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 ! @ # $ % &
              </div>
            </div>
          </div>
        )}

        {/* TAB: LIVE SPECIMENS (COMPONENTS) */}
        {activeTab === "components" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-ink-muted pb-2 border-b border-keyline">
              <span>Real computed component specimens styled with this site&apos;s exact tokens</span>
              <span className="font-mono text-[11px] text-pass">
                RADIUS: {system.geometry.radii.controlPx}px CONTROLS / {system.geometry.radii.cardPx}px CONTAINERS
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Column 1: Action Controls */}
              <div className="space-y-4 rounded-[8px] border border-keyline bg-canvas p-4">
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
              <div className="space-y-4 rounded-[8px] border border-keyline bg-canvas p-4">
                <span className="font-mono text-xs font-bold text-ink uppercase block">
                  Container Card
                </span>

                <div
                  style={{
                    backgroundColor: surfaceColor.hex,
                    borderRadius: `${system.geometry.radii.cardPx}px`,
                    borderColor: "#E2DDD2",
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
                    <span className="font-mono text-[10px] text-ink-subtle">
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
                    className="text-xs text-ink-muted leading-relaxed"
                    style={{ fontFamily: system.typography.bodyFamily }}
                  >
                    Every padding and margin aligns strictly to the {system.geometry.baseGridPx}pt baseline grid.
                  </p>

                  <div className="pt-2 border-t border-keyline flex items-center justify-between text-[11px] font-mono">
                    <span className="text-ink-subtle">Accent: {primaryAccent.hex}</span>
                    <span className="text-pass font-semibold">100% Locked</span>
                  </div>
                </div>
              </div>

              {/* Column 3: Badges, Status & Contrast Matrix */}
              <div className="space-y-4 rounded-[8px] border border-keyline bg-canvas p-4">
                <span className="font-mono text-xs font-bold text-ink uppercase block">
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
                      <span className="text-[#525866]">CTA Action Contrast:</span>
                      <span className={`font-bold ${primaryAccent.wcagRating === "FAIL" ? "text-[#FF4800]" : "text-[#059669]"}`}>
                        {primaryAccent.contrastRatio || primaryAccent.contrastAgainstCanvas}:1 ({primaryAccent.wcagRating})
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-[8px] border border-keyline bg-canvas">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-accent-wash border border-accent-border text-accent">
                  <Sparkle size={13} weight="fill" />
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-ink uppercase">
                    AI Design Compiler
                  </span>
                  {isSynthesizing ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-accent bg-accent-wash border border-accent-border px-2 py-0.5 rounded font-medium">
                      <ArrowClockwise size={11} className="animate-spin" />
                      <span>Synthesizing in background...</span>
                    </span>
                  ) : synthesisBadge?.includes("ZORVEUS") ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-pass bg-pass-wash border border-[#A7F3D0] px-2 py-0.5 rounded font-bold">
                      <CheckCircle size={11} weight="fill" />
                      <span>{synthesisBadge}</span>
                    </span>
                  ) : (
                    <span className="text-[#868C98] text-[11px] font-mono">
                      {synthesisBadge || "Deterministic Baseline"}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPromptInput(!showPromptInput)}
                  className={`btn-gloss-neutral h-8 px-3 text-xs font-medium cursor-pointer ${showPromptInput ? "bg-[#FFF1EB] text-[#FF4800] border-[#FFD6C7]" : ""}`}
                >
                  {showPromptInput ? "Hide Directive" : "+ Add Custom Directive"}
                </button>

                <button
                  type="button"
                  disabled={isSynthesizing}
                  onClick={() => handleSynthesizeWithZorveus()}
                  className="btn-gloss-neutral h-8 px-3 text-xs font-semibold gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Re-run AI synthesis"
                >
                  <ArrowClockwise size={12} className={isSynthesizing ? "animate-spin text-[#FF4800]" : ""} />
                  <span>{isSynthesizing ? "Compiling..." : "Re-synthesize"}</span>
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
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => downloadFile(currentMarkdown, `${system.domain || "design"}-design.md`)}
                  className="flex items-center gap-1.5 rounded-[4px] bg-white/10 hover:bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-md transition-colors cursor-pointer"
                  title="Download design.md"
                >
                  <DownloadSimple size={13} weight="bold" />
                  <span>Download .md</span>
                </button>
                <button
                  onClick={() => copyToClipboard(currentMarkdown, "raw-markdown")}
                  className="flex items-center gap-1.5 rounded-[4px] bg-white/10 hover:bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-md transition-colors cursor-pointer"
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
              </div>

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
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => downloadFile(system.tailwindCss, `${system.domain || "design"}-tokens.css`)}
                className="flex items-center gap-1.5 rounded-[4px] bg-white/10 hover:bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-md transition-colors cursor-pointer"
                title="Download CSS"
              >
                <DownloadSimple size={13} weight="bold" />
                <span>Download .css</span>
              </button>
              <button
                onClick={() => copyToClipboard(system.tailwindCss, "tailwind-css")}
                className="flex items-center gap-1.5 rounded-[4px] bg-white/10 hover:bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-md transition-colors cursor-pointer"
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
            </div>
            <pre className="leading-relaxed">{system.tailwindCss}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
