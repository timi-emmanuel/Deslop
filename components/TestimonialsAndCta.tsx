"use client";

import { ArrowRight, Crosshair, CheckCircle, GithubLogo } from "@phosphor-icons/react";

export function TestimonialsAndCta() {
  return (
    <>
      {/* Testimonials */}
      <section id="testimonials" className="py-20 border-b border-[#E2E4E9] bg-[#FAFAFA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 pb-6 border-b border-[#E2E4E9] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#FF4800]">
                FIELD REPORTS
              </div>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0A0D14]">
                Verified by frontend engineers.
              </h2>
            </div>
            <p className="text-xs font-mono text-[#868C98]">
              TESTIMONIALS // 100% UNEDITED FEEDBACK
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Testimonial 1 */}
            <div className="rounded-[6px] border border-[#E2E4E9] bg-white p-6 flex flex-col justify-between shadow-keyline">
              <blockquote className="text-sm sm:text-base text-[#343741] leading-relaxed">
                &ldquo;Our Cursor prompt outputs kept inventing random hex values and ugly 24px border radii. Dropping Deslop&apos;s <code className="font-mono text-xs bg-[#F4F4F6] border border-[#E2E4E9] px-1 py-0.5 rounded text-[#0A0D14]">design.md</code> into our repository immediately locked down our token adherence.&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[#E2E4E9]">
                <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#FFF1EB] text-[#FF4800] border border-[#FFD6C7] font-mono font-bold text-xs">
                  SK
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0A0D14]">Sarah Kim</p>
                  <p className="text-[11px] font-mono text-[#868C98]">Design Systems Architect @ NextPhase</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-[6px] border border-[#E2E4E9] bg-white p-6 flex flex-col justify-between shadow-keyline">
              <blockquote className="text-sm sm:text-base text-[#343741] leading-relaxed">
                &ldquo;We extracted our live marketing site into tokens in 20 seconds. Now v0 outputs match our exact typography scale and spacing grid on the first prompt without tedious CSS tweaking.&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[#E2E4E9]">
                <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#FFF1EB] text-[#FF4800] border border-[#FFD6C7] font-mono font-bold text-xs">
                  MR
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0A0D14]">Marcus Rivera</p>
                  <p className="text-[11px] font-mono text-[#868C98]">Staff Engineer @ Shipwright Labs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-Impact Light Mode CTA (NO DARK HUE) */}
      <section className="py-20 border-b border-[#E2E4E9] bg-white bg-drafting-grid">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="rounded-[8px] border border-[#E2E4E9] bg-[#FAFAFA] p-8 sm:p-12 shadow-keyline">
            <div className="inline-flex items-center gap-2 rounded-[4px] border border-[#FFD6C7] bg-[#FFF1EB] px-2.5 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#FF4800] mb-4">
              <span>READY FOR ZERO-SLOP PROMPT EXECUTION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0A0D14]">
              Start shipping verified design systems today.
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#525866] max-w-xl mx-auto leading-relaxed">
              Extract colors, typography scales, and spatial rules into an immutable <code className="font-mono text-xs bg-white border border-[#E2E4E9] px-1.5 py-0.5 rounded text-[#0A0D14]">design.md</code> file in under 30 seconds.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#extractor"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#FF4800] px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#E03E00] active:scale-[0.98] transition-all"
              >
                <span>Launch Extractor Now</span>
                <ArrowRight size={14} weight="bold" />
              </a>

              <a
                href="https://github.com/AJonastech/deslop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#E2E4E9] bg-white px-5 py-3 text-xs font-semibold text-[#0A0D14] hover:bg-[#F4F4F6] hover:border-[#CDD0D5] active:scale-[0.98] transition-all shadow-xs"
              >
                <GithubLogo size={15} weight="bold" />
                <span>View on GitHub</span>
              </a>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 font-mono text-[11px] text-[#868C98]">
              <span className="flex items-center gap-1">
                <CheckCircle size={13} weight="fill" className="text-[#059669]" />
                100% Free & Open Source
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle size={13} weight="fill" className="text-[#059669]" />
                Zero Hallucinations
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Technical Footer */}
      <footer className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#868C98]">
          <div className="flex items-center gap-2 text-[#0A0D14]">
            <div className="flex h-5 w-5 items-center justify-center rounded-[3px] bg-[#FF4800] text-white">
              <Crosshair size={12} weight="bold" />
            </div>
            <span className="font-bold tracking-tight">deslop</span>
            <span className="text-[#868C98]">— Quality control for AI frontend code</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#slop-inspector" className="hover:text-[#0A0D14] transition-colors">
              Comparator
            </a>
            <a href="#extractor" className="hover:text-[#0A0D14] transition-colors">
              Extractor
            </a>
            <a href="#presets" className="hover:text-[#0A0D14] transition-colors">
              Presets
            </a>
            <a
              href="https://github.com/AJonastech/deslop"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0A0D14] transition-colors"
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
