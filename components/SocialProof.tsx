"use client";

export function SocialProof() {
  return (
    <section className="border-b border-[#E2E4E9] bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Keyline Metric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 pb-8 border-b border-[#E2E4E9]">
          <div className="rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-4">
            <div className="font-mono text-[10px] text-[#868C98] uppercase">PURGED SLOP</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0A0D14] tracking-tight mt-1">
              48,200+
            </div>
            <div className="text-xs text-[#525866] mt-0.5">Hallucinated tokens eliminated</div>
          </div>

          <div className="rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-4">
            <div className="font-mono text-[10px] text-[#868C98] uppercase">ACCENT DISCIPLINE</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FF4800] tracking-tight mt-1">
              1-to-1
            </div>
            <div className="text-xs text-[#525866] mt-0.5">Strict locked primary palette</div>
          </div>

          <div className="rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-4">
            <div className="font-mono text-[10px] text-[#868C98] uppercase">ACCESSIBILITY SCORE</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#059669] tracking-tight mt-1">
              100%
            </div>
            <div className="text-xs text-[#525866] mt-0.5">Automated WCAG AAA contrast audit</div>
          </div>

          <div className="rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-4">
            <div className="font-mono text-[10px] text-[#868C98] uppercase">AI ENGINE COMPATIBILITY</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0A0D14] tracking-tight mt-1">
              Native
            </div>
            <div className="text-xs text-[#525866] mt-0.5">Cursor, Claude, Copilot & v0</div>
          </div>
        </div>

        {/* Logo Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#868C98]">
            TRUSTED FOR ZERO-SLOP PROMPT CONTEXT IN:
          </span>

          <div className="flex flex-wrap items-center gap-8 text-[#525866]">
            {/* Cursor */}
            <div className="flex items-center gap-1.5 font-semibold text-xs text-[#0A0D14] hover:text-[#FF4800] transition-colors">
              <span className="font-mono text-[10px] bg-[#F4F4F6] border border-[#E2E4E9] px-1 py-0.5 rounded">.cursorrules</span>
              <span>Cursor</span>
            </div>

            {/* Claude */}
            <div className="flex items-center gap-1.5 font-semibold text-xs text-[#0A0D14] hover:text-[#FF4800] transition-colors">
              <span className="font-mono text-[10px] bg-[#F4F4F6] border border-[#E2E4E9] px-1 py-0.5 rounded">CLAUDE.md</span>
              <span>Claude Code</span>
            </div>

            {/* v0 */}
            <div className="flex items-center gap-1.5 font-semibold text-xs text-[#0A0D14] hover:text-[#FF4800] transition-colors">
              <span className="font-mono text-[10px] bg-[#F4F4F6] border border-[#E2E4E9] px-1 py-0.5 rounded">v0.dev</span>
              <span>v0 System</span>
            </div>

            {/* Copilot */}
            <div className="flex items-center gap-1.5 font-semibold text-xs text-[#0A0D14] hover:text-[#FF4800] transition-colors">
              <span className="font-mono text-[10px] bg-[#F4F4F6] border border-[#E2E4E9] px-1 py-0.5 rounded">AGENTS.md</span>
              <span>GitHub Copilot</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
