"use client";

import Link from "next/link";
import { ArrowRight, Sparkle } from "@phosphor-icons/react";
import { motion } from "motion/react";

interface Template {
  id: string;
  name: string;
  url: string;
  desc: string;
  font: string;
  dots: string[];
  pill: string;
  pillColor: string;
  specCount: string;
}

const TEMPLATES: Template[] = [
  {
    id: "minimal-obsidian",
    name: "Minimal Obsidian",
    url: "https://linear.app",
    desc: "Ultra-clean monochrome with deep obsidian canvas and crisp white typography.",
    font: "Geist Sans + JetBrains Mono",
    dots: ["#0A0A0A", "#171717", "#EDEDED"],
    pill: "Monochrome",
    pillColor: "text-zinc-400 bg-zinc-800/60 border-zinc-700/60",
    specCount: "32 Tokens · 8pt Grid",
  },
  {
    id: "hyper-bold-crimson",
    name: "Hyper-Bold Crimson",
    url: "https://raycast.com",
    desc: "Electric crimson accents against midnight carbon for developer tools.",
    font: "Inter Display + SF Mono",
    dots: ["#090A0F", "#FF3366", "#FFFFFF"],
    pill: "Dev Tool",
    pillColor: "text-rose-400 bg-rose-950/40 border-rose-800/50",
    specCount: "28 Tokens · AA Pass",
  },
  {
    id: "enterprise-cobalt",
    name: "Enterprise Cobalt",
    url: "https://stripe.com",
    desc: "Authoritative corporate SaaS palette with balanced slate and navy accents.",
    font: "Söhne Breit + Söhne Text",
    dots: ["#F8FAFC", "#0F172A", "#2563EB"],
    pill: "Enterprise SaaS",
    pillColor: "text-blue-400 bg-blue-950/40 border-blue-800/50",
    specCount: "44 Tokens · Shadows",
  },
  {
    id: "expressive-iris",
    name: "Expressive Iris",
    url: "https://supabase.com",
    desc: "Refined violet and iris gradients for next-generation consumer apps.",
    font: "Plus Jakarta Sans + JetBrains",
    dots: ["#0B0A10", "#8B5CF6", "#F3F4F6"],
    pill: "Modern Fintech",
    pillColor: "text-purple-400 bg-purple-950/40 border-purple-800/50",
    specCount: "36 Tokens · WCAG AAA",
  },
];

export function TemplateGallery() {
  return (
    <section id="templates" className="py-24 border-b border-keyline bg-canvas relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-6 border-b border-keyline"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-accent" />
              <span className="font-mono text-xs uppercase tracking-widest text-ink-muted font-bold">
                CURATED DESIGN.MD TEMPLATES
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">
              Curated design.md templates
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-ink-muted max-w-xl">
              Don&apos;t have a site to inspect? Start with battle-tested design tokens from iconic UI paradigms.
            </p>
          </div>

          <Link
            href="/inspect?url=https%3A%2F%2Flinear.app"
            className="text-xs font-mono font-semibold text-accent hover:text-accent-hover flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>Browse all in Studio</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* 2x2 High-Craft Dark Obsidian Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TEMPLATES.map((tmpl, idx) => (
            <motion.div
              key={tmpl.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.85,
                delay: 0.08 + idx * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative rounded-[10px] border border-[#222734] bg-[#0A0D14] p-6 sm:p-7 shadow-xl hover:border-accent/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Pill badge + Color swatch dots */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1A202E]">
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold border ${tmpl.pillColor}`}
                  >
                    {tmpl.pill}
                  </span>

                  {/* Circular Swatch Dots */}
                  <div className="flex items-center gap-2">
                    {tmpl.dots.map((dot, i) => (
                      <span
                        key={i}
                        className="h-3.5 w-3.5 rounded-full border border-white/20 shadow-sm transition-transform group-hover:scale-110"
                        style={{ backgroundColor: dot }}
                        title={dot}
                      />
                    ))}
                  </div>
                </div>

                {/* Template Name & Description */}
                <h3 className="text-xl font-bold text-[#F8FAFC] tracking-tight group-hover:text-accent transition-colors">
                  {tmpl.name}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6">
                  {tmpl.desc}
                </p>

                {/* Font Stack Spec */}
                <div className="rounded-[6px] border border-[#1E2433] bg-[#10141E] px-3 py-2 font-mono text-[11px] text-[#CBD5E1] mb-6 flex items-center justify-between">
                  <span>{tmpl.font}</span>
                  <span className="text-[10px] text-[#64748B]">{tmpl.specCount}</span>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/inspect?url=${encodeURIComponent(tmpl.url)}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#161B26] hover:bg-accent border border-[#2B3346] hover:border-accent text-xs font-semibold text-[#F1F5F9] hover:text-white py-2.5 px-4 transition-all duration-200 cursor-pointer"
              >
                <span>Use Template</span>
                <ArrowRight size={13} weight="bold" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
