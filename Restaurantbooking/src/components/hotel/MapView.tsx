import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { InfoIcon, MapPinIcon } from "lucide-react";
import { destinations } from "../../data/destinations";
import type { Hotel } from "../../types/hotel";
import { formatPrice } from "../../utils/format";
import { getLowestPrice } from "../../utils/hotels";
import { buttonClasses } from "../ui/Button";
import { RatingBadge } from "../ui/RatingBadge";

interface MapViewProps {
  hotels: Hotel[];
  searchQuery: string;
}

export function MapView({ hotels, searchQuery }: MapViewProps) {
  const [activeId, setActiveId] = useState<string | null>(hotels[0]?.id ?? null);
  const active = hotels.find((hotel) => hotel.id === activeId) ?? null;

  useEffect(() => {
    if (!hotels.some((hotel) => hotel.id === activeId)) setActiveId(hotels[0]?.id ?? null);
  }, [hotels, activeId]);

  return (
    <section aria-label="Map of results" className="overflow-hidden rounded-2xl border border-sand-200 bg-white">
      <div
        className="relative aspect-[4/3] w-full bg-forest-50 sm:aspect-[16/9]"
        style={{
          backgroundImage: "linear-gradient(#d7e5de 1px, transparent 1px), linear-gradient(90deg, #d7e5de 1px, transparent 1px)",
          backgroundSize: "56px 56px"
        }}>
        
        <p className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-ink-soft shadow-card">
          <InfoIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Demo map — positions are illustrative
        </p>
        {destinations.map((destination) =>
        <span
          key={destination.id}
          className="pointer-events-none absolute -translate-x-1/2 text-xs font-semibold uppercase tracking-wide text-forest-500"
          style={{ left: `${destination.mapPosition.x}%`, top: `${destination.mapPosition.y + 9}%` }}
          aria-hidden="true">
          
            {destination.name}
          </span>
        )}
        <ul>
          {hotels.map((hotel) => {
            const isActive = hotel.id === activeId;
            return (
              <li key={hotel.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(hotel.id)}
                  aria-pressed={isActive}
                  aria-label={`${hotel.name}, from ${formatPrice(getLowestPrice(hotel))} per night`}
                  className={`absolute flex -translate-x-1/2 -translate-y-full items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold shadow-card transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${
                  isActive ? "z-10 bg-forest-700 text-white" : "bg-white text-ink hover:bg-sand-100"}`
                  }
                  style={{ left: `${hotel.mapPosition.x}%`, top: `${hotel.mapPosition.y}%` }}>
                  
                  <MapPinIcon className="h-3 w-3" aria-hidden="true" />
                  {formatPrice(getLowestPrice(hotel))}
                </button>
              </li>);

          })}
        </ul>
      </div>
      {active &&
      <div className="flex flex-col gap-4 border-t border-sand-200 p-4 sm:flex-row sm:items-center" aria-live="polite">
          <img src={active.images[0]} alt="" className="h-24 w-full rounded-xl object-cover sm:w-36" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-medium text-ink">{active.name}</p>
            <p className="text-sm text-ink-soft">
              {active.neighborhood}, {active.city}
            </p>
            <div className="mt-1.5">
              <RatingBadge rating={active.guestRating} reviewCount={active.reviewCount} />
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
            <p className="text-sm text-ink">
              from <span className="text-lg font-semibold">{formatPrice(getLowestPrice(active))}</span> / night
            </p>
            <Link to={`/hotels/${active.id}${searchQuery ? `?${searchQuery}` : ""}`} className={buttonClasses("primary", "sm")}>
              View details
            </Link>
          </div>
        </div>
      }
    </section>);

}