export interface Offer {
  id: string;
  title: string;
  description: string;
  discountLabel: string;
  image: string;
  validFrom: string;
  validUntil: string;
  conditions: string[];
  promoCode: string;
  destinationId: string | null;
}

export interface FaqItem {
  id: string;
  topic: "Reservations" | "Cancellations" | "Payments" | "Check-in";
  question: string;
  answer: string;
}