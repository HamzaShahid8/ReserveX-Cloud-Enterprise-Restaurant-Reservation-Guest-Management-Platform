import React from "react";
import { twMerge } from "tailwind-merge";

export function Skeleton({ className }: {className?: string;}) {
  return <div aria-hidden="true" className={twMerge("animate-pulse rounded-lg bg-sand-200", className)} />;
}