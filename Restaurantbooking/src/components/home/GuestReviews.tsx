import React from "react";
import { Link } from "react-router-dom";
import { hotels } from "../../data/hotels";
import { reviews } from "../../data/reviews";
import { formatDate } from "../../utils/dates";

const featuredIds = ["r5", "r9", "r17"];

export function GuestReviews() {
  const [lead, ...rest] = featuredIds.
  map((id) => reviews.find((review) => review.id === id)).
  filter((review): review is (typeof reviews)[number] => !!review);
  const hotelName = (hotelId: string) => hotels.find((hotel) => hotel.id === hotelId)?.name ?? "";

  return (
    <section aria-labelledby="reviews-title" className="bg-sand-100 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="reviews-title" className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
          What guests are saying
        </h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <figure>
            <blockquote className="font-display text-2xl font-normal leading-snug text-ink md:text-3xl">"{lead.body}"</blockquote>
            <figcaption className="mt-6 text-sm">
              <span className="font-medium text-ink">{lead.author}</span>
              <span className="text-ink-soft">
                {" "}
                · {lead.country} · stayed at{" "}
                <Link to={`/hotels/${lead.hotelId}`} className="font-medium text-forest-700 underline-offset-4 hover:underline">
                  {hotelName(lead.hotelId)}
                </Link>
              </span>
            </figcaption>
          </figure>
          <div className="divide-y divide-sand-300 border-t border-sand-300 lg:border-t-0">
            {rest.map((review) =>
            <figure key={review.id} className="py-6 lg:first:pt-0">
                <p className="text-sm font-semibold text-forest-700">{review.rating}/10</p>
                <blockquote className="mt-2 text-base leading-relaxed text-ink">"{review.body}"</blockquote>
                <figcaption className="mt-3 text-xs text-ink-soft">
                  {review.author} · {hotelName(review.hotelId)} · {formatDate(review.date, "MMMM yyyy")}
                </figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
    </section>);

}