import React from "react";

interface SectionHeadingProps {
  id?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  tone?: "dark" | "light";
}

export function SectionHeading({ id, title, description, action, tone = "dark" }: SectionHeadingProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="max-w-2xl">
        <h2 id={id} className={`font-display text-3xl font-medium tracking-tight md:text-4xl ${tone === "dark" ? "text-ink" : "text-white"}`}>
          {title}
        </h2>
        {description &&
        <p className={`mt-3 text-base leading-relaxed ${tone === "dark" ? "text-ink-soft" : "text-forest-100"}`}>{description}</p>
        }
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>);

}