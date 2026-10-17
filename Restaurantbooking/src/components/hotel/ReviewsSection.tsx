import React from "react";
import type { Hotel, RatingBreakdown, Review } from "../../types/hotel";
import { formatDate } from "../../utils/dates";
import { formatNumber, ratingLabel } from "../../utils/format";

const categoryLabels: Record<keyof RatingBreakdown, string> = {
  cleanliness: "Cleanliness",
  comfort: "Comfort",
  location: "Location",
  service: "Service",
  value: "Value for money"
};

export function ReviewsSection({ hotel, reviews }: {hotel: Hotel;reviews: Review[];}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-display text-5xl font-medium text-ink">{hotel.guestRating.toFixed(1)}</span>
          <span className="text-lg font-medium text-ink">{ratingLabel(hotel.guestRating)}</span>
        </div>
        <p className="mt-1 text-sm text-ink-soft">Based on {formatNumber(hotel.reviewCount)} verified reviews</p>
        <dl className="mt-6 space-y-3">
          {(Object.keys(categoryLabels) as (keyof RatingBreakdown)[]).map((key) =>
          <div key={key}>
              <div className="flex justify-between text-sm">
                <dt className="text-ink-soft">{categoryLabels[key]}</dt>
                <dd className="font-medium tabular-nums text-ink">{hotel.ratingBreakdown[key].toFixed(1)}</dd>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sand-200" aria-hidden="true">
                <div className="h-full rounded-full bg-forest-700" style={{ width: `${hotel.ratingBreakdown[key] * 10}%` }} />
              </div>
            </div>
          )}
        </dl>
      </div>
      <ul className="divide-y divide-sand-200">
        {reviews.map((review) =>
        <li key={review.id} className="py-6 first:pt-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-sand-200 text-sm font-semibold text-ink" aria-hidden="true">
                  {review.author.
                split(" ").
                map((part) => part[0]).
                join("")}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{review.author}</p>
                  <p className="text-xs text-ink-muted">
                    {review.country} · {review.stayType} · {formatDate(review.date, "MMMM yyyy")}
                  </p>
                </div>
              </div>
              <span className="rounded-lg bg-forest-50 px-2 py-1 text-sm font-semibold tabular-nums text-forest-700">
                {review.rating}/10
              </span>
            </div>
            <p className="mt-3 font-medium text-ink">"{review.title}"</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{review.body}</p>
          </li>
        )}
      </ul>
    </div>);

}