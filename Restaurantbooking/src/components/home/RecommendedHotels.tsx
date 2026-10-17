import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { hotels } from "../../data/hotels";
import { HotelCard } from "../hotel/HotelCard";
import { SectionHeading } from "../ui/SectionHeading";

export function RecommendedHotels() {
  const recommended = hotels.filter((hotel) => hotel.featured).slice(0, 3);

  return (
    <section aria-labelledby="recommended-title" className="bg-sand-100 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="recommended-title"
          title="Recommended hotels"
          description="Guest favorites rated Superb or higher this season."
          action={
          <Link to="/hotels?sort=rating" className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 underline-offset-4 hover:underline">
              See all hotels
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          } />
        
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommended.map((hotel) =>
          <HotelCard key={hotel.id} hotel={hotel} />
          )}
        </div>
      </div>
    </section>);

}