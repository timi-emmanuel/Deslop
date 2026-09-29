"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Crosshair, ArrowRight, Warning, Lock, Envelope, User, Eye, EyeSlash } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/auth-context";
import { PeekingMascot } from "@/components/auth/PeekingMascot";
import { CrosshairFrame } from "@/components/auth/CrosshairFrame";

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

  // Interactive Mascot tracking states
  const [activeField, setActiveField] = useState<"none" | "name" | "email" | "password">("none");
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

    const result = await register(email, password, name);
    setIsSubmitting(false);

    if (result.success) {
      router.push(redirectUrl);
    } else {
      setError(result.error || "Failed to create account");
    }
  };

  const isTextFocused = activeField === "name" || activeField === "email";
  const textLength = activeField === "name" ? name.length : email.length;

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

      {/* Main Single Unified Card with Crosshair Framing */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 w-full">
        <CrosshairFrame>
          <div className="w-full rounded-[18px] border border-keyline bg-white shadow-keyline overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch relative">
            
            {/* High-Precision Vertical Dotted Line Divider (Desktop) */}
            <div
              className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2px] pointer-events-none z-10"
              style={{
                backgroundImage: "radial-gradient(circle, #8A867D 1.25px, transparent 1.25px)",
                backgroundSize: "2px 10px",
                backgroundRepeat: "repeat-y",
              }}
            />

            {/* Left Column: 4-Guardian Illustration Stage */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-canvas/35 relative border-b lg:border-b-0 border-dotted border-keyline-strong">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-ink-subtle flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    Anti-Slop Security Crew
                  </span>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-surface-sunken text-ink-muted border border-keyline">
                    4 Guardians
                  </span>
                </div>
              <h2 className="text-lg font-bold text-ink mt-2 tracking-tight">
                Join the Anti-Slop Vanguard
              </h2>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                Your design system scans and tokens will be safeguarded by our interactive security sentinels.
              </p>
            </div>

            {/* Center 4-Mascot Stage */}
            <div className="my-4 py-2 flex items-center justify-center">
              <PeekingMascot
                isEmailFocused={isTextFocused}
                emailLength={textLength}
                isPasswordFocused={activeField === "password"}
                showPassword={showPassword}
                isSubmitting={isSubmitting}
                isError={!!error}
              />
            </div>

            {/* Bottom Crew Roster */}
            <div className="pt-4 border-t border-keyline/70 grid grid-cols-4 gap-2 text-center">
              <div className="flex flex-col items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[#f0642f] border border-white shadow-xs" />
                <span className="text-[10px] font-semibold text-ink mt-1">Lead</span>
                <span className="text-[9px] text-ink-subtle">Covers eyes</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[#2c2925] border border-white shadow-xs" />
                <span className="text-[10px] font-semibold text-ink mt-1">Shy</span>
                <span className="text-[9px] text-ink-subtle">Turns around</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[#ECE6DC] border border-[#2c2925] shadow-xs" />
                <span className="text-[10px] font-semibold text-ink mt-1">Whistler</span>
                <span className="text-[9px] text-ink-subtle">Looks up ♪</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[#f59569] border border-white shadow-xs" />
                <span className="text-[10px] font-semibold text-ink mt-1">Peeker</span>
                <span className="text-[9px] text-ink-subtle">Winks & peeks</span>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white">
            <div className="w-full max-w-sm mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-ink">
                  Create your <span className="font-serif-editorial italic text-accent font-medium">deslop</span> account
                </h1>
                <p className="mt-1.5 text-xs text-ink-muted">
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
                      onFocus={() => setActiveField("name")}
                      onBlur={() => setActiveField("none")}
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
                      onFocus={() => setActiveField("email")}
                      onBlur={() => setActiveField("none")}
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
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setActiveField("password")}
                      onBlur={() => setActiveField("none")}
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

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <RegisterForm />
    </Suspense>
  );
}
