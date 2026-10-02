"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Globe } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { CrosshairCard } from "@/components/ui/CrosshairCard";

export function Hero() {
  const router = useRouter();

  // Core State
  const [urlInput, setUrlInput] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleExtract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    router.push(`/inspect?url=${encodeURIComponent(urlInput.trim())}`);
  };

  return (
    <section className="relative overflow-hidden pt-16 sm:pt-24 pb-20 sm:pb-28 border-b border-keyline bg-canvas bg-drafting-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        {/* ============================================================
            HERO HEADER WITH HANDCRAFTED SCRIBBLE
            ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          {/* Main Headline with Hand-Drawn Scribble Underline */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-ink leading-[1.14]">
            Steal any website&apos;s{" "}
            <span className="relative inline-block text-ink">
              look
              {/* Organic Hand-Drawn Scribble Underline SVG */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-[14px] text-accent pointer-events-none"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M2,10 Q25,2 50,8 T98,5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.9 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                />
              </svg>
            </span>
            , minus the mess.
            <br className="hidden sm:inline" />
            <span className="text-accent">On-brand UI</span> from your first prompt.
          </h1>

          <p className="mt-5 text-xs sm:text-sm text-ink-muted leading-relaxed max-w-2xl">
            Deslop measures the colors, type, and spacing a live site actually renders, cleans them up, and writes one{" "}
            <code className="font-mono text-xs bg-white border border-keyline px-1.5 py-0.5 rounded text-ink font-semibold">
              design.md
            </code>{" "}
            your AI coding tool can follow.
          </p>

          {/* Primary URL Input Form */}
          <CrosshairCard size="md" className="mt-8 w-full max-w-xl">
            <motion.form
              onSubmit={handleExtract}
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
                <div className={`pl-3.5 transition-colors duration-200 pointer-events-none ${isFocused ? "text-accent" : "text-ink-subtle"}`}>
                  <Globe size={18} />
                </div>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter a public URL (e.g. linear.app)"
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
                <span>Extract design</span>
                <ArrowRight size={15} weight="bold" />
              </motion.button>
            </motion.form>
          </CrosshairCard>
        </motion.div>
      </div>
    </section>
  );
}
