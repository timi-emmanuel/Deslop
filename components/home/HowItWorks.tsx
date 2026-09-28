"use client";

import { Globe, SlidersHorizontal, FileCode } from "@phosphor-icons/react";

const STEPS = [
  {
    step: "01",
    action: "SCAN",
    title: "Inspect live computed styles",
    description:
      "Paste any URL you admire (Linear, Stripe, Raycast). Deslop inspects how the site actually renders on a screen—measuring real computed colors, rendered font stacks, and layout dimensions.",
    spec: "Linear, Stripe, Raycast, or any URL",
    highlight: "Live DOM inspection",
    icon: Globe,
  },
  {
    step: "02",
    action: "PURGE",
    title: "Clean noise & AI slop",
    description:
      "Real websites often have 50+ messy hex codes and weird 13px padding hacks. Deslop clusters colors into 5 crisp semantic roles and snaps spacing to an 8pt modular grid.",
    spec: "50+ messy values → 5 locked roles",
    highlight: "8pt baseline · WCAG AAA",
    icon: SlidersHorizontal,
  },
  {
    step: "03",
    action: "ENFORCE",
    title: "Drop 1 file into your AI",
    description:
      "Deslop outputs a clean design.md file. Drop it into Cursor, Claude Code, Lovable, or v0, and your AI assistant will build disciplined, on-brand interfaces on the first try.",
    spec: "Cursor, Claude, Lovable, v0",
    highlight: "Zero-Slop Guarantee",
    icon: FileCode,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 border-b border-keyline bg-canvas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14 pb-6 border-b border-keyline">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">
              Three steps from live site to locked tokens.
            </h2>
          </div>
          <p className="text-xs text-ink-subtle">
            From any live website to clean AI code in seconds
          </p>
        </div>

        {/* 3-Step Simple Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="rounded-[12px] border border-keyline bg-white p-6 flex flex-col justify-between shadow-2xs hover:border-keyline-strong hover:shadow-xs transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-accent bg-accent-wash border border-accent-border px-2 py-0.5 rounded">
                      STEP {s.step}
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

                <div className="mt-6 pt-4 border-t border-keyline flex items-center justify-between font-mono text-[11px]">
                  <span className="text-ink-subtle truncate max-w-[160px]">
                    {s.spec}
                  </span>
                  <span className="text-ink font-semibold">{s.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
