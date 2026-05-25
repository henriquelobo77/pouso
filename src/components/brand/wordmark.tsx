import * as React from "react";
import { cn } from "@/lib/utils";

interface WordmarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: "span" | "div" | "h1";
}

export function Wordmark({ as: Tag = "span", className, ...props }: WordmarkProps) {
  return (
    <Tag
      className={cn(
        "font-display font-medium text-fg leading-none tracking-tight inline-flex items-baseline",
        className
      )}
      {...props}
    >
      pouso<span className="text-primary">.</span>
    </Tag>
  );
}
