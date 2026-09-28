"use client";

import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalSuccessHero,
} from "@/components/ui/Modal";
import {
  Code,
  FileCode,
  FileText,
  BracketsCurly,
  Sparkle,
  Copy,
  DownloadSimple,
} from "@phosphor-icons/react";
import { ExtractedDesignSystem } from "@/types/tokens";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  system: ExtractedDesignSystem;
}

type ExportFormat = "design-md" | "cursorrules" | "tailwind" | "json";

export function ExportModal({ isOpen, onClose, system }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("design-md");
  const [isSuccessState, setIsSuccessState] = useState<boolean>(false);

  const getExportPayload = (): { filename: string; content: string; label: string } => {
    switch (selectedFormat) {
      case "cursorrules":
        return {
          filename: ".cursorrules",
          content: `# Cursor Design Rules for ${system.domain}\n\n${system.designMd}`,
          label: ".cursorrules",
        };
      case "tailwind":
        return {
          filename: "tailwind.css",
          content: system.tailwindCss,
          label: "Tailwind v4 @theme",
        };
      case "json":
        return {
          filename: "tokens.json",
          content: JSON.stringify(
            {
              domain: system.domain,
              colors: system.colors,
              typography: system.typography,
              geometry: system.geometry,
            },
            null,
            2
          ),
          label: "W3C Design Tokens JSON",
        };
      case "design-md":
      default:
        return {
          filename: "design.md",
          content: system.designMd,
          label: "design.md System Rules",
        };
    }
  };

  const current = getExportPayload();

  const handleDownload = () => {
    const blob = new Blob([current.content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", current.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsSuccessState(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(current.content);
    setIsSuccessState(true);
  };

  const handleClose = () => {
    setIsSuccessState(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-xl">
      {isSuccessState ? (
        <ModalSuccessHero
          title="Tokens Exported Successfully!"
          subtitle={`Your ${current.label} is ready. Drop it into your project root so your AI assistant respects these design constraints.`}
          copyValue={current.content}
          copyLabel="Copy File Content Again"
          onDone={handleClose}
        />
      ) : (
        <>
          {/* Part 1: Fixed Header with Duotone Phosphor Icon */}
          <ModalHeader
            icon={<Code size={20} weight="bold" />}
            title="Export AI Design Directives"
            subtitle={`Formatted for Cursor, Claude, Lovable, or v0 based on ${system.domain}`}
            onClose={handleClose}
          />

          {/* Part 2: Scrollable Body */}
          <ModalBody>
            {/* Format Selection Cards */}
            <div>
              <label className="block text-xs font-bold text-[#0A0D14] uppercase tracking-wider mb-2 font-mono">
                Select Export Target:
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedFormat("design-md")}
                  className={`flex items-start gap-2.5 rounded-[8px] border p-3 text-left transition-all ${
                    selectedFormat === "design-md"
                      ? "border-accent bg-accent-wash shadow-xs"
                      : "border-keyline bg-canvas hover:bg-white"
                  }`}
                >
                  <FileText
                    size={18}
                    weight={selectedFormat === "design-md" ? "fill" : "regular"}
                    className={selectedFormat === "design-md" ? "text-accent" : "text-ink-subtle"}
                  />
                  <div>
                    <div className="font-bold text-xs text-ink">design.md</div>
                    <div className="text-[11px] text-ink-muted mt-0.5">Universal AI system rules</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFormat("cursorrules")}
                  className={`flex items-start gap-2.5 rounded-[8px] border p-3 text-left transition-all ${
                    selectedFormat === "cursorrules"
                      ? "border-accent bg-accent-wash shadow-xs"
                      : "border-keyline bg-canvas hover:bg-white"
                  }`}
                >
                  <Sparkle
                    size={18}
                    weight={selectedFormat === "cursorrules" ? "fill" : "regular"}
                    className={selectedFormat === "cursorrules" ? "text-accent" : "text-ink-subtle"}
                  />
                  <div>
                    <div className="font-bold text-xs text-ink">.cursorrules</div>
                    <div className="text-[11px] text-ink-muted mt-0.5">Auto-loaded by Cursor IDE</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFormat("tailwind")}
                  className={`flex items-start gap-2.5 rounded-[8px] border p-3 text-left transition-all ${
                    selectedFormat === "tailwind"
                      ? "border-accent bg-accent-wash shadow-xs"
                      : "border-keyline bg-canvas hover:bg-white"
                  }`}
                >
                  <FileCode
                    size={18}
                    weight={selectedFormat === "tailwind" ? "fill" : "regular"}
                    className={selectedFormat === "tailwind" ? "text-accent" : "text-ink-subtle"}
                  />
                  <div>
                    <div className="font-bold text-xs text-ink">Tailwind v4</div>
                    <div className="text-[11px] text-ink-muted mt-0.5">CSS @theme tokens block</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFormat("json")}
                  className={`flex items-start gap-2.5 rounded-[8px] border p-3 text-left transition-all ${
                    selectedFormat === "json"
                      ? "border-accent bg-accent-wash shadow-xs"
                      : "border-keyline bg-canvas hover:bg-white"
                  }`}
                >
                  <BracketsCurly
                    size={18}
                    weight={selectedFormat === "json" ? "fill" : "regular"}
                    className={selectedFormat === "json" ? "text-accent" : "text-ink-subtle"}
                  />
                  <div>
                    <div className="font-bold text-xs text-[#0A0D14]">JSON Tokens</div>
                    <div className="text-[11px] text-[#525866] mt-0.5">W3C DTCG format</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Preview Box */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#868C98] mb-1.5">
                <span>PREVIEW ({current.filename}):</span>
                <span className="text-[#059669]">VALIDATED</span>
              </div>
              <pre className="rounded-[6px] border border-[#222326] bg-[#0A0D14] p-3 font-mono text-[11px] text-[#E2E4E9] max-h-40 overflow-y-auto leading-relaxed">
                {current.content}
              </pre>
            </div>
          </ModalBody>

          {/* Part 3: Fixed Footer with Actions */}
          <ModalFooter>
            <button
              type="button"
              onClick={handleClose}
              className="btn-gloss-neutral px-4 py-2 text-xs font-semibold"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="btn-gloss-neutral px-4 py-2 text-xs font-semibold gap-1.5"
            >
              <Copy size={13} weight="bold" />
              <span>Copy Content</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="btn-gloss-orange px-5 py-2 text-xs font-semibold gap-1.5"
            >
              <DownloadSimple size={13} weight="bold" />
              <span>Download {current.filename}</span>
            </button>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
}
