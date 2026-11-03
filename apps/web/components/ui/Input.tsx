import React, { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
  containerClassName?: string;
}

/**
 * Standardized dumb input primitive with left-inset icon support.
 */
export function Input({
  leftIcon,
  rightElement,
  className,
  containerClassName,
  ...props
}: InputProps) {
  return (
    <div className={cn("relative flex-1 flex items-center", containerClassName)}>
      {leftIcon && (
        <div className="pl-3.5 text-[#868C98] pointer-events-none flex items-center">
          {leftIcon}
        </div>
      )}
      <input
        className={cn(
          "w-full bg-transparent pr-4 py-2.5 text-xs sm:text-sm text-[#0A0D14] placeholder-[#868C98] focus:outline-none font-mono",
          leftIcon ? "pl-2.5" : "pl-3.5",
          className
        )}
        {...props}
      />
      {rightElement && (
        <div className="pr-3 text-[#868C98] flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  );
}
