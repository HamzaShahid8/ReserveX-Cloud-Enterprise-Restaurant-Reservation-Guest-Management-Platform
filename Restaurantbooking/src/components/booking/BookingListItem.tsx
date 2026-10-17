import React from "react";
import { Link } from "react-router-dom";
import { CalendarDaysIcon, UsersIcon } from "lucide-react";
import type { Booking } from "../../types/booking";
import type { BookingGroup } from "../../utils/booking";
import { formatDateRange } from "../../utils/dates";
import { formatMoney } from "../../utils/format";
import { guestSummary } from "../../utils/search";
import { Button } from "../ui/Button";

interface BookingListItemProps {
  booking: Booking;
  group: BookingGroup;
  onView: () => void;
  onCancel: () => void;
}

const statusStyles: Record<BookingGroup, {label: string;className: string;}> = {
  upcoming: { label: "Upcoming", className: "bg-forest-50 text-forest-700" },
  past: { label: "Completed", className: "bg-sand-100 text-ink-soft" },
  cancelled: { label: "Cancelled", className: "bg-danger-50 text-danger-700" }
};

export function BookingListItem({ booking, group, onView, onCancel }: BookingListItemProps) {
  const status = statusStyles[group];

  return (
    <li className="flex flex-col gap-5 py-6 sm:flex-row">
      <img src={booking.hotelImage} alt="" className="h-40 w-full shrink-0 rounded-2xl object-cover sm:h-32 sm:w-44" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>{status.label}</span>
          <span className="font-mono text-xs text-ink-muted">{booking.reference}</span>
        </div>
        <h3 className="mt-2 font-display text-xl font-medium text-ink">
          <Link to={`/hotels/${booking.hotelId}`} className="hover:text-forest-700">
            {booking.hotelName}
          </Link>
        </h3>
        <p className="text-sm text-ink-soft">
          {booking.roomName} · {booking.location}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink">
          <span className="flex items-center gap-1.5">
            <CalendarDaysIcon className="h-4 w-4 text-forest-600" aria-hidden="true" />
            {formatDateRange(booking.checkIn, booking.checkOut)}
          </span>
          <span className="flex items-center gap-1.5">
            <UsersIcon className="h-4 w-4 text-forest-600" aria-hidden="true" />
            {guestSummary(booking)}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-between">
        <p className="text-right">
          <span className="block text-xs text-ink-muted">Total</span>
          <span className={`text-lg font-semibold tabular-nums ${group === "cancelled" ? "text-ink-muted line-through" : "text-ink"}`}>
            {formatMoney(booking.price.total)}
          </span>
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onView}>
            View details
          </Button>
          {group === "upcoming" &&
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-danger-600 hover:bg-danger-50 hover:text-danger-700">
              Cancel
            </Button>
          }
        </div>
      </div>
    </li>);

}