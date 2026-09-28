"use client";

import { ArrowRight, Crosshair, CheckCircle, GithubLogo } from "@phosphor-icons/react";
import Link from "next/link";

export function TestimonialsAndCta() {
  return (
    <>
      {/* High-Impact Light Mode CTA with Multiplayer Cursors */}
      <section className="relative py-24 border-b border-keyline bg-canvas bg-drafting-grid overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="relative rounded-[16px] border border-keyline bg-white p-8 sm:p-16 shadow-keyline overflow-hidden">
            {/* Multiplayer Cursor 1: Frontend Dev */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-6 top-8 hidden sm:flex items-start gap-1.5 animate-cursor-a z-20"
            >
              <div className="relative">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="drop-shadow-sm text-pass">
                  <path
                    d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
                    fill="currentColor"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="absolute -left-1 -top-1 h-6 w-6 rounded-full border border-pass animate-ping-slow pointer-events-none" />
              </div>
              <span className="rounded-full bg-pass px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-xs">
                frontend dev
              </span>
            </div>

            {/* Multiplayer Cursor 2: AI Agent */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-8 top-12 hidden sm:flex items-start gap-1.5 animate-cursor-b z-20"
            >
              <div className="relative">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="drop-shadow-sm text-accent">
                  <path
                    d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
                    fill="currentColor"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="absolute -left-1 -top-1 h-6 w-6 rounded-full border border-accent animate-ping-slow pointer-events-none" />
              </div>
              <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-xs">
                cursor / claude
              </span>
            </div>

            {/* Multiplayer Cursor 3: Designer */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-14 bottom-10 hidden sm:flex items-start gap-1.5 animate-cursor-b z-20"
            >
              <div className="relative">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="drop-shadow-sm text-[#6366F1]">
                  <path
                    d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
                    fill="#6366F1"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <span className="rounded-full bg-[#6366F1] px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-xs">
                designer
              </span>
            </div>

            {/* Radial glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-96 -translate-x-1/2 -translate-y-1/2 opacity-70"
              style={{
                background: "radial-gradient(ellipse at center, rgba(255, 72, 0, 0.12) 0%, transparent 70%)",
              }}
            />

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink max-w-2xl mx-auto leading-tight">
              Stop guessing at other people&apos;s{" "}
              <span className="font-serif-editorial font-medium italic text-accent text-[1.12em]">
                CSS
              </span>
              .
            </h2>

            <p className="mt-4 text-sm sm:text-base text-ink-muted max-w-xl mx-auto leading-relaxed">
              Extract colors, typography scales, and spatial rules into an immutable <code className="font-mono text-xs bg-white border border-keyline px-1.5 py-0.5 rounded text-ink">design.md</code> file in one click.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/inspect"
                className="btn-gloss-orange w-full sm:w-auto h-12 px-7 text-sm font-bold gap-2 cursor-pointer"
              >
                <span>Launch Extractor Now</span>
                <ArrowRight size={15} weight="bold" />
              </Link>

              <a
                href="https://github.com/AJonastech/deslop"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gloss-neutral w-full sm:w-auto h-12 px-6 text-sm font-semibold gap-2 cursor-pointer"
              >
                <GithubLogo size={16} weight="bold" />
                <span>View on GitHub</span>
              </a>
            </div>

            <div className="mt-7 flex items-center justify-center gap-6 font-mono text-[11px] text-ink-subtle">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle size={14} weight="fill" className="text-pass" />
                100% Free & Open Source
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle size={14} weight="fill" className="text-pass" />
                Zero Hallucinations
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Technical Footer */}
      <footer className="bg-canvas border-t border-keyline py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-subtle">
          <div className="flex items-center gap-2 text-ink">
            <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-accent text-white">
              <Crosshair size={13} weight="bold" />
            </div>
            <span className="font-bold tracking-tight text-sm">deslop</span>
            <span className="text-ink-subtle">— Quality control for AI frontend code</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-ink transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-ink transition-colors">
              How it works
            </a>
            <a href="#presets" className="hover:text-ink transition-colors">
              Presets
            </a>
            <a href="#pricing" className="hover:text-ink transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-ink transition-colors">
              FAQ
            </a>
            <a
              href="https://github.com/AJonastech/deslop"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink transition-colors"
            >
              GitHub
            </a>
          </div>

          <div>
            © {new Date().getFullYear()} deslop. Open source software.
          </div>
        </div>
      </footer>
    </>
  );
}
