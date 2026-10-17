import { destinations } from "../data/destinations";
import { hotels } from "../data/hotels";
import { reviews } from "../data/reviews";
import { roomTypes } from "../data/roomTypes";
import type { SearchCriteria } from "../types/booking";
import type { Hotel, MealPlan, Room } from "../types/hotel";

export function getHotelById(id?: string | null): Hotel | undefined {
  return hotels.find((hotel) => hotel.id === id);
}

export function getDestination(id?: string | null) {
  return destinations.find((destination) => destination.id === id);
}

export function getHotelRooms(hotel: Hotel): Room[] {
  return hotel.rates.flatMap((rate) => {
    const type = roomTypes.find((roomType) => roomType.id === rate.typeId);
    if (!type) return [];
    return [
    {
      ...type,
      hotelId: hotel.id,
      pricePerNight: rate.pricePerNight,
      inventory: rate.inventory,
      mealPlan: rate.mealPlan,
      freeCancellation: rate.freeCancellation
    }];

  });
}

export function getRoom(hotel: Hotel, roomId?: string | null): Room | undefined {
  return getHotelRooms(hotel).find((room) => room.id === roomId);
}

export function getLowestPrice(hotel: Hotel): number {
  return Math.min(...hotel.rates.map((rate) => rate.pricePerNight));
}

export function getMealPlans(hotel: Hotel): MealPlan[] {
  return Array.from(new Set(hotel.rates.map((rate) => rate.mealPlan)));
}

export function hasFreeCancellation(hotel: Hotel): boolean {
  return hotel.rates.some((rate) => rate.freeCancellation);
}

export function getHotelReviews(hotelId: string) {
  return reviews.filter((review) => review.hotelId === hotelId);
}

export function getHotelsByDestination(destinationId: string): Hotel[] {
  return hotels.filter((hotel) => hotel.destinationId === destinationId);
}

export function getSimilarHotels(hotel: Hotel, limit = 3): Hotel[] {
  return hotels.
  filter((candidate) => candidate.id !== hotel.id).
  map((candidate) => {
    let score = 0;
    if (candidate.destinationId === hotel.destinationId) score += 3;
    if (candidate.propertyType === hotel.propertyType) score += 2;
    if (candidate.stars === hotel.stars) score += 1;
    score -= Math.abs(getLowestPrice(candidate) - getLowestPrice(hotel)) / 500;
    return { candidate, score };
  }).
  sort((a, b) => b.score - a.score).
  slice(0, limit).
  map(({ candidate }) => candidate);
}

export function matchesDestination(hotel: Hotel, query: string): boolean {
  const q = query.split(",")[0].trim().toLowerCase();
  if (!q) return true;
  const destination = getDestination(hotel.destinationId);
  return [hotel.name, hotel.city, hotel.neighborhood, hotel.country, destination?.name, destination?.country].some((value) =>
  value?.toLowerCase().includes(q)
  );
}

export interface CapacityCheck {
  ok: boolean;
  message?: string;
}

export function checkRoomCapacity(room: Room, criteria: SearchCriteria): CapacityCheck {
  const { adults, children, rooms } = criteria;
  if (room.inventory === 0) return { ok: false, message: "Sold out for your dates. Try another room type." };
  if (rooms > room.inventory) {
    return {
      ok: false,
      message: `Only ${room.inventory} of this room ${room.inventory === 1 ? "is" : "are"} left. Reduce to ${room.inventory} or choose another type.`
    };
  }
  if (adults > room.maxAdults * rooms) {
    return { ok: false, message: `Sleeps up to ${room.maxAdults} adults per room. Add rooms or choose a larger room.` };
  }
  if (children > room.maxChildren * rooms) {
    return {
      ok: false,
      message:
      room.maxChildren === 0 ?
      "This room doesn't accommodate children. Try a Family Room or Suite." :
      `Fits up to ${room.maxChildren} ${room.maxChildren === 1 ? "child" : "children"} per room. Add rooms or choose a larger room.`
    };
  }
  if (adults + children > room.maxOccupancy * rooms) {
    return { ok: false, message: `Maximum ${room.maxOccupancy} guests per room. Add rooms or choose a larger room.` };
  }
  return { ok: true };
}