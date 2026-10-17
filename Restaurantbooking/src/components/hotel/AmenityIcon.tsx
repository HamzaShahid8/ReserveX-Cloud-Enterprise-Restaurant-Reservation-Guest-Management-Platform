import React from "react";
import { AirVentIcon, BabyIcon, BathIcon, Building2Icon, CarIcon, ConciergeBellIcon, DumbbellIcon, Flower2Icon, MountainSnowIcon, PawPrintIcon, PlaneIcon, UmbrellaIcon, UtensilsCrossedIcon, WavesIcon, WifiIcon, WineIcon, BoxIcon } from "lucide-react";
import { AmenityId } from "../../types/hotel";
const icons: Record<AmenityId, BoxIcon> = {
  wifi: WifiIcon,
  pool: WavesIcon,
  spa: Flower2Icon,
  gym: DumbbellIcon,
  restaurant: UtensilsCrossedIcon,
  bar: WineIcon,
  parking: CarIcon,
  "airport-shuttle": PlaneIcon,
  "beach-access": UmbrellaIcon,
  "pet-friendly": PawPrintIcon,
  "room-service": ConciergeBellIcon,
  "air-conditioning": AirVentIcon,
  "kids-club": BabyIcon,
  "ski-storage": MountainSnowIcon,
  onsen: BathIcon,
  rooftop: Building2Icon
};
export function AmenityIcon({
  id,
  className = "h-4 w-4"



}: {id: AmenityId;className?: string;}) {
  const Icon = icons[id];
  return <Icon className={className} aria-hidden="true" />;
}