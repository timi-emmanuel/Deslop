"use client";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/Modal";
import { CheckCircle, Sparkle, ArrowRight } from "@phosphor-icons/react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockDemo?: () => void;
}

export function PaywallModal({ isOpen, onClose, onUnlockDemo }: PaywallModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      {/* Part 1: Fixed Header with Duotone Icon */}
      <ModalHeader
        icon={<Sparkle size={20} weight="fill" />}
        title="Unlock Unlimited Extractions"
        subtitle="Daily free allowance reached (3/3 guest extractions used)"
        onClose={onClose}
      />

      {/* Part 2: Scrollable Body */}
      <ModalBody>
        <p className="text-xs text-[#525866] leading-relaxed">
          Upgrade to Deslop Pro for unlimited headless crawls, direct GitHub PR syncing, and team design token repositories.
        </p>

        {/* Pro Benefits List */}
        <div className="space-y-2.5 rounded-[8px] border border-[#E2E4E9] bg-[#FAFAFA] p-4 text-xs">
          <div className="flex items-center gap-2.5 text-[#0A0D14] font-medium">
            <CheckCircle size={16} weight="fill" className="text-[#059669] shrink-0" />
            <span>Unlimited live website & SPA headless extractions</span>
          </div>
          <div className="flex items-center gap-2.5 text-[#0A0D14] font-medium">
            <CheckCircle size={16} weight="fill" className="text-[#059669] shrink-0" />
            <span>1-click GitHub PR to commit .cursorrules & design.md</span>
          </div>
          <div className="flex items-center gap-2.5 text-[#0A0D14] font-medium">
            <CheckCircle size={16} weight="fill" className="text-[#059669] shrink-0" />
            <span>Private & staging URL inspection behind auth</span>
          </div>
          <div className="flex items-center gap-2.5 text-[#0A0D14] font-medium">
            <CheckCircle size={16} weight="fill" className="text-[#059669] shrink-0" />
            <span>Figma & DTCG token export</span>
          </div>
        </div>
      </ModalBody>

      {/* Part 3: Fixed Footer */}
      <ModalFooter className="justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-[#0A0D14]">$9</span>
          <span className="text-xs text-[#868C98]">/ month · cancel anytime</span>
        </div>

        <div className="flex items-center gap-2">
          {onUnlockDemo && (
            <button
              type="button"
              onClick={onUnlockDemo}
              className="btn-gloss-neutral px-3 py-2 text-xs font-semibold"
            >
              Reset Demo
            </button>
          )}

          <button
            type="button"
            onClick={() => alert("Stripe checkout integration point")}
            className="btn-gloss-orange px-4 py-2 text-xs font-semibold gap-1.5"
          >
            <span>Upgrade to Pro</span>
            <ArrowRight size={13} weight="bold" />
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
