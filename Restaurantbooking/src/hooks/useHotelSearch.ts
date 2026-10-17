import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { hotels } from "../data/hotels";
import type { SearchCriteria } from "../types/booking";
import {
  type HotelFilterState,
  type SortOption,
  type ViewMode,
  applyFilters,
  countActiveFilters,
  defaultFilters,
  filtersFromParams,
  sortFromParams,
  sortHotels,
  viewFromParams,
  writeFiltersToParams } from
"../utils/filters";
import { criteriaFromParams, criteriaToParams, writeCriteriaToParams } from "../utils/search";
import { useSimulatedLoading } from "./useSimulatedLoading";

export const RESULTS_PAGE_SIZE = 6;

export function useHotelSearch() {
  const [params, setParams] = useSearchParams();

  const criteria = useMemo(() => criteriaFromParams(params), [params]);
  const filters = useMemo(() => filtersFromParams(params), [params]);
  const sort = sortFromParams(params);
  const view = viewFromParams(params);

  const results = useMemo(
    () => sortHotels(applyFilters(hotels, filters, criteria.destination), sort),
    [filters, criteria.destination, sort]
  );

  const totalPages = Math.max(1, Math.ceil(results.length / RESULTS_PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(params.get("page")) || 1), totalPages);
  const pageResults = results.slice((page - 1) * RESULTS_PAGE_SIZE, page * RESULTS_PAGE_SIZE);

  const loadingKey = useMemo(() => {
    const copy = new URLSearchParams(params);
    copy.delete("view");
    return copy.toString();
  }, [params]);
  const loading = useSimulatedLoading(loadingKey);

  const mutate = useCallback(
    (update: (next: URLSearchParams) => void, resetPage = true) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        update(next);
        if (resetPage) next.delete("page");
        return next;
      },
      { replace: true }
    ),
    [setParams]
  );

  return {
    criteria,
    filters,
    sort,
    view,
    page,
    totalPages,
    results,
    pageResults,
    loading,
    activeFilterCount: countActiveFilters(filters),
    searchQuery: criteriaToParams(criteria).toString(),
    setFilters: (next: HotelFilterState) => mutate((p) => writeFiltersToParams(p, next)),
    clearFilters: () => mutate((p) => writeFiltersToParams(p, defaultFilters)),
    setSort: (next: SortOption) => mutate((p) => next === "recommended" ? p.delete("sort") : p.set("sort", next)),
    setView: (next: ViewMode) => mutate((p) => next === "grid" ? p.delete("view") : p.set("view", next), false),
    setPage: (next: number) => {
      mutate((p) => next <= 1 ? p.delete("page") : p.set("page", String(next)), false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    setCriteria: (next: SearchCriteria) => mutate((p) => writeCriteriaToParams(p, next))
  };
}