import React from "react";
import { Link } from "react-router-dom";
import { HeartIcon } from "lucide-react";
import { HotelCard } from "../components/hotel/HotelCard";
import { buttonClasses } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { useFavorites } from "../contexts/FavoritesContext";
import { hotels } from "../data/hotels";
import { pluralize } from "../utils/format";

export function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  const favorites = favoriteIds.
  map((id) => hotels.find((hotel) => hotel.id === id)).
  filter((hotel): hotel is (typeof hotels)[number] => !!hotel);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-medium tracking-tight text-ink">Favorites</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {favorites.length > 0 ? `${pluralize(favorites.length, "saved hotel")} · saved in this browser` : "Hotels you save will appear here."}
      </p>
      {favorites.length === 0 ?
      <EmptyState
        icon={HeartIcon}
        title="No favorites yet"
        description="Tap the heart on any hotel to save it here for later. Your list stays in this browser."
        action={
        <Link to="/hotels" className={buttonClasses("primary")}>
              Discover hotels
            </Link>
        } /> :


      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((hotel) =>
        <HotelCard key={hotel.id} hotel={hotel} />
        )}
        </div>
      }
    </div>);

}