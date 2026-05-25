import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-border bg-surface-2 px-3.5 py-2 text-[0.9375rem] text-fg",
          "placeholder:text-muted",
          "transition-[border-color,background-color] duration-200 ease-[var(--ease)]",
          "focus:outline-none focus:border-primary focus:bg-surface focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
