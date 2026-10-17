import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircleIcon, MoonIcon, SearchIcon } from "lucide-react";
import { usePersistentState } from "../../hooks/usePersistentState";
import type { SearchCriteria } from "../../types/booking";
import { defaultStayDates, nightsBetween } from "../../utils/dates";
import { pluralize } from "../../utils/format";
import { criteriaToParams, defaultCriteria, validateCriteria } from "../../utils/search";
import { Button } from "../ui/Button";
import { DateRangePicker } from "./DateRangePicker";
import { DestinationInput } from "./DestinationInput";
import { GuestSelector } from "./GuestSelector";

interface SearchFormProps {
  initial?: SearchCriteria;
  variant?: "hero" | "bar";
  onSearch?: (criteria: SearchCriteria) => void;
}

export function SearchForm({ initial, variant = "hero", onSearch }: SearchFormProps) {
  const navigate = useNavigate();
  const [savedSearch, setSavedSearch] = usePersistentState<SearchCriteria | null>("aurelle.lastSearch", null);
  const [criteria, setCriteria] = useState<SearchCriteria>(() => {
    if (initial) return initial;
    const base = savedSearch ?? defaultCriteria();
    return validateCriteria(base) ? { ...base, ...defaultStayDates() } : base;
  });
  const [error, setError] = useState<string | null>(null);
  const nights = nightsBetween(criteria.checkIn, criteria.checkOut);

  const update = (patch: Partial<SearchCriteria>) => {
    setCriteria((current) => ({ ...current, ...patch }));
    setError(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateCriteria(criteria);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSavedSearch(criteria);
    if (onSearch) onSearch(criteria);else
    navigate(`/hotels?${criteriaToParams(criteria).toString()}`);
  };

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Search hotels"
      className={isHero ? "rounded-3xl bg-white p-3 shadow-lift sm:p-4" : "rounded-2xl border border-sand-200 bg-white p-3"}>
      
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-[1.15fr_1.6fr_1.1fr_auto]">
        <DestinationInput value={criteria.destination} onChange={(destination) => update({ destination })} />
        <DateRangePicker
          checkIn={criteria.checkIn}
          checkOut={criteria.checkOut}
          onChange={(dates) => update(dates)}
          hasError={!!error && /date|check/i.test(error)}
          popoverAlign="center" />
        
        <GuestSelector
          adults={criteria.adults}
          children={criteria.children}
          rooms={criteria.rooms}
          onChange={(guests) => update(guests)}
          popoverAlign="right" />
        
        <Button type="submit" size="lg" className="h-full min-h-[3.25rem] rounded-xl">
          <SearchIcon className="h-4 w-4" aria-hidden="true" />
          Search
        </Button>
      </div>
      <div className="mt-2 flex min-h-[1.5rem] flex-wrap items-center gap-x-4 gap-y-1 px-1 text-sm">
        {error ?
        <p role="alert" className="flex items-center gap-1.5 font-medium text-danger-600">
            <AlertCircleIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p> :

        <p className="flex items-center gap-1.5 text-ink-soft" aria-live="polite">
            <MoonIcon className="h-4 w-4 text-gold-600" aria-hidden="true" />
            {nights > 0 ? `${pluralize(nights, "night")} selected` : "Pick your dates to see the length of your stay"}
          </p>
        }
      </div>
    </form>);

}