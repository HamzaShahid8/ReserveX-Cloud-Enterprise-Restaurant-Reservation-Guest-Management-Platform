import React from "react";
import { CheckIcon } from "lucide-react";

export const BOOKING_STEPS = ["Guest details", "Review", "Payment", "Confirmation"];

export function BookingStepper({ current }: {current: number;}) {
  return (
    <nav aria-label="Booking progress">
      <ol className="flex items-center">
        {BOOKING_STEPS.map((label, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li key={label} className={`flex items-center ${index < BOOKING_STEPS.length - 1 ? "flex-1" : ""}`}>
              <div className="flex items-center gap-2.5" aria-current={active ? "step" : undefined}>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold transition-colors duration-200 ${
                  done ? "bg-forest-700 text-white" : active ? "border-2 border-forest-700 bg-white text-forest-700" : "border border-sand-300 bg-white text-ink-muted"}`
                  }>
                  
                  {done ? <CheckIcon className="h-4 w-4" aria-hidden="true" /> : index + 1}
                </span>
                <span className={`hidden whitespace-nowrap text-sm sm:inline ${active ? "font-semibold text-ink" : done ? "text-ink" : "text-ink-muted"}`}>
                  {label}
                  {done && <span className="sr-only"> (completed)</span>}
                </span>
              </div>
              {index < BOOKING_STEPS.length - 1 &&
              <span className={`mx-3 h-px flex-1 ${done ? "bg-forest-700" : "bg-sand-300"}`} aria-hidden="true" />
              }
            </li>);

        })}
      </ol>
      <p className="mt-3 text-sm font-medium text-ink sm:hidden">{BOOKING_STEPS[current]}</p>
    </nav>);

}