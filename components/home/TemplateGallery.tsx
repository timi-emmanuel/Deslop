"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

interface Template {
  id: string;
  name: string;
  url: string;
  desc: string;
  font: string;
  accent: string;
  colors: string[];
  pill: string;
  specCount: string;
}

const TEMPLATES: Template[] = [
  {
    id: "linear-craft",
    name: "Linear Precision",
    url: "https://linear.app",
    desc: "Strict obsidian canvas with violet key action and restrained major-second scale.",
    font: "Geist Sans + JetBrains Mono",
    accent: "#5E6AD2",
    colors: ["#08090A", "#141518", "#222326", "#5E6AD2", "#F7F8F8"],
    pill: "Dark High-Contrast",
    specCount: "32 Tokens",
  },
  {
    id: "stripe-precision",
    name: "Stripe Foundation",
    url: "https://stripe.com",
    desc: "Deep navy foundation with cobalt accent and multi-tier elevated shadows.",
    font: "Söhne Breit + Söhne Text",
    accent: "#635BFF",
    colors: ["#0A2540", "#635BFF", "#00D4FF", "#F6F9FC", "#FFFFFF"],
    pill: "Enterprise SaaS",
    specCount: "44 Tokens",
  },
  {
    id: "supabase-emerald",
    name: "Supabase Monolith",
    url: "https://supabase.com",
    desc: "Developer-first dark canvas with signature emerald badges and monospace metrics.",
    font: "Circular Sans + JetBrains",
    accent: "#3ECF8E",
    colors: ["#121212", "#1C1C1C", "#2E2E2E", "#3ECF8E", "#FFFFFF"],
    pill: "Dev Tool",
    specCount: "36 Tokens",
  },
  {
    id: "raycast-editorial",
    name: "Raycast Redux",
    url: "https://raycast.com",
    desc: "High-density productivity layout with stark monochrome ink and crimson alerts.",
    font: "Inter Display + SF Mono",
    accent: "#FF6363",
    colors: ["#0C0D0E", "#1B1C1E", "#FF6363", "#F2F3F5"],
    pill: "Productivity",
    specCount: "28 Tokens",
  },
];

export function TemplateGallery() {
  return (
    <section id="presets" className="py-24 border-b border-keyline bg-canvas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14 pb-6 border-b border-keyline">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">
              Pre-calibrated token templates.
            </h2>
          </div>
          <p className="text-xs text-ink-subtle">
            Verified for Cursor, Claude Code, and v0
          </p>
        </div>

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="flex flex-col justify-between rounded-[8px] border border-keyline bg-white p-5 shadow-xs hover:border-keyline-strong transition-all"
            >
              <div>
                {/* Category Pill + Token Count */}
                <div className="flex items-center justify-between text-xs pb-3 mb-3 border-b border-keyline">
                  <span className="font-semibold text-accent">{tmpl.pill}</span>
                  <span className="text-ink-subtle font-mono text-[11px]">{tmpl.specCount}</span>
                </div>

                <h3 className="font-bold text-base text-ink tracking-tight">{tmpl.name}</h3>
                <p className="mt-1 text-xs text-ink-muted leading-relaxed mb-4">{tmpl.desc}</p>

                {/* Color Swatch Strip */}
                <div className="flex items-center gap-1.5 mb-4">
                  {tmpl.colors.map((c, i) => (
                    <div
                      key={i}
                      className="h-6 flex-1 rounded-[3px] border border-black/10 shadow-xs"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>

                {/* Font Spec */}
                <div className="rounded-[4px] border border-keyline bg-surface-sunken px-2.5 py-1.5 font-mono text-[11px] text-ink-muted mb-5">
                  {tmpl.font}
                </div>
              </div>

              {/* Inspect Button */}
              <Link
                href={`/inspect?url=${encodeURIComponent(tmpl.url)}`}
                className="btn-gloss-neutral w-full h-9 text-xs font-semibold gap-1.5 cursor-pointer"
              >
                <span>Inspect in Studio</span>
                <ArrowRight size={13} weight="bold" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
