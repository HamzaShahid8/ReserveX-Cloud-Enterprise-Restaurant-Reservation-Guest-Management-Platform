import React from "react";
import { StarIcon } from "lucide-react";

export function StarRating({ stars, size = "sm" }: {stars: number;size?: "sm" | "md";}) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${stars}-star property`}>
      {Array.from({ length: stars }, (_, index) =>
      <StarIcon key={index} className={`${iconSize} fill-gold-500 text-gold-500`} aria-hidden="true" />
      )}
    </span>);

}