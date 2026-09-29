"use client";

import React from "react";

export type CornerPosition = "tl" | "tr" | "bl" | "br" | "top-divider" | "bottom-divider";

export interface HalfSquareProps {
  corner: CornerPosition;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Precision half-square corner bracket (┌, ┐, └, ┘) matching the reference architectural framing.
 * Replaces the plus (+) reticle with authentic two-sided corner brackets.
 * - tl: ┌ (top-left)
 * - tr: ┐ (top-right)
 * - bl: └ (bottom-left)
 * - br: ┘ (bottom-right)
 * - top-divider: ┬ (T-junction pointing down)
 * - bottom-divider: ┴ (T-junction pointing up)
 */
export function HalfSquare({
  corner,
  className = "",
  size = "md",
}: HalfSquareProps) {
  const dim = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";

  if (corner === "tl") {
    return (
      <svg viewBox="0 0 20 20" className={`${dim} pointer-events-none select-none ${className}`} fill="none">
        <path d="M 20 1 L 1 1 L 1 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
    );
  }

  if (corner === "tr") {
    return (
      <svg viewBox="0 0 20 20" className={`${dim} pointer-events-none select-none ${className}`} fill="none">
        <path d="M 0 1 L 19 1 L 19 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
    );
  }

  if (corner === "bl") {
    return (
      <svg viewBox="0 0 20 20" className={`${dim} pointer-events-none select-none ${className}`} fill="none">
        <path d="M 1 0 L 1 19 L 20 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
    );
  }

  if (corner === "br") {
    return (
      <svg viewBox="0 0 20 20" className={`${dim} pointer-events-none select-none ${className}`} fill="none">
        <path d="M 19 0 L 19 19 L 0 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
    );
  }

  if (corner === "top-divider") {
    return (
      <svg viewBox="0 0 20 20" className={`${dim} pointer-events-none select-none ${className}`} fill="none">
        <path d="M 0 1 L 20 1 M 10 1 L 10 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
    );
  }

  if (corner === "bottom-divider") {
    return (
      <svg viewBox="0 0 20 20" className={`${dim} pointer-events-none select-none ${className}`} fill="none">
        <path d="M 0 19 L 20 19 M 10 19 L 10 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
    );
  }

  return null;
}

export interface CrosshairCardProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  crosshairClassName?: string;
  highlightOnHover?: boolean;
}

/**
 * Wraps any card with precision half-square corner brackets at the 4 vertices.
 */
export function CrosshairCard({
  children,
  className = "",
  size = "md",
  crosshairClassName = "",
  highlightOnHover = true,
}: CrosshairCardProps) {
  const hoverColor = highlightOnHover
    ? "transition-colors duration-200 group-hover:text-accent"
    : "";

  return (
    <div className={`relative group ${className}`}>
      {/* Top-Left Half-Square (┌) */}
      <div className="absolute -top-[1px] -left-[1px] z-20 pointer-events-none text-ink-subtle">
        <HalfSquare corner="tl" size={size} className={`${hoverColor} ${crosshairClassName}`} />
      </div>

      {/* Top-Right Half-Square (┐) */}
      <div className="absolute -top-[1px] -right-[1px] z-20 pointer-events-none text-ink-subtle">
        <HalfSquare corner="tr" size={size} className={`${hoverColor} ${crosshairClassName}`} />
      </div>

      {/* Bottom-Left Half-Square (└) */}
      <div className="absolute -bottom-[1px] -left-[1px] z-20 pointer-events-none text-ink-subtle">
        <HalfSquare corner="bl" size={size} className={`${hoverColor} ${crosshairClassName}`} />
      </div>

      {/* Bottom-Right Half-Square (┘) */}
      <div className="absolute -bottom-[1px] -right-[1px] z-20 pointer-events-none text-ink-subtle">
        <HalfSquare corner="br" size={size} className={`${hoverColor} ${crosshairClassName}`} />
      </div>

      {children}
    </div>
  );
}

// Backwards-compatible alias for any existing imports
export const CrosshairMark = HalfSquare;
