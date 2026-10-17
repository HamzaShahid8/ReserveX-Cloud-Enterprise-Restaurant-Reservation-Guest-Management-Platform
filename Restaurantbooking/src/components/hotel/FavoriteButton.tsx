import React from "react";
import { motion } from "framer-motion";
import { HeartIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useFavorites } from "../../contexts/FavoritesContext";

interface FavoriteButtonProps {
  hotelId: string;
  hotelName: string;
  variant?: "overlay" | "outline";
  className?: string;
}

export function FavoriteButton({ hotelId, hotelName, variant = "overlay", className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(hotelId);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.12 }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(hotelId, hotelName);
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${hotelName} from favorites` : `Save ${hotelName} to favorites`}
      className={twMerge(
        "grid place-items-center rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
        variant === "overlay" ?
        "h-10 w-10 bg-white/95 text-ink shadow-card hover:bg-white" :
        "h-10 w-10 border border-sand-300 bg-white text-ink hover:border-forest-700",
        className
      )}>
      
      <HeartIcon className={`h-5 w-5 ${saved ? "fill-danger-600 text-danger-600" : ""}`} aria-hidden="true" />
    </motion.button>);

}