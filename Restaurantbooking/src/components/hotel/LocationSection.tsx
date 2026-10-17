import React from "react";
import { MapPinIcon, NavigationIcon } from "lucide-react";
import type { Hotel } from "../../types/hotel";

export function LocationSection({ hotel }: {hotel: Hotel;}) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name} ${hotel.address}`)}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-sand-200 bg-forest-50"
        style={{
          backgroundImage: "linear-gradient(#d7e5de 1px, transparent 1px), linear-gradient(90deg, #d7e5de 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
        role="img"
        aria-label={`Demo map placeholder showing ${hotel.name} in ${hotel.neighborhood}, ${hotel.city}`}>
        
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
          <span className="rounded-full bg-forest-700 px-3 py-1.5 text-xs font-semibold text-white shadow-card">{hotel.name}</span>
          <MapPinIcon className="h-8 w-8 fill-gold-500 text-forest-800" aria-hidden="true" />
        </div>
        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs text-ink-soft">
          Map placeholder — no map provider connected
        </span>
      </div>
      <div>
        <p className="flex items-start gap-2 text-sm text-ink">
          <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
          {hotel.address}
        </p>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 underline-offset-4 hover:underline">
          
          <NavigationIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Get directions (opens in a new tab)
        </a>
        <h3 className="mt-6 text-sm font-semibold text-ink">Nearby</h3>
        <ul className="mt-3 divide-y divide-sand-200">
          {hotel.nearby.map((place) =>
          <li key={place.name} className="flex items-center justify-between gap-4 py-3 text-sm">
              <span>
                <span className="block text-ink">{place.name}</span>
                <span className="text-xs text-ink-muted">{place.type}</span>
              </span>
              <span className="shrink-0 tabular-nums text-ink-soft">{place.distance}</span>
            </li>
          )}
        </ul>
      </div>
    </div>);

}