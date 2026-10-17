import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDaysIcon } from "lucide-react";
import { isAfter, isBefore } from "date-fns";
import { useDismiss } from "../../hooks/useDismiss";
import { formatDate, fromISODate, nightsBetween, toISODate, today } from "../../utils/dates";
import { pluralize } from "../../utils/format";
import { Calendar } from "./Calendar";

interface DateRangePickerProps {
  checkIn: string | null;
  checkOut: string | null;
  onChange: (value: {checkIn: string | null;checkOut: string | null;}) => void;
  hasError?: boolean;
  popoverAlign?: "left" | "center" | "right";
}

type ActiveField = "checkIn" | "checkOut";

export function DateRangePicker({ checkIn, checkOut, onChange, hasError, popoverAlign = "left" }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ActiveField>("checkIn");
  const containerRef = useRef<HTMLDivElement>(null);
  useDismiss(containerRef, () => setOpen(false), open);

  const from = fromISODate(checkIn);
  const to = fromISODate(checkOut);
  const nights = nightsBetween(checkIn, checkOut);

  const openAt = (field: ActiveField) => {
    setActive(field);
    setOpen(true);
  };

  const handleSelect = (date: Date) => {
    const iso = toISODate(date);
    if (active === "checkIn" || !from) {
      const keepCheckOut = to && isBefore(date, to);
      onChange({ checkIn: iso, checkOut: keepCheckOut ? checkOut : null });
      setActive("checkOut");
      return;
    }
    if (!isAfter(date, from)) {
      onChange({ checkIn: iso, checkOut: null });
      setActive("checkOut");
      return;
    }
    onChange({ checkIn, checkOut: iso });
    setOpen(false);
  };

  const triggerClass = (field: ActiveField) =>
  `flex min-w-0 flex-1 flex-col items-start rounded-xl border bg-white px-3.5 py-2 text-left transition-[border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-700/10 ${
  open && active === field ?
  "border-forest-700 ring-4 ring-forest-700/10" :
  hasError ?
  "border-danger-600" :
  "border-sand-300 hover:border-forest-500"}`;


  const alignClass = {
    left: "left-0",
    center: "left-0 lg:left-1/2 lg:-translate-x-1/2",
    right: "right-0"
  }[popoverAlign];

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-2">
        {(["checkIn", "checkOut"] as const).map((field) => {
          const value = field === "checkIn" ? checkIn : checkOut;
          return (
            <button
              key={field}
              type="button"
              className={triggerClass(field)}
              onClick={() => openAt(field)}
              aria-haspopup="dialog"
              aria-expanded={open && active === field}
              aria-label={`${field === "checkIn" ? "Check-in" : "Check-out"} date: ${value ? formatDate(value) : "not set"}`}>
              
              <span className="text-xs font-medium text-ink-muted">{field === "checkIn" ? "Check-in" : "Check-out"}</span>
              <span className={`flex items-center gap-1.5 truncate text-sm ${value ? "font-medium text-ink" : "text-ink-muted"}`}>
                <CalendarDaysIcon className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
                <span className="truncate">{value ? formatDate(value, "EEE, MMM d") : "Add date"}</span>
              </span>
            </button>);

        })}
      </div>
      <AnimatePresence>
        {open &&
        <motion.div
          role="dialog"
          aria-label={active === "checkIn" ? "Choose check-in date" : "Choose check-out date"}
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className={`absolute top-full z-40 mt-2 w-[calc(100vw-2rem)] max-w-[340px] rounded-2xl border border-sand-200 bg-white p-5 shadow-lift md:w-[660px] md:max-w-none ${alignClass}`}>
          
            <p className="mb-4 text-sm text-ink-soft" aria-live="polite">
              {active === "checkIn" ? "Select your check-in date" : "Now select your check-out date"}
            </p>
            <Calendar from={from} to={to} minDate={today()} onSelect={handleSelect} />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-sand-200 pt-4">
              <p className="text-sm text-ink" aria-live="polite">
                {nights > 0 ?
              <>
                    <span className="font-semibold">{pluralize(nights, "night")}</span>
                    <span className="text-ink-soft">
                      {" "}
                      · {formatDate(checkIn, "MMM d")} – {formatDate(checkOut, "MMM d")}
                    </span>
                  </> :

              <span className="text-ink-soft">Minimum stay is 1 night</span>
              }
              </p>
              <div className="flex gap-2">
                <button
                type="button"
                onClick={() => {
                  onChange({ checkIn: null, checkOut: null });
                  setActive("checkIn");
                }}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
                
                  Clear
                </button>
                <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-forest-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-forest-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2">
                
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}