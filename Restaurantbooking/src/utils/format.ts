const wholeCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const preciseCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export function formatPrice(amount: number): string {
  return wholeCurrency.format(amount);
}

export function formatMoney(amount: number): string {
  return preciseCurrency.format(amount);
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return `${count} ${count === 1 ? singular : plural ?? `${singular}s`}`;
}

export function ratingLabel(rating: number): string {
  if (rating >= 9.3) return "Exceptional";
  if (rating >= 9) return "Superb";
  if (rating >= 8.5) return "Excellent";
  if (rating >= 8) return "Very good";
  if (rating >= 7) return "Good";
  return "Pleasant";
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}