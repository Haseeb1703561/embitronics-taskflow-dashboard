import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-300",
  secondary:
    "border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-600 hover:bg-slate-800",
  ghost: "text-slate-300 hover:bg-slate-900 hover:text-white",
  danger:
    "border border-rose-500/30 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
          variantStyles[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
