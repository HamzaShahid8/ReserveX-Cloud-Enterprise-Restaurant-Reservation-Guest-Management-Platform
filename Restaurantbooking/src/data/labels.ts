import type { MealPlan, PropertyType } from "../types/hotel";
import type { SortOption } from "../utils/filters";

export const propertyTypeLabels: Record<PropertyType, string> = {
  hotel: "Hotel",
  resort: "Resort",
  boutique: "Boutique hotel",
  villa: "Villa",
  ryokan: "Ryokan",
  riad: "Riad",
  chalet: "Chalet"
};

export const mealPlanLabels: Record<MealPlan, string> = {
  "room-only": "Room only",
  breakfast: "Breakfast included",
  "half-board": "Half board",
  "all-inclusive": "All inclusive"
};

export const sortOptions: {value: SortOption;label: string;}[] = [
{ value: "recommended", label: "Recommended" },
{ value: "price-asc", label: "Price: low to high" },
{ value: "price-desc", label: "Price: high to low" },
{ value: "rating", label: "Highest guest rating" },
{ value: "reviews", label: "Most reviewed" }];


export const guestRatingOptions = [
{ value: 0, label: "Any rating" },
{ value: 7, label: "Good 7+" },
{ value: 8, label: "Very good 8+" },
{ value: 9, label: "Superb 9+" }];


export const distanceOptions = [
{ value: 0, label: "Any distance" },
{ value: 1, label: "Under 1 km" },
{ value: 3, label: "Under 3 km" },
{ value: 5, label: "Under 5 km" },
{ value: 10, label: "Under 10 km" }];