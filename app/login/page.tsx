"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Crosshair, ArrowRight, Warning, Lock, Envelope } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/auth-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/history";

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      router.push(redirectUrl);
    } else {
      setError(result.error || "Failed to sign in");
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

      {/* Main Login Form */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 max-w-md mx-auto w-full">
        <div className="w-full rounded-[14px] border border-keyline bg-white p-8 shadow-keyline">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              Welcome back to <span className="font-serif-editorial italic text-accent font-medium">deslop</span>
            </h1>
            <p className="mt-2 text-xs text-ink-muted">
              Sign in to access your saved design systems and scan history.
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
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="pl-3 text-ink-subtle pointer-events-none absolute left-0">
                  <Envelope size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full rounded-[8px] border border-keyline bg-canvas pl-9 pr-3.5 py-2 text-xs sm:text-sm text-ink placeholder-ink-subtle focus:border-accent focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5 font-mono uppercase tracking-wider">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="pl-3 text-ink-subtle pointer-events-none absolute left-0">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-[8px] border border-keyline bg-canvas pl-9 pr-3.5 py-2 text-xs sm:text-sm text-ink placeholder-ink-subtle focus:border-accent focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-gloss-orange h-10 text-xs font-semibold tracking-[-0.01em] gap-2 cursor-pointer mt-2 justify-center"
            >
              <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
              <ArrowRight size={14} weight="bold" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-keyline text-center text-xs text-ink-muted">
            Don't have an account?{" "}
            <Link
              href={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
              className="font-semibold text-accent hover:underline"
            >
              Create one for free
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <LoginForm />
    </Suspense>
  );
}
