export interface LegalPage {
  slug: "privacy" | "terms" | "cancellation";
  title: string;
  summary: string;
  sections: {heading: string;body: string;}[];
}

export const legalPages: LegalPage[] = [
{
  slug: "privacy",
  title: "Privacy Policy",
  summary: "How this demo handles the information you enter.",
  sections: [
  { heading: "What we store", body: "This demo keeps favorites, search preferences, demo bookings, and demo account names and emails in your browser's LocalStorage. Nothing is sent to a server." },
  { heading: "Payment information", body: "Card details entered at the demo checkout are validated in your browser and discarded. They are never stored, logged, or transmitted." },
  { heading: "Clearing your data", body: "You can remove all demo data at any time by clearing your browser's site data for this page." },
  { heading: "Official policy", body: "Placeholder content: a full privacy policy has not been supplied for this project. Replace this section with your organization's approved policy before launch." }]

},
{
  slug: "terms",
  title: "Terms & Conditions",
  summary: "The terms for using this demonstration booking site.",
  sections: [
  { heading: "Demonstration only", body: "Aurelle Stays is a frontend demonstration. Hotels, prices, availability, and reviews are fictional sample data. No real reservations are created." },
  { heading: "Bookings", body: "Demo bookings exist only in your browser. Booking references are generated locally and are not recognized by any hotel." },
  { heading: "Pricing", body: "Displayed prices include a sample 12% tax and 4% service fee for illustration. Promo codes are demo codes with no monetary value." },
  { heading: "Official terms", body: "Placeholder content: official terms and conditions have not been supplied. Replace this section with legally reviewed terms before launch." }]

},
{
  slug: "cancellation",
  title: "Cancellation Policy",
  summary: "How cancellation works for flexible and non-refundable rates.",
  sections: [
  { heading: "Flexible rates", body: "Rates marked free cancellation can be cancelled without charge until the deadline shown for that hotel — typically 24, 48, or 72 hours before check-in. After the deadline the first night is charged." },
  { heading: "Non-refundable rates", body: "Non-refundable rates offer a lower price but can't be refunded or changed once confirmed." },
  { heading: "How to cancel", body: "Open My Bookings, choose an upcoming booking, and select Cancel booking. In this demo, cancelling updates your saved demo booking only — no hotel is contacted." },
  { heading: "Official policy", body: "Placeholder content: a binding cancellation policy has not been supplied. Replace this section with the approved policy before launch." }]

}];