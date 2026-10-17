import React, { createContext, useCallback, useContext, useMemo } from "react";
import { toast } from "sonner";
import { usePersistentState } from "../hooks/usePersistentState";

interface FavoritesContextValue {
  favoriteIds: string[];
  count: number;
  isFavorite: (hotelId: string) => boolean;
  toggleFavorite: (hotelId: string, hotelName: string) => void;
  removeFavorite: (hotelId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: {children: React.ReactNode;}) {
  const [favoriteIds, setFavoriteIds] = usePersistentState<string[]>("aurelle.favorites", []);

  const isFavorite = useCallback((hotelId: string) => favoriteIds.includes(hotelId), [favoriteIds]);

  const toggleFavorite = useCallback(
    (hotelId: string, hotelName: string) => {
      if (favoriteIds.includes(hotelId)) {
        setFavoriteIds((prev) => prev.filter((id) => id !== hotelId));
        toast(`Removed ${hotelName} from favorites`);
      } else {
        setFavoriteIds((prev) => Array.from(new Set([...prev, hotelId])));
        toast.success(`Saved ${hotelName} to favorites`);
      }
    },
    [favoriteIds, setFavoriteIds]
  );

  const removeFavorite = useCallback(
    (hotelId: string) => setFavoriteIds((prev) => prev.filter((id) => id !== hotelId)),
    [setFavoriteIds]
  );

  const value = useMemo(
    () => ({ favoriteIds, count: favoriteIds.length, isFavorite, toggleFavorite, removeFavorite }),
    [favoriteIds, isFavorite, toggleFavorite, removeFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
  return context;
}