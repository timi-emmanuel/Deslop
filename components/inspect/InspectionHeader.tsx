"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  CheckCircle,
  DownloadSimple,
  Sparkle,
  Globe,
  ShareNetwork,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import { ExtractedDesignSystem, UserQuota } from "@/types/tokens";

import { ExportModal } from "./ExportModal";

interface InspectionHeaderProps {
  system: ExtractedDesignSystem;
  quota?: UserQuota | null;
  onOpenPaywall: () => void;
}

export function InspectionHeader({ system, quota, onOpenPaywall }: InspectionHeaderProps) {
  const router = useRouter();
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isSwitchingUrl, setIsSwitchingUrl] = useState<boolean>(false);
  const [switchUrlInput, setSwitchUrlInput] = useState<string>("");

  const handleCopy = (text: string, formatName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleSwitchUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!switchUrlInput.trim()) return;
    const formatted = switchUrlInput.trim().startsWith("http")
      ? switchUrlInput.trim()
      : `https://${switchUrlInput.trim()}`;
    setIsSwitchingUrl(false);
    setSwitchUrlInput("");
    router.push(`/inspect?url=${encodeURIComponent(formatted)}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-keyline bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left: Return to Home & Target Info */}
          <div className="flex items-center gap-4">
            <Link
              href="/inspect"
              className="flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors p-1.5 rounded-[4px] hover:bg-surface-sunken"
              title="Return to Studio Launcher"
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">Studio</span>
            </Link>

            <div className="h-4 w-px bg-keyline" />

            {!isSwitchingUrl ? (
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-surface-sunken border border-keyline text-ink">
                  <Globe size={15} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold text-sm text-ink tracking-tight">{system.domain}</h1>
                    <span className="font-mono text-[10px] text-pass bg-pass-wash border border-[#A7F3D0] px-1.5 py-0.5 rounded-[3px] font-semibold">
                      {system.diagnostics.slopScore}% CALIBRATED
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSwitchingUrl(true)}
                      className="ml-1 inline-flex items-center gap-1 text-[11px] font-mono text-ink-muted hover:text-accent bg-surface-sunken hover:bg-accent-wash px-2 py-0.5 rounded border border-keyline transition-colors cursor-pointer"
                      title="Inspect another website"
                    >
                      <MagnifyingGlass size={11} />
                      <span className="hidden md:inline">Switch URL</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-ink-subtle font-mono hidden sm:block truncate max-w-xs">
                    {system.url}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSwitchUrl} className="flex items-center gap-2">
                <input
                  type="text"
                  autoFocus
                  value={switchUrlInput}
                  onChange={(e) => setSwitchUrlInput(e.target.value)}
                  placeholder="Paste URL (e.g. woblo.in or stripe.com)"
                  className="rounded-[6px] border border-accent bg-white px-2.5 py-1 text-xs text-ink placeholder-ink-subtle font-mono focus:outline-none w-56 sm:w-72 shadow-xs"
                />
                <button
                  type="submit"
                  className="btn-gloss-orange h-7 px-2.5 text-xs font-semibold cursor-pointer"
                >
                  Scan
                </button>
                <button
                  type="button"
                  onClick={() => setIsSwitchingUrl(false)}
                  className="text-ink-subtle hover:text-ink p-1 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </form>
            )}
          </div>

          {/* Right: Quota & Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Quota Badge / Paywall trigger */}
            {quota && !quota.isPro && (
              <button
                onClick={onOpenPaywall}
                className="hidden md:flex items-center gap-1.5 font-mono text-[10px] border border-keyline bg-surface-sunken px-2.5 py-1.5 rounded-[6px] text-ink-muted hover:border-accent-border hover:text-accent transition-colors cursor-pointer"
              >
                <Sparkle size={12} className="text-accent" />
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

            {/* Standardized 3-Part Export Modal Trigger */}
            <button
              onClick={() => setIsExportOpen(true)}
              className="inline-flex items-center gap-1.5 btn-gloss-orange h-8 px-3.5 text-xs font-semibold cursor-pointer"
            >
              <DownloadSimple size={14} weight="bold" />
              <span>Export Rules</span>
            </button>
          </div>
        </div>
      </header>

      {/* Standardized 3-Part Export Modal with Post-Action Success Hero */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        system={system}
      />
    </>
  );
}
