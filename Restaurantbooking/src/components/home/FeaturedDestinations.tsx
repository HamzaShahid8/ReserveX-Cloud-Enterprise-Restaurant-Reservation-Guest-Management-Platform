import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { destinations } from "../../data/destinations";
import { formatPrice, pluralize } from "../../utils/format";
import { getHotelsByDestination, getLowestPrice } from "../../utils/hotels";
import { SectionHeading } from "../ui/SectionHeading";

export function FeaturedDestinations() {
  const [lead, ...rest] = destinations.slice(0, 5);

  const meta = (destinationId: string) => {
    const list = getHotelsByDestination(destinationId);
    return `${pluralize(list.length, "stay")} · from ${formatPrice(Math.min(...list.map(getLowestPrice)))}`;
  };

  return (
    <section aria-labelledby="destinations-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        id="destinations-title"
        title="Featured destinations"
        description="Six places we know well, from caldera cliffs to alpine villages."
        action={
        <Link to="/destinations" className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 underline-offset-4 hover:underline">
            All destinations
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        } />
      
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link to={`/destinations/${lead.id}`} className="group md:col-span-2 lg:row-span-2">
          <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-sand-200 lg:aspect-auto lg:h-[calc(100%-4.5rem)]">
            <img src={lead.image} alt="" className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]" />
          </div>
          <div className="mt-4">
            <h3 className="font-display text-2xl font-medium text-ink group-hover:text-forest-700">
              {lead.name}, {lead.country}
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              {lead.tagline} · {meta(lead.id)}
            </p>
          </div>
        </Link>
        {rest.map((destination) =>
        <Link key={destination.id} to={`/destinations/${destination.id}`} className="group">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-sand-200">
              <img
              src={destination.image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              loading="lazy" />
            
            </div>
            <h3 className="mt-3 font-display text-lg font-medium text-ink group-hover:text-forest-700">{destination.name}</h3>
            <p className="text-sm text-ink-soft">{meta(destination.id)}</p>
          </Link>
        )}
      </div>
    </section>);

}