import React, { useId, useMemo, useRef, useState } from "react";
import { BuildingIcon, MapPinIcon, SearchIcon } from "lucide-react";
import { destinations } from "../../data/destinations";
import { hotels } from "../../data/hotels";
import { useDismiss } from "../../hooks/useDismiss";

interface DestinationInputProps {
  value: string;
  onChange: (value: string) => void;
}

interface Suggestion {
  id: string;
  label: string;
  detail: string;
  value: string;
  kind: "destination" | "hotel";
}

export function DestinationInput({ value, onChange }: DestinationInputProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const inputId = useId();
  useDismiss(containerRef, () => setOpen(false), open);

  const suggestions = useMemo<Suggestion[]>(() => {
    const query = value.trim().toLowerCase();
    const destinationMatches = destinations.
    filter((d) => !query || d.name.toLowerCase().includes(query) || d.country.toLowerCase().includes(query)).
    map((d) => ({ id: `d-${d.id}`, label: d.name, detail: `${d.region}, ${d.country}`, value: d.name, kind: "destination" as const }));
    const hotelMatches = query ?
    hotels.
    filter((h) => h.name.toLowerCase().includes(query)).
    slice(0, 3).
    map((h) => ({ id: `h-${h.id}`, label: h.name, detail: `${h.neighborhood}, ${h.city}`, value: h.name, kind: "hotel" as const })) :
    [];
    return [...destinationMatches, ...hotelMatches].slice(0, 7);
  }, [value]);

  const select = (suggestion: Suggestion) => {
    onChange(suggestion.value);
    setOpen(false);
    setActiveIndex(-1);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(suggestions.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter" && open && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      select(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex h-full flex-col rounded-xl border border-sand-300 bg-white px-3.5 py-2 transition-[border-color,box-shadow] duration-150 focus-within:border-forest-700 focus-within:ring-4 focus-within:ring-forest-700/10 hover:border-forest-500">
        <label htmlFor={inputId} className="text-xs font-medium text-ink-muted">
          Destination
        </label>
        <div className="flex items-center gap-1.5">
          <MapPinIcon className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
          <input
            id={inputId}
            type="text"
            role="combobox"
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listId}
            aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
            placeholder="Where are you going?"
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
              setOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="w-full min-w-0 bg-transparent text-sm font-medium text-ink placeholder:font-normal placeholder:text-ink-muted focus:outline-none" />
          
        </div>
      </div>
      {open &&
      <ul
        id={listId}
        role="listbox"
        aria-label="Destination suggestions"
        className="absolute left-0 right-0 top-full z-40 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-sand-200 bg-white p-1.5 shadow-lift sm:min-w-[320px]">
        
          {suggestions.length === 0 ?
        <li className="flex items-start gap-3 px-3 py-3 text-sm text-ink-soft">
              <SearchIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              No exact matches. We'll search every stay for "{value.trim()}".
            </li> :

        suggestions.map((suggestion, index) => {
          const Icon = suggestion.kind === "hotel" ? BuildingIcon : MapPinIcon;
          return (
            <li
              key={suggestion.id}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => select(suggestion)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 ${index === activeIndex ? "bg-sand-100" : ""}`}>
              
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-forest-50 text-forest-700">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">{suggestion.label}</span>
                    <span className="block truncate text-xs text-ink-muted">{suggestion.detail}</span>
                  </span>
                </li>);

        })
        }
        </ul>
      }
    </div>);

}