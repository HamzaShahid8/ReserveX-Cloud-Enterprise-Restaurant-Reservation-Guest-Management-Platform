import type { Destination } from "../types/hotel";
import { images } from "./images";

export const destinations: Destination[] = [
{
  id: "santorini",
  name: "Santorini",
  country: "Greece",
  region: "Cyclades",
  tagline: "Whitewashed cliffs above the Aegean",
  description: "Volcanic cliffs, cave suites carved into the caldera, and sunsets that pull the whole island onto its terraces. Stay in Oia for the views or Fira for the evenings.",
  image: images.destSantorini,
  bestTime: "May – October",
  highlights: ["Caldera sunsets in Oia", "Black-sand beaches of Perissa", "Assyrtiko wine tastings"],
  mapPosition: { x: 54, y: 50 }
},
{
  id: "kyoto",
  name: "Kyoto",
  country: "Japan",
  region: "Kansai",
  tagline: "Temples, gardens, and quiet ryokan",
  description: "Seventeen UNESCO sites, lantern-lit lanes in Gion, and inns where dinner is served in your room. Kyoto rewards slow mornings and early starts in equal measure.",
  image: images.destKyoto,
  bestTime: "March – May, October – November",
  highlights: ["Fushimi Inari at dawn", "Arashiyama bamboo grove", "Kaiseki dining in Gion"],
  mapPosition: { x: 86, y: 32 }
},
{
  id: "marrakech",
  name: "Marrakech",
  country: "Morocco",
  region: "Marrakech-Safi",
  tagline: "Riads, souks, and Atlas views",
  description: "Behind plain medina walls, courtyards open onto tiled fountains and orange trees. Spend the day in the souks and the evening on a rooftop facing the Atlas mountains.",
  image: images.destMarrakech,
  bestTime: "October – April",
  highlights: ["Jemaa el-Fnaa at dusk", "Jardin Majorelle", "Day trips to the Atlas"],
  mapPosition: { x: 24, y: 64 }
},
{
  id: "zermatt",
  name: "Zermatt",
  country: "Switzerland",
  region: "Valais",
  tagline: "Alpine chalets beneath the Matterhorn",
  description: "A car-free village of timber chalets at the foot of the Matterhorn, with 360 km of slopes in winter and high trails in summer.",
  image: images.destZermatt,
  bestTime: "December – April, July – September",
  highlights: ["Gornergrat railway", "Ski to Cervinia, Italy", "Five-lakes hiking trail"],
  mapPosition: { x: 40, y: 28 }
},
{
  id: "bali",
  name: "Bali",
  country: "Indonesia",
  region: "Ubud & Uluwatu",
  tagline: "Jungle villas and cliffside surf",
  description: "Rice terraces and river valleys around Ubud, surf breaks and clifftop temples in Uluwatu. Split your stay between the two for the full island.",
  image: images.destBali,
  bestTime: "April – October",
  highlights: ["Tegallalang rice terraces", "Uluwatu temple at sunset", "Morning yoga in Ubud"],
  mapPosition: { x: 80, y: 72 }
},
{
  id: "lisbon",
  name: "Lisbon",
  country: "Portugal",
  region: "Lisboa",
  tagline: "Tiled façades and rooftop sunsets",
  description: "Seven hills of tiled façades, yellow trams, and miradouros that turn gold at sunset. Alfama for character, the riverside for space.",
  image: images.destLisbon,
  bestTime: "March – June, September – October",
  highlights: ["Tram 28 through Alfama", "Pastéis de nata in Belém", "Fado in the old quarter"],
  mapPosition: { x: 18, y: 38 }
}];