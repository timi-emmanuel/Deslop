"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";

const FAQ_ITEMS = [
  {
    q: "Do I need to create an account or log in to use Deslop?",
    a: "No. You can extract tokens from any public website and copy the generated design.md completely free without logging in. We believe in zero-friction tools. You only need an account if you want to sync design tokens directly to your GitHub repositories or unlock unlimited daily extractions.",
  },
  {
    q: "How does Deslop extract design tokens from live websites?",
    a: "Unlike traditional scrapers that guess from raw HTML or minified stylesheets, Deslop evaluates live computed styles in a real headless browser runtime. It captures true computed colors, rendered font stacks, layout bounding boxes, and spacing intervals directly from the DOM.",
  },
  {
    q: "How do I use the generated design.md in Cursor, Claude Code, or v0?",
    a: "Simply download or copy the design.md file and place it in the root of your project. In Cursor, reference it in your .cursorrules file. In Claude Code or v0, provide it as context in your initial prompt. The strict token constraints will prevent the AI from hallucinating arbitrary colors, paddings, or font sizes.",
  },
  {
    q: "Can I extract from dynamic Single Page Applications (SPAs)?",
    a: "Yes. Because Deslop mounts a headless Chromium instance and waits for network idle, client-rendered React, Next.js, Vue, and Svelte applications render completely before style harvesting begins.",
  },
  {
    q: "What export formats are supported?",
    a: "Deslop currently exports to four standard formats: 1) AI-optimized design.md, 2) Tailwind CSS v4 @theme configurations, 3) Standard CSS custom properties (:root), and 4) JSON design tokens compatible with the W3C DTCG specification.",
  },
  {
    q: "How does Deslop prevent 'AI slop'?",
    a: "Modern AI code generators invent unmapped hex codes, arbitrary paddings (like 13px), and repetitive purple gradient wrappers when left unconstrained. Deslop's synthesizer enforces an 8pt modular baseline, clusters noisy colors into single locked semantic roles, and injects strict negative rules into design.md to ban hallucinated styles.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 border-b border-[#E2E4E9] bg-[#FAFAFA]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0A0D14]">
            Questions? Answers.
          </h2>
          <p className="mt-3 text-sm text-[#525866]">
            Everything you need to know about Deslop and AI design system constraints.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-[6px] border border-[#E2E4E9] bg-white shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-[#0A0D14] hover:text-[#FF4800] transition-colors"
                >
                  <span>{item.q}</span>
                  <CaretDown
                    size={16}
                    className={`shrink-0 text-[#868C98] transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#FF4800]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#525866] leading-relaxed border-t border-[#F4F4F6]">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
