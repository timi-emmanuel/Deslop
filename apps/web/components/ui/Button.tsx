import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gloss-orange" | "gloss-neutral" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

/**
 * Standardized dumb button primitive.
 * Enforces unified tactile glossy styling across the application.
 */
export function Button({
  variant = "gloss-neutral",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-xs sm:text-sm",
    lg: "h-11 px-6 text-sm sm:text-base",
  };

  const variantClasses = {
    "gloss-orange": "btn-gloss-orange",
    "gloss-neutral": "btn-gloss-neutral",
    ghost: "text-[#525866] hover:text-[#0A0D14] hover:bg-[#F4F4F6] rounded-[6px]",
    destructive: "bg-[#DC2626] text-white hover:bg-[#B91C1C] rounded-[6px] shadow-xs",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
