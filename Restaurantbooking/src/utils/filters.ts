import { amenities } from "../data/amenities";
import type { AmenityId, Hotel, MealPlan, PropertyType } from "../types/hotel";
import { getLowestPrice, getMealPlans, hasFreeCancellation, matchesDestination } from "./hotels";

export type SortOption = "recommended" | "price-asc" | "price-desc" | "rating" | "reviews";
export type ViewMode = "grid" | "list" | "map";

export interface HotelFilterState {
  priceMin: number;
  priceMax: number;
  stars: number[];
  minRating: number;
  propertyTypes: PropertyType[];
  amenities: AmenityId[];
  mealPlans: MealPlan[];
  freeCancellation: boolean;
  availableOnly: boolean;
  maxDistance: number;
}

export const PRICE_BOUNDS = { min: 50, max: 1500, step: 25 };

export const defaultFilters: HotelFilterState = {
  priceMin: PRICE_BOUNDS.min,
  priceMax: PRICE_BOUNDS.max,
  stars: [],
  minRating: 0,
  propertyTypes: [],
  amenities: [],
  mealPlans: [],
  freeCancellation: false,
  availableOnly: false,
  maxDistance: 0
};

const SORTS: SortOption[] = ["recommended", "price-asc", "price-desc", "rating", "reviews"];
const VIEWS: ViewMode[] = ["grid", "list", "map"];
const PROPERTY_TYPES: PropertyType[] = ["hotel", "resort", "boutique", "villa", "ryokan", "riad", "chalet"];
const MEAL_PLANS: MealPlan[] = ["room-only", "breakfast", "half-board", "all-inclusive"];
const AMENITY_IDS: AmenityId[] = amenities.map((amenity) => amenity.id);
const FILTER_KEYS = ["minPrice", "maxPrice", "stars", "rating", "type", "amenities", "meals", "freeCancellation", "available", "distance"];

function readList<T extends string>(params: URLSearchParams, key: string, allowed: readonly T[]): T[] {
  const raw = params.get(key);
  if (!raw) return [];
  return raw.split(",").filter((value): value is T => (allowed as readonly string[]).includes(value));
}

function readNumber(params: URLSearchParams, key: string, fallback: number, min: number, max: number): number {
  const value = Number(params.get(key));
  if (!params.get(key) || Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

export function filtersFromParams(params: URLSearchParams): HotelFilterState {
  const priceMin = readNumber(params, "minPrice", PRICE_BOUNDS.min, PRICE_BOUNDS.min, PRICE_BOUNDS.max);
  const priceMax = readNumber(params, "maxPrice", PRICE_BOUNDS.max, PRICE_BOUNDS.min, PRICE_BOUNDS.max);
  const rating = Number(params.get("rating"));
  const distance = Number(params.get("distance"));
  return {
    priceMin: Math.min(priceMin, priceMax),
    priceMax: Math.max(priceMin, priceMax),
    stars: readList(params, "stars", ["3", "4", "5"] as const).map(Number),
    minRating: [7, 8, 9].includes(rating) ? rating : 0,
    propertyTypes: readList(params, "type", PROPERTY_TYPES),
    amenities: readList(params, "amenities", AMENITY_IDS),
    mealPlans: readList(params, "meals", MEAL_PLANS),
    freeCancellation: params.get("freeCancellation") === "1",
    availableOnly: params.get("available") === "1",
    maxDistance: [1, 3, 5, 10].includes(distance) ? distance : 0
  };
}

export function writeFiltersToParams(params: URLSearchParams, filters: HotelFilterState): void {
  FILTER_KEYS.forEach((key) => params.delete(key));
  if (filters.priceMin !== PRICE_BOUNDS.min) params.set("minPrice", String(filters.priceMin));
  if (filters.priceMax !== PRICE_BOUNDS.max) params.set("maxPrice", String(filters.priceMax));
  if (filters.stars.length) params.set("stars", filters.stars.join(","));
  if (filters.minRating) params.set("rating", String(filters.minRating));
  if (filters.propertyTypes.length) params.set("type", filters.propertyTypes.join(","));
  if (filters.amenities.length) params.set("amenities", filters.amenities.join(","));
  if (filters.mealPlans.length) params.set("meals", filters.mealPlans.join(","));
  if (filters.freeCancellation) params.set("freeCancellation", "1");
  if (filters.availableOnly) params.set("available", "1");
  if (filters.maxDistance) params.set("distance", String(filters.maxDistance));
}

export function sortFromParams(params: URLSearchParams): SortOption {
  const value = params.get("sort") as SortOption | null;
  return value && SORTS.includes(value) ? value : "recommended";
}

export function viewFromParams(params: URLSearchParams): ViewMode {
  const value = params.get("view") as ViewMode | null;
  return value && VIEWS.includes(value) ? value : "grid";
}

export function countActiveFilters(filters: HotelFilterState): number {
  let count = 0;
  if (filters.priceMin !== PRICE_BOUNDS.min || filters.priceMax !== PRICE_BOUNDS.max) count++;
  count += filters.stars.length + filters.propertyTypes.length + filters.amenities.length + filters.mealPlans.length;
  if (filters.minRating) count++;
  if (filters.freeCancellation) count++;
  if (filters.availableOnly) count++;
  if (filters.maxDistance) count++;
  return count;
}

export function applyFilters(list: Hotel[], filters: HotelFilterState, destination: string): Hotel[] {
  return list.filter((hotel) => {
    if (!matchesDestination(hotel, destination)) return false;
    const price = getLowestPrice(hotel);
    if (price < filters.priceMin) return false;
    if (filters.priceMax < PRICE_BOUNDS.max && price > filters.priceMax) return false;
    if (filters.stars.length && !filters.stars.includes(hotel.stars)) return false;
    if (filters.minRating && hotel.guestRating < filters.minRating) return false;
    if (filters.propertyTypes.length && !filters.propertyTypes.includes(hotel.propertyType)) return false;
    if (filters.amenities.length && !filters.amenities.every((amenity) => hotel.amenities.includes(amenity))) return false;
    if (filters.mealPlans.length && !getMealPlans(hotel).some((plan) => filters.mealPlans.includes(plan))) return false;
    if (filters.freeCancellation && !hasFreeCancellation(hotel)) return false;
    if (filters.availableOnly && !hotel.available) return false;
    if (filters.maxDistance && hotel.distanceKm > filters.maxDistance) return false;
    return true;
  });
}

function recommendedScore(hotel: Hotel): number {
  return hotel.guestRating + (hotel.featured ? 0.6 : 0) + (hotel.available ? 0.4 : -2) + Math.log10(hotel.reviewCount) * 0.2;
}

export function sortHotels(list: Hotel[], sort: SortOption): Hotel[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
    case "price-desc":
      return sorted.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
    case "rating":
      return sorted.sort((a, b) => b.guestRating - a.guestRating);
    case "reviews":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    default:
      return sorted.sort((a, b) => recommendedScore(b) - recommendedScore(a));
  }
}