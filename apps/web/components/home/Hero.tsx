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
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255, 72, 0, 0.08) 0%, transparent 75%)",
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
            <span className="text-accent">
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
                borderColor: isFocused ? "#f0642f" : "#e5dfd3",
                boxShadow: isFocused
                  ? "0 4px 16px -2px rgba(240, 100, 47, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.04)"
                  : "0 1px 2px rgba(0, 0, 0, 0.05)",
              }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 border bg-white rounded-[2px]"
            >
              <div className="relative flex-1 flex items-center">
                <div
                  className={`pl-3.5 transition-colors duration-200 pointer-events-none ${
                    isFocused ? "text-accent" : "text-ink-subtle"
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
                className="btn-gloss-orange h-11 px-6 text-xs sm:text-sm font-semibold tracking-[-0.01em] shrink-0 gap-2 cursor-pointer"
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
                className="px-2.5 py-1 rounded-full border border-keyline bg-white hover:border-accent hover:text-accent text-ink-muted font-mono text-[11px] font-medium transition-all shadow-2xs cursor-pointer flex items-center gap-1 group"
              >
                <span>{demo.name}</span>
                <ArrowRight
                  size={10}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </button>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
}
