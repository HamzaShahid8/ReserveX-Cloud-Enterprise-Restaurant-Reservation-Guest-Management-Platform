import React from "react";
import { AlertCircleIcon, InfoIcon } from "lucide-react";
import type { SearchCriteria } from "../../types/booking";
import type { Room } from "../../types/hotel";
import { nightsBetween } from "../../utils/dates";
import { formatPrice } from "../../utils/format";
import { checkRoomCapacity } from "../../utils/hotels";
import { calculatePrice } from "../../utils/pricing";
import { validateCriteria } from "../../utils/search";
import { PriceSummary } from "../booking/PriceSummary";
import { DateRangePicker } from "../search/DateRangePicker";
import { GuestSelector } from "../search/GuestSelector";
import { Button } from "../ui/Button";

interface BookingSidebarProps {
  lowestPrice: number;
  criteria: SearchCriteria;
  onCriteriaChange: (criteria: SearchCriteria) => void;
  selectedRoom: Room | null;
  onReserve: () => void;
  onChooseRoom: () => void;
}

export function BookingSidebar({ lowestPrice, criteria, onCriteriaChange, selectedRoom, onReserve, onChooseRoom }: BookingSidebarProps) {
  const nights = nightsBetween(criteria.checkIn, criteria.checkOut);
  const criteriaError = validateCriteria(criteria);
  const capacity = selectedRoom ? checkRoomCapacity(selectedRoom, criteria) : null;
  const price =
  selectedRoom && nights > 0 ? calculatePrice({ nightlyRate: selectedRoom.pricePerNight, nights, rooms: criteria.rooms }) : null;

  return (
    <div className="rounded-3xl border border-sand-200 bg-white p-6 shadow-card">
      <p className="text-ink">
        {selectedRoom ?
        <>
            <span className="text-2xl font-semibold tabular-nums">{formatPrice(selectedRoom.pricePerNight)}</span>
            <span className="text-sm text-ink-muted"> / night · {selectedRoom.name}</span>
          </> :

        <>
            <span className="text-sm text-ink-muted">from </span>
            <span className="text-2xl font-semibold tabular-nums">{formatPrice(lowestPrice)}</span>
            <span className="text-sm text-ink-muted"> / night</span>
          </>
        }
      </p>

      <div className="mt-5 space-y-2">
        <DateRangePicker
          checkIn={criteria.checkIn}
          checkOut={criteria.checkOut}
          onChange={(dates) => onCriteriaChange({ ...criteria, ...dates })}
          hasError={!!criteriaError}
          popoverAlign="right" />
        
        <GuestSelector
          adults={criteria.adults}
          children={criteria.children}
          rooms={criteria.rooms}
          onChange={(guests) => onCriteriaChange({ ...criteria, ...guests })}
          popoverAlign="right" />
        
      </div>

      {criteriaError &&
      <p role="alert" className="mt-3 flex items-start gap-1.5 text-xs font-medium text-danger-600">
          <AlertCircleIcon className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {criteriaError}
        </p>
      }
      {capacity && !capacity.ok &&
      <p role="alert" className="mt-3 flex items-start gap-1.5 text-xs font-medium text-danger-600">
          <AlertCircleIcon className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {capacity.message}
        </p>
      }

      {price && !criteriaError ?
      <div className="mt-5 border-t border-sand-200 pt-5">
          <PriceSummary price={price} />
        </div> :

      <p className="mt-5 flex items-start gap-2 rounded-xl bg-sand-100 p-3 text-sm text-ink-soft">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {selectedRoom ? "Choose valid dates to see your total." : "Select a room below to see the full price for your stay."}
        </p>
      }

      <div className="mt-5">
        {selectedRoom ?
        <Button size="lg" className="w-full" onClick={onReserve} disabled={!!criteriaError || !capacity?.ok}>
            Reserve {selectedRoom.name}
          </Button> :

        <Button size="lg" className="w-full" onClick={onChooseRoom}>
            Choose a room
          </Button>
        }
        <p className="mt-3 text-center text-xs text-ink-muted">You won't be charged — this is a demo booking.</p>
      </div>
    </div>);

}