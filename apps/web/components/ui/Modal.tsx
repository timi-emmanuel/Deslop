"use client";

import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        {/* Backdrop click to dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={cn(
            "relative z-10 w-full max-w-lg rounded-[12px] border border-[#E2E4E9] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
            className
          )}
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────
   PART 1: FIXED MODAL HEADER
   Duotone icon container + Title + Subtitle + Close X
   ───────────────────────────────────────────────────────────── */
interface ModalHeaderProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  onClose: () => void;
}

export function ModalHeader({ icon, title, subtitle, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-start justify-between border-b border-[#E2E4E9] bg-[#FAFAFA] px-6 py-4 shrink-0">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#FFF1EB] border border-[#FFD6C7] text-[#FF4800] shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-bold text-base text-[#0A0D14] tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-[#525866] mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-[4px] p-1 text-[#868C98] hover:bg-[#F4F4F6] hover:text-[#0A0D14] transition-colors"
        aria-label="Close modal"
      >
        <X size={16} />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PART 2: SCROLLABLE MODAL BODY
   max-h-[85vh] overflow-y-auto space-y-4
   ───────────────────────────────────────────────────────────── */
interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn("overflow-y-auto p-6 space-y-4 flex-1", className)}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PART 3: FIXED MODAL FOOTER
   Secondary Cancel + Primary CTA
   ───────────────────────────────────────────────────────────── */
interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2.5 border-t border-[#E2E4E9] bg-[#FAFAFA] px-6 py-3.5 shrink-0",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PART 4: POST-ACTION SUCCESS HERO STATE
   Checkmark Hero with 1-Click Copyable Attribution Card
   ───────────────────────────────────────────────────────────── */
interface ModalSuccessHeroProps {
  title: string;
  subtitle: string;
  copyValue: string;
  copyLabel?: string;
  onDone: () => void;
}

export function ModalSuccessHero({
  title,
  subtitle,
  copyValue,
  copyLabel = "Copy Snippet",
  onDone,
}: ModalSuccessHeroProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 text-center flex flex-col items-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] mb-3">
        <CheckCircle size={24} weight="fill" />
      </div>

      <h3 className="font-bold text-lg text-[#0A0D14] tracking-tight">{title}</h3>
      <p className="text-xs text-[#525866] mt-1 max-w-sm">{subtitle}</p>

      {/* 1-Click Copyable Attribution Card */}
      <div className="mt-5 w-full rounded-[8px] border border-[#222326] bg-[#0A0D14] p-4 text-left font-mono text-xs text-white">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[11px] text-[#A1A1AA]">
          <span>Generated File Content</span>
          <span className="text-[#059669]">READY</span>
        </div>
        <pre className="max-h-36 overflow-y-auto text-[11px] text-[#E2E4E9] leading-relaxed whitespace-pre-wrap">
          {copyValue.slice(0, 300)}...
        </pre>
      </div>

      <div className="mt-6 flex w-full items-center justify-between gap-3 pt-3 border-t border-[#E2E4E9]">
        <button
          type="button"
          onClick={onDone}
          className="btn-gloss-neutral px-4 py-2 text-xs font-semibold"
        >
          Close
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="btn-gloss-orange px-5 py-2 text-xs font-semibold"
        >
          {copied ? "Copied to Clipboard!" : copyLabel}
        </button>
      </div>
    </div>
  );
}
