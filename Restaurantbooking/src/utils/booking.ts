import type { Booking, SearchCriteria } from "../types/booking";
import { formatDate, isBeforeToday } from "./dates";
import { formatMoney } from "./format";
import { criteriaToParams, guestSummary } from "./search";

export type BookingGroup = "upcoming" | "past" | "cancelled";

export function generateReference(): string {
  const time = Date.now().toString(36).slice(-4).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "7");
  return `AUR-${time}${random}`;
}

export function getBookingGroup(booking: Booking): BookingGroup {
  if (booking.status === "cancelled") return "cancelled";
  return isBeforeToday(booking.checkOut) ? "past" : "upcoming";
}

export function buildBookingParams(hotelId: string, roomId: string, criteria: SearchCriteria): string {
  const params = criteriaToParams(criteria);
  params.set("hotel", hotelId);
  params.set("room", roomId);
  return params.toString();
}

export function cancellationSummary(booking: Pick<Booking, "freeCancellation" | "freeCancellationHours">): string {
  return booking.freeCancellation ?
  `Free cancellation until ${booking.freeCancellationHours} hours before check-in. After that, the first night is charged.` :
  "This is a non-refundable rate. Cancelling won't return the amount paid.";
}

export function buildConfirmationText(booking: Booking): string {
  const lines = [
  "AURELLE STAYS — DEMO BOOKING CONFIRMATION",
  "This is a simulated booking. No reservation was made with the hotel and no payment was taken.",
  "",
  `Reference: ${booking.reference}`,
  `Status: ${booking.status === "confirmed" ? "Confirmed (demo)" : "Cancelled (demo)"}`,
  "",
  `Hotel: ${booking.hotelName}`,
  `Location: ${booking.location}`,
  `Room: ${booking.roomName}`,
  `Check-in: ${formatDate(booking.checkIn)}`,
  `Check-out: ${formatDate(booking.checkOut)}`,
  `Guests: ${guestSummary(booking)}`,
  "",
  `Lead guest: ${booking.guest.firstName} ${booking.guest.lastName}`,
  `Email: ${booking.guest.email}`,
  "",
  `Room subtotal: ${formatMoney(booking.price.subtotal)}`,
  booking.price.discount ? `Discount (${booking.price.promoCode}): -${formatMoney(booking.price.discount)}` : "",
  `Taxes: ${formatMoney(booking.price.taxes)}`,
  `Service fee: ${formatMoney(booking.price.serviceFee)}`,
  `Total: ${formatMoney(booking.price.total)}`,
  "",
  `Cancellation: ${cancellationSummary(booking)}`];

  return lines.filter((line, index) => line !== "" || lines[index - 1] !== "").join("\n");
}

export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}