import type { Offer } from "../types/offer";
import { images } from "./images";

export const offers: Offer[] = [
{
  id: "welcome",
  title: "First Stay Welcome",
  description: "New to Aurelle? Take 10% off the room subtotal of your first booking at any hotel.",
  discountLabel: "10% off",
  image: images.concierge,
  validFrom: "2026-01-01",
  validUntil: "2027-12-31",
  conditions: ["One use per booking", "Valid at all hotels", "Applies to the room subtotal before taxes"],
  promoCode: "WELCOME10",
  destinationId: null
},
{
  id: "early",
  title: "Book Early, Save 15%",
  description: "Plan ahead and save on stays across every destination when your room subtotal is $400 or more.",
  discountLabel: "15% off",
  image: images.pool,
  validFrom: "2026-09-01",
  validUntil: "2027-03-31",
  conditions: ["Minimum room subtotal of $400", "Valid at all hotels", "Cannot be combined with other codes"],
  promoCode: "EARLY15",
  destinationId: null
},
{
  id: "alps",
  title: "Winter in the Alps",
  description: "Save $100 on chalet stays in Zermatt this ski season — boot warmers and fondue included.",
  discountLabel: "$100 off",
  image: images.extZermatt,
  validFrom: "2026-10-01",
  validUntil: "2027-04-30",
  conditions: ["Minimum room subtotal of $800", "Best used at Zermatt hotels", "One use per booking"],
  promoCode: "ALPS100",
  destinationId: "zermatt"
},
{
  id: "bali",
  title: "Long Stay in Bali",
  description: "Slow down in Ubud or Uluwatu and take 20% off longer stays with a room subtotal of $1,000+.",
  discountLabel: "20% off",
  image: images.extBali,
  validFrom: "2026-06-01",
  validUntil: "2027-06-30",
  conditions: ["Minimum room subtotal of $1,000", "Best used at Bali hotels", "Cannot be combined with other codes"],
  promoCode: "BALI20",
  destinationId: "bali"
}];