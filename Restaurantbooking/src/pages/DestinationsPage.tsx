import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPinnedIcon, SearchIcon } from "lucide-react";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { destinations } from "../data/destinations";
import { formatPrice, pluralize } from "../utils/format";
import { getHotelsByDestination, getLowestPrice } from "../utils/hotels";

export function DestinationsPage() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const results = destinations.filter((destination) =>
  [destination.name, destination.country, destination.region, destination.tagline].some((value) => value.toLowerCase().includes(normalized))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">Destinations</h1>
          <p className="mt-3 text-base leading-relaxed text-ink-soft">
            Six places, chosen for the hotels as much as the scenery. Each has a short list of stays we know first-hand.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <label htmlFor="destination-search" className="sr-only">
            Search destinations
          </label>
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input
            id="destination-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by city, country or vibe"
            className="h-11 w-full rounded-full border border-sand-300 bg-white pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-forest-700 focus:outline-none focus:ring-4 focus:ring-forest-700/10" />
          
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {pluralize(results.length, "destination")} found
      </p>

      {results.length === 0 ?
      <EmptyState
        icon={MapPinnedIcon}
        title="No destinations match"
        description={`We don't cover "${query.trim()}" yet. Try a country like Japan or a word like "alpine".`}
        action={
        <Button variant="outline" onClick={() => setQuery("")}>
              Clear search
            </Button>
        } /> :


      <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((destination) => {
          const list = getHotelsByDestination(destination.id);
          return (
            <li key={destination.id}>
                <Link to={`/destinations/${destination.id}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-sand-200">
                    <img
                    src={destination.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                    loading="lazy" />
                  
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl font-medium text-ink group-hover:text-forest-700">{destination.name}</h2>
                      <p className="text-sm text-ink-soft">
                        {destination.region}, {destination.country}
                      </p>
                    </div>
                    <p className="shrink-0 text-right text-sm text-ink-soft">
                      {pluralize(list.length, "stay")}
                      <br />
                      from <span className="font-semibold text-ink">{formatPrice(Math.min(...list.map(getLowestPrice)))}</span>
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-ink-soft">{destination.tagline}</p>
                </Link>
              </li>);

        })}
        </ul>
      }
    </div>);

}