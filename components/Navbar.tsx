"use client";

import Link from "next/link";
import { ArrowRight, Crosshair, GithubLogo } from "@phosphor-icons/react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E4E9] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#FF4800] text-white shadow-sm transition-transform group-hover:scale-105">
            <Crosshair size={16} weight="bold" />
          </div>
          <span className="font-bold text-base tracking-tight text-[#0A0D14]">deslop</span>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#525866]">
          <a href="#how-it-works" className="hover:text-[#0A0D14] transition-colors">
            How it works
          </a>
          <a href="#features" className="hover:text-[#0A0D14] transition-colors">
            Features
          </a>
          <a href="#presets" className="hover:text-[#0A0D14] transition-colors">
            Presets
          </a>
          <a href="#pricing" className="hover:text-[#0A0D14] transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-[#0A0D14] transition-colors">
            FAQ
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/AJonastech/deslop"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 btn-gloss-neutral h-8 px-3 text-xs font-medium cursor-pointer"
          >
            <GithubLogo size={14} weight="bold" />
            <span>Star</span>
          </a>

          <Link
            href="/inspect?url=https%3A%2F%2Flinear.app"
            className="inline-flex items-center gap-1.5 btn-gloss-orange h-8 px-3.5 text-xs font-semibold cursor-pointer"
          >
            <span>Open Studio</span>
            <ArrowRight size={13} weight="bold" />
          </Link>
        </div>
      </div>
    </header>
  );
}
