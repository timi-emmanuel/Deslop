"use client";

import { Globe, SlidersHorizontal, FileCode } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { CrosshairCard } from "@/components/ui/CrosshairCard";

const STEPS = [
  {
    step: "01",
    action: "SCAN",
    title: "Read the live site",
    description:
      "Paste any public URL. Deslop loads it in a real browser and measures the computed colors, fonts, spacing, and radii the page actually renders.",
    spec: "Linear, Stripe, Raycast",
    highlight: "Computed styles, not source CSS",
    icon: Globe,
  },
  {
    step: "02",
    action: "PURGE",
    title: "Cut the noise",
    description:
      "Mature sites often carry 50+ near-duplicate colors and one-off values like 13px padding. Deslop groups the colors into 6 semantic roles and snaps spacing to an 8pt grid.",
    spec: "50+ colors → 6 roles",
    highlight: "8pt grid · AA/AAA checked",
    icon: SlidersHorizontal,
  },
  {
    step: "03",
    action: "APPLY",
    title: "Drop one file into your AI",
    description:
      "Deslop writes a design.md with your tokens and explicit do-not rules. Add it to Cursor, Claude Code, v0, or Lovable, and your AI has far better odds of producing on-brand UI.",
    spec: "Cursor, Claude, v0",
    highlight: "Fewer off-brand results",
    icon: FileCode,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 border-b border-keyline bg-canvas overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14 pb-6 border-b border-keyline"
        >
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">
              Three steps from live site to locked tokens.
            </h2>
          </div>
          <p className="text-xs text-ink-subtle">
            From any live website to clean AI code in seconds
          </p>
        </motion.div>

        {/* 3-Step Simple Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.85,
                  delay: 0.1 + idx * 0.14,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full"
              >
                <CrosshairCard size="md" className="h-full">
                  <div className="border border-keyline bg-white p-6 flex flex-col justify-between shadow-2xs h-full">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs font-bold text-accent tracking-wider">
                          [ STEP {s.step} · {s.action} ]
                        </span>
                        <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-white border border-keyline text-ink-muted">
                          <Icon size={16} weight="bold" className="text-accent" />
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-ink tracking-tight mb-2">
                        {s.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                        {s.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-keyline font-mono text-[11px] leading-relaxed text-ink-subtle">
                      <span>{s.spec}</span>
                      <span className="mx-2 text-ink-subtle/50 select-none">·</span>
                      <span className="text-ink font-semibold inline-block">{s.highlight}</span>
                    </div>
                  </div>
                </CrosshairCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
