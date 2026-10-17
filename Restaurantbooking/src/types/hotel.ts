export type PropertyType = "hotel" | "resort" | "boutique" | "villa" | "ryokan" | "riad" | "chalet";

export type MealPlan = "room-only" | "breakfast" | "half-board" | "all-inclusive";

export type AmenityId =
"wifi" |
"pool" |
"spa" |
"gym" |
"restaurant" |
"bar" |
"parking" |
"airport-shuttle" |
"beach-access" |
"pet-friendly" |
"room-service" |
"air-conditioning" |
"kids-club" |
"ski-storage" |
"onsen" |
"rooftop";

export interface Amenity {
  id: AmenityId;
  label: string;
}

export interface MapPosition {
  x: number;
  y: number;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  tagline: string;
  description: string;
  image: string;
  bestTime: string;
  highlights: string[];
  mapPosition: MapPosition;
}

export type RoomTypeId = "standard" | "deluxe" | "executive" | "family" | "presidential";

export interface RoomType {
  id: RoomTypeId;
  name: string;
  description: string;
  image: string;
  bedType: string;
  sizeSqm: number;
  maxAdults: number;
  maxChildren: number;
  maxOccupancy: number;
  amenities: string[];
}

export interface RoomRate {
  typeId: RoomTypeId;
  pricePerNight: number;
  inventory: number;
  mealPlan: MealPlan;
  freeCancellation: boolean;
}

export interface Room extends RoomType {
  hotelId: string;
  pricePerNight: number;
  inventory: number;
  mealPlan: MealPlan;
  freeCancellation: boolean;
}

export interface RatingBreakdown {
  cleanliness: number;
  comfort: number;
  location: number;
  service: number;
  value: number;
}

export interface NearbyAttraction {
  name: string;
  distance: string;
  type: string;
}

export interface Hotel {
  id: string;
  name: string;
  destinationId: string;
  neighborhood: string;
  city: string;
  country: string;
  address: string;
  propertyType: PropertyType;
  stars: number;
  guestRating: number;
  reviewCount: number;
  distanceKm: number;
  mapPosition: MapPosition;
  images: string[];
  shortDescription: string;
  description: string;
  amenities: AmenityId[];
  available: boolean;
  featured: boolean;
  checkInTime: string;
  checkOutTime: string;
  freeCancellationHours: number;
  houseRules: string[];
  nearby: NearbyAttraction[];
  ratingBreakdown: RatingBreakdown;
  rates: RoomRate[];
}

export interface Review {
  id: string;
  hotelId: string;
  author: string;
  country: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  stayType: string;
}