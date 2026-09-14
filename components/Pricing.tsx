"use client";

import { CheckCircle, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

export function Pricing() {
  return (
    <section id="pricing" className="py-24 border-b border-[#E2E4E9] bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0A0D14]">
            Inspecting is free. Forever.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#525866]">
            Extract tokens and copy <code className="font-mono text-xs bg-[#F4F4F6] border border-[#E2E4E9] px-1 py-0.5 rounded text-[#0A0D14]">design.md</code> without creating an account. Upgrade when you need continuous CI/CD and team synchronization.
          </p>
        </div>

        {/* 3 Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-[8px] border border-[#E2E4E9] bg-white p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-base text-[#0A0D14]">Free Guest</span>
                <span className="font-mono text-[10px] bg-[#F4F4F6] text-[#525866] border border-[#E2E4E9] px-2 py-0.5 rounded">
                  NO LOGIN NEEDED
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold text-[#0A0D14]">$0</span>
                <span className="text-xs text-[#868C98]">/ forever</span>
              </div>
              <p className="text-xs text-[#525866] leading-relaxed mb-6">
                Perfect for solo developers and quick design audits on live websites.
              </p>

              <div className="space-y-2.5 text-xs text-[#343741] pt-6 border-t border-[#E2E4E9]">
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} weight="fill" className="text-[#059669]" />
                  <span>3 live website extractions per day</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} weight="fill" className="text-[#059669]" />
                  <span>Export full design.md file</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} weight="fill" className="text-[#059669]" />
                  <span>Export Tailwind CSS v4 @theme</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} weight="fill" className="text-[#059669]" />
                  <span>WCAG 2.1 contrast evaluation</span>
                </div>
              </div>
            </div>

            <a
              href="#extractor"
              className="btn-gloss-neutral mt-8 w-full h-11 text-xs font-semibold cursor-pointer"
            >
              Start Free
            </a>
          </div>

          {/* Pro Tier (Featured) */}
          <div className="rounded-[8px] border-2 border-[#FF4800] bg-white p-6 flex flex-col justify-between shadow-keyline relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#FF4800] px-3 py-0.5 font-mono text-[10px] font-bold uppercase text-white shadow-xs">
              MOST POPULAR
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-base text-[#0A0D14]">Pro Engineer</span>
                <span className="font-mono text-[10px] bg-[#FFF1EB] text-[#FF4800] border border-[#FFD6C7] px-2 py-0.5 rounded font-semibold">
                  ACTIVE BUILDER
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold text-[#0A0D14]">$9</span>
                <span className="text-xs text-[#868C98]">/ month</span>
              </div>
              <p className="text-xs text-[#525866] leading-relaxed mb-6">
                For engineers building serious apps with Cursor, Claude, and Tailwind.
              </p>

              <div className="space-y-2.5 text-xs text-[#343741] pt-6 border-t border-[#E2E4E9]">
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} weight="fill" className="text-[#FF4800]" />
                  <span className="font-medium text-[#0A0D14]">Unlimited live extractions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} weight="fill" className="text-[#FF4800]" />
                  <span className="font-medium text-[#0A0D14]">1-Click GitHub PR commit (.cursorrules)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} weight="fill" className="text-[#FF4800]" />
                  <span>Inspect private/staging URLs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} weight="fill" className="text-[#FF4800]" />
                  <span>Figma & DTCG token exports</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} weight="fill" className="text-[#FF4800]" />
                  <span>Saved token system library</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert("Stripe checkout integration point")}
              className="btn-gloss-orange mt-8 w-full h-11 text-xs font-bold gap-1.5 cursor-pointer"
            >
              <span>Upgrade to Pro</span>
              <ArrowRight size={13} weight="bold" />
            </button>
          </div>

          {/* Team Tier */}
          <div className="rounded-[8px] border border-[#E2E4E9] bg-white p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-base text-[#0A0D14]">Team & Agency</span>
                <span className="font-mono text-[10px] bg-[#F4F4F6] text-[#525866] border border-[#E2E4E9] px-2 py-0.5 rounded">
                  ENTERPRISE
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold text-[#0A0D14]">$19</span>
                <span className="text-xs text-[#868C98]">/ seat / mo</span>
              </div>
              <p className="text-xs text-[#525866] leading-relaxed mb-6">
                For organizations enforcing strict design system standards across team repos.
              </p>

              <div className="space-y-2.5 text-xs text-[#343741] pt-6 border-t border-[#E2E4E9]">
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} weight="fill" className="text-[#059669]" />
                  <span>Everything in Pro</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} weight="fill" className="text-[#059669]" />
                  <span>Centralized team token repository</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} weight="fill" className="text-[#059669]" />
                  <span>Automated CI/CD drift detection PR bot</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} weight="fill" className="text-[#059669]" />
                  <span>Dedicated API access & webhook triggers</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert("Team enterprise contact point")}
              className="btn-gloss-neutral mt-8 w-full h-11 text-xs font-semibold cursor-pointer"
            >
              Contact Team Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
