"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  CheckCircle,
  DownloadSimple,
  Sparkle,
  Globe,
  ShareNetwork,
} from "@phosphor-icons/react";
import { ExtractedDesignSystem, UserQuota } from "@/types/tokens";

interface InspectionHeaderProps {
  system: ExtractedDesignSystem;
  quota?: UserQuota | null;
  onOpenPaywall: () => void;
}

export function InspectionHeader({ system, quota, onOpenPaywall }: InspectionHeaderProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const handleCopy = (text: string, formatName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleDownloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E2E4E9] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Return to Home & Target Info */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-[#525866] hover:text-[#0A0D14] transition-colors p-1.5 rounded-[4px] hover:bg-[#F4F4F6]"
            title="Back to Landing Page"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Overview</span>
          </Link>

          <div className="h-4 w-px bg-[#E2E4E9]" />

          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#F4F4F6] border border-[#E2E4E9] text-[#0A0D14]">
              <Globe size={15} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm text-[#0A0D14] tracking-tight">{system.domain}</h1>
                <span className="font-mono text-[10px] text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-1.5 py-0.5 rounded-[3px] font-semibold">
                  {system.diagnostics.slopScore}% CALIBRATED
                </span>
              </div>
              <p className="text-[11px] text-[#868C98] font-mono hidden sm:block truncate max-w-xs">
                {system.url}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quota & Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Quota Badge / Paywall trigger */}
          {quota && !quota.isPro && (
            <button
              onClick={onOpenPaywall}
              className="hidden md:flex items-center gap-1.5 font-mono text-[10px] border border-[#E2E4E9] bg-[#F4F4F6] px-2.5 py-1.5 rounded-[6px] text-[#525866] hover:border-[#FFD6C7] hover:text-[#FF4800] transition-colors"
            >
              <Sparkle size={12} className="text-[#FF4800]" />
              <span>
                {quota.remainingScans} of {quota.allowedScans} FREE SCANS LEFT
              </span>
            </button>
          )}

          {/* Quick Copy design.md */}
          <button
            onClick={() => handleCopy(system.designMd, "design.md")}
            className="inline-flex items-center gap-1.5 btn-gloss-neutral h-8 px-3 text-xs font-semibold cursor-pointer"
          >
            {copiedFormat === "design.md" ? (
              <>
                <CheckCircle size={14} weight="fill" className="text-[#059669]" />
                <span className="text-[#059669]">Copied design.md</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy design.md</span>
              </>
            )}
          </button>

          {/* Download File */}
          <button
            onClick={() => handleDownloadFile(system.designMd, `${system.domain}-design.md`)}
            className="hidden sm:inline-flex items-center gap-1.5 btn-gloss-orange h-8 px-3.5 text-xs font-semibold cursor-pointer"
          >
            <DownloadSimple size={14} weight="bold" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </header>
  );
}
