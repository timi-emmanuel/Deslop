"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Crosshair, ArrowRight, Warning, Lock, Envelope, User } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/auth-context";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/history";

  const { user, register, isLoading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      router.push(redirectUrl);
    }
  }, [user, authLoading, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await register(email, password, name);
    setIsSubmitting(false);

    if (result.success) {
      router.push(redirectUrl);
    } else {
      setError(result.error || "Failed to create account");
    }
  };

  return (
    <div className="min-h-screen bg-canvas bg-drafting-grid flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-keyline bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-accent text-white shadow-sm transition-transform group-hover:scale-105">
              <Crosshair size={16} weight="bold" />
            </div>
            <span className="font-bold text-base tracking-tight text-ink">deslop</span>
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-ink-muted hover:text-ink transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Register Form */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 max-w-md mx-auto w-full">
        <div className="w-full rounded-[14px] border border-keyline bg-white p-8 shadow-keyline">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              Create your <span className="font-serif-editorial italic text-accent font-medium">deslop</span> account
            </h1>
            <p className="mt-2 text-xs text-ink-muted">
              Save your design system scans, view your history, and build anti-slop guidelines.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-2.5 rounded-[8px] border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <Warning size={16} weight="fill" className="shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5 font-mono uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none flex items-center justify-center">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  style={{ paddingLeft: "42px" }}
                  className="input-with-icon w-full rounded-[8px] border border-keyline bg-canvas pr-3.5 py-2.5 text-xs sm:text-sm text-ink placeholder-ink-subtle focus:border-accent focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5 font-mono uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none flex items-center justify-center">
                  <Envelope size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  style={{ paddingLeft: "42px" }}
                  className="input-with-icon w-full rounded-[8px] border border-keyline bg-canvas pr-3.5 py-2.5 text-xs sm:text-sm text-ink placeholder-ink-subtle focus:border-accent focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5 font-mono uppercase tracking-wider">
                Password (min 8 characters)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none flex items-center justify-center">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{ paddingLeft: "42px" }}
                  className="input-with-icon w-full rounded-[8px] border border-keyline bg-canvas pr-3.5 py-2.5 text-xs sm:text-sm text-ink placeholder-ink-subtle focus:border-accent focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-gloss-orange h-10 text-xs font-semibold tracking-[-0.01em] gap-2 cursor-pointer mt-2 justify-center"
            >
              <span>{isSubmitting ? "Creating account..." : "Create Free Account"}</span>
              <ArrowRight size={14} weight="bold" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-keyline text-center text-xs text-ink-muted">
            Already have an account?{" "}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
              className="font-semibold text-accent hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-ink-subtle">
        Deslop &copy; {new Date().getFullYear()} — Anti-Slop Design System Engineering
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <RegisterForm />
    </Suspense>
  );
}
