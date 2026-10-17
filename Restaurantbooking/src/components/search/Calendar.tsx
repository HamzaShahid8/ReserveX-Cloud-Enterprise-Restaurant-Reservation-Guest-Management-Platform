import React, { useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek } from
"date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface CalendarProps {
  from: Date | null;
  to: Date | null;
  minDate: Date;
  onSelect: (date: Date) => void;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function Calendar({ from, to, minDate, onSelect }: CalendarProps) {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(from ?? minDate));
  const [hovered, setHovered] = useState<Date | null>(null);
  const canGoBack = isAfter(viewMonth, startOfMonth(minDate));
  const rangeEnd = to ?? (from && hovered && isAfter(hovered, from) ? hovered : null);

  const renderMonth = (month: Date, className: string) => {
    const days = eachDayOfInterval({ start: startOfWeek(startOfMonth(month)), end: endOfWeek(endOfMonth(month)) });
    return (
      <div className={className}>
        <p className="mb-3 text-center text-sm font-semibold text-ink">{format(month, "MMMM yyyy")}</p>
        <div className="grid grid-cols-7 text-center text-xs font-medium text-ink-muted" aria-hidden="true">
          {WEEKDAYS.map((day) =>
          <span key={day} className="py-1.5">
              {day}
            </span>
          )}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            if (!isSameMonth(day, month)) return <span key={day.toISOString()} aria-hidden="true" />;
            const disabled = isBefore(day, minDate);
            const isStart = !!from && isSameDay(day, from);
            const isEnd = !!rangeEnd && isSameDay(day, rangeEnd);
            const inRange = !!from && !!rangeEnd && isAfter(day, from) && isBefore(day, rangeEnd);
            const band = inRange ?
            "bg-forest-50" :
            isStart && rangeEnd ?
            "bg-forest-50 rounded-l-full" :
            isEnd && from ?
            "bg-forest-50 rounded-r-full" :
            "";
            return (
              <div key={day.toISOString()} className={`py-0.5 ${band}`}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelect(day)}
                  onMouseEnter={() => setHovered(day)}
                  onFocus={() => setHovered(day)}
                  aria-label={`${format(day, "EEEE, MMMM d, yyyy")}${isStart ? ", check-in" : ""}${isEnd ? ", check-out" : ""}`}
                  aria-pressed={isStart || isEnd}
                  className={`mx-auto grid h-10 w-10 place-items-center rounded-full text-sm tabular-nums transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${
                  isStart || isEnd ?
                  "bg-forest-700 font-semibold text-white" :
                  disabled ?
                  "cursor-not-allowed text-sand-300" :
                  "text-ink hover:bg-sand-100"} ${
                  isToday(day) && !isStart && !isEnd ? "font-semibold underline decoration-gold-500 underline-offset-4" : ""}`}>
                  
                  {format(day, "d")}
                </button>
              </div>);

          })}
        </div>
      </div>);

  };

  return (
    <div onMouseLeave={() => setHovered(null)}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setViewMonth((month) => addMonths(month, -1))}
          disabled={!canGoBack}
          aria-label="Previous month"
          className="absolute left-0 top-0 z-10 grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-sand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:opacity-30 disabled:hover:bg-transparent">
          
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setViewMonth((month) => addMonths(month, 1))}
          aria-label="Next month"
          className="absolute right-0 top-0 z-10 grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-sand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
          
          <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="grid gap-8 md:grid-cols-2">
          {renderMonth(viewMonth, "")}
          {renderMonth(addMonths(viewMonth, 1), "hidden md:block")}
        </div>
      </div>
    </div>);

}