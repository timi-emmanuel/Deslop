"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Globe } from "@phosphor-icons/react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { CrosshairCard } from "@/components/ui/CrosshairCard";

const TARGET_TOOLS = ["Cursor", "Claude", "Tailwind", "shadcn"];

export function Hero() {
  const router = useRouter();

  // Core State
  const [urlInput, setUrlInput] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Tool cycler
  const [toolIndex, setToolIndex] = useState<number>(0);

  // Interactive Flowing Blob Mouse Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 120 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 120 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x * 0.25);
    mouseY.set(y * 0.25);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setToolIndex((prev) => (prev + 1) % TARGET_TOOLS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const currentTool = TARGET_TOOLS[toolIndex];

  const handleExtract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    router.push(`/inspect?url=${encodeURIComponent(urlInput.trim())}`);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden pt-16 sm:pt-24 pb-20 sm:pb-28 border-b border-keyline bg-canvas bg-drafting-grid"
    >
      {/* ============================================================
          INTERACTIVE AMBIENT FLOWING CHROMATIC BLOB
          ============================================================ */}
      <motion.div
        aria-hidden="true"
        style={{ x: springX, y: springY }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center -z-0 overflow-hidden"
      >
        <div className="relative w-[500px] sm:w-[680px] h-[320px] sm:h-[440px] filter blur-[95px] opacity-40 sm:opacity-50">
          {/* Primary Warm Accent Node */}
          <motion.div
            animate={{
              scale: [1, 1.15, 0.92, 1],
              rotate: [0, 90, 180, 360],
              x: [0, 40, -30, 0],
              y: [0, -30, 25, 0],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-gradient-to-tr from-[#f0642f] via-[#ff7849] to-[#fb923c] mix-blend-multiply"
          />

          {/* Secondary Amber Sunburst Node */}
          <motion.div
            animate={{
              scale: [1.1, 0.9, 1.18, 1.1],
              rotate: [360, 240, 120, 0],
              x: [0, -45, 35, 0],
              y: [0, 35, -35, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-bl from-[#f59e0b] via-[#fbbf24] to-[#fde68a] mix-blend-multiply"
          />

          {/* Soft Peach Center Bridge Node */}
          <motion.div
            animate={{
              scale: [0.95, 1.12, 0.92, 0.95],
              x: [0, 25, -20, 0],
              y: [0, -18, 18, 0],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-x-12 inset-y-12 rounded-full bg-[#fbd5c6] opacity-60"
          />
        </div>
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        {/* ============================================================
            HERO HEADER WITH HANDCRAFTED SCRIBBLE & CYCLER
            ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          {/* Main Headline with Hand-Drawn Scribble Underline */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-ink leading-[1.14]">
            Steal any website&apos;s{" "}
            <span className="relative inline-block text-ink">
              look.
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
            <br className="hidden sm:inline" />
            Perfect UI on the first prompt for{" "}
            <span className="relative inline-flex h-[1.18em] overflow-hidden align-bottom min-w-[3.6ch] text-left">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={currentTool}
                  initial={{ y: "110%", opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: "-110%", opacity: 0, filter: "blur(4px)" }}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 24,
                    mass: 0.8,
                  }}
                  className="inline-block font-bold text-accent"
                >
                  {currentTool}
                </motion.span>
              </AnimatePresence>
            </span>
            .
          </h1>

          <p className="mt-5 text-xs sm:text-sm text-ink-muted leading-relaxed max-w-2xl">
            Extract clean colors, typography, and 8px spacing from any live
            website. Generate a single{" "}
            <code className="font-mono text-xs bg-white border border-keyline px-1.5 py-0.5 rounded text-ink font-semibold">
              design.md
            </code>{" "}
            file that teaches Cursor, Claude, Lovable, or v0 to build gorgeous
            UI on the first prompt.
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
                  placeholder="Enter any live URL (e.g. linear.app)"
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
                <span>Extract Design</span>
                <ArrowRight size={15} weight="bold" />
              </motion.button>
            </motion.form>
          </CrosshairCard>
        </motion.div>
      </div>
    </section>
  );
}
