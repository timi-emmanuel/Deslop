"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Crosshair, ArrowRight, Warning, Lock, Envelope, Eye, EyeSlash } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/auth-context";
import { PeekingMascot } from "@/components/auth/PeekingMascot";
import { CrosshairFrame } from "@/components/auth/CrosshairFrame";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/history";

  const { user, login, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Interactive Mascot tracking states
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      router.push(redirectUrl);
    }
  }, [user, authLoading, redirectUrl, router]);

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
            <span className="font-serif-editorial font-medium italic text-accent text-2xl tracking-tight leading-none">
              deslop
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-ink-muted hover:text-ink transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Single Unified Card with Crosshair Framing */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 w-full">
        <CrosshairFrame>
          <div className="w-full border border-keyline bg-white shadow-keyline overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch relative">
            
            {/* Vertical Dashed Line Divider (Desktop) */}
            <div
              className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-0 border-r border-dashed border-keyline-strong pointer-events-none z-10"
            />

            {/* Left Column: 4-Character Illustration Stage */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col items-center justify-center bg-canvas/35 relative border-b lg:border-b-0 border-dashed border-keyline-strong">
              <PeekingMascot
                isEmailFocused={isEmailFocused}
                emailLength={email.length}
                isPasswordFocused={isPasswordFocused}
                showPassword={showPassword}
                isSubmitting={isSubmitting}
                isError={!!error}
              />
            </div>

          {/* Right Column: Authentication Form */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white">
            <div className="w-full max-w-sm mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-ink">
                  Welcome back to <span className="font-serif-editorial italic text-accent font-medium">deslop</span>
                </h1>
                <p className="mt-1.5 text-xs text-ink-muted">
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
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none flex items-center justify-center">
                      <Envelope size={16} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => setIsEmailFocused(false)}
                      placeholder="alex@company.com"
                      style={{ paddingLeft: "42px" }}
                      className="input-with-icon w-full rounded-[8px] border border-keyline bg-canvas pr-3.5 py-2.5 text-xs sm:text-sm text-ink placeholder-ink-subtle focus:border-accent focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5 font-mono uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none flex items-center justify-center">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      placeholder="••••••••••••"
                      style={{ paddingLeft: "42px", paddingRight: "42px" }}
                      className="input-with-icon w-full rounded-[8px] border border-keyline bg-canvas pr-11 py-2.5 text-xs sm:text-sm text-ink placeholder-ink-subtle focus:border-accent focus:bg-white focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors p-1 flex items-center justify-center cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                    </button>
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
          </div>
        </div>
        </CrosshairFrame>
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
