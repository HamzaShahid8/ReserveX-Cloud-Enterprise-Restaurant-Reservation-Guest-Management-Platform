import React from "react";
import { roomTypes } from "../../data/roomTypes";
import { SectionHeading } from "../ui/SectionHeading";

export function RoomCategories() {
  return (
    <section aria-labelledby="rooms-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        id="rooms-title"
        title="Popular room categories"
        description="Every hotel offers some of these five room types, so you can compare like with like." />
      
      <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
        {roomTypes.map((room) =>
        <li key={room.id} className="w-64 shrink-0 snap-start lg:w-auto">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-sand-200">
              <img src={room.image} alt={room.name} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <h3 className="mt-3 font-display text-lg font-medium text-ink">{room.name}</h3>
            <p className="text-sm text-ink-soft">
              {room.sizeSqm} m² · sleeps {room.maxOccupancy}
            </p>
          </li>
        )}
      </ul>
    </section>);

}