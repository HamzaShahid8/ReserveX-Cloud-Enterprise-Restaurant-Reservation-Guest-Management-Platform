import React from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarHeartIcon, MapPinnedIcon, SparklesIcon } from "lucide-react";
import { HotelCard } from "../components/hotel/HotelCard";
import { buttonClasses } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { getDestination, getHotelsByDestination } from "../utils/hotels";

export function DestinationDetailsPage() {
  const { destinationId } = useParams();
  const destination = getDestination(destinationId);

  if (!destination) {
    return (
      <EmptyState
        icon={MapPinnedIcon}
        tone="error"
        title="Destination not found"
        description="We don't have a guide for this destination. Browse the places we cover instead."
        action={
        <Link to="/destinations" className={buttonClasses("primary")}>
            All destinations
          </Link>
        } />);


  }

  const list = getHotelsByDestination(destination.id);
  const searchQuery = `destination=${encodeURIComponent(destination.name)}`;

  return (
    <div>
      <section className="relative isolate">
        <img src={destination.image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-forest-900/55" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 md:pt-36 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-white/80">
            <Link to="/destinations" className="hover:text-white">
              Destinations
            </Link>{" "}
            / <span aria-current="page">{destination.name}</span>
          </nav>
          <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-white md:text-6xl">{destination.name}</h1>
          <p className="mt-2 text-lg text-white/90">
            {destination.region}, {destination.country} · {destination.tagline}
          </p>
          <Link to={`/hotels?${searchQuery}`} className={buttonClasses("light", "lg", "mt-8")}>
            Search stays in {destination.name}
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <p className="font-display text-2xl leading-snug text-ink">{destination.description}</p>
          <dl className="space-y-6 border-t border-sand-200 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div className="flex gap-3">
              <CalendarHeartIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
              <div>
                <dt className="text-sm font-semibold text-ink">Best time to visit</dt>
                <dd className="text-sm text-ink-soft">{destination.bestTime}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <SparklesIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
              <div>
                <dt className="text-sm font-semibold text-ink">Don't miss</dt>
                <dd>
                  <ul className="mt-1 space-y-1 text-sm text-ink-soft">
                    {destination.highlights.map((highlight) =>
                    <li key={highlight}>{highlight}</li>
                    )}
                  </ul>
                </dd>
              </div>
            </div>
          </dl>
        </div>

        <section aria-labelledby="destination-hotels" className="mt-16">
          <h2 id="destination-hotels" className="font-display text-3xl font-medium tracking-tight text-ink">
            Hotels in {destination.name}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((hotel) =>
            <HotelCard key={hotel.id} hotel={hotel} />
            )}
          </div>
        </section>
      </div>
    </div>);

}