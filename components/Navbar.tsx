"use client";

import Link from "next/link";
import { ArrowRight, Crosshair, GithubLogo } from "@phosphor-icons/react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E4E9] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#FF4800] text-white shadow-sm transition-transform group-hover:scale-105">
            <Crosshair size={16} weight="bold" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-base tracking-tight text-[#0A0D14]">deslop</span>
            <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-wider text-[#868C98] bg-[#F4F4F6] border border-[#E2E4E9] px-1.5 py-0.5 rounded-[4px]">
              SPEC.01
            </span>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#525866]">
          <a href="#slop-inspector" className="hover:text-[#0A0D14] transition-colors">
            Slop vs Craft
          </a>
          <a href="#extractor" className="hover:text-[#0A0D14] transition-colors">
            Token Extractor
          </a>
          <a href="#how-it-works" className="hover:text-[#0A0D14] transition-colors">
            Inspection Protocol
          </a>
          <a href="#presets" className="hover:text-[#0A0D14] transition-colors">
            Preset Matrix
          </a>
          <a href="#features" className="hover:text-[#0A0D14] transition-colors">
            Specifications
          </a>
        </nav>

        {/* Actions & Status */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 font-mono text-[11px] text-[#525866] border border-[#E2E4E9] bg-[#F4F4F6] px-2.5 py-1 rounded-[6px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#059669] animate-pulse" />
            <span>0% AI SLOP</span>
          </div>

          <a
            href="https://github.com/AJonastech/deslop"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-[6px] border border-[#E2E4E9] bg-white px-3 py-1.5 text-xs font-medium text-[#525866] hover:border-[#CDD0D5] hover:text-[#0A0D14] transition-all shadow-sm active:scale-[0.98]"
          >
            <GithubLogo size={14} weight="bold" />
            <span>Star</span>
          </a>

          <a
            href="#extractor"
            className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#FF4800] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#E03E00] transition-all active:scale-[0.98]"
          >
            <span>Launch Extractor</span>
            <ArrowRight size={13} weight="bold" />
          </a>
        </div>
      </div>
    </header>
  );
}
