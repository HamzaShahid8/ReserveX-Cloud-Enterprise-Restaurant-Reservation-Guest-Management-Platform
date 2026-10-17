import React from "react";
import { Skeleton } from "../ui/Skeleton";

export function HotelCardSkeleton({ layout = "grid" }: {layout?: "grid" | "list";}) {
  const isList = layout === "list";
  return (
    <div
      className={`flex overflow-hidden rounded-2xl border border-sand-200 bg-white ${isList ? "flex-col sm:flex-row" : "flex-col"}`}
      aria-hidden="true">
      
      <Skeleton className={`rounded-none ${isList ? "aspect-[4/3] sm:aspect-auto sm:h-auto sm:w-72 lg:w-80" : "aspect-[4/3]"}`} />
      <div className="flex-1 space-y-3 p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-40" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-end justify-between border-t border-sand-200 pt-4">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>
    </div>);

}