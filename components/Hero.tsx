"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Globe,
  CheckCircle,
  Copy,
  SlidersHorizontal,
  WarningOctagon,
  Lightning,
  Code,
  Sparkle,
} from "@phosphor-icons/react";

interface ColorToken {
  name: string;
  hex: string;
  role: string;
}

interface PresetData {
  id: string;
  name: string;
  url: string;
  headline: string;
  subheadline: string;
  buttonLabel: string;
  targetAccent: string;
  targetCanvas: string;
  colors: ColorToken[];
  typography: {
    heading: string;
    body: string;
    scale: string;
  };
  spacing: string[];
  radii: string;
  markdownSnippet: string;
}

const TARGET_TOOLS = ["Cursor", "Claude", "Tailwind", "shadcn/ui"];

const PRESETS: Record<string, PresetData> = {
  woblo: {
    id: "woblo",
    name: "Woblo",
    url: "https://woblo.in",
    headline: "Extract any website's design system in one click.",
    subheadline:
      "Export colors, fonts, icons, and CSS directly to Tailwind, shadcn, or an AI prompt.",
    buttonLabel: "Add to Chrome",
    targetAccent: "#0F7FFF",
    targetCanvas: "#FFFFFF",
    colors: [
      { name: "bg-canvas", hex: "#FFFFFF", role: "Light Canvas" },
      { name: "brand-accent", hex: "#0F7FFF", role: "Electric Blue Accent" },
      { name: "bg-surface", hex: "#DBE9FF", role: "Feature Highlight Card" },
      { name: "text-primary", hex: "#101013", role: "Dark Ink Text" },
      { name: "accent-border", hex: "#6BA0EF", role: "Glass Button Stroke" },
    ],
    typography: {
      heading: "Plus Jakarta Sans (-0.03em tracking)",
      body: "Inter (15px / 24px line-height)",
      scale: "Major Second (1.125)",
    },
    spacing: ["4px", "8px", "12px", "16px", "24px", "32px"],
    radii: "2px controls / 8px panels",
    markdownSnippet: `# Woblo Production Design System Tokens
## 1. Color Palette
- --bg-canvas: #FFFFFF
- --brand-accent: #0F7FFF (WCAG AA verified)
- --text-primary: #101013 (WCAG AAA verified)
- --bg-surface: #DBE9FF

## 2. Typography Specification
- Headings: Plus Jakarta Sans (-0.03em)
- Body: Inter (15px / 24px)
- Scale Factor: 1.125

## 3. Spatial & Geometry Constraints
- Base Grid: 8pt baseline
- Radii: 2px controls / 8px cards / 9999px pills`,
  },
  linear: {
    id: "linear",
    name: "Linear",
    url: "https://linear.app",
    headline: "Linear is a better way to build products.",
    subheadline:
      "Streamline issues, sprints, and product roadmaps with deliberate craft.",
    buttonLabel: "Start building",
    targetAccent: "#5E6AD2",
    targetCanvas: "#08090A",
    colors: [
      { name: "canvas", hex: "#08090A", role: "Base Canvas" },
      { name: "surface", hex: "#141518", role: "Elevated Container" },
      { name: "accent", hex: "#5E6AD2", role: "Brand Key Action" },
      { name: "text", hex: "#F7F8F8", role: "High-contrast Text" },
      { name: "keyline", hex: "#222326", role: "1px Structural Keyline" },
    ],
    typography: {
      heading: "Geist Sans (-0.03em tracking)",
      body: "Inter (15px / 24px line-height)",
      scale: "Major Second (1.125)",
    },
    spacing: ["4px", "8px", "12px", "16px", "24px", "32px"],
    radii: "6px controls / 8px panels",
    markdownSnippet: `# Linear Design System Tokens
## 1. Color Palette
- --bg-canvas: #08090A
- --brand-accent: #5E6AD2 (WCAG AAA verified)
- --text-primary: #F7F8F8
- --keyline-border: #222326

## 2. Typography Hierarchy
- Headings: Geist Sans (-0.03em tracking)
- Body: Inter (15px / 24px)
- Scale: Major Second (1.125)

## 3. Spatial & Geometry Rules
- Base Grid: 8pt baseline (4 / 8 / 16 / 24px)
- Radii: 6px controls / 8px panels
- Strict Constraint: No purple gradients, no 24px radii`,
  },
  stripe: {
    id: "stripe",
    name: "Stripe",
    url: "https://stripe.com",
    headline: "Financial infrastructure for the internet.",
    subheadline:
      "Millions of businesses of all sizes use Stripe online to accept payments.",
    buttonLabel: "Start now",
    targetAccent: "#635BFF",
    targetCanvas: "#0A2540",
    colors: [
      { name: "navy-deep", hex: "#0A2540", role: "Deep Canvas Foundation" },
      { name: "brand-indigo", hex: "#635BFF", role: "Signature Accent" },
      { name: "cyan-active", hex: "#00D4FF", role: "Active Highlight" },
      { name: "surface-light", hex: "#FFFFFF", role: "Crisp Foreground" },
      { name: "keyline", hex: "#E3E8EE", role: "Subtle Hairline" },
    ],
    typography: {
      heading: "Söhne Breit (-0.02em tracking)",
      body: "Söhne Text (16px / 26px line-height)",
      scale: "Minor Third (1.200)",
    },
    spacing: ["4px", "8px", "16px", "24px", "36px", "48px"],
    radii: "8px controls / 12px containers",
    markdownSnippet: `# Stripe Design System Tokens
## 1. Color Palette
- --navy-deep: #0A2540
- --stripe-accent: #635BFF
- --cyan-active: #00D4FF
- --text-clean: #FFFFFF

## 2. Typography Specification
- Headings: Söhne Breit (-0.02em)
- Body: Söhne Text (16px / 26px)
- Scale: Minor Third (1.200)

## 3. Spacing & Elevation
- Grid: 8pt baseline
- Radii: 8px controls / 12px containers`,
  },
  supabase: {
    id: "supabase",
    name: "Supabase",
    url: "https://supabase.com",
    headline: "Build in a weekend. Scale to millions.",
    subheadline:
      "Open source Firebase alternative with Postgres, Auth, and Edge Functions.",
    buttonLabel: "Start project",
    targetAccent: "#3ECF8E",
    targetCanvas: "#121212",
    colors: [
      { name: "canvas-dark", hex: "#121212", role: "Base Canvas" },
      { name: "surface-card", hex: "#1C1C1C", role: "Elevated Container" },
      { name: "brand-emerald", hex: "#3ECF8E", role: "Signature Emerald" },
      { name: "text-primary", hex: "#FFFFFF", role: "High-contrast Text" },
      { name: "border-dim", hex: "#2E2E2E", role: "Structural Keyline" },
    ],
    typography: {
      heading: "Circular Sans / Grotesk",
      body: "Inter (14px / 22px line-height)",
      scale: "Major Second (1.125)",
    },
    spacing: ["4px", "8px", "12px", "16px", "24px", "32px"],
    radii: "6px controls / 8px panels",
    markdownSnippet: `# Supabase Design System Tokens
## 1. Color Palette
- --canvas-obsidian: #121212
- --emerald-brand: #3ECF8E
- --surface-elevated: #1C1C1C
- --border-keyline: #2E2E2E

## 2. Typography Specification
- Headings: Circular Sans (-0.02em)
- Body: Inter (14px / 22px)

## 3. Spacing & Geometry
- Grid: 8pt modular scale
- Radii: 6px buttons / 8px cards`,
  },
  raycast: {
    id: "raycast",
    name: "Raycast",
    url: "https://raycast.com",
    headline: "Your shortcut to everything.",
    subheadline:
      "Control your tools with a few keystrokes. Built for high-density speed.",
    buttonLabel: "Download for Mac",
    targetAccent: "#FF6363",
    targetCanvas: "#0C0D0E",
    colors: [
      { name: "obsidian", hex: "#0C0D0E", role: "Stark Dark Canvas" },
      { name: "surface", hex: "#1B1C1E", role: "Key Container" },
      { name: "crimson-accent", hex: "#FF6363", role: "Action Highlight" },
      { name: "text-crisp", hex: "#F2F3F5", role: "Foreground Text" },
      { name: "stroke", hex: "#2B2D31", role: "Hairline Keyline" },
    ],
    typography: {
      heading: "Inter Display / SF Pro",
      body: "SF Mono / Inter (14px / 20px)",
      scale: "Major Second (1.125)",
    },
    spacing: ["4px", "8px", "12px", "16px", "24px", "32px"],
    radii: "6px controls / 8px panels",
    markdownSnippet: `# Raycast Design System Tokens
## 1. Color Palette
- --bg-obsidian: #0C0D0E
- --crimson-accent: #FF6363
- --surface-panel: #1B1C1E
- --text-primary: #F2F3F5

## 2. Typography Specification
- Headings: Inter Display (-0.03em)
- Body: SF Mono & Inter
- Scale Factor: 1.125`,
  },
};

export function Hero() {
  const router = useRouter();

  // Core State
  const [activePresetKey, setActivePresetKey] = useState<string>("linear");
  const [urlInput, setUrlInput] = useState<string>("https://linear.app");
  const [viewMode, setViewMode] = useState<"craft" | "slop">("craft");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [pipelineTab, setPipelineTab] = useState<"tokens" | "specimen" | "code">("tokens");
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Tool cycler
  const [toolIndex, setToolIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setToolIndex((prev) => (prev + 1) % TARGET_TOOLS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const currentPreset = PRESETS[activePresetKey] || PRESETS.linear;
  const currentTool = TARGET_TOOLS[toolIndex];

  const handleSelectPreset = (key: string) => {
    setActivePresetKey(key);
    setUrlInput(PRESETS[key].url);
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 450);
  };

  const handleExtract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    router.push(`/inspect?url=${encodeURIComponent(urlInput.trim())}`);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(currentPreset.markdownSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  return (
    <section className="relative overflow-hidden pt-14 pb-24 border-b border-[#E2E4E9] bg-[#FAFAFA] bg-drafting-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        {/* ============================================================
            HERO HEADER WITH HANDCRAFTED SCRIBBLE & CYCLER
            ============================================================ */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Cute Editorial Micro-Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E4E9] bg-white px-3 py-1 text-xs font-medium text-[#525866] shadow-2xs mb-5">
            <span className="text-[#FF4800] text-sm">✦</span>
            <span>Drop one file in Cursor and never write CSS again</span>
            <span className="text-[#868C98]">·</span>
            <span className="font-mono text-[11px] text-[#0A0D14] font-semibold">Zero Hassle</span>
          </div>

          {/* Main Headline with Hand-Drawn Scribble Underline */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#0A0D14] leading-[1.14]">
            Steal any website&apos;s{" "}
            <span className="relative inline-block text-[#0A0D14]">
              look.
              {/* Organic Hand-Drawn Scribble Underline SVG */}
              <svg className="absolute -bottom-2 left-0 w-full h-[14px] text-[#FF4800] opacity-90" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M2,10 Q25,2 50,8 T98,5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
            <br className="hidden sm:inline" />
            Perfect UI on the first prompt for{" "}
            <span className="relative inline-flex h-[1.18em] overflow-hidden align-bottom">
              <span
                key={currentTool}
                className="inline-block animate-slide-up-in font-extrabold text-[#FF4800]"
              >
                {currentTool}
              </span>
            </span>
            .
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#525866] leading-relaxed max-w-2xl">
            Steal clean colors, typography, and 8px spacing from any live website. Generate a single <code className="font-mono text-xs bg-white border border-[#E2E4E9] px-1.5 py-0.5 rounded text-[#0A0D14] font-semibold">design.md</code> file that teaches Cursor, Claude, Lovable, or v0 to build gorgeous UI on the first prompt.
          </p>

          {/* Primary URL Input Form */}
          <form
            onSubmit={handleExtract}
            className="mt-8 w-full max-w-xl flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 rounded-[12px] border border-[#E2E4E9] bg-white shadow-keyline"
          >
            <div className="relative flex-1 flex items-center">
              <div className="pl-3.5 text-[#868C98] pointer-events-none">
                <Globe size={18} />
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter any live URL (e.g. linear.app)"
                required
                className="w-full bg-transparent pl-3 pr-4 py-2.5 text-xs sm:text-sm text-[#0A0D14] placeholder-[#868C98] focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="btn-gloss-orange h-11 px-6 text-xs sm:text-sm font-semibold tracking-[-0.01em] shrink-0 gap-2 cursor-pointer"
            >
              <span>Extract Design</span>
              <ArrowRight size={15} weight="bold" />
            </button>
          </form>

          {/* Quick Presets Selector */}
          <div className="mt-4 flex items-center flex-wrap justify-center gap-2 text-xs text-[#868C98]">
            <span className="font-mono text-[11px] uppercase">Curated Presets:</span>
            {Object.keys(PRESETS).map((key) => {
              const p = PRESETS[key];
              const isSelected = activePresetKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectPreset(key)}
                  className={`btn-gloss-neutral px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-[#FF4800] border-[#FF4800] text-[#0A0D14] font-semibold"
                      : "text-[#525866] hover:text-[#0A0D14]"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            THE "CUTE TECHNICAL" ILLUSTRATED TRANSFORMATION WORKBENCH
            Layout:
            [ YOUR WEBSITE (Input) ] ─── ✂ EXTRACT ───► [ DESIGN.MD (Output) ]
            Enriched with hand-drawn arrows, doodle stars, stickers, & tags
            ============================================================ */}
        <div className="mt-14 max-w-5xl mx-auto">
          {/* Top Workbench Chrome Bar with Slop vs Craft Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#E2E4E9] px-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]/80" />
              </div>
              <span className="text-[#868C98] font-mono text-[11px] ml-2 hidden sm:inline">
                interactive visual transformation pipeline
              </span>
            </div>

            {/* Playful Craft vs Slop Toggle */}
            <div className="flex items-center gap-1.5 rounded-[6px] border border-[#E2E4E9] bg-white p-1 font-mono text-xs self-start sm:self-auto shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("craft")}
                className={`flex items-center gap-1.5 rounded-[4px] px-3 py-1 font-semibold transition-all cursor-pointer ${
                  viewMode === "craft"
                    ? "bg-[#FFF1EB] text-[#FF4800] border border-[#FFD6C7] shadow-xs"
                    : "text-[#525866] hover:text-[#0A0D14]"
                }`}
              >
                <Lightning size={13} weight="fill" />
                <span>⚡ Deslopped Craft</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("slop")}
                className={`flex items-center gap-1.5 rounded-[4px] px-3 py-1 font-semibold transition-all cursor-pointer ${
                  viewMode === "slop"
                    ? "bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] shadow-xs"
                    : "text-[#525866] hover:text-[#0A0D14]"
                }`}
              >
                <WarningOctagon size={13} weight="fill" />
                <span>⚠️ AI Slop Mode</span>
              </button>
            </div>
          </div>

          {/* ============================================================
              CRAFT MODE: THE HANDCRAFTED TRANSFORMATION FLOW
              ============================================================ */}
          {viewMode === "craft" && (
            <div className="relative rounded-[16px] border border-[#E2E4E9] bg-white p-4 sm:p-7 shadow-keyline-elevated">
              {/* Cute Floating Sticker Notes in Corners */}
              <div className="hidden lg:block absolute -top-4 -right-4 z-20 rotate-[3deg]">
                <div className="rounded-[6px] bg-[#FEF9C3] border border-[#FDE047] px-3 py-1.5 font-mono text-[10px] font-bold text-[#854D0E] shadow-sm flex items-center gap-1.5">
                  <span>✦ 100% WCAG AAA</span>
                </div>
              </div>

              <div className="hidden lg:block absolute -bottom-3 -left-3 z-20 rotate-[-2deg]">
                <div className="rounded-[6px] bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1.5 font-mono text-[10px] font-bold text-[#065F46] shadow-sm flex items-center gap-1.5">
                  <span>✓ 8pt Baseline Locked</span>
                </div>
              </div>

              {/* Two-Pane Transformation Flow */}
              <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 lg:gap-6 items-stretch">
                {/* ──────────────────────────────────────────────────────────
                    LEFT PANE: YOUR WEBSITE (The Live Source)
                    ────────────────────────────────────────────────────────── */}
                <div className="lg:col-span-5 rounded-[12px] border border-[#E2E4E9] bg-[#FAFAFA] p-5 flex flex-col justify-between relative overflow-hidden">
                  {/* Pane Header */}
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E2E4E9]">
                      <div className="flex items-center gap-2">
                        <span className="text-[#FF4800] text-xs">✦</span>
                        <span className="font-mono text-xs font-bold text-[#0A0D14] uppercase tracking-wide">
                          01 · YOUR WEBSITE
                        </span>
                      </div>
                      <span className="font-mono text-[10px] bg-white border border-[#E2E4E9] px-2 py-0.5 rounded text-[#525866] font-semibold">
                        {currentPreset.url.replace("https://", "")}
                      </span>
                    </div>

                    {/* Target Website Preview Card */}
                    <div
                      className="rounded-[8px] p-5 text-white shadow-xs relative transition-all duration-300 min-h-[190px] flex flex-col justify-between"
                      style={{ backgroundColor: currentPreset.targetCanvas }}
                    >
                      <div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-[#A1A1AA] mb-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: currentPreset.targetAccent }}
                          />
                          <span>{currentPreset.name}</span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
                          {currentPreset.headline}
                        </h4>
                        <p className="mt-1.5 text-xs text-[#A1A1AA] line-clamp-2 leading-relaxed">
                          {currentPreset.subheadline}
                        </p>
                      </div>

                      {/* Interactive Button with Real Optical Callout */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                        <div className="relative inline-block">
                          <div
                            className="rounded-[6px] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm ring-2 ring-white/20"
                            style={{ backgroundColor: currentPreset.targetAccent }}
                          >
                            {currentPreset.buttonLabel}
                          </div>
                        </div>
                        <span className="font-mono text-[10px] text-[#A1A1AA]">
                          radius: {currentPreset.radii.split(" ")[0]}
                        </span>
                      </div>
                    </div>

                    {/* Extracted Raw Token Tags (Cute Pill Chips) */}
                    <div className="mt-4">
                      <div className="text-[10px] font-mono text-[#868C98] uppercase mb-2">
                        Inspected Visual Language:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#E2E4E9] bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-[#0A0D14] shadow-2xs">
                          <span
                            className="h-2 w-2 rounded-full border border-black/10"
                            style={{ backgroundColor: currentPreset.targetAccent }}
                          />
                          <span>{currentPreset.targetAccent}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-[4px] border border-[#E2E4E9] bg-white px-2.5 py-1 font-mono text-[11px] font-semibold text-[#0A0D14] shadow-2xs">
                          <span>✦ {currentPreset.typography.heading.split(" ")[0]}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-[4px] border border-[#E2E4E9] bg-white px-2.5 py-1 font-mono text-[11px] font-semibold text-[#0A0D14] shadow-2xs">
                          <span>✦ 8pt Grid (16px)</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Playful Handcrafted Note */}
                  <div className="mt-4 pt-3 border-t border-[#E2E4E9] flex items-center gap-2 text-xs text-[#525866]">
                    <span className="text-[#FF4800]">✂</span>
                    <span>Live crawler measures real screen colors, fonts, and button sizes</span>
                  </div>
                </div>

                {/* ──────────────────────────────────────────────────────────
                    CENTER CONNECTOR: THE LIVE SCANNING EXTRACTOR BRIDGE
                    ────────────────────────────────────────────────────────── */}
                <div className="lg:col-span-1 flex flex-row lg:flex-col items-center justify-center gap-2 py-2 lg:py-0 relative">
                  <div className="hidden lg:block w-px flex-1 bg-gradient-to-b from-transparent via-[#FFD6C7] to-transparent" />
                  
                  <div
                    className={`flex flex-col items-center justify-center p-2 rounded-[8px] bg-[#FFF1EB] border border-[#FFD6C7] shadow-xs text-center transition-all duration-300 ${
                      isScanning ? "ring-2 ring-[#FF4800] scale-110 shadow-md bg-[#FFE8DF]" : ""
                    }`}
                  >
                    <span className={`text-base text-[#FF4800] ${isScanning ? "animate-bounce" : ""}`}>✂</span>
                    <span className="font-mono text-[9px] font-extrabold uppercase text-[#FF4800] tracking-wider mt-0.5">
                      {isScanning ? "SCANNING" : "EXTRACT"}
                    </span>
                  </div>

                  {/* Organic Arrow SVG */}
                  <div className="text-[#FF4800] hidden lg:block">
                    <svg
                      width="16"
                      height="20"
                      viewBox="0 0 16 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 2V18M8 18L2 12M8 18L14 12"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="hidden lg:block w-px flex-1 bg-gradient-to-b from-transparent via-[#FFD6C7] to-transparent" />
                </div>

                {/* ──────────────────────────────────────────────────────────
                    RIGHT PANE: LIVE INSPECTION STUDIO SPECIMEN
                    ────────────────────────────────────────────────────────── */}
                <div className="lg:col-span-5 rounded-[12px] border border-[#E2E4E9] bg-white p-5 flex flex-col justify-between shadow-xs relative overflow-hidden">
                  {/* Laser Scanline Beam Animation when switching */}
                  {isScanning && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#FF4800] to-transparent animate-pulse z-30" />
                  )}

                  <div>
                    {/* Header with Studio Navigation Tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#E2E4E9] gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[#059669] text-xs">✓</span>
                        <span className="font-mono text-xs font-bold text-[#0A0D14] uppercase tracking-wide">
                          02 · STUDIO OUTPUT
                        </span>
                      </div>

                      {/* Mini Studio Tabs */}
                      <div className="flex items-center gap-1 font-mono text-[10px] bg-[#FAFAFA] border border-[#E2E4E9] p-0.5 rounded-[5px]">
                        <button
                          type="button"
                          onClick={() => setPipelineTab("tokens")}
                          className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                            pipelineTab === "tokens"
                              ? "bg-white text-[#0A0D14] shadow-2xs border border-[#E2E4E9]"
                              : "text-[#525866] hover:text-[#0A0D14]"
                          }`}
                        >
                          Tokens
                        </button>
                        <button
                          type="button"
                          onClick={() => setPipelineTab("specimen")}
                          className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                            pipelineTab === "specimen"
                              ? "bg-white text-[#0A0D14] shadow-2xs border border-[#E2E4E9]"
                              : "text-[#525866] hover:text-[#0A0D14]"
                          }`}
                        >
                          Live Specimen
                        </button>
                        <button
                          type="button"
                          onClick={() => setPipelineTab("code")}
                          className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                            pipelineTab === "code"
                              ? "bg-white text-[#0A0D14] shadow-2xs border border-[#E2E4E9]"
                              : "text-[#525866] hover:text-[#0A0D14]"
                          }`}
                        >
                          design.md
                        </button>
                      </div>
                    </div>

                    {/* TAB VIEW 1: TOKENS MATRIX */}
                    {pipelineTab === "tokens" && (
                      <div className="space-y-2.5 font-mono text-xs">
                        {/* Token Swatches Grid */}
                        <div className="grid grid-cols-2 gap-2">
                          {currentPreset.colors.slice(0, 4).map((c) => (
                            <div
                              key={c.name}
                              className="rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-2.5 flex items-center gap-2.5 shadow-2xs"
                            >
                              <span
                                className="h-6 w-6 rounded-[4px] border border-black/10 shrink-0 shadow-inner"
                                style={{ backgroundColor: c.hex }}
                              />
                              <div className="overflow-hidden">
                                <div className="font-bold text-[#0A0D14] text-[11px] truncate">
                                  {c.hex}
                                </div>
                                <div className="text-[10px] text-[#868C98] truncate">
                                  {c.name}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Typography and Geometry Ramps */}
                        <div className="rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-2.5 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="text-[#059669] font-bold">✓</span>
                            <span className="font-bold text-[#0A0D14]">type:</span>
                            <span className="text-[#525866] truncate max-w-[180px]">
                              {currentPreset.typography.heading.split(" ")[0]} ({currentPreset.typography.scale.split(" ")[0]})
                            </span>
                          </div>
                          <span className="text-[9px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-1.5 py-0.5 rounded">
                            LOCKED
                          </span>
                        </div>

                        <div className="rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-2.5 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="text-[#059669] font-bold">✓</span>
                            <span className="font-bold text-[#0A0D14]">grid:</span>
                            <span className="text-[#525866]">8pt modular ({currentPreset.radii})</span>
                          </div>
                          <span className="text-[9px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] px-1.5 py-0.5 rounded">
                            QUANTIZED
                          </span>
                        </div>
                      </div>
                    )}

                    {/* TAB VIEW 2: LIVE SPECIMEN (COMPONENTS) */}
                    {pipelineTab === "specimen" && (
                      <div className="space-y-3 font-mono text-xs">
                        {/* Live Button Specimen */}
                        <div className="rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-3 space-y-2">
                          <div className="flex items-center justify-between text-[10px] text-[#868C98]">
                            <span>PRIMARY BUTTON SPECIMEN</span>
                            <span>radius: {currentPreset.radii.split(" ")[0]}</span>
                          </div>
                          <button
                            type="button"
                            style={{
                              backgroundColor: currentPreset.targetAccent,
                              borderRadius: currentPreset.radii.split(" ")[0],
                            }}
                            className="w-full py-2 px-4 text-xs font-semibold text-white shadow-xs transition-transform active:scale-[0.98] cursor-pointer"
                          >
                            {currentPreset.buttonLabel}
                          </button>
                        </div>

                        {/* Live Input Specimen */}
                        <div className="rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-3 space-y-1.5">
                          <div className="text-[10px] text-[#868C98]">FORM INPUT (KEYLINE)</div>
                          <input
                            type="text"
                            defaultValue="design@system.dev"
                            style={{ borderRadius: currentPreset.radii.split(" ")[0] }}
                            className="w-full border border-[#E2E4E9] bg-white px-2.5 py-1.5 text-xs text-[#0A0D14] font-mono focus:outline-none"
                          />
                        </div>

                        {/* Status Pill Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            style={{
                              backgroundColor: currentPreset.targetAccent,
                              borderRadius: "9999px",
                            }}
                            className="px-2.5 py-1 text-[10px] font-bold text-white shadow-2xs"
                          >
                            ✦ WCAG AAA
                          </span>
                          <span className="px-2.5 py-1 text-[10px] font-bold text-[#0A0D14] bg-[#FAFAFA] border border-[#E2E4E9] rounded-full shadow-2xs">
                            8pt Baseline
                          </span>
                        </div>
                      </div>
                    )}

                    {/* TAB VIEW 3: DESIGN.MD CODE */}
                    {pipelineTab === "code" && (
                      <div className="rounded-[6px] border border-[#222326] bg-[#0A0D14] p-3 font-mono text-[11px] text-[#A1A1AA] leading-relaxed max-h-40 overflow-y-auto">
                        <div><span className="text-[#059669]">// Output file: design.md</span></div>
                        <div>- <span className="text-white">--brand-accent</span>: <span className="text-[#FF4800]">{currentPreset.targetAccent}</span>;</div>
                        <div>- <span className="text-white">--bg-canvas</span>: <span className="text-white">{currentPreset.targetCanvas}</span>;</div>
                        <div>- <span className="text-white">--radius-control</span>: <span className="text-yellow-300">{currentPreset.radii.split(" ")[0]}</span>;</div>
                        <div>- <span className="text-white">--grid-baseline</span>: <span className="text-yellow-300">8px</span>;</div>
                      </div>
                    )}
                  </div>

                  {/* 1-Click Copy and Action */}
                  <div className="mt-4 pt-3 border-t border-[#E2E4E9] flex items-center justify-between gap-3">
                    <span className="text-[11px] text-[#525866]">
                      Drop into <code className="font-mono text-[10px] bg-[#F4F4F6] px-1 py-0.5 border rounded">.cursorrules</code> or Claude Code
                    </span>

                    <button
                      type="button"
                      onClick={handleCopyMarkdown}
                      className="btn-gloss-orange h-8 px-4 text-xs font-semibold gap-1.5 cursor-pointer shrink-0"
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle size={14} weight="fill" className="text-white" />
                          <span>Copied design.md!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} weight="bold" />
                          <span>Copy design.md</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              SLOP MODE: THE HILARIOUS ANTI-SLOP CONTRAST
              Features playful annotations from deslop-design-tips.md.md:
              "13px?", "40 shades of blue", "Why this radius?", "Please stop."
              ============================================================ */}
          {viewMode === "slop" && (
            <div className="rounded-[16px] border border-[#FCA5A5] bg-white p-5 sm:p-7 shadow-keyline animate-slide-up-in">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#FCA5A5]/60">
                <div className="flex items-center gap-2">
                  <span className="text-[#DC2626] font-bold text-sm">⚠️</span>
                  <span className="font-mono text-xs font-bold text-[#DC2626] uppercase tracking-wide">
                    RAW AI CODE GENERATOR OUTPUT (0 DESIGN CONSTRAINTS)
                  </span>
                </div>
                <span className="font-mono text-[10px] bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] px-2 py-0.5 rounded font-bold">
                  STATUS: REJECTED SLOP
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left: The Tacky Hallucinated UI Card */}
                <div className="lg:col-span-7 relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#8b5cf6] via-[#ec4899] to-[#3b82f6] p-7 text-white shadow-xl">
                  {/* Playful Handcrafted Red Sticky Annotations */}
                  <span className="absolute top-3 left-4 rounded-[4px] bg-[#DC2626] px-2 py-0.5 font-mono text-[9px] font-bold text-white shadow-md rotate-[-2deg]">
                    Another purple gradient... 🤮
                  </span>
                  <span className="absolute top-3 right-4 rounded-[4px] bg-[#DC2626] px-2 py-0.5 font-mono text-[9px] font-bold text-white shadow-md rotate-[2deg]">
                    Why 24px radius?
                  </span>
                  <span className="absolute bottom-3 right-4 rounded-[4px] bg-[#DC2626] px-2 py-0.5 font-mono text-[9px] font-bold text-white shadow-md rotate-[-1deg]">
                    13px padding? Please stop.
                  </span>

                  <div className="mt-5 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-3">
                    ✨ Supercharge Synergy ✨
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-normal drop-shadow-md">
                    Unleash Next-Gen AI Paradigms with Hyper-Velocity
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-white/90 leading-relaxed drop-shadow">
                    Seamlessly revolutionize cross-functional vector synergies using intelligent neural-first workflows for all humans.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      className="rounded-full bg-white px-4 py-2 text-xs font-bold text-purple-700 shadow-md cursor-default"
                    >
                      Explore Magic ✨
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-white/60 bg-transparent px-4 py-2 text-xs font-bold text-white shadow-sm cursor-default"
                    >
                      Learn More 🚀
                    </button>
                  </div>
                </div>

                {/* Right: Technical Diagnostics */}
                <div className="lg:col-span-5 rounded-[8px] border border-[#FCA5A5] bg-[#FFF5F5] p-4 font-mono text-xs">
                  <div className="font-bold text-[#DC2626] uppercase mb-3 pb-2 border-b border-[#FCA5A5]">
                    AI Slop Diagnostics Matrix
                  </div>

                  <div className="space-y-2.5 text-[#525866]">
                    <div className="flex items-start gap-2 text-[#DC2626]">
                      <span className="font-bold">✕</span>
                      <div>
                        <strong className="text-[#0A0D14]">Hallucinated Palette:</strong> 5 clashing neon hues without semantic roles.
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-[#DC2626]">
                      <span className="font-bold">✕</span>
                      <div>
                        <strong className="text-[#0A0D14]">Arbitrary Spacing:</strong> 13px & 19px padding hacks breaking layout rhythm.
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-[#DC2626]">
                      <span className="font-bold">✕</span>
                      <div>
                        <strong className="text-[#0A0D14]">Mismatched Radii:</strong> 24px rounded pills clashing with 4px inner cards.
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-[#DC2626]">
                      <span className="font-bold">✕</span>
                      <div>
                        <strong className="text-[#0A0D14]">Generic Buzzwords:</strong> Hallucinated placeholder marketing filler.
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#FCA5A5] text-[11px] text-[#DC2626] font-bold">
                    Deslop purges these hallucinations with 1 single command.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
