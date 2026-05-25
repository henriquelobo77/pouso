import * as React from "react";
import { Mark } from "./mark";
import { Wordmark } from "./wordmark";
import { cn } from "@/lib/utils";

interface HorizontalLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  markSize?: number;
  textSize?: string;
}

export function HorizontalLogo({
  markSize = 36,
  textSize = "text-4xl",
  className,
  ...props
}: HorizontalLogoProps) {
  return (
    <div
      className={cn("inline-flex items-center gap-3", className)}
      {...props}
    >
      <Mark size={markSize} />
      <Wordmark className={textSize} />
    </div>
  );
}
