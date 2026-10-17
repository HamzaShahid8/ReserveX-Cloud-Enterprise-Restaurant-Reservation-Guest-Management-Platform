import React, { useState } from "react";
import { StarIcon } from "lucide-react";
import { amenities } from "../../data/amenities";
import { distanceOptions, guestRatingOptions, mealPlanLabels, propertyTypeLabels } from "../../data/labels";
import type { AmenityId, MealPlan, PropertyType } from "../../types/hotel";
import { type HotelFilterState, PRICE_BOUNDS, countActiveFilters } from "../../utils/filters";
import { formatPrice } from "../../utils/format";
import { RangeSlider } from "../ui/RangeSlider";

interface FilterPanelProps {
  filters: HotelFilterState;
  onChange: (filters: HotelFilterState) => void;
  onClear: () => void;
  idPrefix: string;
  showTitle?: boolean;
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function FilterPanel({ filters, onChange, onClear, idPrefix, showTitle = true }: FilterPanelProps) {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const activeCount = countActiveFilters(filters);
  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, 8);
  const set = (patch: Partial<HotelFilterState>) => onChange({ ...filters, ...patch });

  const checkboxRow = (id: string, label: string, checked: boolean, onToggle: () => void) =>
  <label key={id} htmlFor={id} className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-ink">
      <input id={id} type="checkbox" checked={checked} onChange={onToggle} className="h-4 w-4 rounded border-sand-300 accent-forest-700" />
      {label}
    </label>;


  const section = (title: string, children: React.ReactNode) =>
  <fieldset className="border-t border-sand-200 py-5">
      <legend className="sr-only">{title}</legend>
      <h3 className="mb-3 text-sm font-semibold text-ink" aria-hidden="true">
        {title}
      </h3>
      {children}
    </fieldset>;


  return (
    <div>
      <div className={`flex items-center pb-4 ${showTitle ? "justify-between" : "justify-end"}`}>
        {showTitle && <h2 className="font-display text-lg font-medium text-ink">Filters</h2>}
        <button
          type="button"
          onClick={onClear}
          disabled={activeCount === 0}
          className="text-sm font-medium text-forest-700 underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-ink-muted disabled:no-underline">
          
          Clear all{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
      </div>

      {section(
        "Price per night",
        <RangeSlider
          label="price per night"
          min={PRICE_BOUNDS.min}
          max={PRICE_BOUNDS.max}
          step={PRICE_BOUNDS.step}
          value={[filters.priceMin, filters.priceMax]}
          onChange={([priceMin, priceMax]) => set({ priceMin, priceMax })}
          formatValue={formatPrice} />

      )}

      {section(
        "Star rating",
        <div className="flex gap-2">
          {[3, 4, 5].map((star) => {
            const active = filters.stars.includes(star);
            return (
              <button
                key={star}
                type="button"
                aria-pressed={active}
                onClick={() => set({ stars: toggle(filters.stars, star) })}
                className={`flex h-10 flex-1 items-center justify-center gap-1 rounded-full border text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${
                active ? "border-forest-700 bg-forest-700 text-white" : "border-sand-300 bg-white text-ink hover:border-forest-700"}`
                }>
                
                {star}
                <StarIcon className={`h-3.5 w-3.5 ${active ? "fill-gold-400 text-gold-400" : "fill-gold-500 text-gold-500"}`} aria-hidden="true" />
              </button>);

          })}
        </div>
      )}

      {section(
        "Guest rating",
        <div className="space-y-0.5">
          {guestRatingOptions.map((option) =>
          <label key={option.value} className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-ink">
              <input
              type="radio"
              name={`${idPrefix}-rating`}
              checked={filters.minRating === option.value}
              onChange={() => set({ minRating: option.value })}
              className="h-4 w-4 accent-forest-700" />
            
              {option.label}
            </label>
          )}
        </div>
      )}

      {section(
        "Property type",
        <div>
          {(Object.keys(propertyTypeLabels) as PropertyType[]).map((type) =>
          checkboxRow(`${idPrefix}-type-${type}`, propertyTypeLabels[type], filters.propertyTypes.includes(type), () =>
          set({ propertyTypes: toggle(filters.propertyTypes, type) })
          )
          )}
        </div>
      )}

      {section(
        "Amenities",
        <div>
          {visibleAmenities.map((amenity) =>
          checkboxRow(`${idPrefix}-amenity-${amenity.id}`, amenity.label, filters.amenities.includes(amenity.id), () =>
          set({ amenities: toggle<AmenityId>(filters.amenities, amenity.id) })
          )
          )}
          <button
            type="button"
            onClick={() => setShowAllAmenities((value) => !value)}
            aria-expanded={showAllAmenities}
            className="mt-2 text-sm font-medium text-forest-700 underline-offset-4 hover:underline">
            
            {showAllAmenities ? "Show fewer" : `Show all ${amenities.length}`}
          </button>
        </div>
      )}

      {section(
        "Meal plan",
        <div>
          {(Object.keys(mealPlanLabels) as MealPlan[]).map((plan) =>
          checkboxRow(`${idPrefix}-meal-${plan}`, mealPlanLabels[plan], filters.mealPlans.includes(plan), () =>
          set({ mealPlans: toggle(filters.mealPlans, plan) })
          )
          )}
        </div>
      )}

      {section(
        "Booking options",
        <div>
          {checkboxRow(`${idPrefix}-free-cancel`, "Free cancellation", filters.freeCancellation, () =>
          set({ freeCancellation: !filters.freeCancellation })
          )}
          {checkboxRow(`${idPrefix}-available`, "Available for my dates only", filters.availableOnly, () =>
          set({ availableOnly: !filters.availableOnly })
          )}
        </div>
      )}

      {section(
        "Distance from center",
        <div className="space-y-0.5">
          {distanceOptions.map((option) =>
          <label key={option.value} className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-ink">
              <input
              type="radio"
              name={`${idPrefix}-distance`}
              checked={filters.maxDistance === option.value}
              onChange={() => set({ maxDistance: option.value })}
              className="h-4 w-4 accent-forest-700" />
            
              {option.label}
            </label>
          )}
        </div>
      )}
    </div>);

}