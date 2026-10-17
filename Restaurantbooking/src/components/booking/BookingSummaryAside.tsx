import React from "react";
import { CalendarDaysIcon, MapPinIcon, UsersIcon } from "lucide-react";
import type { PriceBreakdown, SearchCriteria } from "../../types/booking";
import type { Hotel, Room } from "../../types/hotel";
import { formatDate } from "../../utils/dates";
import { pluralize } from "../../utils/format";
import { guestSummary } from "../../utils/search";
import { StarRating } from "../ui/StarRating";
import { PriceSummary } from "./PriceSummary";

interface BookingSummaryAsideProps {
  hotel: Hotel;
  room: Room;
  criteria: SearchCriteria;
  price: PriceBreakdown;
}

export function BookingSummaryAside({ hotel, room, criteria, price }: BookingSummaryAsideProps) {
  return (
    <aside aria-label="Booking summary" className="overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-card">
      <img src={hotel.images[0]} alt="" className="h-40 w-full object-cover" />
      <div className="p-6">
        <StarRating stars={hotel.stars} />
        <h2 className="mt-1.5 font-display text-xl font-medium text-ink">{hotel.name}</h2>
        <p className="mt-1 flex items-center gap-1 text-sm text-ink-soft">
          <MapPinIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {hotel.neighborhood}, {hotel.city}
        </p>
        <dl className="mt-5 space-y-3 border-t border-sand-200 pt-5 text-sm">
          <div>
            <dt className="text-xs text-ink-muted">Room</dt>
            <dd className="font-medium text-ink">{room.name}</dd>
          </div>
          <div className="flex items-start gap-2">
            <CalendarDaysIcon className="mt-0.5 h-4 w-4 text-forest-600" aria-hidden="true" />
            <div>
              <dt className="sr-only">Dates</dt>
              <dd className="text-ink">
                {formatDate(criteria.checkIn, "EEE, MMM d")} → {formatDate(criteria.checkOut, "EEE, MMM d, yyyy")}
              </dd>
              <dd className="text-xs text-ink-muted">{pluralize(price.nights, "night")}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <UsersIcon className="mt-0.5 h-4 w-4 text-forest-600" aria-hidden="true" />
            <div>
              <dt className="sr-only">Guests</dt>
              <dd className="text-ink">{guestSummary(criteria)}</dd>
            </div>
          </div>
        </dl>
        <div className="mt-5 border-t border-sand-200 pt-5">
          <PriceSummary price={price} />
        </div>
      </div>
    </aside>);

}