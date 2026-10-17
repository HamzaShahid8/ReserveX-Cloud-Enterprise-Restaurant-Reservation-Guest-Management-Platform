import React from "react";
import { formatNumber, ratingLabel } from "../../utils/format";

interface RatingBadgeProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
}

export function RatingBadge({ rating, reviewCount, size = "sm" }: RatingBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`rounded-lg bg-forest-700 font-semibold tabular-nums text-white ${size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-sm"}`}>
        
        {rating.toFixed(1)}
      </span>
      <span className={`font-medium text-ink ${size === "sm" ? "text-sm" : "text-base"}`}>{ratingLabel(rating)}</span>
      {reviewCount !== undefined &&
      <span className={`text-ink-muted ${size === "sm" ? "text-xs" : "text-sm"}`}>
          {formatNumber(reviewCount)} reviews
        </span>
      }
    </span>);

}