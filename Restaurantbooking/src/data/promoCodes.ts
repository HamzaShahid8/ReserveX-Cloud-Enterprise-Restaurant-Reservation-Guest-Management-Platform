import type { PromoCode } from "../types/booking";

export const promoCodes: PromoCode[] = [
{ code: "WELCOME10", description: "10% off your room subtotal", type: "percent", value: 10, validUntil: "2027-12-31" },
{ code: "EARLY15", description: "15% off stays booked early", type: "percent", value: 15, minSubtotal: 400, validUntil: "2027-03-31" },
{ code: "ALPS100", description: "$100 off alpine escapes", type: "fixed", value: 100, minSubtotal: 800, validUntil: "2027-04-30" },
{ code: "BALI20", description: "20% off long stays", type: "percent", value: 20, minSubtotal: 1000, validUntil: "2027-06-30" },
{ code: "SUMMER25", description: "25% off summer stays", type: "percent", value: 25, validUntil: "2026-08-31" }];