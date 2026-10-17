import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function pageList(page: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const pages: (number | "gap")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) pages.push("gap");
  for (let current = start; current <= end; current++) pages.push(current);
  if (end < total - 1) pages.push("gap");
  pages.push(total);
  return pages;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const itemClass =
  "grid h-10 min-w-[2.5rem] place-items-center rounded-full px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`${itemClass} text-ink-soft hover:bg-sand-100 disabled:opacity-40 disabled:hover:bg-transparent`}
        aria-label="Previous page">
        
        <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
      </button>
      {pageList(page, totalPages).map((item, index) =>
      item === "gap" ?
      <span key={`gap-${index}`} className="px-1 text-ink-muted" aria-hidden="true">
            …
          </span> :

      <button
        key={item}
        type="button"
        onClick={() => onChange(item)}
        aria-current={item === page ? "page" : undefined}
        aria-label={`Page ${item}`}
        className={`${itemClass} ${item === page ? "bg-forest-700 text-white" : "text-ink hover:bg-sand-100"}`}>
        
            {item}
          </button>

      )}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={`${itemClass} text-ink-soft hover:bg-sand-100 disabled:opacity-40 disabled:hover:bg-transparent`}
        aria-label="Next page">
        
        <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>);

}