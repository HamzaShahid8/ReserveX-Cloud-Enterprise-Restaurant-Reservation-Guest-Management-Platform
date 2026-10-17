import type { SearchCriteria } from "../types/booking";
import { defaultStayDates, fromISODate, isPastDate, nightsBetween } from "./dates";
import { pluralize } from "./format";

export const GUEST_LIMITS = {
  adults: { min: 1, max: 16 },
  children: { min: 0, max: 10 },
  rooms: { min: 1, max: 8 }
} as const;

export const MAX_NIGHTS = 30;

function clampInt(raw: string | null, min: number, max: number, fallback: number): number {
  const value = Number.parseInt(raw ?? "", 10);
  if (Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

export function defaultCriteria(): SearchCriteria {
  return { destination: "", ...defaultStayDates(), adults: 2, children: 0, rooms: 1 };
}

export function criteriaFromParams(params: URLSearchParams, fallback: SearchCriteria = defaultCriteria()): SearchCriteria {
  const checkIn = params.get("checkIn");
  const checkOut = params.get("checkOut");
  const adults = clampInt(params.get("adults"), GUEST_LIMITS.adults.min, GUEST_LIMITS.adults.max, fallback.adults);
  const rooms = clampInt(params.get("rooms"), GUEST_LIMITS.rooms.min, GUEST_LIMITS.rooms.max, fallback.rooms);
  return {
    destination: params.get("destination") ?? fallback.destination,
    checkIn: fromISODate(checkIn) ? checkIn : fallback.checkIn,
    checkOut: fromISODate(checkOut) ? checkOut : fallback.checkOut,
    adults,
    children: clampInt(params.get("children"), GUEST_LIMITS.children.min, GUEST_LIMITS.children.max, fallback.children),
    rooms: Math.min(rooms, adults)
  };
}

export function criteriaToParams(criteria: SearchCriteria): URLSearchParams {
  const params = new URLSearchParams();
  if (criteria.destination.trim()) params.set("destination", criteria.destination.trim());
  if (criteria.checkIn) params.set("checkIn", criteria.checkIn);
  if (criteria.checkOut) params.set("checkOut", criteria.checkOut);
  params.set("adults", String(criteria.adults));
  params.set("children", String(criteria.children));
  params.set("rooms", String(criteria.rooms));
  return params;
}

export function writeCriteriaToParams(params: URLSearchParams, criteria: SearchCriteria): void {
  ["destination", "checkIn", "checkOut", "adults", "children", "rooms"].forEach((key) => params.delete(key));
  criteriaToParams(criteria).forEach((value, key) => params.set(key, value));
}

export function validateCriteria(criteria: SearchCriteria): string | null {
  if (!criteria.checkIn || !criteria.checkOut) return "Choose your check-in and check-out dates to see prices.";
  const checkIn = fromISODate(criteria.checkIn);
  const checkOut = fromISODate(criteria.checkOut);
  if (!checkIn || !checkOut) return "One of your dates isn't valid. Please pick them again.";
  if (isPastDate(checkIn)) return "Check-in can't be in the past. Please choose today or a later date.";
  const nights = nightsBetween(criteria.checkIn, criteria.checkOut);
  if (nights < 1) return "Check-out must be at least one night after check-in.";
  if (nights > MAX_NIGHTS) return `Stays are limited to ${MAX_NIGHTS} nights. Please shorten your dates.`;
  if (criteria.rooms > criteria.adults) return "Each room needs at least one adult. Add adults or reduce rooms.";
  return null;
}

export function guestSummary(criteria: Pick<SearchCriteria, "adults" | "children" | "rooms">): string {
  const parts = [pluralize(criteria.adults, "adult")];
  if (criteria.children > 0) parts.push(pluralize(criteria.children, "child", "children"));
  parts.push(pluralize(criteria.rooms, "room"));
  return parts.join(" · ");
}