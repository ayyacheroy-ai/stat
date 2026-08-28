import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:opacity-40",
        variant === "primary"
          ? "bg-accent text-accent-foreground hover:opacity-90"
          : "border border-border bg-surface-2 text-foreground hover:bg-surface",
        className,
      )}
      {...props}
    />
  );
}
