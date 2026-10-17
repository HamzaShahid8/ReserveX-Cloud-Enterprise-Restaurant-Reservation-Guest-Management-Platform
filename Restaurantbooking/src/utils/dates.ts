import { addDays, differenceInCalendarDays, format, isBefore, isValid, parseISO, startOfDay } from "date-fns";

export function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function fromISODate(value?: string | null): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = parseISO(value);
  return isValid(parsed) ? startOfDay(parsed) : null;
}

export function today(): Date {
  return startOfDay(new Date());
}

export function isPastDate(date: Date): boolean {
  return isBefore(startOfDay(date), today());
}

export function nightsBetween(checkIn?: string | null, checkOut?: string | null): number {
  const start = fromISODate(checkIn);
  const end = fromISODate(checkOut);
  if (!start || !end) return 0;
  return Math.max(0, differenceInCalendarDays(end, start));
}

export function formatDate(value?: string | null, pattern = "EEE, MMM d, yyyy"): string {
  const date = fromISODate(value);
  return date ? format(date, pattern) : "—";
}

export function formatDateRange(checkIn?: string | null, checkOut?: string | null): string {
  if (!checkIn || !checkOut) return "Dates not set";
  return `${formatDate(checkIn, "MMM d")} – ${formatDate(checkOut, "MMM d, yyyy")}`;
}

export function defaultStayDates(): {checkIn: string;checkOut: string;} {
  const checkIn = addDays(today(), 14);
  return { checkIn: toISODate(checkIn), checkOut: toISODate(addDays(checkIn, 3)) };
}

export function isBeforeToday(value?: string | null): boolean {
  const date = fromISODate(value);
  return date ? isBefore(date, today()) : false;
}