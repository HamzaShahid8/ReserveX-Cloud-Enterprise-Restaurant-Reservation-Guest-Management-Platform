import React from "react";
import { AlertCircleIcon, BedDoubleIcon, CheckCircle2Icon, CheckIcon, CoffeeIcon, MaximizeIcon, UsersIcon, XCircleIcon } from "lucide-react";
import { mealPlanLabels } from "../../data/labels";
import type { SearchCriteria } from "../../types/booking";
import type { Room } from "../../types/hotel";
import { formatPrice } from "../../utils/format";
import { checkRoomCapacity } from "../../utils/hotels";
import { nightlyTaxesAndFees } from "../../utils/pricing";
import { Button } from "../ui/Button";

interface RoomCardProps {
  room: Room;
  criteria: SearchCriteria;
  freeCancellationHours: number;
  selected: boolean;
  onSelect: () => void;
  onBook: () => void;
}

export function RoomCard({ room, criteria, freeCancellationHours, selected, onSelect, onBook }: RoomCardProps) {
  const capacity = checkRoomCapacity(room, criteria);
  const soldOut = room.inventory === 0;
  const occupancy = `Sleeps ${room.maxAdults} adult${room.maxAdults > 1 ? "s" : ""}${
  room.maxChildren ? ` + ${room.maxChildren} child${room.maxChildren > 1 ? "ren" : ""}` : ""}`;


  return (
    <article
      aria-label={room.name}
      className={`grid overflow-hidden rounded-2xl border bg-white transition-[border-color,box-shadow] duration-200 md:grid-cols-[220px_1fr] lg:grid-cols-[200px_1fr_200px] xl:grid-cols-[220px_1fr_210px] ${
      selected ? "border-forest-700 ring-2 ring-forest-700" : "border-sand-200"}`
      }>
      
      <div className="relative aspect-[16/10] bg-sand-200 md:aspect-auto">
        <img src={room.image} alt={room.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        {selected &&
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-forest-700 px-2.5 py-1 text-xs font-medium text-white">
            <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Selected
          </span>
        }
      </div>

      <div className="p-5">
        <h3 className="font-display text-xl font-medium text-ink">{room.name}</h3>
        <p className="mt-1 text-sm text-ink-soft">{room.description}</p>
        <ul className="mt-4 grid gap-2 text-sm text-ink sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4 text-forest-600" aria-hidden="true" />
            {occupancy}
          </li>
          <li className="flex items-center gap-2">
            <BedDoubleIcon className="h-4 w-4 text-forest-600" aria-hidden="true" />
            {room.bedType}
          </li>
          <li className="flex items-center gap-2">
            <MaximizeIcon className="h-4 w-4 text-forest-600" aria-hidden="true" />
            {room.sizeSqm} m²
          </li>
          <li className="flex items-center gap-2">
            <CoffeeIcon className="h-4 w-4 text-forest-600" aria-hidden="true" />
            {mealPlanLabels[room.mealPlan]}
          </li>
        </ul>
        <p className="mt-3 text-xs text-ink-muted">{room.amenities.join(" · ")}</p>
        <p className={`mt-3 flex items-start gap-1.5 text-sm ${room.freeCancellation ? "text-forest-600" : "text-ink-soft"}`}>
          {room.freeCancellation ?
          <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> :

          <XCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          }
          {room.freeCancellation ?
          `Free cancellation until ${freeCancellationHours} hours before check-in` :
          "Non-refundable — lowest price, no changes"}
        </p>
      </div>

      <div className="flex flex-col justify-between gap-4 border-t border-sand-200 p-5 md:col-span-2 md:flex-row md:items-end lg:col-span-1 lg:flex-col lg:items-stretch lg:border-l lg:border-t-0">
        <div>
          <p
            className={`text-xs font-medium ${soldOut ? "text-danger-600" : room.inventory <= 2 ? "text-gold-600" : "text-ink-muted"}`}>
            
            {soldOut ? "Sold out" : room.inventory <= 2 ? `Only ${room.inventory} left at this price` : `${room.inventory} rooms available`}
          </p>
          <p className="mt-1 text-ink">
            <span className="text-2xl font-semibold tabular-nums">{formatPrice(room.pricePerNight)}</span>
            <span className="text-sm text-ink-muted"> / night</span>
          </p>
          <p className="text-xs text-ink-muted">+ {formatPrice(nightlyTaxesAndFees(room.pricePerNight))} taxes & fees per night</p>
        </div>
        <div className="space-y-2 md:w-56 lg:w-auto">
          {!capacity.ok &&
          <p role="status" className="flex items-start gap-1.5 rounded-xl bg-danger-50 p-2.5 text-xs font-medium text-danger-700">
              <AlertCircleIcon className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {capacity.message}
            </p>
          }
          <Button variant={selected ? "secondary" : "outline"} className="w-full" onClick={onSelect} disabled={!capacity.ok} aria-pressed={selected}>
            {selected ? "Room selected" : "Select room"}
          </Button>
          <Button className="w-full" onClick={onBook} disabled={!capacity.ok}>
            Book now
          </Button>
        </div>
      </div>
    </article>);

}