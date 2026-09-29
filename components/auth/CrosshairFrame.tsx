"use client";

import React from "react";

interface CrosshairFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function CrosshairMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`w-5 h-5 text-ink-subtle pointer-events-none select-none ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <line x1="10" y1="2" x2="10" y2="18" strokeLinecap="round" />
      <line x1="2" y1="10" x2="18" y2="10" strokeLinecap="round" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function CrosshairFrame({ children, className = "" }: CrosshairFrameProps) {
  return (
    <div className={`relative w-full max-w-5xl mx-auto ${className}`}>
      {/* ============================================================ */}
      {/* CORNER CROSSHAIR FRAMING MARKS                               */}
      {/* Positioned precisely at the 4 outer vertices of the card     */}
      {/* ============================================================ */}
      {/* Top-Left Vertex */}
      <div className="absolute -top-2.5 -left-2.5 z-20">
        <CrosshairMark />
      </div>

      {/* Top-Right Vertex */}
      <div className="absolute -top-2.5 -right-2.5 z-20">
        <CrosshairMark />
      </div>

      {/* Bottom-Left Vertex */}
      <div className="absolute -bottom-2.5 -left-2.5 z-20">
        <CrosshairMark />
      </div>

      {/* Bottom-Right Vertex */}
      <div className="absolute -bottom-2.5 -right-2.5 z-20">
        <CrosshairMark />
      </div>

      {/* Top Divider Junction (Desktop) */}
      <div className="hidden lg:block absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
        <CrosshairMark />
      </div>

      {/* Bottom Divider Junction (Desktop) */}
      <div className="hidden lg:block absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20">
        <CrosshairMark />
      </div>

      {/* The Unified Card Content */}
      {children}
    </div>
  );
}
