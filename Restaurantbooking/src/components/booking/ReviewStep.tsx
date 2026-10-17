import React from "react";
import { Link } from "react-router-dom";
import { PencilIcon, ShieldCheckIcon, ShieldXIcon } from "lucide-react";
import type { Guest, PriceBreakdown, SearchCriteria } from "../../types/booking";
import type { Hotel, Room } from "../../types/hotel";
import { cancellationSummary } from "../../utils/booking";
import { formatDate } from "../../utils/dates";
import { pluralize } from "../../utils/format";
import { Button, buttonClasses } from "../ui/Button";
import { PriceSummary } from "./PriceSummary";

interface ReviewStepProps {
  hotel: Hotel;
  room: Room;
  criteria: SearchCriteria;
  guest: Guest;
  price: PriceBreakdown;
  editStayHref: string;
  onEditGuest: () => void;
  onContinue: () => void;
}

export function ReviewStep({ hotel, room, criteria, guest, price, editStayHref, onEditGuest, onContinue }: ReviewStepProps) {
  const row = (label: string, value: React.ReactNode) =>
  <div className="flex justify-between gap-6 py-2.5 text-sm">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>;


  return (
    <div>
      <h2 className="font-display text-2xl font-medium text-ink">Review your booking</h2>
      <p className="mt-1 text-sm text-ink-soft">Check everything looks right before moving to the demo payment.</p>

      <section className="mt-8" aria-labelledby="review-stay">
        <div className="flex items-center justify-between gap-4">
          <h3 id="review-stay" className="text-base font-semibold text-ink">
            Your stay
          </h3>
          <Link to={editStayHref} className={buttonClasses("ghost", "sm")}>
            <PencilIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Edit booking
          </Link>
        </div>
        <dl className="mt-2 divide-y divide-sand-200 border-y border-sand-200">
          {row("Hotel", hotel.name)}
          {row("Room", room.name)}
          {row("Check-in", `${formatDate(criteria.checkIn)} from ${hotel.checkInTime}`)}
          {row("Check-out", `${formatDate(criteria.checkOut)} by ${hotel.checkOutTime}`)}
          {row("Length of stay", pluralize(price.nights, "night"))}
          {row("Guests", `${pluralize(criteria.adults, "adult")}${criteria.children ? `, ${pluralize(criteria.children, "child", "children")}` : ""}`)}
          {row("Rooms", criteria.rooms)}
        </dl>
      </section>

      <section className="mt-8" aria-labelledby="review-guest">
        <div className="flex items-center justify-between gap-4">
          <h3 id="review-guest" className="text-base font-semibold text-ink">
            Lead guest
          </h3>
          <button type="button" onClick={onEditGuest} className={buttonClasses("ghost", "sm")}>
            <PencilIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Edit details
          </button>
        </div>
        <dl className="mt-2 divide-y divide-sand-200 border-y border-sand-200">
          {row("Name", `${guest.firstName} ${guest.lastName}`)}
          {row("Email", guest.email)}
          {row("Phone", guest.phone)}
          {row("Country", guest.country)}
          {guest.specialRequests ? row("Special requests", guest.specialRequests) : null}
        </dl>
      </section>

      <section className="mt-8" aria-labelledby="review-price">
        <h3 id="review-price" className="text-base font-semibold text-ink">
          Price breakdown
        </h3>
        <div className="mt-3 rounded-2xl bg-sand-100 p-5">
          <PriceSummary price={price} />
          <p className="mt-3 text-xs text-ink-muted">Have a promo code? You can apply it on the next step.</p>
        </div>
      </section>

      <section className="mt-8 flex items-start gap-3 rounded-2xl border border-sand-200 p-5" aria-labelledby="review-cancel">
        {room.freeCancellation ?
        <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-forest-600" aria-hidden="true" /> :

        <ShieldXIcon className="mt-0.5 h-5 w-5 shrink-0 text-ink-soft" aria-hidden="true" />
        }
        <div>
          <h3 id="review-cancel" className="text-sm font-semibold text-ink">
            Cancellation policy
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            {cancellationSummary({ freeCancellation: room.freeCancellation, freeCancellationHours: hotel.freeCancellationHours })}
          </p>
        </div>
      </section>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="outline" size="lg" onClick={onEditGuest}>
          Back
        </Button>
        <Button size="lg" onClick={onContinue}>
          Continue to payment
        </Button>
      </div>
    </div>);

}