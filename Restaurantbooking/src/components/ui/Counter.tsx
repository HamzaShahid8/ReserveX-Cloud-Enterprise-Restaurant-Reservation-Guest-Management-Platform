import React, { useId } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

interface CounterProps {
  label: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function Counter({ label, description, value, min, max, onChange }: CounterProps) {
  const labelId = useId();
  const buttonClass =
  "grid h-9 w-9 place-items-center rounded-full border border-sand-300 text-ink transition-colors duration-150 hover:border-forest-700 hover:text-forest-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-sand-300 disabled:hover:text-ink";

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p id={labelId} className="text-sm font-medium text-ink">
          {label}
        </p>
        {description && <p className="text-xs text-ink-muted">{description}</p>}
      </div>
      <div className="flex items-center gap-3" role="group" aria-labelledby={labelId}>
        <button
          type="button"
          className={buttonClass}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label.toLowerCase()}`}>
          
          <MinusIcon className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="w-6 text-center text-sm font-medium tabular-nums" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          className={buttonClass}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label.toLowerCase()}`}>
          
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>);

}