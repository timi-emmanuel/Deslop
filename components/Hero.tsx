"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Globe,
  CheckCircle,
  Copy,
  Terminal,
  SlidersHorizontal,
  WarningOctagon,
  Lightning,
  Code,
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

const TARGET_TOOLS = [
  { name: "Cursor", color: "#FF4800" },
  { name: "Claude", color: "#D97706" },
  { name: "Tailwind", color: "#0284C7" },
  { name: "shadcn/ui", color: "#4F46E5" },
];

const PRESETS: Record<string, PresetData> = {
  linear: {
    id: "linear",
    name: "Linear",
    url: "https://linear.app",
    headline: "Linear is a better way to build products.",
    subheadline:
      "Meet the new standard for modern software development. Streamline issues, sprints, and product roadmaps.",
    buttonLabel: "Start building",
    targetAccent: "#5E6AD2",
    targetCanvas: "#08090A",
    colors: [
      { name: "canvas", hex: "#08090A", role: "Base Canvas" },
      { name: "surface", hex: "#141518", role: "Elevated Container" },
      { name: "accent", hex: "#5E6AD2", role: "Brand Key Action" },
      { name: "text", hex: "#F7F8F8", role: "High-contrast Typography" },
      { name: "keyline", hex: "#222326", role: "1px Structural Keyline" },
    ],
    typography: {
      heading: "Geist Sans (-0.03em tracking)",
      body: "Inter (15px / 24px line-height)",
      scale: "Major Second (1.125) - Restrained",
    },
    spacing: ["4px", "8px", "12px", "16px", "24px", "32px", "48px"],
    radii: "6px controls / 8px panels / 9999px pills",
    markdownSnippet: `# Linear Design System Tokens
## 1. Color Palette
- --bg-canvas: #08090A
- --bg-surface: #141518
- --brand-accent: #5E6AD2 (WCAG AAA verified)
- --text-primary: #F7F8F8
- --keyline-border: #222326

## 2. Typography Hierarchy
- Display & Headings: Geist Sans (-0.03em tracking)
- Body: Inter (15px / 24px line-height)
- Scale Factor: 1.125 (Major Second)

## 3. Spatial & Geometry Rules
- Base Grid: 8pt baseline (4 / 8 / 16 / 24 / 32px)
- Radius: 6px controls / 8px panels
- Keylines: 1px solid #222326`,
  },
  stripe: {
    id: "stripe",
    name: "Stripe",
    url: "https://stripe.com",
    headline: "Financial infrastructure for the internet.",
    subheadline:
      "Millions of businesses of all sizes use Stripe online and in person to accept payments and manage finances.",
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
      scale: "Minor Third (1.200) - Expressive",
    },
    spacing: ["4px", "8px", "16px", "24px", "36px", "48px", "64px"],
    radii: "8px controls / 12px containers / 4px badges",
    markdownSnippet: `# Stripe Design System Tokens
## 1. Color Palette
- --navy-deep: #0A2540
- --stripe-accent: #635BFF
- --cyan-active: #00D4FF
- --text-clean: #FFFFFF

## 2. Typography Specification
- Headings: Söhne Breit (-0.02em tracking)
- Body: Söhne Text (16px / 26px)
- Scale Factor: 1.200 (Minor Third)

## 3. Spacing & Elevation
- Grid: 8pt baseline
- Radius: 8px controls / 12px containers
- Elevation: Multi-layer ambient drop shadows`,
  },
  supabase: {
    id: "supabase",
    name: "Supabase",
    url: "https://supabase.com",
    headline: "Build in a weekend. Scale to millions.",
    subheadline:
      "The open source Firebase alternative. Build with Postgres database, Authentication, and Edge Functions.",
    buttonLabel: "Start your project",
    targetAccent: "#3ECF8E",
    targetCanvas: "#121212",
    colors: [
      { name: "canvas-dark", hex: "#121212", role: "Base Canvas" },
      { name: "surface-card", hex: "#1C1C1C", role: "Elevated Container" },
      { name: "brand-emerald", hex: "#3ECF8E", role: "Signature Emerald" },
      { name: "text-primary", hex: "#FFFFFF", role: "High-contrast Typography" },
      { name: "border-dim", hex: "#2E2E2E", role: "Structural Keyline" },
    ],
    typography: {
      heading: "Circular Sans / Custom Grotesk",
      body: "Inter (14px / 22px line-height)",
      scale: "Major Second (1.125)",
    },
    spacing: ["4px", "8px", "12px", "16px", "24px", "32px", "40px"],
    radii: "6px controls / 8px panels / 9999px pills",
    markdownSnippet: `# Supabase Design System Tokens
## 1. Color Palette
- --canvas-obsidian: #121212
- --emerald-brand: #3ECF8E
- --surface-elevated: #1C1C1C
- --border-keyline: #2E2E2E

## 2. Typography Specification
- Headings: Circular Sans (-0.02em tracking)
- Body: Inter (14px / 22px)
- Monospace: JetBrains Mono

## 3. Spacing & Geometry
- Grid: 8pt modular scale
- Radius: 6px buttons / 8px cards`,
  },
  raycast: {
    id: "raycast",
    name: "Raycast",
    url: "https://raycast.com",
    headline: "Your shortcut to everything.",
    subheadline:
      "Raycast lets you control your tools with a few keystrokes. Supercharged productivity built for speed.",
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
    radii: "6px controls / 8px panels / 4px chips",
    markdownSnippet: `# Raycast Design System Tokens
## 1. Color Palette
- --bg-obsidian: #0C0D0E
- --crimson-accent: #FF6363
- --surface-panel: #1B1C1E
- --text-primary: #F2F3F5

## 2. Typography Specification
- Headings: Inter Display (-0.03em tracking)
- Body: SF Mono & Inter
- Scale Factor: 1.125

## 3. Spatial & Geometry Rules
- Grid: 8pt baseline
- Radius: 6px controls / 8px panels`,
  },
};

const EXTRACTION_STEPS = [
  {
    num: "01",
    label: "DOM Ingestion",
    log: "CRAWL: Evaluated 142 DOM nodes · Harvested 18 computed @font-face and layout rules",
    badge: "STAGE 1/4",
  },
  {
    num: "02",
    label: "Color Clustering",
    log: "CLUSTER: Grouped 48 raw hex codes into 5 semantic tokens (Delta-E < 2.0)",
    badge: "STAGE 2/4",
  },
  {
    num: "03",
    label: "8pt Spatial Rhythm",
    log: "QUANTIZE: Snapped rogue 13px & 19px paddings to strict 8pt grid baseline",
    badge: "STAGE 3/4",
  },
  {
    num: "04",
    label: "design.md Output",
    log: "EMIT: Generated hardened design.md specification · Zero AI hallucinations locked",
    badge: "STAGE 4/4",
  },
];

export function Hero() {
  const router = useRouter();

  // Core State
  const [activePresetKey, setActivePresetKey] = useState<string>("linear");
  const [urlInput, setUrlInput] = useState<string>("https://linear.app");
  const [workbenchView, setWorkbenchView] = useState<"pipeline" | "comparator">("pipeline");

  // Pipeline & Tab States
  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "spacing" | "markdown">("colors");
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Comparator State (Slop vs Craft)
  const [slopMode, setSlopMode] = useState<"slop" | "craft">("craft");

  // Zynnode Word Cycler State
  const [toolIndex, setToolIndex] = useState<number>(0);

  
  useEffect(() => {
    const timer = setInterval(() => {
      setToolIndex((prev) => (prev + 1) % TARGET_TOOLS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

 
  useEffect(() => {
    if (isPaused || workbenchView !== "pipeline") return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % EXTRACTION_STEPS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPaused, workbenchView]);

  const currentPreset = PRESETS[activePresetKey] || PRESETS.linear;
  const currentTool = TARGET_TOOLS[toolIndex];
  const currentStep = EXTRACTION_STEPS[activeStep];

  const handleSelectPreset = (key: string) => {
    setActivePresetKey(key);
    setUrlInput(PRESETS[key].url);
  };

  const handleExtract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    router.push(`/inspect?url=${encodeURIComponent(urlInput.trim())}`);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(currentPreset.markdownSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-24 border-b border-[#E2E4E9] bg-white bg-drafting-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        {/* Hero Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-[#0A0D14] leading-[1.12]">
            Stop shipping AI slop.{" "}
            <br className="hidden sm:inline" />
            Lock down any design for{" "}
            <span className="relative inline-flex h-[1.18em] overflow-hidden align-bottom">
              <span
                key={currentTool.name}
                className="inline-block animate-slide-up-in font-extrabold"
                style={{ color: currentTool.color }}
              >
                {currentTool.name}
              </span>
            </span>
            .
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#525866] leading-relaxed max-w-2xl">
            Deslop inspects live computed DOM styles, eliminates styling noise, and outputs production-grade <code className="font-mono text-xs bg-[#F4F4F6] border border-[#E2E4E9] px-1.5 py-0.5 rounded text-[#0A0D14]">design.md</code> files and <code className="font-mono text-xs bg-[#F4F4F6] border border-[#E2E4E9] px-1.5 py-0.5 rounded text-[#0A0D14]">.cursorrules</code> that keep AI code generators strictly on-brand.
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
            <span className="font-mono text-[11px] uppercase">Quick Presets:</span>
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
            THE UNIFIED HERO WORKBENCH
            Combines:
            1. Automated Live Pipeline & Real-Time Terminal (Zynnode)
            2. Multi-Tab Token Studio & Presets
            3. Slop vs. Craft Signature Comparator (with playful annotations)
            ============================================================ */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="mt-14 rounded-[14px] border border-[#E2E4E9] bg-white p-3 sm:p-6 shadow-keyline-elevated max-w-5xl mx-auto overflow-hidden transition-all duration-300"
        >
          {/* Top Browser Bar & Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#E2E4E9] px-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]/80" />
              </div>
              <span className="text-[#868C98] font-mono text-[11px] ml-2 hidden sm:inline truncate max-w-xs">
                deslop.com/inspect?url={encodeURIComponent(currentPreset.url)}
              </span>
            </div>

            {/* Workbench Dual-Mode Switcher */}
            <div className="flex items-center gap-1.5 rounded-[6px] border border-[#E2E4E9] bg-[#F4F4F6] p-1 self-start sm:self-auto font-mono text-xs">
              <button
                type="button"
                onClick={() => setWorkbenchView("pipeline")}
                className={`flex items-center gap-1.5 rounded-[4px] px-3 py-1 font-semibold transition-all cursor-pointer ${
                  workbenchView === "pipeline"
                    ? "bg-white text-[#0A0D14] shadow-xs"
                    : "text-[#525866] hover:text-[#0A0D14]"
                }`}
              >
                <Terminal size={13} weight="bold" />
                <span>01 // Live Extractor Pipeline</span>
              </button>

              <button
                type="button"
                onClick={() => setWorkbenchView("comparator")}
                className={`flex items-center gap-1.5 rounded-[4px] px-3 py-1 font-semibold transition-all cursor-pointer ${
                  workbenchView === "comparator"
                    ? "bg-white text-[#0A0D14] shadow-xs"
                    : "text-[#525866] hover:text-[#0A0D14]"
                }`}
              >
                <SlidersHorizontal size={13} weight="bold" />
                <span>02 // Slop vs. Craft Inspector</span>
              </button>
            </div>
          </div>

          {/* ============================================================
              VIEW 1: LIVE EXTRACTOR PIPELINE & TOKEN STUDIO
              ============================================================ */}
          {workbenchView === "pipeline" && (
            <div>
              {/* Interactive Pipeline Stage Selector (Auto-cycles every 3.2s) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {EXTRACTION_STEPS.map((step, idx) => {
                  const isCurrent = activeStep === idx;
                  return (
                    <button
                      key={step.num}
                      type="button"
                      onClick={() => setActiveStep(idx)}
                      className={`flex items-center gap-2 rounded-[6px] px-3 py-2 text-left border transition-all cursor-pointer ${
                        isCurrent
                          ? "border-[#FF4800] bg-[#FFF8F5] text-[#0A0D14] shadow-xs"
                          : "border-[#E2E4E9] bg-[#FAFAFA] text-[#868C98] hover:border-[#CDD0D5]"
                      }`}
                    >
                      <span
                        className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isCurrent
                            ? "bg-[#FF4800] text-white"
                            : "bg-[#E2E4E9] text-[#525866]"
                        }`}
                      >
                        {step.num}
                      </span>
                      <span className="text-xs font-semibold truncate">
                        {step.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Real-time Terminal Log Strip (Zynnode-style) */}
              <div className="rounded-[8px] bg-[#0A0D14] border border-black/30 px-3.5 py-2.5 font-mono text-[11px] text-[#A1A1AA] flex items-center justify-between gap-2 mb-4 shadow-inner">
                <div className="flex items-center gap-2 overflow-hidden truncate">
                  <Terminal size={14} className="text-[#FF4800] shrink-0" />
                  <span className="text-white font-bold shrink-0">&gt; deslop:</span>
                  <span
                    key={currentStep.log}
                    className="text-[#E2E4E9] truncate animate-slide-up-in"
                  >
                    {currentStep.log}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30 px-1.5 py-0.5 rounded font-bold font-mono hidden sm:inline">
                    {currentStep.badge}
                  </span>
                  <span className="text-[10px] text-[#059669] font-bold hidden md:inline">
                    ✓ REALTIME
                  </span>
                </div>
              </div>

              {/* Active Token Extraction Conduit Bar (Linear / Stripe Saaspo Signature) */}
              <div className="mb-4 rounded-[10px] border border-[#FFD6C7] bg-[#FFF8F5] p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs relative overflow-hidden">
                {/* Luminous laser glow wash */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF4800]/10 to-transparent animate-pulse pointer-events-none" />

                <div className="flex items-center gap-2.5 relative z-10">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4800] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF4800]" />
                  </span>
                  <div>
                    <span className="font-mono text-xs font-bold text-[#0A0D14] tracking-wide">
                      LIVE TOKEN PIPELINE STREAM:
                    </span>
                    <span className="hidden sm:inline text-[11px] text-[#525866] ml-2">
                      Harvesting computed styles from <strong className="text-[#0A0D14] font-mono">{currentPreset.url.replace("https://", "")}</strong>
                    </span>
                  </div>
                </div>

                {/* Flying / Docked Token Capsules */}
                <div className="flex items-center gap-2 relative z-10 flex-wrap justify-center sm:justify-end">
                  <div className="flex items-center gap-1.5 rounded-[4px] border border-[#FFD6C7] bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-[#FF4800] shadow-2xs">
                    <span className="h-2 w-2 rounded-full border border-black/10" style={{ backgroundColor: currentPreset.targetAccent }} />
                    <span>{currentPreset.targetAccent} ➔ --brand-accent</span>
                    <span className="text-[9px] bg-[#ECFDF5] text-[#059669] px-1 py-0.5 rounded font-bold">LOCKED</span>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-[4px] border border-[#E2E4E9] bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-[#0A0D14] shadow-2xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF4800]" />
                    <span>16px ➔ 8pt rhythm</span>
                    <span className="text-[9px] bg-[#ECFDF5] text-[#059669] px-1 py-0.5 rounded font-bold">QUANTIZED</span>
                  </div>

                  <div className="hidden lg:flex items-center gap-1.5 rounded-[4px] border border-[#E2E4E9] bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-[#525866] shadow-2xs">
                    <span>6px ➔ --radius</span>
                    <span className="text-[9px] bg-[#ECFDF5] text-[#059669] px-1 py-0.5 rounded font-bold">CALIBRATED</span>
                  </div>
                </div>
              </div>

              {/* Split Product Demonstration */}
              <div className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Left: Target Website Live Preview with Reactive Inspection */}
                  <div
                    className="lg:col-span-6 rounded-[8px] border border-[#E2E4E9] p-6 text-white flex flex-col justify-between relative overflow-hidden min-h-[350px] transition-all duration-300"
                    style={{ backgroundColor: currentPreset.targetCanvas }}
                  >
                    <div className="absolute top-3 right-3 rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-[#A1A1AA]">
                      Target: {currentPreset.name}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA] mb-4">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: currentPreset.targetAccent }}
                        />
                        <span>{currentPreset.url.replace("https://", "")}</span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white max-w-sm">
                        {currentPreset.headline}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-xs">
                        {currentPreset.subheadline}
                      </p>
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                      {/* Element with reactive inspection overlay */}
                      <div className="relative">
                        <span className="absolute -top-7 left-0 whitespace-nowrap rounded-[4px] bg-[#FF4800] px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-sm flex items-center gap-1.5 animate-slide-up-in">
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                          <span>
                            {activeStep === 0 && `INSPECTED: button · 168 × 38 · ${currentPreset.targetAccent}`}
                            {activeStep === 1 && `EXTRACTED: ${currentPreset.targetAccent} (Color Token)`}
                            {activeStep === 2 && `QUANTIZED: 16px padding (8pt Grid)`}
                            {activeStep === 3 && `COMMITTED: .cursorrules & design.md`}
                          </span>
                        </span>
                        <div
                          className="rounded-[6px] px-4 py-2 text-xs font-semibold text-white shadow-sm ring-2 ring-[#FF4800] ring-offset-2 ring-offset-[#08090A] transition-all"
                          style={{ backgroundColor: currentPreset.targetAccent }}
                        >
                          {currentPreset.buttonLabel}
                        </div>
                      </div>

                      <div className="rounded-[6px] border border-[#222326] bg-[#141518] px-4 py-2 text-xs font-medium text-[#A1A1AA]">
                        Documentation
                      </div>
                    </div>
                  </div>

                  {/* Right: Extracted Token Studio with Multi-Tab Inspection */}
                  <div className="lg:col-span-6 rounded-[8px] border border-[#E2E4E9] bg-[#FAFAFA] p-5 flex flex-col justify-between">
                    <div>
                      {/* Tabs Header */}
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E2E4E9] gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setActiveTab("colors")}
                            className={`rounded-[4px] px-2.5 py-1 font-mono text-xs font-semibold transition-colors cursor-pointer ${
                              activeTab === "colors"
                                ? "bg-[#0A0D14] text-white"
                                : "text-[#525866] hover:bg-[#E2E4E9]"
                            }`}
                          >
                            Colors ({currentPreset.colors.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab("typography")}
                            className={`rounded-[4px] px-2.5 py-1 font-mono text-xs font-semibold transition-colors cursor-pointer ${
                              activeTab === "typography"
                                ? "bg-[#0A0D14] text-white"
                                : "text-[#525866] hover:bg-[#E2E4E9]"
                            }`}
                          >
                            Typography
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab("spacing")}
                            className={`rounded-[4px] px-2.5 py-1 font-mono text-xs font-semibold transition-colors cursor-pointer ${
                              activeTab === "spacing"
                                ? "bg-[#0A0D14] text-white"
                                : "text-[#525866] hover:bg-[#E2E4E9]"
                            }`}
                          >
                            8pt Grid
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab("markdown")}
                            className={`flex items-center gap-1 rounded-[4px] px-2.5 py-1 font-mono text-xs font-semibold transition-colors cursor-pointer ${
                              activeTab === "markdown"
                                ? "bg-[#0A0D14] text-white"
                                : "text-[#525866] hover:bg-[#E2E4E9]"
                            }`}
                          >
                            <Code size={12} weight="bold" />
                            <span>design.md</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={handleCopyMarkdown}
                          className="flex items-center gap-1 rounded-[4px] border border-[#E2E4E9] bg-white px-2 py-1 text-xs font-medium text-[#525866] hover:text-[#0A0D14] hover:border-[#CDD0D5] transition-all shadow-xs cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <CheckCircle size={13} weight="fill" className="text-[#059669]" />
                              <span className="text-[#059669] font-medium text-[11px]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span className="text-[11px]">Copy spec</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Tab 1: Colors */}
                      {activeTab === "colors" && (
                        <div
                          className={`transition-all duration-300 rounded-[6px] ${
                            activeStep === 1
                              ? "animate-dock-bloom ring-2 ring-[#FF4800]/70 p-2.5 bg-[#FFF8F5]"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-mono text-[#868C98]">
                              Semantic Cluster (Delta-E &lt; 2.0)
                            </span>
                            {activeStep === 1 ? (
                              <span className="font-mono text-[9px] text-[#FF4800] font-bold bg-[#FFF1EB] border border-[#FFD6C7] px-1.5 py-0.5 rounded animate-pulse">
                                ● DOCKED TO SPEC
                              </span>
                            ) : (
                              <span className="font-mono text-[9px] text-[#059669] font-bold bg-[#ECFDF5] px-1.5 py-0.5 rounded">
                                ✓ WCAG AAA VALIDATED
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {currentPreset.colors.map((c) => (
                              <div
                                key={c.hex}
                                className="rounded-[4px] border border-[#E2E4E9] bg-white p-2 text-left shadow-2xs"
                              >
                                <div
                                  className="h-6 w-full rounded-[2px] mb-1.5 border border-black/10"
                                  style={{ backgroundColor: c.hex }}
                                />
                                <span className="font-mono text-[10px] font-bold text-[#0A0D14] block">
                                  {c.hex}
                                </span>
                                <span className="text-[9px] text-[#868C98] block truncate">
                                  {c.role}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tab 2: Typography */}
                      {activeTab === "typography" && (
                        <div className="space-y-2">
                          <div className="rounded-[4px] border border-[#E2E4E9] bg-white p-3 text-xs shadow-2xs">
                            <span className="text-[10px] text-[#868C98] block font-mono uppercase">
                              Heading Font Stack
                            </span>
                            <span className="font-bold text-[#0A0D14] text-xs block mt-0.5">
                              {currentPreset.typography.heading}
                            </span>
                          </div>
                          <div className="rounded-[4px] border border-[#E2E4E9] bg-white p-3 text-xs shadow-2xs">
                            <span className="text-[10px] text-[#868C98] block font-mono uppercase">
                              Body Copy Stack
                            </span>
                            <span className="font-bold text-[#0A0D14] text-xs block mt-0.5">
                              {currentPreset.typography.body}
                            </span>
                          </div>
                          <div className="rounded-[4px] border border-[#E2E4E9] bg-white p-3 text-xs shadow-2xs">
                            <span className="text-[10px] text-[#868C98] block font-mono uppercase">
                              Modular Scale Factor
                            </span>
                            <span className="font-mono text-[11px] text-[#FF4800] block mt-0.5 font-bold">
                              {currentPreset.typography.scale}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Tab 3: Spacing & Geometry */}
                      {activeTab === "spacing" && (
                        <div
                          className={`space-y-3 transition-all duration-300 rounded-[6px] ${
                            activeStep === 2
                              ? "animate-dock-bloom ring-2 ring-[#FF4800]/70 p-2.5 bg-[#FFF8F5]"
                              : ""
                          }`}
                        >
                          <div className="rounded-[4px] border border-[#E2E4E9] bg-white p-3 text-xs shadow-2xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] text-[#868C98] block font-mono uppercase">
                                8pt Spacing Rhythm (Normalized)
                              </span>
                              {activeStep === 2 && (
                                <span className="font-mono text-[9px] text-[#FF4800] font-bold bg-[#FFF1EB] border border-[#FFD6C7] px-1.5 py-0.5 rounded animate-pulse">
                                  ● 8PT SNAPPED
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {currentPreset.spacing.map((s) => (
                                <span
                                  key={s}
                                  className="rounded-[3px] border border-[#E2E4E9] bg-[#F4F4F6] px-2 py-0.5 font-mono text-[10px] text-[#0A0D14] font-medium"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-[4px] border border-[#E2E4E9] bg-white p-3 text-xs shadow-2xs">
                            <span className="text-[10px] text-[#868C98] block font-mono uppercase mb-1">
                              Corner Geometry System
                            </span>
                            <span className="font-mono text-xs text-[#0A0D14]">
                              {currentPreset.radii}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Tab 4: Raw Markdown */}
                      {activeTab === "markdown" && (
                        <div
                          className={`rounded-[6px] border border-[#222326] bg-[#0A0D14] p-3 font-mono text-[11px] text-[#A1A1AA] max-h-48 overflow-y-auto leading-relaxed transition-all ${
                            activeStep === 3 ? "ring-2 ring-[#059669]" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono mb-2 pb-1.5 border-b border-[#222326]">
                            <span className="text-[#868C98]">// Output: design.md</span>
                            {activeStep === 3 && (
                              <span className="text-[#059669] font-bold bg-[#ECFDF5]/10 px-1.5 rounded">
                                ✓ ALL TOKENS COMPILED
                              </span>
                            )}
                          </div>
                          <pre className="whitespace-pre-wrap">{currentPreset.markdownSnippet}</pre>
                        </div>
                      )}
                    </div>

                    {/* Studio Bottom Bar */}
                    <div className="mt-4 pt-3 border-t border-[#E2E4E9] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#525866]">
                        Compatible with <code className="font-mono text-[10px] bg-white px-1 py-0.5 border rounded">.cursorrules</code>
                      </span>
                      <button
                        type="button"
                        onClick={() => router.push(`/inspect?url=${encodeURIComponent(currentPreset.url)}`)}
                        className="inline-flex items-center gap-1 font-semibold text-xs text-[#FF4800] hover:text-[#E03E00] cursor-pointer"
                      >
                        <span>Open Live Studio</span>
                        <ArrowRight size={13} weight="bold" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              VIEW 2: SLOP VS. CRAFT COMPARATOR (Signature Deslop Widget)
              Features playful annotations from deslop-design-tips.md.md:
              "13px?", "40 shades of blue", "Why this radius?", "Please stop."
              ============================================================ */}
          {workbenchView === "comparator" && (
            <div>
              {/* Comparator Toggle Switch */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-5 border-b border-[#E2E4E9]">
                <div>
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} weight="bold" className="text-[#FF4800]" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0A0D14]">
                      SLOP VS. CRAFT COMPARATOR
                    </span>
                  </div>
                  <p className="text-xs text-[#525866] mt-0.5">
                    Compare raw unconstrained AI code vs. Deslop token-locked execution.
                  </p>
                </div>

                <div className="flex items-center rounded-[6px] border border-[#E2E4E9] bg-[#F4F4F6] p-1 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setSlopMode("slop")}
                    className={`flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 transition-all cursor-pointer ${
                      slopMode === "slop"
                        ? "bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] shadow-xs font-bold"
                        : "text-[#525866] hover:text-[#0A0D14]"
                    }`}
                  >
                    <WarningOctagon size={14} weight="fill" />
                    <span>⚠️ AI Slop Output</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSlopMode("craft")}
                    className={`flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 transition-all cursor-pointer ${
                      slopMode === "craft"
                        ? "bg-[#FFF1EB] text-[#FF4800] border border-[#FFD6C7] shadow-xs font-bold"
                        : "text-[#525866] hover:text-[#0A0D14]"
                    }`}
                  >
                    <Lightning size={14} weight="fill" />
                    <span>⚡ Deslopped Craft</span>
                  </button>
                </div>
              </div>

              {/* Interactive Canvas & Diagnostics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Left: Visual Component Canvas */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  {slopMode === "slop" ? (
                    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#8b5cf6] via-[#ec4899] to-[#3b82f6] p-7 text-white shadow-xl animate-slide-up-in">
                      {/* Playful Anti-Slop Red Sticky Annotations */}
                      <span className="absolute top-3 left-4 rounded-[4px] bg-[#DC2626] px-2 py-0.5 font-mono text-[9px] font-bold text-white shadow-md rotate-[-2deg]">
                        Another purple gradient...
                      </span>
                      <span className="absolute top-3 right-4 rounded-[4px] bg-[#DC2626] px-2 py-0.5 font-mono text-[9px] font-bold text-white shadow-md rotate-[2deg]">
                        Why 24px radius?
                      </span>
                      <span className="absolute bottom-2 right-4 rounded-[4px] bg-[#DC2626] px-2 py-0.5 font-mono text-[9px] font-bold text-white shadow-md rotate-[-1deg]">
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
                  ) : (
                    <div className="rounded-[8px] border border-[#E2E4E9] bg-white p-7 text-[#0A0D14] shadow-keyline animate-slide-up-in">
                      <div className="flex items-center justify-between mb-4 border-b border-[#E2E4E9] pb-3">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[#059669]" />
                          <span className="font-mono text-[11px] font-semibold text-[#0A0D14] uppercase tracking-wider">
                            DESLOPPED // SYSTEM TOKEN SPEC
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-[#059669] font-bold bg-[#ECFDF5] px-1.5 py-0.5 rounded">
                          WCAG AAA · 8PT GRID
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A0D14]">
                        Continuous deployment for high-velocity software teams.
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-[#525866] leading-relaxed">
                        Ship production changes with deterministic rollback checks, unified design tokens, and instant peer verification.
                      </p>

                      <div className="mt-6 flex items-center gap-3">
                        <button
                          type="button"
                          className="rounded-[6px] bg-[#FF4800] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#E03E00] transition-colors cursor-default"
                        >
                          Deploy Pipeline
                        </button>
                        <button
                          type="button"
                          className="rounded-[6px] border border-[#E2E4E9] bg-white px-4 py-2 text-xs font-medium text-[#525866] hover:text-[#0A0D14] hover:border-[#CDD0D5] transition-colors cursor-default"
                        >
                          Documentation
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Technical Diagnostics Matrix */}
                <div className="lg:col-span-5 rounded-[8px] border border-[#E2E4E9] bg-[#FAFAFA] p-4 font-mono text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E2E4E9]">
                      <span className="font-bold text-[#0A0D14] uppercase text-[11px]">
                        {slopMode === "slop" ? "Slop Analysis Matrix" : "Quality Audit Passed"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${
                          slopMode === "slop"
                            ? "bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]"
                            : "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
                        }`}
                      >
                        {slopMode === "slop" ? "STATUS: REJECTED" : "STATUS: CALIBRATED"}
                      </span>
                    </div>

                    {slopMode === "slop" ? (
                      <div className="space-y-2 text-[#525866]">
                        <div className="flex items-start gap-2 text-[#DC2626]">
                          <span className="font-bold">✕</span>
                          <div>
                            <strong className="text-[#0A0D14]">Hallucinated Palette:</strong> 5 clashing neon hues with zero semantic roles.
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-[#DC2626]">
                          <span className="font-bold">✕</span>
                          <div>
                            <strong className="text-[#0A0D14]">Arbitrary Spacing:</strong> 13px & 19px padding hacks that break spatial flow.
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-[#DC2626]">
                          <span className="font-bold">✕</span>
                          <div>
                            <strong className="text-[#0A0D14]">Clashing Geometry:</strong> 24px pill corners conflicting with 4px card padding.
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-[#DC2626]">
                          <span className="font-bold">✕</span>
                          <div>
                            <strong className="text-[#0A0D14]">AI Buzzword Copy:</strong> Generic hallucinated marketing filler.
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-[#525866]">
                        <div className="flex items-start gap-2 text-[#059669]">
                          <span className="font-bold">✓</span>
                          <div>
                            <strong className="text-[#0A0D14]">Semantic Token Lock:</strong> Disciplined 1-to-1 brand accent (#FF4800).
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-[#059669]">
                          <span className="font-bold">✓</span>
                          <div>
                            <strong className="text-[#0A0D14]">8pt Modular Rhythm:</strong> Consistent 4 / 8 / 16 / 24px spatial bounds.
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-[#059669]">
                          <span className="font-bold">✓</span>
                          <div>
                            <strong className="text-[#0A0D14]">Calibrated Radii:</strong> Strict 6px controls & 8px structural panels.
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-[#059669]">
                          <span className="font-bold">✓</span>
                          <div>
                            <strong className="text-[#0A0D14]">WCAG AAA Compliance:</strong> Guaranteed high contrast typography.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E4E9] flex items-center justify-between text-[11px] text-[#868C98]">
                    <span>Taste Skill Rules</span>
                    <span className="font-mono text-[#0A0D14] font-semibold">
                      {slopMode === "slop" ? "0 / 4 Directives" : "4 / 4 Directives"}
                    </span>
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
