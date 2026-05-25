import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[background-color,border-color,color,box-shadow] duration-200 ease-[var(--ease)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.125em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-[#f9fbf7] hover:bg-primary-hover shadow-[var(--shadow-soft)]",
        secondary:
          "bg-surface text-fg border border-border hover:bg-surface-2 hover:border-border-strong",
        outline:
          "bg-transparent text-fg border border-border-strong hover:bg-surface-2",
        ghost: "bg-transparent text-fg hover:bg-surface-2",
        accent:
          "bg-accent text-[#fdf8f1] hover:brightness-95 shadow-[var(--shadow-soft)]",
        danger:
          "bg-transparent text-danger border border-[color-mix(in_oklab,var(--danger)_25%,var(--border))] hover:bg-[color-mix(in_oklab,var(--danger)_8%,transparent)]",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-[0.9375rem]",
        lg: "h-12 px-5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
