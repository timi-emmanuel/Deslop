"use client";

import Link from "next/link";
import { ArrowRight, Crosshair, GithubLogo, User, SignOut } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/auth-context";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-keyline bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-accent text-white shadow-sm transition-transform group-hover:scale-105">
            <Crosshair size={16} weight="bold" />
          </div>
          <span className="font-serif-editorial font-medium italic text-accent text-2xl tracking-tight leading-none">
            deslop
          </span>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-ink-muted">
          <a href="#how-it-works" className="hover:text-ink transition-colors">
            How it works
          </a>
          <a href="#templates" className="hover:text-ink transition-colors">
            Templates
          </a>
          <a href="#features" className="hover:text-ink transition-colors">
            Features
          </a>
          <a href="#faq" className="hover:text-ink transition-colors">
            FAQ
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/timi-emmanuel/deslop"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 btn-gloss-neutral h-8 px-3 text-xs font-medium cursor-pointer"
          >
            <GithubLogo size={14} weight="bold" />
            <span>Star</span>
          </a>

          {user ? (
            <div className="inline-flex items-center gap-1.5 btn-gloss-neutral h-8 px-2.5 text-xs font-medium text-ink">
              <Link href="/history" className="flex items-center gap-1.5 hover:text-accent transition-colors" title="View scan history">
                <User size={14} className="text-accent" />
                <span className="max-w-[100px] truncate">{user.name || user.email.split("@")[0]}</span>
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                title="Sign Out"
                className="ml-1 text-ink-muted hover:text-[#DC2626] transition-colors cursor-pointer"
              >
                <SignOut size={13} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-medium text-ink-muted hover:text-ink transition-colors px-2 py-1"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/inspect"
            className="inline-flex items-center gap-1.5 btn-gloss-orange h-8 px-3.5 text-xs font-semibold cursor-pointer"
          >
            <span>Try Scanner</span>
            <ArrowRight size={13} weight="bold" />
          </Link>
        </div>
      </div>
    </header>
  );
}
