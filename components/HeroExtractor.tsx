"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  CheckCircle,
  Copy,
  WarningOctagon,
  Sparkle,
  SlidersHorizontal,
  Code,
  Globe,
} from "@phosphor-icons/react";

interface TokenPreset {
  id: string;
  name: string;
  url: string;
  colors: { name: string; hex: string; role: string }[];
  typography: { heading: string; body: string; scale: string };
  spacing: string[];
  radii: string;
  markdownSnippet: string;
}

const PRESETS: Record<string, TokenPreset> = {
  linear: {
    id: "linear",
    name: "Linear",
    url: "https://linear.app",
    colors: [
      { name: "bg-surface", hex: "#08090A", role: "Base Canvas" },
      { name: "brand-accent", hex: "#5E6AD2", role: "Key Action / Brand" },
      { name: "text-primary", hex: "#F7F8F8", role: "High-contrast Typography" },
      { name: "keyline", hex: "#222326", role: "Hairline Structural Keyline" },
    ],
    typography: {
      heading: "Inter Display / Geist Sans",
      body: "Inter (15px / 24px line-height)",
      scale: "Major Second (1.125) - Restrained",
    },
    spacing: ["4px", "8px", "12px", "16px", "24px", "32px", "48px"],
    radii: "6px (Buttons/Inputs), 8px (Cards), 9999px (Pills)",
    markdownSnippet: `# Linear Design System Tokens
## Color Palette
- \`--bg-canvas\`: \`#08090A\`
- \`--brand-accent\`: \`#5E6AD2\` (WCAG AAA)
- \`--text-primary\`: \`#F7F8F8\`
- \`--keyline-border\`: \`#222326\`

## Typography Specification
- Display & Headings: Geist Sans (-0.03em tracking)
- Body: Inter (15px / 24px)
- Scale Factor: 1.125 (Major Second)

## Spacing & Elevation
- Grid: 8pt baseline
- Radius: 6px controls / 8px panels
- Keylines: 1px solid #222326`,
  },
  stripe: {
    id: "stripe",
    name: "Stripe",
    url: "https://stripe.com",
    colors: [
      { name: "slate-deep", hex: "#0A2540", role: "Deep Navy Foundation" },
      { name: "brand-indigo", hex: "#635BFF", role: "Signature Accent" },
      { name: "cyan-accent", hex: "#00D4FF", role: "Active Highlight" },
      { name: "text-primary", hex: "#FFFFFF", role: "Crisp Foreground" },
    ],
    typography: {
      heading: "Söhne / Söhne Breit",
      body: "Söhne Text (16px / 26px line-height)",
      scale: "Minor Third (1.200) - Expressive",
    },
    spacing: ["4px", "8px", "16px", "24px", "36px", "48px", "64px"],
    radii: "8px (Controls), 12px (Cards), 4px (Badges)",
    markdownSnippet: `# Stripe Design System Tokens
## Color Palette
- \`--navy-primary\`: \`#0A2540\`
- \`--stripe-accent\`: \`#635BFF\`
- \`--cyan-active\`: \`#00D4FF\`
- \`--text-clean\`: \`#FFFFFF\`

## Typography Specification
- Display: Söhne Breit (-0.02em tracking)
- Body: Söhne Text (16px / 26px)
- Scale Factor: 1.200 (Minor Third)

## Spacing & Elevation
- Multi-layer shadow elevation: 0 13px 27px -5px rgba(50,50,93,0.25)
- Border radius: 8px controls / 12px containers`,
  },
  supabase: {
    id: "supabase",
    name: "Supabase",
    url: "https://supabase.com",
    colors: [
      { name: "canvas-dark", hex: "#121212", role: "Base Canvas" },
      { name: "brand-emerald", hex: "#3ECF8E", role: "Signature Emerald" },
      { name: "surface-card", hex: "#1C1C1C", role: "Elevated Container" },
      { name: "border-dim", hex: "#2E2E2E", role: "Structural Keyline" },
    ],
    typography: {
      heading: "Circular Sans / Custom Grotesk",
      body: "Inter / 14px - 22px line-height",
      scale: "Major Second (1.125)",
    },
    spacing: ["4px", "8px", "12px", "16px", "24px", "32px", "40px"],
    radii: "6px (Buttons), 8px (Panels), 9999px (Status)",
    markdownSnippet: `# Supabase Design System Tokens
## Color Palette
- \`--canvas-obsidian\`: \`#121212\`
- \`--emerald-brand\`: \`#3ECF8E\`
- \`--surface-elevated\`: \`#1C1C1C\`
- \`--border-keyline\`: \`#2E2E2E\`

## Typography Specification
- Headings: Circular Sans (-0.02em)
- Body: Inter (14px / 22px)
- Monospace: JetBrains Mono (12px)`,
  },
};

export function HeroExtractor() {
  const [activePreset, setActivePreset] = useState<string>("linear");
  const [urlInput, setUrlInput] = useState<string>("https://linear.app");
  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "spacing" | "markdown">("colors");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Slop vs Craft Comparator State
  const [slopMode, setSlopMode] = useState<"slop" | "craft">("craft");

  const currentPreset = PRESETS[activePreset] || PRESETS.linear;

  const handleSelectPreset = (key: string) => {
    setActivePreset(key);
    setUrlInput(PRESETS[key].url);
  };

  const handleExtract = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPreset.markdownSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#E2E4E9] bg-drafting-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top Meta Badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-[4px] border border-[#FFD6C7] bg-[#FFF1EB] px-2.5 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#FF4800] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#FF4800] animate-ping" />
            <span>AI UI QUALITY CONTROL ENGINE</span>
          </div>

          <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold tracking-[-0.04em] text-[#0A0D14] max-w-4xl">
            Stop shipping AI slop.{" "}
            <span className="text-[#FF4800] underline decoration-[#FFD6C7] decoration-wavy underline-offset-8">
              Start shipping design.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#525866] max-w-2xl leading-relaxed">
            AI code assistants love hallucinating purple gradients, 40 inconsistent fonts, and nested wrappers.
            Deslop extracts strict tokens, typography scales, and a unified <code className="font-mono text-xs bg-[#F4F4F6] border border-[#E2E4E9] px-1.5 py-0.5 rounded text-[#0A0D14]">design.md</code> from any live website so your AI builds with real human craftsmanship.
          </p>
        </div>

        {/* ============================================================
            SIGNATURE WIDGET: SLOP VS CRAFT COMPARATOR
            ============================================================ */}
        <div id="slop-inspector" className="mb-14 rounded-[8px] border border-[#E2E4E9] bg-white p-4 sm:p-6 shadow-keyline">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-[#E2E4E9]">
            <div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} weight="bold" className="text-[#FF4800]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0A0D14]">
                  INSPECTOR // SLOP VS. CRAFT COMPARISON
                </span>
              </div>
              <p className="text-xs text-[#525866] mt-0.5">
                Toggle between raw LLM output and deslopped token-locked code.
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center rounded-[6px] border border-[#E2E4E9] bg-[#F4F4F6] p-1 font-mono text-xs font-medium">
              <button
                onClick={() => setSlopMode("slop")}
                className={`flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 transition-all ${
                  slopMode === "slop"
                    ? "bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] shadow-sm font-semibold"
                    : "text-[#525866] hover:text-[#0A0D14]"
                }`}
              >
                <WarningOctagon size={14} weight="fill" />
                <span>⚠️ AI Slop Output</span>
              </button>
              <button
                onClick={() => setSlopMode("craft")}
                className={`flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 transition-all ${
                  slopMode === "craft"
                    ? "bg-[#FFF1EB] text-[#FF4800] border border-[#FFD6C7] shadow-sm font-semibold"
                    : "text-[#525866] hover:text-[#0A0D14]"
                }`}
              >
                <Sparkle size={14} weight="fill" />
                <span>⚡ Deslopped Craft</span>
              </button>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Component Preview Box */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {slopMode === "slop" ? (
                  <motion.div
                    key="slop"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#8b5cf6] via-[#ec4899] to-[#3b82f6] p-8 text-white shadow-2xl"
                  >
                    <div className="absolute top-3 right-3 rounded-full bg-black/40 px-3 py-1 font-mono text-[10px] uppercase text-pink-200 backdrop-blur-md">
                      AI Generated: 0 constraints
                    </div>
                    <div className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-4">
                      ✨ Supercharge Synergy ✨
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-normal drop-shadow-md">
                      Unleash Next-Gen AI Paradigms with Hyper-Velocity
                    </h3>
                    <p className="mt-2 text-sm text-white/90 leading-relaxed drop-shadow">
                      Seamlessly revolutionize cross-functional vector synergies using intelligent neural-first workflows for all humans.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button className="rounded-full bg-white px-5 py-2.5 text-xs font-bold text-purple-700 shadow-lg hover:scale-105 transition-transform">
                        Explore Magic ✨
                      </button>
                      <button className="rounded-full border-2 border-white/60 bg-transparent px-5 py-2.5 text-xs font-bold text-white shadow-sm">
                        Learn More 🚀
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="craft"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-[6px] border border-[#E2E4E9] bg-white p-7 text-[#0A0D14] shadow-keyline"
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-[#E2E4E9] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#059669]" />
                        <span className="font-mono text-[11px] font-semibold text-[#0A0D14] uppercase tracking-wider">
                          DESLOPPED // SYSTEM TOKEN SPEC
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#868C98]">WCAG AAA // 8PT GRID</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A0D14]">
                      Continuous deployment for high-velocity software teams.
                    </h3>
                    <p className="mt-2 text-sm text-[#525866] leading-relaxed">
                      Ship production changes with deterministic rollback checks, unified design tokens, and instant peer verification.
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <button className="rounded-[6px] bg-[#FF4800] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#E03E00] transition-colors">
                        Deploy Pipeline
                      </button>
                      <button className="rounded-[6px] border border-[#E2E4E9] bg-white px-4 py-2 text-xs font-medium text-[#525866] hover:text-[#0A0D14] hover:border-[#CDD0D5] transition-colors">
                        Documentation
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Diagnostics & Inspection Breakdown */}
            <div className="lg:col-span-5 rounded-[6px] border border-[#E2E4E9] bg-[#F4F4F6] p-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E2E4E9]">
                <span className="font-bold text-[#0A0D14] uppercase text-[11px]">
                  {slopMode === "slop" ? "Slop Analysis Matrix" : "Quality Audit Passed"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-[4px] text-[10px] font-semibold ${
                    slopMode === "slop" ? "bg-[#FEF2F2] text-[#DC2626]" : "bg-[#ECFDF5] text-[#059669]"
                  }`}
                >
                  {slopMode === "slop" ? "STATUS: REJECTED" : "STATUS: CALIBRATED"}
                </span>
              </div>

              {slopMode === "slop" ? (
                <div className="space-y-2.5 text-[#525866]">
                  <div className="flex items-start gap-2 text-[#DC2626]">
                    <span>✕</span>
                    <div>
                      <strong className="text-[#0A0D14]">Hallucinated Palette:</strong> 5 clashing neon hues without semantic roles.
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-[#DC2626]">
                    <span>✕</span>
                    <div>
                      <strong className="text-[#0A0D14]">Random Geometry:</strong> Pill corners (24px) clashing with 4px card padding.
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-[#DC2626]">
                    <span>✕</span>
                    <div>
                      <strong className="text-[#0A0D14]">AI Buzzword Copy:</strong> Generic hallucinated placeholder marketing text.
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-[#DC2626]">
                    <span>✕</span>
                    <div>
                      <strong className="text-[#0A0D14]">Accessibility:</strong> 2 low-contrast text elements failing WCAG AA.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 text-[#525866]">
                  <div className="flex items-start gap-2 text-[#059669]">
                    <span>✓</span>
                    <div>
                      <strong className="text-[#0A0D14]">Locked Accent:</strong> Single high-visibility Safety Orange (#FF4800).
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-[#059669]">
                    <span>✓</span>
                    <div>
                      <strong className="text-[#0A0D14]">Geometric Discipline:</strong> Uniform 6px controls & 8pt modular spacing grid.
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-[#059669]">
                    <span>✓</span>
                    <div>
                      <strong className="text-[#0A0D14]">Typography Scale:</strong> High-contrast headlines with tight -0.03em tracking.
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-[#059669]">
                    <span>✓</span>
                    <div>
                      <strong className="text-[#0A0D14]">Zero Hallucination:</strong> Drop-in design.md tokens ready for Cursor.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================
            INTERACTIVE URL TOKEN EXTRACTOR
            ============================================================ */}
        <div id="extractor" className="rounded-[8px] border border-[#E2E4E9] bg-white p-4 sm:p-6 shadow-keyline">
          {/* Top Bar: URL Input + Presets */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0A0D14]">
                STEP 01 // LIVE TOKEN EXTRACTOR
              </span>
              <span className="font-mono text-[11px] text-[#868C98]">TARGET URL → DESIGN.MD</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#868C98]">
                  <Globe size={16} />
                </div>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://linear.app"
                  className="w-full rounded-[6px] border border-[#E2E4E9] bg-[#F4F4F6] pl-9 pr-4 py-2.5 text-xs font-mono text-[#0A0D14] placeholder-[#868C98] focus:border-[#FF4800] focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <button
                onClick={handleExtract}
                disabled={isAnalyzing}
                className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#FF4800] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#E03E00] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <span>Extract Tokens</span>
                    <ArrowRight size={14} weight="bold" />
                  </>
                )}
              </button>
            </div>

            {/* Quick Reference Chips */}
            <div className="flex items-center flex-wrap gap-2 text-xs">
              <span className="font-mono text-[11px] text-[#868C98] uppercase">Quick Presets:</span>
              {Object.keys(PRESETS).map((key) => {
                const preset = PRESETS[key];
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectPreset(key)}
                    className={`rounded-[4px] border px-2.5 py-1 text-xs font-medium transition-all ${
                      activePreset === key
                        ? "border-[#FF4800] bg-[#FFF1EB] text-[#FF4800] font-semibold shadow-xs"
                        : "border-[#E2E4E9] bg-[#F4F4F6] text-[#525866] hover:border-[#CDD0D5] hover:text-[#0A0D14]"
                    }`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extractor Tabs */}
          <div className="border-t border-[#E2E4E9] pt-4">
            <div className="flex items-center justify-between border-b border-[#E2E4E9] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("colors")}
                  className={`rounded-[4px] px-3 py-1 font-mono text-xs font-semibold transition-colors ${
                    activeTab === "colors"
                      ? "bg-[#0A0D14] text-white"
                      : "text-[#525866] hover:text-[#0A0D14] hover:bg-[#F4F4F6]"
                  }`}
                >
                  Color Palette ({currentPreset.colors.length})
                </button>
                <button
                  onClick={() => setActiveTab("typography")}
                  className={`rounded-[4px] px-3 py-1 font-mono text-xs font-semibold transition-colors ${
                    activeTab === "typography"
                      ? "bg-[#0A0D14] text-white"
                      : "text-[#525866] hover:text-[#0A0D14] hover:bg-[#F4F4F6]"
                  }`}
                >
                  Typography
                </button>
                <button
                  onClick={() => setActiveTab("spacing")}
                  className={`rounded-[4px] px-3 py-1 font-mono text-xs font-semibold transition-colors ${
                    activeTab === "spacing"
                      ? "bg-[#0A0D14] text-white"
                      : "text-[#525866] hover:text-[#0A0D14] hover:bg-[#F4F4F6]"
                  }`}
                >
                  Geometry
                </button>
                <button
                  onClick={() => setActiveTab("markdown")}
                  className={`flex items-center gap-1.5 rounded-[4px] px-3 py-1 font-mono text-xs font-semibold transition-colors ${
                    activeTab === "markdown"
                      ? "bg-[#0A0D14] text-white"
                      : "text-[#525866] hover:text-[#0A0D14] hover:bg-[#F4F4F6]"
                  }`}
                >
                  <Code size={13} weight="bold" />
                  <span>design.md</span>
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-[4px] border border-[#E2E4E9] bg-white px-2.5 py-1 text-xs font-medium text-[#525866] hover:border-[#CDD0D5] hover:text-[#0A0D14] transition-all shadow-xs"
              >
                {isCopied ? (
                  <>
                    <CheckCircle size={13} weight="fill" className="text-[#059669]" />
                    <span className="text-[#059669] font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy design.md</span>
                  </>
                )}
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === "colors" && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentPreset.colors.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-[6px] border border-[#E2E4E9] bg-[#F4F4F6] p-3 text-xs"
                  >
                    <div
                      className="h-10 w-full rounded-[4px] border border-black/10 mb-2.5 shadow-inner"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="font-mono font-bold text-[#0A0D14]">{c.hex}</div>
                    <div className="font-mono text-[10px] text-[#525866]">{c.name}</div>
                    <div className="text-[10px] text-[#868C98] mt-1">{c.role}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "typography" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-[6px] border border-[#E2E4E9] bg-[#F4F4F6] p-3 text-xs">
                  <div className="font-mono text-[10px] text-[#868C98] uppercase">Heading Font</div>
                  <div className="font-bold text-[#0A0D14] text-sm mt-1">{currentPreset.typography.heading}</div>
                  <div className="font-mono text-[10px] text-[#525866] mt-1">Tracking: -0.03em</div>
                </div>
                <div className="rounded-[6px] border border-[#E2E4E9] bg-[#F4F4F6] p-3 text-xs">
                  <div className="font-mono text-[10px] text-[#868C98] uppercase">Body Copy</div>
                  <div className="font-bold text-[#0A0D14] text-sm mt-1">{currentPreset.typography.body}</div>
                  <div className="font-mono text-[10px] text-[#525866] mt-1">Line Height: 1.55</div>
                </div>
                <div className="rounded-[6px] border border-[#E2E4E9] bg-[#F4F4F6] p-3 text-xs">
                  <div className="font-mono text-[10px] text-[#868C98] uppercase">Scale Ratio</div>
                  <div className="font-bold text-[#0A0D14] text-sm mt-1">{currentPreset.typography.scale}</div>
                  <div className="font-mono text-[10px] text-[#525866] mt-1">Strict clamp() bounds</div>
                </div>
              </div>
            )}

            {activeTab === "spacing" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-[6px] border border-[#E2E4E9] bg-[#F4F4F6] p-3 text-xs">
                  <div className="font-mono text-[10px] text-[#868C98] uppercase mb-2">Spacing Scale (8pt Grid)</div>
                  <div className="flex flex-wrap gap-2">
                    {currentPreset.spacing.map((s, idx) => (
                      <span
                        key={idx}
                        className="rounded-[4px] border border-[#E2E4E9] bg-white px-2 py-1 font-mono text-[11px] text-[#0A0D14]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-[6px] border border-[#E2E4E9] bg-[#F4F4F6] p-3 text-xs">
                  <div className="font-mono text-[10px] text-[#868C98] uppercase mb-2">Border Radii & Geometry</div>
                  <div className="font-mono text-xs text-[#0A0D14] bg-white p-2.5 rounded-[4px] border border-[#E2E4E9]">
                    {currentPreset.radii}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "markdown" && (
              <div className="rounded-[6px] border border-[#E2E4E9] bg-[#0A0D14] p-4 font-mono text-xs text-[#F4F4F6] overflow-x-auto max-h-72">
                <pre>{currentPreset.markdownSnippet}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
