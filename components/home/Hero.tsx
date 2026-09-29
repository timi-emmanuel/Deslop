"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Globe } from "@phosphor-icons/react";
import { CrosshairCard } from "@/components/ui/CrosshairCard";

const TARGET_TOOLS = ["Cursor", "Claude", "Tailwind", "shadcn"];

export function Hero() {
  const router = useRouter();

  // Core State
  const [urlInput, setUrlInput] = useState<string>("");

  // Tool cycler
  const [toolIndex, setToolIndex] = useState<number>(0);

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
    <section className="relative overflow-hidden pt-16 sm:pt-24 pb-20 sm:pb-28 border-b border-keyline bg-canvas bg-drafting-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        {/* ============================================================
            HERO HEADER WITH HANDCRAFTED SCRIBBLE & CYCLER
            ============================================================ */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Main Headline with Hand-Drawn Scribble Underline */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-ink leading-[1.14]">
            Steal any website&apos;s{" "}
            <span className="relative inline-block text-ink">
              look.
              {/* Organic Hand-Drawn Scribble Underline SVG */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-[14px] text-accent opacity-90"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M2,10 Q25,2 50,8 T98,5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <br className="hidden sm:inline" />
            Perfect UI on the first prompt for{" "}
            <span className="relative inline-flex h-[1.18em] overflow-hidden align-bottom">
              <span
                key={currentTool}
                className="inline-block animate-slide-up-in font-bold text-accent"
              >
                {currentTool}
              </span>
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
            <form
              onSubmit={handleExtract}
              className="w-full flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 border border-keyline bg-white shadow-keyline"
            >
              <div className="relative flex-1 flex items-center">
                <div className="pl-3.5 text-ink-subtle pointer-events-none">
                  <Globe size={18} />
                </div>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter any live URL (e.g. linear.app)"
                  required
                  className="w-full bg-transparent pl-3 pr-4 py-2.5 text-xs sm:text-sm text-ink placeholder-ink-subtle focus:outline-none font-mono"
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
          </CrosshairCard>
        </div>
      </div>
    </section>
  );
}
