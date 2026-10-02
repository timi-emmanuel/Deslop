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
    a: "Modern AI code generators invent unmapped hex codes, arbitrary paddings (like 13px), and repetitive purple gradient wrappers when left unconstrained. Deslop groups noisy colors into 6 clear semantic roles, snaps spacing to an 8pt grid, and injects clear negative rules into design.md to keep your AI on-brand.",
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
            Everything you need to know about Deslop and AI design system constraints.
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
