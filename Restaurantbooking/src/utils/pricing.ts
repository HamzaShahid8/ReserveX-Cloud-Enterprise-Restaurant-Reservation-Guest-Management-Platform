import { promoCodes } from "../data/promoCodes";
import type { PriceBreakdown, PromoCode } from "../types/booking";
import { formatDate, isBeforeToday } from "./dates";
import { formatPrice } from "./format";

export const TAX_RATE = 0.12;
export const SERVICE_FEE_RATE = 0.04;

interface PriceInput {
  nightlyRate: number;
  nights: number;
  rooms: number;
  promo?: PromoCode | null;
}

export type PromoResult = {ok: true;promo: PromoCode;message: string;} | {ok: false;message: string;};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateDiscount(promo: PromoCode, subtotal: number): number {
  if (promo.type === "percent") return round2(subtotal * promo.value / 100);
  return Math.min(promo.value, subtotal);
}

export function calculatePrice({ nightlyRate, nights, rooms, promo }: PriceInput): PriceBreakdown {
  const subtotal = round2(nightlyRate * nights * rooms);
  const discount = promo ? calculateDiscount(promo, subtotal) : 0;
  const taxable = round2(subtotal - discount);
  const taxes = round2(taxable * TAX_RATE);
  const serviceFee = round2(taxable * SERVICE_FEE_RATE);
  return {
    nightlyRate,
    nights,
    rooms,
    subtotal,
    discount,
    taxes,
    serviceFee,
    taxRate: TAX_RATE,
    serviceFeeRate: SERVICE_FEE_RATE,
    total: round2(taxable + taxes + serviceFee),
    originalTotal: round2(subtotal * (1 + TAX_RATE + SERVICE_FEE_RATE)),
    promoCode: promo?.code ?? null
  };
}

export function nightlyTaxesAndFees(nightlyRate: number): number {
  return round2(nightlyRate * (TAX_RATE + SERVICE_FEE_RATE));
}

export function findPromo(code: string | null): PromoCode | null {
  if (!code) return null;
  return promoCodes.find((promo) => promo.code === code.toUpperCase()) ?? null;
}

export function validatePromoCode(input: string, subtotal: number): PromoResult {
  const code = input.trim().toUpperCase();
  if (!code) return { ok: false, message: "Enter a promo code to apply it." };
  const promo = findPromo(code);
  if (!promo) return { ok: false, message: `"${code}" isn't a valid promo code.` };
  if (isBeforeToday(promo.validUntil)) {
    return { ok: false, message: `${code} expired on ${formatDate(promo.validUntil, "MMM d, yyyy")}.` };
  }
  if (promo.minSubtotal && subtotal < promo.minSubtotal) {
    return { ok: false, message: `${code} needs a room subtotal of at least ${formatPrice(promo.minSubtotal)}.` };
  }
  return { ok: true, promo, message: `${code} applied — ${promo.description}.` };
}