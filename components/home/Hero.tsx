"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Globe,
  CheckCircle,
  Copy,
  SlidersHorizontal,
  TextAa,
  Palette,
  Sparkle,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { CrosshairCard } from "@/components/ui/CrosshairCard";

const DEMO_SITES = [
  { name: "Stripe", url: "https://stripe.com" },
  { name: "Linear", url: "https://linear.app" },
  { name: "Vercel", url: "https://vercel.com" },
  { name: "Raycast", url: "https://raycast.com" },
];

export function Hero() {
  const router = useRouter();

  // Core State
  const [urlInput, setUrlInput] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const handleExtract = (e?: React.FormEvent, directUrl?: string) => {
    if (e) e.preventDefault();
    const target = directUrl || urlInput.trim();
    if (!target) return;
    router.push(`/inspect?url=${encodeURIComponent(target)}`);
  };

  const handleCopyTailwind = () => {
    navigator.clipboard.writeText(`@theme {
  --color-canvas: #08090A;
  --color-surface: #141518;
  --color-text-primary: #F7F8F8;
  --color-accent-primary: #5E6AD2;
  --font-display: "Geist Sans", sans-serif;
  --font-body: "Inter", sans-serif;
  --radius-card: 12px;
}`);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-14 sm:pt-20 pb-20 sm:pb-28 border-b border-keyline bg-canvas bg-drafting-grid">
      {/* Top ambient radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-full max-w-7xl -translate-x-1/2 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(37, 99, 235, 0.12) 0%, transparent 75%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        {/* ============================================================
            HERO HEADER
            ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-ink leading-[1.08]">
            Stop shipping AI slop.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Start shipping design.
            </span>
          </h1>

          <p className="mt-5 text-xs sm:text-sm md:text-base text-ink-muted leading-relaxed max-w-2xl mx-auto">
            Extract exact design tokens, typography scales, and spacing ramps from any live website or URL into a hardened{" "}
            <code className="font-mono text-xs bg-white border border-keyline px-1.5 py-0.5 rounded text-ink font-semibold">
              design.md
            </code>{" "}
            ready for Cursor / Claude.
          </p>

          {/* Primary URL Input Form */}
          <CrosshairCard size="md" className="mt-8 w-full max-w-xl">
            <motion.form
              onSubmit={(e) => handleExtract(e)}
              animate={{
                borderColor: isFocused ? "#2563EB" : "#e5dfd3",
                boxShadow: isFocused
                  ? "0 4px 16px -2px rgba(37, 99, 235, 0.14), 0 2px 4px -1px rgba(0, 0, 0, 0.04)"
                  : "0 1px 2px rgba(0, 0, 0, 0.05)",
              }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 border bg-white rounded-[2px]"
            >
              <div className="relative flex-1 flex items-center">
                <div
                  className={`pl-3.5 transition-colors duration-200 pointer-events-none ${
                    isFocused ? "text-blue-600" : "text-ink-subtle"
                  }`}
                >
                  <Globe size={18} />
                </div>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="https://linear.app (or any website URL)"
                  required
                  className="w-full bg-transparent pl-3 pr-4 py-2.5 text-xs sm:text-sm text-ink placeholder-ink-subtle focus:outline-none font-mono"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="btn-gloss-blue h-11 px-6 text-xs sm:text-sm font-semibold tracking-[-0.01em] shrink-0 gap-2 cursor-pointer"
              >
                <span>Inspect Website</span>
                <ArrowRight size={15} weight="bold" />
              </motion.button>
            </motion.form>
          </CrosshairCard>

          {/* Quick Demo Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-ink-subtle">
            <span className="font-mono text-[11px] text-ink-muted">Or try a demo:</span>
            {DEMO_SITES.map((demo) => (
              <button
                key={demo.name}
                type="button"
                onClick={() => handleExtract(undefined, demo.url)}
                className="px-2.5 py-1 rounded-full border border-keyline bg-white hover:border-blue-500 hover:text-blue-600 text-ink-muted font-mono text-[11px] font-medium transition-all shadow-2xs cursor-pointer flex items-center gap-1 group"
              >
                <span>{demo.name}</span>
                <ArrowRight
                  size={10}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </button>
            ))}
          </div>

          {/* ============================================================
              HERO PRODUCT PREVIEW MOCKUP (STUDIO EXTRACTED CARD)
              ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 w-full max-w-5xl rounded-[12px] border border-[#222734] bg-[#0A0D14] shadow-2xl overflow-hidden text-left"
          >
            {/* Window Top Navigation Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1B202D] bg-[#0E121B] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#EF4444]/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#10B981]/80" />
                </div>
                <div className="h-4 w-px bg-[#262C3D]" />
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[#F4F4F6] font-semibold">linear.app</span>
                  <span className="text-[#868C98]">/ tokens-v1</span>
                  <span className="rounded bg-[#1A202E] border border-[#2B3346] px-1.5 py-0.5 text-[10px] text-[#A5B4FC] font-semibold">
                    32 TOKENS
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyTailwind}
                  className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#2B3346] bg-[#161B26] px-2.5 py-1 text-[11px] font-mono text-[#D1D5DB] hover:text-white hover:border-[#3B82F6] transition-colors cursor-pointer"
                >
                  {copiedSnippet ? (
                    <CheckCircle size={13} weight="fill" className="text-[#10B981]" />
                  ) : (
                    <Copy size={13} />
                  )}
                  <span>{copiedSnippet ? "Copied" : "Copy Tailwind v4"}</span>
                </button>
                <Link
                  href="/inspect?url=https%3A%2F%2Flinear.app"
                  className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#2563EB] hover:bg-[#1D4ED8] px-3 py-1 text-[11px] font-semibold text-white transition-colors cursor-pointer"
                >
                  <span>Inspect in Studio</span>
                  <ArrowRight size={12} weight="bold" />
                </Link>
              </div>
            </div>

            {/* Window Content: 3-Column Token Preview Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1B202D] p-5 sm:p-6 gap-6 md:gap-0">
              {/* Column 1: Color Tokens */}
              <div className="md:pr-6 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-[#1B202D]">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#94A3B8] uppercase">
                    <Palette size={14} className="text-[#3B82F6]" />
                    Semantic Colors
                  </span>
                  <span className="font-mono text-[10px] text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded">
                    CIEDE2000
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {[
                    { name: "--bg-canvas", hex: "#08090A", role: "canvas", wcag: "BASE" },
                    { name: "--surface", hex: "#141518", role: "surface", wcag: "1.14:1" },
                    { name: "--text-primary", hex: "#F7F8F8", role: "text", wcag: "AAA 18.2:1" },
                    { name: "--accent-primary", hex: "#5E6AD2", role: "action", wcag: "AA 5.8:1" },
                    { name: "--accent-secondary", hex: "#8A94F8", role: "interactive", wcag: "AAA 8.4:1" },
                  ].map((color) => (
                    <div
                      key={color.name}
                      className="flex items-center justify-between p-2 rounded-[6px] bg-[#10141E] border border-[#1E2433] hover:border-[#384259] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-4 w-4 rounded-[4px] border border-white/20 shrink-0 shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-[#E2E8F0] font-medium text-[11px]">{color.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#94A3B8] text-[11px]">{color.hex}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 text-[#60A5FA]">
                          {color.wcag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Typography Hierarchy */}
              <div className="md:px-6 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-[#1B202D]">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#94A3B8] uppercase">
                    <TextAa size={14} className="text-[#818CF8]" />
                    Typography Ramp
                  </span>
                  <span className="font-mono text-[10px] text-[#A5B4FC] bg-[#818CF8]/10 px-1.5 py-0.5 rounded">
                    Major Second
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-[6px] bg-[#10141E] border border-[#1E2433] space-y-1">
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#94A3B8]">
                      <span>DISPLAY</span>
                      <span className="text-[#38BDF8]">Geist Sans · 800 Bold</span>
                    </div>
                    <div className="text-xl font-bold tracking-tight text-[#F8FAFC]">
                      Next-Gen Velocity
                    </div>
                  </div>

                  <div className="p-3 rounded-[6px] bg-[#10141E] border border-[#1E2433] space-y-1">
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#94A3B8]">
                      <span>BODY & INTERFACE</span>
                      <span className="text-[#94A3B8]">Inter · 400 Regular</span>
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      Linear planning and issue tracking for high-performance product teams.
                    </p>
                  </div>

                  <div className="rounded-[6px] bg-[#10141E] border border-[#1E2433] p-2.5 font-mono text-[11px] text-[#94A3B8] flex items-center justify-between">
                    <span>CODE / MONO</span>
                    <span className="text-[#F1F5F9]">JetBrains Mono (0.9em)</span>
                  </div>
                </div>
              </div>

              {/* Column 3: Geometry & Anti-Slop Constraints */}
              <div className="md:pl-6 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-[#1B202D]">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#94A3B8] uppercase">
                    <SlidersHorizontal size={14} className="text-[#10B981]" />
                    8pt Geometry & Rules
                  </span>
                  <span className="font-mono text-[10px] text-[#34D399] bg-[#10B981]/10 px-1.5 py-0.5 rounded">
                    Locked Grid
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-[6px] bg-[#10141E] border border-[#1E2433] space-y-2">
                    <span className="font-mono text-[10px] text-[#94A3B8] block">SPACING RAMP (PX)</span>
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      {[4, 8, 16, 24, 32, 48].map((px) => (
                        <span
                          key={px}
                          className="flex-1 py-1 text-center rounded bg-[#1A202E] border border-[#2B3346] text-[#CBD5E1]"
                        >
                          {px}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-[6px] bg-[#10141E] border border-[#1E2433] space-y-2 font-mono text-[11px]">
                    <span className="text-[10px] text-[#94A3B8] block">RADII TOKENS</span>
                    <div className="flex items-center justify-between text-[#CBD5E1]">
                      <span>Controls: 6px</span>
                      <span>Cards: 12px</span>
                      <span>Pills: 9999px</span>
                    </div>
                  </div>

                  {/* Anti-Slop Negative Rule Badge */}
                  <div className="p-2.5 rounded-[6px] bg-[#1E1B4B]/30 border border-[#4338CA]/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#A5B4FC]">
                      <Sparkle size={13} weight="fill" className="text-[#818CF8]" />
                      <span>ANTI-SLOP DIRECTIVES</span>
                    </div>
                    <div className="font-mono text-[10px] text-[#94A3B8] space-y-0.5">
                      <div>✔ 0 unmapped hex codes permitted</div>
                      <div>✔ No generic glowing purple cliché gradients</div>
                      <div>✔ Strict 8pt snap on margins and padding</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
