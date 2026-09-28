"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Globe,
  ArrowRight,
  Sparkle,
  ArrowLeft,
  Crosshair,
  Palette,
  TextAa,
  Ruler,
  FileCode,
} from "@phosphor-icons/react";

const QUICK_PRESETS = [
  { name: "Woblo", url: "https://woblo.in", accent: "#0F7FFF", font: "Plus Jakarta" },
  { name: "Linear", url: "https://linear.app", accent: "#5E6AD2", font: "Geist Sans" },
  { name: "Stripe", url: "https://stripe.com", accent: "#635BFF", font: "Söhne" },
  { name: "Supabase", url: "https://supabase.com", accent: "#3ECF8E", font: "Circular" },
  { name: "Raycast", url: "https://raycast.com", accent: "#FF6363", font: "Inter Display" },
  { name: "Tailwind CSS", url: "https://tailwindcss.com", accent: "#38BDF8", font: "Inter" },
];

export function StudioLauncher() {
  const router = useRouter();
  const [inputUrl, setInputUrl] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    const formatted = inputUrl.trim().startsWith("http")
      ? inputUrl.trim()
      : `https://${inputUrl.trim()}`;
    router.push(`/inspect?url=${encodeURIComponent(formatted)}`);
  };

  const handleLaunchPreset = (url: string) => {
    router.push(`/inspect?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="min-h-screen bg-canvas bg-drafting-grid flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="border-b border-keyline bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left: Branding */}
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-accent text-white shadow-xs">
              <Crosshair size={14} weight="bold" />
            </div>
            <span className="font-bold text-xs tracking-tight text-ink uppercase font-mono">
              Deslop Studio
            </span>
          </div>

          {/* Right: Return to Home */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors px-2.5 py-1.5 rounded-[6px] border border-keyline bg-surface-sunken hover:bg-canvas shadow-2xs"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Studio Launcher Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 max-w-3xl mx-auto w-full text-center">
        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink leading-tight">
          What website do you want to{" "}
          <motion.span
            animate={{ 
              rotate: [0, -5, 5, -5, 0],
              scale: [1, 1.05, 1] 
            }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0.5
            }}
            className="inline-block font-serif-editorial font-medium italic text-accent origin-center"
          >
            deslop
          </motion.span>
          ?
        </h1>
        <p className="mt-3 text-sm sm:text-base text-ink-muted max-w-lg leading-relaxed">
          Paste any live URL. Deslop will crawl the computed styles, cluster semantic colors, quantize the 8pt grid, and compile an anti-slop <code className="font-mono text-xs bg-white border border-keyline px-1 py-0.5 rounded text-ink">design.md</code>.
        </p>

        {/* Focused Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 w-full flex flex-col sm:flex-row items-stretch gap-2.5 p-2 rounded-[12px] border border-keyline bg-white shadow-keyline"
        >
          <div className="relative flex-1 flex items-center">
            <div className="pl-3.5 text-ink-subtle pointer-events-none">
              <Globe size={18} />
            </div>
            <input
              type="text"
              autoFocus
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste any live URL"
              className="w-full bg-transparent pl-3 pr-4 py-2 text-xs sm:text-sm text-ink placeholder-ink-subtle focus:outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            className="btn-gloss-orange h-10 px-6 text-xs sm:text-sm font-semibold tracking-[-0.01em] shrink-0 gap-2 cursor-pointer"
          >
            <span>Inspect Website</span>
            <ArrowRight size={15} weight="bold" />
          </button>
        </form>

        {/* Quick Presets */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="font-mono text-[10px] text-ink-subtle uppercase mr-1">
            Or test a preset:
          </span>
          {QUICK_PRESETS.map((preset) => (
            <button
              key={preset.url}
              type="button"
              onClick={() => handleLaunchPreset(preset.url)}
              className="inline-flex items-center gap-1.5 btn-gloss-neutral px-3 py-1.5 text-xs font-medium cursor-pointer transition-all hover:border-accent"
            >
              <span
                className="h-2 w-2 rounded-full border border-black/10"
                style={{ backgroundColor: preset.accent }}
              />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>

        {/* 4 Core Benefits */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-14 text-left w-full">
          <div className="rounded-[8px] border border-keyline bg-white p-3.5 shadow-2xs">
            <Palette size={16} className="text-accent mb-2" weight="duotone" />
            <div className="font-bold text-xs text-ink">Perfect Colors</div>
            <div className="text-[11px] text-ink-muted mt-0.5">No more ugly AI colors. Guaranteed readable text with zero guesswork.</div>
          </div>

          <div className="rounded-[8px] border border-keyline bg-white p-3.5 shadow-2xs">
            <TextAa size={16} className="text-[#2563EB] mb-2" weight="duotone" />
            <div className="font-bold text-xs text-ink">Premium Typography</div>
            <div className="text-[11px] text-ink-muted mt-0.5">Steal exact fonts and sizing so your app looks instantly professional.</div>
          </div>

          <div className="rounded-[8px] border border-keyline bg-white p-3.5 shadow-2xs">
            <Ruler size={16} className="text-[#059669] mb-2" weight="duotone" />
            <div className="font-bold text-xs text-ink">Crisp Spacing</div>
            <div className="text-[11px] text-ink-muted mt-0.5">Spacing that feels premium. No more weirdly shaped buttons or cards.</div>
          </div>

          <div className="rounded-[8px] border border-keyline bg-white p-3.5 shadow-2xs">
            <FileCode size={16} className="text-[#7C3AED] mb-2" weight="duotone" />
            <div className="font-bold text-xs text-ink">One File To Fix UI</div>
            <div className="text-[11px] text-ink-muted mt-0.5">Drop one file in Cursor and your AI becomes a senior UI designer.</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-keyline py-4 text-center font-mono text-[11px] text-ink-subtle bg-canvas">
        Deslop Studio · Local headless AST & live CSS style parser
      </footer>
    </div>
  );
}
