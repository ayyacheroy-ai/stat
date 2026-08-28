import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Mobile-first content width. Narrow by default (phone), widening on
 * larger breakpoints — never the other way around.
 */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-fade-in mx-auto w-full max-w-md px-4 sm:max-w-2xl lg:max-w-4xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
