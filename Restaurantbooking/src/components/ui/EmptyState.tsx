import React from "react";
import { BoxIcon } from "lucide-react";
interface EmptyStateProps {
  icon: BoxIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  tone?: "neutral" | "error";
}
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = "neutral"
}: EmptyStateProps) {
  return <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center" role={tone === "error" ? "alert" : undefined}>
      <div className={`grid h-14 w-14 place-items-center rounded-full ${tone === "error" ? "bg-danger-50 text-danger-600" : "bg-forest-50 text-forest-700"}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="mt-5 font-display text-2xl font-medium text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>;
}