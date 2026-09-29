"use client";

import React from "react";

export interface CrosshairMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CrosshairMark({
  className = "",
  size = "md",
}: CrosshairMarkProps) {
  const dim = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";
  return (
    <svg
      viewBox="0 0 20 20"
      className={`${dim} text-ink-subtle pointer-events-none select-none ${className}`}
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

export interface CrosshairCardProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  crosshairClassName?: string;
  highlightOnHover?: boolean;
}

export function CrosshairCard({
  children,
  className = "",
  size = "md",
  crosshairClassName = "",
  highlightOnHover = true,
}: CrosshairCardProps) {
  const isSm = size === "sm";
  const offsetTL = isSm ? "-top-2 -left-2" : "-top-2.5 -left-2.5";
  const offsetTR = isSm ? "-top-2 -right-2" : "-top-2.5 -right-2.5";
  const offsetBL = isSm ? "-bottom-2 -left-2" : "-bottom-2.5 -left-2.5";
  const offsetBR = isSm ? "-bottom-2 -right-2" : "-bottom-2.5 -right-2.5";

  const hoverColor = highlightOnHover
    ? "transition-colors duration-200 group-hover:text-accent"
    : "";

  return (
    <div className={`relative group ${className}`}>
      {/* Top-Left Vertex */}
      <div className={`absolute ${offsetTL} z-20 pointer-events-none`}>
        <CrosshairMark size={size} className={`${hoverColor} ${crosshairClassName}`} />
      </div>

      {/* Top-Right Vertex */}
      <div className={`absolute ${offsetTR} z-20 pointer-events-none`}>
        <CrosshairMark size={size} className={`${hoverColor} ${crosshairClassName}`} />
      </div>

      {/* Bottom-Left Vertex */}
      <div className={`absolute ${offsetBL} z-20 pointer-events-none`}>
        <CrosshairMark size={size} className={`${hoverColor} ${crosshairClassName}`} />
      </div>

      {/* Bottom-Right Vertex */}
      <div className={`absolute ${offsetBR} z-20 pointer-events-none`}>
        <CrosshairMark size={size} className={`${hoverColor} ${crosshairClassName}`} />
      </div>

      {children}
    </div>
  );
}
