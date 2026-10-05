"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ExtractedDesignSystem, UserQuota } from "@/types/tokens";
import { InspectionHeader } from "@/components/inspect/InspectionHeader";
import { TokenTabs } from "@/components/inspect/TokenTabs";
import {
  Warning,
  Sparkle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle,
} from "@phosphor-icons/react";
import Link from "next/link";

import { useExtraction } from "@/lib/api/hooks/useExtraction";

import { StudioLauncher } from "@/components/inspect/StudioLauncher";

function InspectionStudioContent() {
  const searchParams = useSearchParams();
  const rawUrl = searchParams.get("url");


  const {
    system,
    quota,
    isLoading,
    loadingStep,
    error,
    refetch,
  } = useExtraction(rawUrl);

  // If no URL is specified, render the Studio Launcher
  if (!rawUrl) {
    return <StudioLauncher />;
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      {system && (
        <InspectionHeader
          system={system}
          quota={quota}
        />
      )}

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-accent-wash border border-accent-border text-accent mb-4 shadow-sm animate-pulse">
              <Sparkle size={24} weight="fill" />
            </div>
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
              {loadingStep}
            </div>
            <h2 className="text-xl font-bold text-ink mt-2">
              Analyzing and deslopping {rawUrl}
            </h2>
            <p className="text-xs text-ink-muted mt-1 max-w-sm">
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
                onClick={() => refetch()}
                className="rounded-[6px] bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#B91C1C] transition-colors"
              >
                Retry Scan
              </button>
              <Link
                href="/"
                className="group inline-flex items-center gap-1.5 rounded-[6px] border border-keyline bg-white px-4 py-2 text-xs font-medium text-ink-muted hover:text-ink transition-colors shadow-2xs"
              >
                <ArrowLeft size={13} weight="bold" className="transition-transform group-hover:-translate-x-0.5" />
                <span>Return Home</span>
              </Link>
            </div>
          </div>
        )}

        {/* Loaded Specimen Studio */}
        {!isLoading && system && (
          <div className="space-y-6">

            {/* Token Tabs & Code Viewers */}
            <TokenTabs system={system} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function InspectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas flex items-center justify-center font-mono text-xs text-ink-subtle">
          LOADING STUDIO...
        </div>
      }
    >
      <InspectionStudioContent />
    </Suspense>
  );
}
