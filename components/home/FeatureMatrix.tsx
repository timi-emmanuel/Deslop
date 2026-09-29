"use client";

import {
  Palette,
  Ruler,
  TextAa,
  ShieldCheck,
  Check,
  X,
} from "@phosphor-icons/react";
import { CrosshairCard } from "@/components/ui/CrosshairCard";

const FEATURES = [
  {
    icon: Palette,
    title: "Harmonious Colors",
    badge: "No clashing tints",
    description:
      "AI tools often pick random shades that clash. Deslop creates a balanced 5-color palette where every shade looks intentional and easy on the eyes.",
    specimen: (
      <div className="rounded-[10px] bg-canvas border border-keyline p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span>5 Balanced Roles</span>
          <span className="text-pass font-semibold flex items-center gap-1 text-[11px]">
            <Check size={12} weight="bold" /> Easy to read
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1.5 text-center">
          {[
            { name: "Canvas", color: "#F5F2EB", text: "#141413" },
            { name: "Card", color: "#FFFFFF", text: "#141413" },
            { name: "Text", color: "#141413", text: "#FFFFFF" },
            { name: "Accent", color: "#E9551B", text: "#FFFFFF" },
            { name: "Border", color: "#E2DDD2", text: "#141413" },
          ].map((item) => (
            <div key={item.name} className="space-y-1">
              <div
                className="h-8 rounded-[6px] border border-keyline shadow-2xs flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: item.color, color: item.text }}
              >
                Aa
              </div>
              <span className="text-[10px] text-ink-muted block font-medium">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Ruler,
    title: "Balanced Spacing",
    badge: "Clean layout rhythm",
    description:
      "No awkward gaps or crooked padding. Buttons, cards, and text snap to a tidy, comfortable grid so your whole page feels balanced.",
    specimen: (
      <div className="rounded-[10px] bg-canvas border border-keyline p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span>Consistent Margins</span>
          <span className="text-accent font-semibold text-[11px]">Tidy & Aligned</span>
        </div>
        <div className="rounded-[8px] bg-white border border-keyline p-3 space-y-2 shadow-2xs">
          <div className="h-2.5 w-1/3 rounded bg-accent/25" />
          <div className="h-2 w-full rounded bg-surface-sunken" />
          <div className="h-2 w-4/5 rounded bg-surface-sunken" />
          <div className="pt-1 flex items-center gap-2">
            <div className="h-6 px-3 rounded-[6px] bg-accent text-white text-[10px] font-semibold flex items-center shadow-xs">
              Primary Button
            </div>
            <div className="h-6 px-2.5 rounded-[6px] border border-keyline text-[10px] text-ink-muted flex items-center">
              Secondary
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: TextAa,
    title: "Readable Typography",
    badge: "Crisp font pairing",
    description:
      "Generous line spacing and sharp font weights. Your headlines pop and your body text is effortless to read on both desktop and mobile.",
    specimen: (
      <div className="rounded-[10px] bg-canvas border border-keyline p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span>Clear Hierarchy</span>
          <span className="text-ink font-semibold text-[11px]">Display + Body</span>
        </div>
        <div className="rounded-[8px] bg-white border border-keyline p-3.5 space-y-1.5 shadow-2xs">
          <h4 className="text-base font-bold text-ink leading-tight">
            Designed with intent.
          </h4>
          <p className="text-xs text-ink-muted leading-relaxed">
            Headlines are bold and distinctive, while body copy is spaced for
            comfortable, natural reading.
          </p>
        </div>
      </div>
    ),
  },
  {
    icon: ShieldCheck,
    title: "Smart AI Guardrails",
    badge: "Blocks bad habits",
    description:
      "Explicit instructions that tell Cursor, Claude, and v0 what NOT to build—blocking generic purple glows and messy layouts before code is written.",
    specimen: (
      <div className="rounded-[10px] bg-canvas border border-keyline p-3.5 space-y-2 text-xs">
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span>Rules for your AI</span>
          <span className="text-pass font-semibold text-[11px]">Enforced</span>
        </div>
        <div className="rounded-[6px] bg-white border border-keyline p-2.5 flex items-center gap-2 text-fail shadow-2xs">
          <X size={14} weight="bold" className="shrink-0" />
          <span className="text-[11px]">Block generic glowing purple gradients</span>
        </div>
        <div className="rounded-[6px] bg-white border border-keyline p-2.5 flex items-center gap-2 text-pass shadow-2xs">
          <Check size={14} weight="bold" className="shrink-0" />
          <span className="text-[11px]">Enforce clean, intentional colors & layout</span>
        </div>
      </div>
    ),
  },
];

export function FeatureMatrix() {
  return (
    <section id="features" className="py-24 border-b border-keyline bg-canvas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14 pb-6 border-b border-keyline">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="font-mono text-xs uppercase tracking-widest text-ink-muted font-bold">
                BUILT FOR GOOD TASTE
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">
              Everything your AI needs to build clean UI.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-muted max-w-md">
            AI coding tools are fast, but they struggle with design consistency.
            Deslop gives them clear rules so your pages look polished on the first try.
          </p>
        </div>

        {/* 2x2 Calm, Human-Friendly Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <CrosshairCard key={f.title} size="md" className="h-full">
                <div className="border border-keyline bg-white p-6 sm:p-8 flex flex-col justify-between shadow-2xs hover:border-keyline-strong hover:shadow-xs transition-all h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[10px] font-bold text-accent bg-accent-wash border border-accent-border px-2 py-0.5 rounded">
                        {f.badge}
                      </span>
                      <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-canvas border border-keyline text-accent">
                        <Icon size={16} weight="bold" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight text-ink mb-2">
                      {f.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mb-6">
                      {f.description}
                    </p>
                  </div>

                  {/* Friendly Visual Specimen */}
                  <div>{f.specimen}</div>
                </div>
              </CrosshairCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
