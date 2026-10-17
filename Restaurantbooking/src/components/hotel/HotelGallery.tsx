import React from "react";
import { ImagesIcon } from "lucide-react";

interface HotelGalleryProps {
  images: string[];
  hotelName: string;
  onOpen: (index: number) => void;
}

export function HotelGallery({ images, hotelName, onOpen }: HotelGalleryProps) {
  const tiles = images.slice(0, 5);

  return (
    <div className="relative grid h-[280px] grid-cols-1 gap-2 overflow-hidden rounded-3xl sm:h-[380px] md:h-[460px] md:grid-cols-4 md:grid-rows-2">
      {tiles.map((image, index) =>
      <button
        key={`${image}-${index}`}
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`Open photo ${index + 1} of ${images.length}`}
        className={`group relative overflow-hidden bg-sand-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-gold-500 ${
        index === 0 ? "md:col-span-2 md:row-span-2" : "hidden md:block"}`
        }>
        
          <img
          src={image}
          alt={index === 0 ? `${hotelName} main photo` : ""}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]" />
        
        </button>
      )}
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink shadow-card transition-colors hover:bg-sand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
        
        <ImagesIcon className="h-4 w-4" aria-hidden="true" />
        Show all {images.length} photos
      </button>
    </div>);

}