import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from "lucide-react";
import { amenities } from "../../data/amenities";
import { propertyTypeLabels } from "../../data/labels";
import type { Hotel } from "../../types/hotel";
import { formatPrice } from "../../utils/format";
import { getLowestPrice, hasFreeCancellation } from "../../utils/hotels";
import { buttonClasses } from "../ui/Button";
import { RatingBadge } from "../ui/RatingBadge";
import { StarRating } from "../ui/StarRating";
import { AmenityIcon } from "./AmenityIcon";
import { FavoriteButton } from "./FavoriteButton";

interface HotelCardProps {
  hotel: Hotel;
  layout?: "grid" | "list";
  searchQuery?: string;
}

export function HotelCard({ hotel, layout = "grid", searchQuery = "" }: HotelCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const gallery = hotel.images.slice(0, 5);
  const href = `/hotels/${hotel.id}${searchQuery ? `?${searchQuery}` : ""}`;
  const isList = layout === "list";
  const topAmenities = hotel.amenities.slice(0, isList ? 5 : 3);

  const step = (direction: 1 | -1) => (event: React.MouseEvent) => {
    event.preventDefault();
    setImageIndex((index) => (index + direction + gallery.length) % gallery.length);
  };

  return (
    <article
      className={`group flex h-full overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-card ${
      isList ? "flex-col sm:flex-row" : "flex-col"}`
      }>
      
      <div className={`relative shrink-0 overflow-hidden bg-sand-200 ${isList ? "aspect-[4/3] sm:aspect-auto sm:w-72 lg:w-80" : "aspect-[4/3]"}`}>
        <img
          src={gallery[imageIndex]}
          alt={`${hotel.name} — photo ${imageIndex + 1} of ${gallery.length}`}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy" />
        
        {!hotel.available &&
        <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-xs font-medium text-white">
            Sold out for these dates
          </span>
        }
        <FavoriteButton hotelId={hotel.id} hotelName={hotel.name} className="absolute right-3 top-3" />
        <button
          type="button"
          onClick={step(-1)}
          aria-label={`Previous photo of ${hotel.name}`}
          className="absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-ink shadow-card transition-opacity duration-150 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 md:opacity-0 md:group-hover:opacity-100">
          
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={step(1)}
          aria-label={`Next photo of ${hotel.name}`}
          className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-ink shadow-card transition-opacity duration-150 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 md:opacity-0 md:group-hover:opacity-100">
          
          <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
          {gallery.map((_, index) =>
          <span
            key={index}
            className={`h-1.5 rounded-full bg-white transition-[width,opacity] duration-200 ${index === imageIndex ? "w-4 opacity-100" : "w-1.5 opacity-60"}`} />

          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <StarRating stars={hotel.stars} />
          <span aria-hidden="true">·</span>
          <span>{propertyTypeLabels[hotel.propertyType]}</span>
        </div>
        <h3 className="mt-2 font-display text-xl font-medium leading-snug text-ink">
          <Link to={href} className="rounded hover:text-forest-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
            {hotel.name}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-ink-soft">
          <MapPinIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {hotel.neighborhood}, {hotel.city} · {hotel.distanceKm} km from center
        </p>
        <div className="mt-3">
          <RatingBadge rating={hotel.guestRating} reviewCount={hotel.reviewCount} />
        </div>
        {isList && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-soft">{hotel.shortDescription}</p>}
        <ul className="mb-5 mt-4 flex flex-wrap gap-x-4 gap-y-2" aria-label="Top amenities">
          {topAmenities.map((id) =>
          <li key={id} className="flex items-center gap-1.5 text-xs text-ink-soft">
              <AmenityIcon id={id} className="h-3.5 w-3.5 text-forest-600" />
              {amenities.find((amenity) => amenity.id === id)?.label}
            </li>
          )}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-sand-200 pt-4">
          <div>
            {hasFreeCancellation(hotel) &&
            <p className="mb-1 flex items-center gap-1 text-xs font-medium text-forest-600">
                <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Free cancellation
              </p>
            }
            <p className="text-ink">
              <span className="text-xs text-ink-muted">from </span>
              <span className="text-xl font-semibold tabular-nums">{formatPrice(getLowestPrice(hotel))}</span>
              <span className="text-xs text-ink-muted"> / night</span>
            </p>
            <p className="text-xs text-ink-muted">+ taxes & fees</p>
          </div>
          <Link to={href} className={buttonClasses("primary", "sm")} aria-label={`View details for ${hotel.name}`}>
            View details
          </Link>
        </div>
      </div>
    </article>);

}