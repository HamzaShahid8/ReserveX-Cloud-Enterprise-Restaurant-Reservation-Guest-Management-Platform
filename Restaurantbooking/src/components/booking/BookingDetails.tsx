import React from "react";
import type { Booking } from "../../types/booking";
import { cancellationSummary } from "../../utils/booking";
import { formatDate } from "../../utils/dates";
import { pluralize } from "../../utils/format";
import { PriceSummary } from "./PriceSummary";

export function BookingDetails({ booking }: {booking: Booking;}) {
  const row = (label: string, value: React.ReactNode) =>
  <div className="flex justify-between gap-6 py-2.5 text-sm">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>;


  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <img src={booking.hotelImage} alt="" className="h-20 w-24 shrink-0 rounded-xl object-cover" />
        <div className="min-w-0">
          <p className="font-display text-lg font-medium text-ink">{booking.hotelName}</p>
          <p className="text-sm text-ink-soft">{booking.location}</p>
          <p className="mt-1 text-sm text-ink">{booking.roomName}</p>
        </div>
      </div>
      <dl className="divide-y divide-sand-200 border-y border-sand-200">
        {row("Reference", <span className="font-mono">{booking.reference}</span>)}
        {row("Check-in", formatDate(booking.checkIn))}
        {row("Check-out", formatDate(booking.checkOut))}
        {row("Length of stay", pluralize(booking.price.nights, "night"))}
        {row(
          "Guests",
          `${pluralize(booking.adults, "adult")}${booking.children ? `, ${pluralize(booking.children, "child", "children")}` : ""}`
        )}
        {row("Rooms", booking.rooms)}
        {row("Lead guest", `${booking.guest.firstName} ${booking.guest.lastName}`)}
        {row("Email", booking.guest.email)}
        {booking.guest.specialRequests ? row("Special requests", booking.guest.specialRequests) : null}
        {row("Booked on", formatDate(booking.createdAt.slice(0, 10)))}
      </dl>
      <div className="rounded-2xl bg-sand-100 p-5">
        <PriceSummary price={booking.price} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-ink">Cancellation policy</h3>
        <p className="mt-1 text-sm text-ink-soft">{cancellationSummary(booking)}</p>
      </div>
    </div>);

}