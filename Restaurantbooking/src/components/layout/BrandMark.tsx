import React from "react";

export function BrandMark({ tone = "dark" }: {tone?: "dark" | "light";}) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={`grid h-9 w-9 place-items-center rounded-full font-display text-lg font-medium ${
        tone === "dark" ? "bg-forest-700 text-gold-100" : "bg-gold-500 text-forest-900"}`
        }
        aria-hidden="true">
        
        A
      </span>
      <span className={`font-display text-xl font-medium tracking-tight ${tone === "dark" ? "text-ink" : "text-white"}`}>
        Aurelle <span className={tone === "dark" ? "text-gold-600" : "text-gold-400"}>Stays</span>
      </span>
    </span>);

}