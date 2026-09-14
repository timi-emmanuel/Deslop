"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ExtractedDesignSystem, UserQuota } from "@/types/tokens";
import { InspectionHeader } from "@/components/inspect/InspectionHeader";
import { TokenTabs } from "@/components/inspect/TokenTabs";
import { PaywallModal } from "@/components/inspect/PaywallModal";
import {
  Warning,
  Sparkle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from "@phosphor-icons/react";
import Link from "next/link";

function InspectionStudioContent() {
  const searchParams = useSearchParams();
  const rawUrl = searchParams.get("url") || "https://linear.app";

  const [system, setSystem] = useState<ExtractedDesignSystem | null>(null);
  const [quota, setQuota] = useState<UserQuota | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingStep, setLoadingStep] = useState<string>("CONNECTING TO RUNTIME");
  const [error, setError] = useState<string | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);

  const fetchExtraction = async (target: string) => {
    setIsLoading(true);
    setError(null);

    // Progressive loading simulation stages
    setLoadingStep("MOUNTING HEADLESS DOM PARSER...");
    const t1 = setTimeout(() => setLoadingStep("HARVESTING COMPUTED STYLES & FONTS..."), 300);
    const t2 = setTimeout(() => setLoadingStep("SYNTHESIZING OKLCH PALETTE & 8PT GRID..."), 600);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        if (json.paywall) {
          setIsPaywallOpen(true);
          setQuota(json.quota);
        }
        throw new Error(json.error || "Failed to extract design system");
      }

      setSystem(json.data);
      setQuota(json.quota);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Extraction failed";
      setError(message);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExtraction(rawUrl);
  }, [rawUrl]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0D14] flex flex-col">
      {system && (
        <InspectionHeader
          system={system}
          quota={quota}
          onOpenPaywall={() => setIsPaywallOpen(true)}
        />
      )}

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#FFF1EB] border border-[#FFD6C7] text-[#FF4800] mb-4 shadow-sm animate-pulse">
              <Sparkle size={24} weight="fill" />
            </div>
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF4800]">
              {loadingStep}
            </div>
            <h2 className="text-xl font-bold text-[#0A0D14] mt-2">
              Analyzing and deslopping {rawUrl}
            </h2>
            <p className="text-xs text-[#525866] mt-1 max-w-sm">
              Extracting real computed styles, deduplicating colors, and generating your AI constraints.
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="rounded-[8px] border border-[#FECDD3] bg-[#FEF2F2] p-8 text-center max-w-md mx-auto my-16">
            <Warning size={32} weight="fill" className="text-[#DC2626] mx-auto mb-3" />
            <h3 className="font-bold text-base text-[#991B1B]">Extraction Error</h3>
            <p className="text-xs text-[#7F1D1D] mt-1 mb-6 leading-relaxed">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => fetchExtraction(rawUrl)}
                className="rounded-[6px] bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#B91C1C] transition-colors"
              >
                Retry Scan
              </button>
              <Link
                href="/"
                className="rounded-[6px] border border-[#E2E4E9] bg-white px-4 py-2 text-xs font-medium text-[#525866] hover:text-[#0A0D14]"
              >
                Return Home
              </Link>
            </div>
          </div>
        )}

        {/* Loaded Specimen Studio */}
        {!isLoading && system && (
          <div className="space-y-6">
            {/* Top Diagnostics Banner */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-[6px] border border-[#E2E4E9] bg-white p-3.5 shadow-xs">
                <span className="font-mono text-[10px] text-[#868C98] uppercase block">CALIBRATION SCORE</span>
                <span className="font-extrabold text-2xl text-[#059669] mt-0.5 block">
                  {system.diagnostics.slopScore}%
                </span>
                <span className="text-[11px] text-[#525866]">0% visual drift detected</span>
              </div>

              <div className="rounded-[6px] border border-[#E2E4E9] bg-white p-3.5 shadow-xs">
                <span className="font-mono text-[10px] text-[#868C98] uppercase block">COLORS PRUNED</span>
                <span className="font-extrabold text-2xl text-[#0A0D14] mt-0.5 block">
                  {system.diagnostics.rawColorsScanned} → {system.diagnostics.tokensNormalized}
                </span>
                <span className="text-[11px] text-[#525866]">Deduplicated to locked roles</span>
              </div>

              <div className="rounded-[6px] border border-[#E2E4E9] bg-white p-3.5 shadow-xs">
                <span className="font-mono text-[10px] text-[#868C98] uppercase block">GRID HARMONY</span>
                <span className="font-extrabold text-2xl text-[#FF4800] mt-0.5 block">
                  {system.geometry.baseGridPx}pt
                </span>
                <span className="text-[11px] text-[#525866]">Strict modular baseline ramp</span>
              </div>

              <div className="rounded-[6px] border border-[#E2E4E9] bg-white p-3.5 shadow-xs">
                <span className="font-mono text-[10px] text-[#868C98] uppercase block">EXTRACTION SPEED</span>
                <span className="font-extrabold text-2xl text-[#0A0D14] mt-0.5 block">
                  {system.diagnostics.timingMs}ms
                </span>
                <span className="text-[11px] text-[#525866]">Compiled directly in memory</span>
              </div>
            </div>

            {/* Token Tabs & Code Viewers */}
            <TokenTabs system={system} />
          </div>
        )}
      </main>

      {/* Paywall Upgrade Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onUnlockDemo={() => {
          setIsPaywallOpen(false);
          fetchExtraction(rawUrl);
        }}
      />
    </div>
  );
}

export default function InspectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-mono text-xs text-[#868C98]">
          LOADING STUDIO...
        </div>
      }
    >
      <InspectionStudioContent />
    </Suspense>
  );
}
