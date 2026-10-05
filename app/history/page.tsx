"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Crosshair,
  ArrowRight,
  Clock,
  Globe,
  SignOut,
  Sparkle,
  ArrowLeft,
  Lock,
  User,
} from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/auth-context";

interface ScanRecord {
  id: string;
  url: string;
  domain: string;
  screenshotUrl: string | null;
  tokens: Record<string, { hex: string }>;
  brandArchetype: string | null;
  scanDurationMs: number | null;
  createdAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function HistoryPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    async function fetchHistory() {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE}/api/scans/history`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setScans(data.scans || []);
        } else {
          setError("Failed to fetch scan history");
        }
      } catch {
        setError("Could not connect to backend server");
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="flex items-center gap-2 text-ink-muted text-xs font-mono">
          <Sparkle size={16} className="animate-spin text-accent" />
          <span>LOADING PROFILE...</span>
        </div>
      </div>
    );
  }

  // Unauthenticated View
  if (!user) {
    return (
      <div className="min-h-screen bg-canvas bg-drafting-grid flex flex-col justify-between">
        <header className="border-b border-keyline bg-canvas/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-accent text-white shadow-sm transition-transform group-hover:scale-105">
                <Crosshair size={16} weight="bold" />
              </div>
              <span className="font-serif-editorial font-medium italic text-accent text-2xl tracking-tight leading-none">
                deslop
              </span>
            </Link>
            <Link
              href="/"
              className="group flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors px-2.5 py-1.5 rounded-[6px] border border-keyline bg-surface-sunken hover:bg-canvas shadow-2xs"
            >
              <ArrowLeft size={13} weight="bold" className="transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-md mx-auto">
          <div className="flex h-14 w-14 items-center justify-center rounded-[12px] bg-surface-sunken border border-keyline text-accent mb-4 shadow-sm">
            <Lock size={28} weight="bold" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Sign in to view your scan history
          </h1>
          <p className="mt-2 text-xs text-ink-muted leading-relaxed">
            Create an account or log in to view all your previous website design extractions,
            color palettes, and AI guidelines.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link
              href="/login?redirect=/history"
              className="btn-gloss-orange h-10 px-6 text-xs font-semibold gap-2"
            >
              <span>Sign In</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
            <Link
              href="/register?redirect=/history"
              className="btn-gloss-neutral h-10 px-5 text-xs font-medium"
            >
              Create Account
            </Link>
          </div>
        </main>

        <footer className="py-6 text-center text-xs text-ink-subtle">
          Deslop &copy; {new Date().getFullYear()} — Anti-Slop Design System Engineering
        </footer>
      </div>
    );
  }

  // Authenticated View
  return (
    <div className="min-h-screen bg-canvas bg-drafting-grid flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-keyline bg-canvas/90 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-accent text-white shadow-sm transition-transform group-hover:scale-105">
                <Crosshair size={16} weight="bold" />
              </div>
              <span className="font-serif-editorial font-medium italic text-accent text-2xl tracking-tight leading-none">
                deslop
              </span>
            </Link>
            <span className="text-xs text-ink-subtle">/</span>
            <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
              Scan History
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors px-2 py-1.5 rounded-[6px] hover:bg-surface-sunken"
            >
              <ArrowLeft size={13} weight="bold" className="transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              href="/inspect"
              className="btn-gloss-orange h-8 px-3 text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <Sparkle size={13} weight="bold" />
              <span>New Scan</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 btn-gloss-neutral h-8 px-2.5 text-xs font-medium text-ink">
              <User size={14} className="text-accent" />
              <span className="max-w-[120px] truncate">{user.name || user.email.split("@")[0]}</span>
              <button
                type="button"
                onClick={() => logout()}
                title="Sign out"
                className="ml-1 text-ink-muted hover:text-[#DC2626] transition-colors cursor-pointer"
              >
                <SignOut size={13} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-keyline">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              Your Inspection History
            </h1>
            <p className="mt-1 text-xs text-ink-muted">
              Past design system extractions saved to your PostgreSQL database.
            </p>
          </div>
          <div className="text-xs font-mono text-ink-muted">
            {scans.length} {scans.length === 1 ? "scan" : "scans"} recorded
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 text-center text-xs font-mono text-ink-muted flex items-center justify-center gap-2">
            <Sparkle size={16} className="animate-spin text-accent" />
            <span>FETCHING SCANS FROM NEON DATABASE...</span>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-[10px] my-8 p-6 max-w-md mx-auto">
            {error}
          </div>
        ) : scans.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-surface-sunken border border-keyline text-ink-subtle mx-auto mb-3">
              <Globe size={24} />
            </div>
            <h3 className="font-bold text-base text-ink">No scans yet</h3>
            <p className="text-xs text-ink-muted mt-1 mb-6">
              You haven't inspected any websites yet. Enter a URL in the studio to extract your first design system.
            </p>
            <Link
              href="/inspect"
              className="btn-gloss-orange h-9 px-4 text-xs font-semibold gap-1.5 inline-flex items-center"
            >
              <span>Inspect Your First Site</span>
              <ArrowRight size={13} weight="bold" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {scans.map((scan) => {
              const tokenColors = Object.values(scan.tokens || {})
                .map((t) => t.hex)
                .filter(Boolean)
                .slice(0, 5);

              return (
                <div
                  key={scan.id}
                  className="rounded-[12px] border border-keyline bg-white p-5 shadow-keyline flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Domain & Date */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Globe size={14} className="text-ink-subtle shrink-0" />
                          <h3 className="font-bold text-sm text-ink font-mono">
                            {scan.domain}
                          </h3>
                        </div>
                        <a
                          href={scan.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-2xs text-ink-subtle hover:text-ink truncate block max-w-[200px] mt-0.5"
                        >
                          {scan.url}
                        </a>
                      </div>

                      <span className="text-2xs font-mono text-ink-subtle flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Archetype Badge */}
                    {scan.brandArchetype && (
                      <div className="mb-4">
                        <span className="text-2xs font-medium px-2 py-0.5 rounded-[4px] bg-canvas border border-keyline text-ink-muted">
                          {scan.brandArchetype}
                        </span>
                      </div>
                    )}

                    {/* Palette Swatches */}
                    {tokenColors.length > 0 && (
                      <div className="flex items-center gap-1.5 mb-5 p-2 rounded-[8px] bg-canvas border border-keyline">
                        {tokenColors.map((hex, idx) => (
                          <div
                            key={idx}
                            className="h-6 flex-1 rounded-[4px] border border-black/10 shadow-2xs"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-keyline flex items-center justify-between">
                    <span className="text-2xs font-mono text-ink-subtle">
                      {scan.scanDurationMs ? `${(scan.scanDurationMs / 1000).toFixed(1)}s crawl` : ""}
                    </span>

                    <Link
                      href={`/inspect?url=${encodeURIComponent(scan.url)}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                    >
                      <span>Open in Studio</span>
                      <ArrowRight size={12} weight="bold" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-ink-subtle border-t border-keyline mt-12">
        Deslop &copy; {new Date().getFullYear()} — Anti-Slop Design System Engineering
      </footer>
    </div>
  );
}
