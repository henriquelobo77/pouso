import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default:
          "bg-surface-2 text-fg-muted border border-border",
        primary:
          "bg-primary-soft text-[color-mix(in_oklab,var(--primary)_70%,var(--fg))]",
        accent:
          "bg-accent-soft text-[color-mix(in_oklab,var(--accent)_60%,var(--fg))]",
        success:
          "bg-[color-mix(in_oklab,var(--success)_15%,var(--surface))] text-[color-mix(in_oklab,var(--success)_75%,var(--fg))]",
        warning:
          "bg-[color-mix(in_oklab,var(--warning)_15%,var(--surface))] text-[color-mix(in_oklab,var(--warning)_75%,var(--fg))]",
        danger:
          "bg-[color-mix(in_oklab,var(--danger)_12%,var(--surface))] text-[color-mix(in_oklab,var(--danger)_70%,var(--fg))]",
        outline:
          "bg-transparent text-fg-muted border border-border-strong",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
