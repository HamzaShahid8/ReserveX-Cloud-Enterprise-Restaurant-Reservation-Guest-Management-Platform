import React from "react";
import { Link } from "react-router-dom";
import { ClockIcon, ShieldCheckIcon } from "lucide-react";
import type { Hotel } from "../../types/hotel";

export function HotelPolicies({ hotel }: {hotel: Hotel;}) {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <ClockIcon className="h-4 w-4 text-forest-600" aria-hidden="true" />
          Check-in & check-out
        </h3>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">Check-in from</dt>
            <dd className="font-medium text-ink">{hotel.checkInTime}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">Check-out by</dt>
            <dd className="font-medium text-ink">{hotel.checkOutTime}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">Early check-in and late check-out are subject to availability.</p>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-ink">House rules</h3>
        <ul className="mt-3 space-y-2 text-sm text-ink-soft">
          {hotel.houseRules.map((rule) =>
          <li key={rule} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
              {rule}
            </li>
          )}
        </ul>
      </div>
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <ShieldCheckIcon className="h-4 w-4 text-forest-600" aria-hidden="true" />
          Cancellation policy
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Flexible rates can be cancelled free of charge until {hotel.freeCancellationHours} hours before check-in. After that, the first
          night is charged. Non-refundable rates can't be changed or refunded.
        </p>
        <Link to="/legal/cancellation" className="mt-2 inline-block text-sm font-medium text-forest-700 underline-offset-4 hover:underline">
          Read the full policy
        </Link>
      </div>
    </div>);

}