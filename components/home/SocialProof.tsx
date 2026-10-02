"use client";

import { motion } from "motion/react";

interface SupportedTool {
  name: string;
  file: string;
}

const TOOLS: SupportedTool[] = [
  { name: "Cursor", file: ".cursorrules" },
  { name: "Claude Code", file: "CLAUDE.md" },
  { name: "v0 System", file: "v0.dev" },
  { name: "GitHub Copilot", file: "AGENTS.md" },
  { name: "Windsurf", file: ".windsurfrules" },
  { name: "Bolt.new", file: "prompt.md" },
];

export function SocialProof() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-keyline bg-canvas py-6 sm:py-8 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8">
          {/* Section Header Label with Status Indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pass opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pass" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-subtle font-semibold">
              TRUSTED FOR ZERO-SLOP PROMPT CONTEXT IN:
            </span>
          </div>

          {/* Infinite Animated Marquee Ribbon */}
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]">
            <div className="animate-marquee flex items-center gap-6 sm:gap-8 py-1">
              {/* Set 1 */}
              {TOOLS.map((tool) => (
                <div
                  key={`t1-${tool.name}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] border border-keyline bg-white shadow-2xs cursor-default select-none shrink-0"
                >
                  <span className="font-mono text-[10px] bg-surface-sunken border border-keyline px-1.5 py-0.5 rounded text-ink-muted font-semibold">
                    {tool.file}
                  </span>
                  <span className="text-xs font-semibold text-ink">
                    {tool.name}
                  </span>
                </div>
              ))}

              {/* Set 2 (for continuous loop) */}
              {TOOLS.map((tool) => (
                <div
                  key={`t2-${tool.name}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] border border-keyline bg-white shadow-2xs cursor-default select-none shrink-0"
                >
                  <span className="font-mono text-[10px] bg-surface-sunken border border-keyline px-1.5 py-0.5 rounded text-ink-muted font-semibold">
                    {tool.file}
                  </span>
                  <span className="text-xs font-semibold text-ink">
                    {tool.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
