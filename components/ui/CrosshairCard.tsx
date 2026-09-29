"use client";

import React from "react";

export interface CrosshairMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Pure 1px hairline drafting crosshair (+) matching the architectural blueprint pattern.
 * Intersects cleanly at 90 degrees with no center circle, extending along and beyond the card borders.
 */
export function CrosshairMark({
  className = "",
  size = "md",
}: CrosshairMarkProps) {
  const dim = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <svg
      viewBox="0 0 16 16"
      className={`${dim} text-ink-subtle pointer-events-none select-none ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      shapeRendering="crispEdges"
    >
      <line x1="8" y1="0" x2="8" y2="16" />
      <line x1="0" y1="8" x2="16" y2="8" />
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
  // Center (8, 8) sits precisely at (0, 0) corner vertices
  const offsetTL =
    size === "sm"
      ? "-top-[7px] -left-[7px]"
      : size === "lg"
      ? "-top-2.5 -left-2.5"
      : "-top-2 -left-2";
  const offsetTR =
    size === "sm"
      ? "-top-[7px] -right-[7px]"
      : size === "lg"
      ? "-top-2.5 -right-2.5"
      : "-top-2 -right-2";
  const offsetBL =
    size === "sm"
      ? "-bottom-[7px] -left-[7px]"
      : size === "lg"
      ? "-bottom-2.5 -left-2.5"
      : "-bottom-2 -left-2";
  const offsetBR =
    size === "sm"
      ? "-bottom-[7px] -right-[7px]"
      : size === "lg"
      ? "-bottom-2.5 -right-2.5"
      : "-bottom-2 -right-2";

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
