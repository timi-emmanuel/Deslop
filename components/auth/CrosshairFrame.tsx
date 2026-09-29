"use client";

import React from "react";

interface CrosshairFrameProps {
  children: React.ReactNode;
  className?: string;
}

import { HalfSquare } from "@/components/ui/CrosshairCard";
export { HalfSquare };

export function CrosshairFrame({ children, className = "" }: CrosshairFrameProps) {
  return (
    <div className={`relative w-full max-w-5xl mx-auto group ${className}`}>
      {/* ============================================================ */}
      {/* CORNER HALF-SQUARE BRACKETS & DIVIDER JUNCTIONS               */}
      {/* Positioned precisely at the 4 outer vertices of the card     */}
      {/* ============================================================ */}
      {/* Top-Left Half-Square (┌) */}
      <div className="absolute -top-[1px] -left-[1px] z-20 pointer-events-none text-ink-subtle group-hover:text-accent transition-colors duration-200">
        <HalfSquare corner="tl" size="md" />
      </div>

      {/* Top-Right Half-Square (┐) */}
      <div className="absolute -top-[1px] -right-[1px] z-20 pointer-events-none text-ink-subtle group-hover:text-accent transition-colors duration-200">
        <HalfSquare corner="tr" size="md" />
      </div>

      {/* Bottom-Left Half-Square (└) */}
      <div className="absolute -bottom-[1px] -left-[1px] z-20 pointer-events-none text-ink-subtle group-hover:text-accent transition-colors duration-200">
        <HalfSquare corner="bl" size="md" />
      </div>

      {/* Bottom-Right Half-Square (┘) */}
      <div className="absolute -bottom-[1px] -right-[1px] z-20 pointer-events-none text-ink-subtle group-hover:text-accent transition-colors duration-200">
        <HalfSquare corner="br" size="md" />
      </div>

      {/* Top Divider Junction (Desktop ┬) */}
      <div className="hidden lg:block absolute -top-[1px] left-1/2 -translate-x-1/2 z-20 pointer-events-none text-ink-subtle group-hover:text-accent transition-colors duration-200">
        <HalfSquare corner="top-divider" size="md" />
      </div>

      {/* Bottom Divider Junction (Desktop ┴) */}
      <div className="hidden lg:block absolute -bottom-[1px] left-1/2 -translate-x-1/2 z-20 pointer-events-none text-ink-subtle group-hover:text-accent transition-colors duration-200">
        <HalfSquare corner="bottom-divider" size="md" />
      </div>

      {/* The Unified Card Content */}
      {children}
    </div>
  );
}
