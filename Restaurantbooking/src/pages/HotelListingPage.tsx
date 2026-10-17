import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGridIcon, ListIcon, MapIcon, SearchXIcon, SlidersHorizontalIcon } from "lucide-react";
import { FilterPanel } from "../components/hotel/FilterPanel";
import { HotelCard } from "../components/hotel/HotelCard";
import { HotelCardSkeleton } from "../components/hotel/HotelCardSkeleton";
import { MapView } from "../components/hotel/MapView";
import { SearchForm } from "../components/search/SearchForm";
import { Button, buttonClasses } from "../components/ui/Button";
import { Dropdown } from "../components/ui/Dropdown";
import { EmptyState } from "../components/ui/EmptyState";
import { Modal } from "../components/ui/Modal";
import { Pagination } from "../components/ui/Pagination";
import { Skeleton } from "../components/ui/Skeleton";
import { sortOptions } from "../data/labels";
import { RESULTS_PAGE_SIZE, useHotelSearch } from "../hooks/useHotelSearch";
import { formatDateRange } from "../utils/dates";
import type { ViewMode } from "../utils/filters";
import { pluralize } from "../utils/format";
import { guestSummary } from "../utils/search";

const viewOptions: {value: ViewMode;label: string;icon: typeof LayoutGridIcon;}[] = [
{ value: "grid", label: "Grid view", icon: LayoutGridIcon },
{ value: "list", label: "List view", icon: ListIcon },
{ value: "map", label: "Map view", icon: MapIcon }];


export function HotelListingPage() {
  const search = useHotelSearch();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { criteria, results, pageResults, view, loading } = search;
  const title = criteria.destination ? `Stays in ${criteria.destination}` : "All stays";
  const firstShown = (search.page - 1) * RESULTS_PAGE_SIZE + 1;

  const renderResults = () => {
    if (loading) {
      if (view === "map") return <Skeleton className="aspect-[16/9] w-full rounded-2xl" />;
      return (
        <div className={`grid gap-6 ${view === "list" ? "" : "sm:grid-cols-2 xl:grid-cols-3"}`} aria-hidden="true">
          {Array.from({ length: view === "list" ? 3 : 6 }, (_, index) =>
          <HotelCardSkeleton key={index} layout={view === "list" ? "list" : "grid"} />
          )}
        </div>);

    }
    if (results.length === 0) {
      return (
        <EmptyState
          icon={SearchXIcon}
          title="No stays match your search"
          description={
          search.activeFilterCount > 0 ?
          "Try removing a filter or widening your price range — your filters may be too narrow." :
          `We don't have hotels matching "${criteria.destination}" yet. Try one of our six destinations.`
          }
          action={
          <>
              {search.activeFilterCount > 0 && <Button onClick={search.clearFilters}>Clear all filters</Button>}
              {criteria.destination &&
            <Link to="/hotels" className={buttonClasses("outline")}>
                  Show all destinations
                </Link>
            }
            </>
          } />);


    }
    if (view === "map") return <MapView hotels={results} searchQuery={search.searchQuery} />;
    return (
      <>
        <div className={`grid gap-6 ${view === "list" ? "" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
          {pageResults.map((hotel) =>
          <HotelCard key={hotel.id} hotel={hotel} layout={view === "list" ? "list" : "grid"} searchQuery={search.searchQuery} />
          )}
        </div>
        <div className="mt-10 flex flex-col items-center gap-3">
          <Pagination page={search.page} totalPages={search.totalPages} onChange={search.setPage} />
          <p className="text-sm text-ink-muted">
            Showing {firstShown}–{firstShown + pageResults.length - 1} of {results.length}
          </p>
        </div>
      </>);

  };

  return (
    <div>
      <div className="relative z-20 border-b border-sand-200 bg-sand-100">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <SearchForm key={search.searchQuery} variant="bar" initial={criteria} onSearch={search.setCriteria} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">{title}</h1>
            <p className="mt-2 text-sm text-ink-soft" aria-live="polite">
              {loading ? "Searching stays…" : `${pluralize(results.length, "property", "properties")} found`} ·{" "}
              {formatDateRange(criteria.checkIn, criteria.checkOut)} · {guestSummary(criteria)}
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="h-10 lg:hidden" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontalIcon className="h-4 w-4" aria-hidden="true" />
              Filters{search.activeFilterCount ? ` (${search.activeFilterCount})` : ""}
            </Button>
            <Dropdown label="Sort" options={sortOptions} value={search.sort} onChange={search.setSort} />
            <div className="flex rounded-full border border-sand-300 bg-white p-1" role="group" aria-label="Display mode">
              {viewOptions.map(({ value, label, icon: Icon }) =>
              <button
                key={value}
                type="button"
                onClick={() => search.setView(value)}
                aria-pressed={view === value}
                aria-label={label}
                className={`grid h-8 w-9 place-items-center rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${
                view === value ? "bg-forest-700 text-white" : "text-ink-soft hover:text-ink"}`
                }>
                
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[272px_1fr]">
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6 pr-3">
              <FilterPanel idPrefix="desktop" filters={search.filters} onChange={search.setFilters} onClear={search.clearFilters} />
            </div>
          </aside>
          <section aria-label="Search results" aria-busy={loading} className="min-w-0">
            {renderResults()}
          </section>
        </div>
      </div>

      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        placement="right"
        footer={
        <Button className="w-full" size="lg" onClick={() => setFiltersOpen(false)}>
            Show {pluralize(results.length, "stay")}
          </Button>
        }>
        
        <FilterPanel
          idPrefix="mobile"
          showTitle={false}
          filters={search.filters}
          onChange={search.setFilters}
          onClear={search.clearFilters} />
        
      </Modal>
    </div>);

}