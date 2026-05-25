import * as React from "react";
import { cn } from "@/lib/utils";

interface MarkProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function Mark({ size = 32, className, ...props }: MarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label="pouso"
      className={cn("text-primary", className)}
      {...props}
    >
      <title>pouso</title>
      <path
        d="M 6 14 C 8 50, 56 50, 58 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="8" fill="currentColor" />
    </svg>
  );
}
