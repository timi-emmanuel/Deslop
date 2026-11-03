"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";

const FAQ_ITEMS = [
  {
    q: "Do I need to create an account or log in to use Deslop?",
    a: "No. You can extract from any public website and copy the design.md without an account. An account is only needed to sync tokens to your GitHub repositories or unlock higher daily limits.",
  },
  {
    q: "How does Deslop extract design tokens from live websites?",
    a: "Deslop loads the URL in a headless browser and evaluates real computed styles after JavaScript runs. It measures the rendered colors, font stacks, line-heights, letter-spacing, and spacing intervals directly from the DOM—not by guessing from minified CSS stylesheets.",
  },
  {
    q: "How do I use design.md in Cursor, Claude Code, or v0?",
    a: "Drop design.md into your project root. In Cursor, reference it in your .cursorrules file. In Claude Code, v0, or Lovable, attach it to your initial prompt. Giving your AI explicit tokens and do-not rules drastically reduces hallucinated colors, weird margins, and off-brand layouts.",
  },
  {
    q: "What makes design.md better than copy-pasting raw CSS?",
    a: "Raw CSS from production sites is full of 50+ near-duplicate hex codes, inline overrides, and one-off padding values (like 13px). If you feed that to an AI, it gets confused. Deslop clusters those colors into 6 semantic roles, snaps spacing to an 8pt grid, and adds explicit negative constraints (like banning generic purple glows).",
  },
  {
    q: "Can I extract from dynamic Single Page Applications (SPAs)?",
    a: "Yes. Deslop waits for network idle and client hydration, so React, Next.js, Vue, and Svelte applications render completely before style measurement begins.",
  },
  {
    q: "What export formats are supported?",
    a: "Deslop currently exports to four standard formats: 1) AI-optimized design.md with guardrails, 2) Tailwind CSS v4 @theme configurations, 3) Standard CSS custom properties (:root), and 4) JSON design tokens compatible with the W3C DTCG specification.",
  },
  {
    q: "Can I extract from password-protected or local sites?",
    a: "Currently, Deslop extracts from any publicly accessible URL. Support for authenticated dashboards and local dev servers (via CLI integration) is planned on the roadmap.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 border-b border-keyline bg-canvas overflow-hidden">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">
            Questions? Answers.
          </h2>
          <p className="mt-3 text-sm text-ink-muted">
            Everything you need to know about extracting tokens, using design.md, and guiding AI coding tools.
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.75,
                  delay: 0.06 + idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-[6px] border border-keyline bg-white shadow-xs overflow-hidden transition-colors"
              >
                <motion.button
                  type="button"
                  onClick={() => toggle(idx)}
                  whileTap={{ scale: 0.995 }}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-ink hover:text-accent transition-colors cursor-pointer select-none"
                >
                  <span>{item.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 22 }}
                    className="shrink-0 flex items-center justify-center text-ink-subtle"
                  >
                    <CaretDown
                      size={16}
                      className={isOpen ? "text-accent" : ""}
                    />
                  </motion.div>
                </motion.button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-ink-muted leading-relaxed border-t border-surface-sunken">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
