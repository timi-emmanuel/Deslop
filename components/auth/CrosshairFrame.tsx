"use client";

import React from "react";

interface CrosshairFrameProps {
  children: React.ReactNode;
  className?: string;
}

import { CrosshairMark } from "@/components/ui/CrosshairCard";
export { CrosshairMark };

export function CrosshairFrame({ children, className = "" }: CrosshairFrameProps) {
  return (
    <div className={`relative w-full max-w-5xl mx-auto ${className}`}>
      {/* ============================================================ */}
      {/* CORNER CROSSHAIR FRAMING MARKS                               */}
      {/* Positioned precisely at the 4 outer vertices of the card     */}
      {/* ============================================================ */}
      {/* Top-Left Vertex */}
      <div className="absolute -top-2 -left-2 z-20 pointer-events-none">
        <CrosshairMark size="md" />
      </div>

      {/* Top-Right Vertex */}
      <div className="absolute -top-2 -right-2 z-20 pointer-events-none">
        <CrosshairMark size="md" />
      </div>

      {/* Bottom-Left Vertex */}
      <div className="absolute -bottom-2 -left-2 z-20 pointer-events-none">
        <CrosshairMark size="md" />
      </div>

      {/* Bottom-Right Vertex */}
      <div className="absolute -bottom-2 -right-2 z-20 pointer-events-none">
        <CrosshairMark size="md" />
      </div>

      {/* Top Divider Junction (Desktop) */}
      <div className="hidden lg:block absolute -top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <CrosshairMark size="md" />
      </div>

      {/* Bottom Divider Junction (Desktop) */}
      <div className="hidden lg:block absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <CrosshairMark size="md" />
      </div>

      {/* The Unified Card Content */}
      {children}
    </div>
  );
}
