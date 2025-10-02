"use client";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function FullBleed({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen",
        className
      )}
    >
      {children}
    </div>
  );
}
