import type { RoomType } from "../types/hotel";
import { images } from "./images";

export const roomTypes: RoomType[] = [
{
  id: "standard",
  name: "Standard Room",
  description: "A calm, well-proportioned room with everything you need for a comfortable stay.",
  image: images.roomStandard,
  bedType: "1 queen bed",
  sizeSqm: 24,
  maxAdults: 2,
  maxChildren: 0,
  maxOccupancy: 2,
  amenities: ["Free Wi-Fi", "Rain shower", "Work desk", "Coffee maker"]
},
{
  id: "deluxe",
  name: "Deluxe Room",
  description: "More space, a lounge chair by the window, and upgraded bath amenities.",
  image: images.roomDeluxe,
  bedType: "1 king bed",
  sizeSqm: 34,
  maxAdults: 2,
  maxChildren: 1,
  maxOccupancy: 3,
  amenities: ["Free Wi-Fi", "View", "Minibar", "Bathtub", "Nespresso machine"]
},
{
  id: "executive",
  name: "Executive Suite",
  description: "A separate living room and bedroom, with lounge access and evening turndown.",
  image: images.roomSuite,
  bedType: "1 king bed + sofa bed",
  sizeSqm: 58,
  maxAdults: 3,
  maxChildren: 1,
  maxOccupancy: 4,
  amenities: ["Lounge access", "Separate living room", "Soaking tub", "Minibar", "Butler on request"]
},
{
  id: "family",
  name: "Family Room",
  description: "Room for everyone: a king bed plus two singles, with space for luggage and play.",
  image: images.roomFamily,
  bedType: "1 king bed + 2 single beds",
  sizeSqm: 46,
  maxAdults: 2,
  maxChildren: 3,
  maxOccupancy: 5,
  amenities: ["Free Wi-Fi", "Kids' amenities", "Mini fridge", "Two bathrooms"]
},
{
  id: "presidential",
  name: "Presidential Suite",
  description: "The property's finest suite, with a private terrace, dining room, and dedicated butler.",
  image: images.roomPresidential,
  bedType: "1 super king bed + 1 twin room",
  sizeSqm: 140,
  maxAdults: 4,
  maxChildren: 2,
  maxOccupancy: 6,
  amenities: ["Private terrace", "Dining room", "Dedicated butler", "Airport transfer", "Champagne on arrival"]
}];