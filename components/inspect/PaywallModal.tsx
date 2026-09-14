"use client";

import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, X, Sparkle, ShieldCheck, ArrowRight } from "@phosphor-icons/react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockDemo?: () => void;
}

export function PaywallModal({ isOpen, onClose, onUnlockDemo }: PaywallModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg rounded-[8px] border border-[#E2E4E9] bg-white p-6 sm:p-8 shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-[4px] text-[#868C98] hover:text-[#0A0D14] hover:bg-[#F4F4F6] transition-colors"
          >
            <X size={16} />
          </button>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#FFD6C7] bg-[#FFF1EB] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#FF4800] uppercase mb-4">
            <Sparkle size={12} weight="fill" />
            <span>DAILY FREE ALLOWANCE REACHED</span>
          </div>

          <h3 className="text-2xl font-extrabold tracking-tight text-[#0A0D14]">
            Unlock Unlimited Extractions with Deslop Pro.
          </h3>

          <p className="mt-2 text-xs text-[#525866] leading-relaxed">
            You have used your 3 daily guest extractions. Upgrade to Deslop Pro for unlimited headless crawling, direct GitHub PR syncing, and team token repositories.
          </p>

          {/* Pro Benefits List */}
          <div className="mt-6 space-y-2.5 rounded-[6px] border border-[#E2E4E9] bg-[#FAFAFA] p-4 text-xs">
            <div className="flex items-center gap-2 text-[#0A0D14] font-medium">
              <CheckCircle size={15} weight="fill" className="text-[#059669]" />
              <span>Unlimited live URL and SPA extractions</span>
            </div>
            <div className="flex items-center gap-2 text-[#0A0D14] font-medium">
              <CheckCircle size={15} weight="fill" className="text-[#059669]" />
              <span>1-click GitHub PR to commit .cursorrules & design.md</span>
            </div>
            <div className="flex items-center gap-2 text-[#0A0D14] font-medium">
              <CheckCircle size={15} weight="fill" className="text-[#059669]" />
              <span>Private / staging URL inspection behind basic auth</span>
            </div>
            <div className="flex items-center gap-2 text-[#0A0D14] font-medium">
              <CheckCircle size={15} weight="fill" className="text-[#059669]" />
              <span>Figma & DTCG token export</span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E2E4E9]">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#0A0D14]">$9</span>
                <span className="text-xs text-[#868C98]">/ month</span>
              </div>
              <span className="font-mono text-[10px] text-[#059669]">Cancel anytime</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onUnlockDemo && (
                <button
                  onClick={onUnlockDemo}
                  className="w-full sm:w-auto rounded-[6px] border border-[#E2E4E9] bg-white px-3 py-2 text-xs font-medium text-[#525866] hover:text-[#0A0D14] hover:bg-[#F4F4F6]"
                >
                  Reset Demo
                </button>
              )}
              <button
                onClick={() => alert("Stripe checkout integration point")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-[6px] bg-[#FF4800] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#E03E00] active:scale-[0.98] transition-all"
              >
                <span>Upgrade to Pro</span>
                <ArrowRight size={13} weight="bold" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
