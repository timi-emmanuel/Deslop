"use client";

import { useState } from "react";
import { DownloadSimple, ArrowUpRight, CheckCircle, SquaresFour } from "@phosphor-icons/react";

interface Template {
  id: string;
  name: string;
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
    desc: "Strict obsidian canvas with violet key action and restrained major-second scale.",
    font: "Geist Sans + JetBrains Mono",
    accent: "#5E6AD2",
    colors: ["#08090A", "#141518", "#222326", "#5E6AD2", "#F7F8F8"],
    pill: "DARK HIGH-CONTRAST",
    specCount: "32 TOKENS",
  },
  {
    id: "stripe-precision",
    name: "Stripe Foundation",
    desc: "Deep navy foundation with cobalt accent and multi-tier elevated shadows.",
    font: "Söhne Breit + Söhne Text",
    accent: "#635BFF",
    colors: ["#0A2540", "#635BFF", "#00D4FF", "#F6F9FC", "#FFFFFF"],
    pill: "ENTERPRISE SAAS",
    specCount: "44 TOKENS",
  },
  {
    id: "supabase-emerald",
    name: "Supabase Monolith",
    desc: "Developer-first dark canvas with signature emerald badges and monospace metrics.",
    font: "Circular Sans + JetBrains",
    accent: "#3ECF8E",
    colors: ["#121212", "#1C1C1C", "#2E2E2E", "#3ECF8E", "#FFFFFF"],
    pill: "DEV-TOOL",
    specCount: "36 TOKENS",
  },
  {
    id: "raycast-editorial",
    name: "Raycast Redux",
    desc: "High-density productivity layout with stark monochrome ink and crimson alerts.",
    font: "Inter Display + SF Mono",
    accent: "#FF6363",
    colors: ["#0C0D0E", "#1B1C1E", "#FF6363", "#F2F3F5"],
    pill: "PRODUCTIVITY",
    specCount: "28 TOKENS",
  },
];

export function TemplateGallery() {
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const handleDownload = (id: string) => {
    setDownloadedId(id);
    setTimeout(() => setDownloadedId(null), 2000);
  };

  return (
    <section id="presets" className="py-20 border-b border-[#E2E4E9] bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-6 border-b border-[#E2E4E9]">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#FF4800]">
              <SquaresFour size={15} weight="bold" />
              <span>CURATED DESIGN SYSTEMS</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0A0D14]">
              Pre-calibrated token templates.
            </h2>
          </div>
          <p className="text-xs font-mono text-[#868C98]">
            VERIFIED_PRESETS // ZERO_SLOP_CERTIFIED
          </p>
        </div>

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.map((tmpl) => {
            const isDownloaded = downloadedId === tmpl.id;
            return (
              <div
                key={tmpl.id}
                className="flex flex-col justify-between rounded-[6px] border border-[#E2E4E9] bg-white p-5 shadow-keyline hover:border-[#CDD0D5] transition-all"
              >
                <div>
                  {/* Category Pill + Token Count */}
                  <div className="flex items-center justify-between font-mono text-[10px] pb-3 mb-3 border-b border-[#E2E4E9]">
                    <span className="font-semibold text-[#FF4800]">{tmpl.pill}</span>
                    <span className="text-[#868C98]">{tmpl.specCount}</span>
                  </div>

                  <h3 className="font-bold text-base text-[#0A0D14] tracking-tight">{tmpl.name}</h3>
                  <p className="mt-1 text-xs text-[#525866] leading-relaxed mb-4">{tmpl.desc}</p>

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
                  <div className="rounded-[4px] border border-[#E2E4E9] bg-[#F4F4F6] px-2.5 py-1.5 font-mono text-[11px] text-[#525866] mb-5">
                    {tmpl.font}
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(tmpl.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#E2E4E9] bg-white py-2 text-xs font-semibold text-[#0A0D14] hover:bg-[#F4F4F6] hover:border-[#CDD0D5] active:scale-[0.98] transition-all shadow-xs"
                >
                  {isDownloaded ? (
                    <>
                      <CheckCircle size={14} weight="fill" className="text-[#059669]" />
                      <span className="text-[#059669]">Copied design.md</span>
                    </>
                  ) : (
                    <>
                      <DownloadSimple size={14} weight="bold" />
                      <span>Get design.md</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
