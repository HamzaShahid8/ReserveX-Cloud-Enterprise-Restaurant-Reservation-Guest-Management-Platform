import type { RoomTypeId } from "./hotel";

export interface SearchCriteria {
  destination: string;
  checkIn: string | null;
  checkOut: string | null;
  adults: number;
  children: number;
  rooms: number;
}

export interface Guest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  specialRequests?: string;
}

export interface PromoCode {
  code: string;
  description: string;
  type: "percent" | "fixed";
  value: number;
  minSubtotal?: number;
  validUntil: string;
}

export interface PriceBreakdown {
  nightlyRate: number;
  nights: number;
  rooms: number;
  subtotal: number;
  discount: number;
  taxes: number;
  serviceFee: number;
  taxRate: number;
  serviceFeeRate: number;
  total: number;
  originalTotal: number;
  promoCode: string | null;
}

export type BookingStatus = "confirmed" | "cancelled";

export interface Booking {
  id: string;
  reference: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  location: string;
  roomTypeId: RoomTypeId;
  roomName: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  guest: Guest;
  price: PriceBreakdown;
  freeCancellation: boolean;
  freeCancellationHours: number;
  status: BookingStatus;
  createdAt: string;
  cancelledAt?: string;
}