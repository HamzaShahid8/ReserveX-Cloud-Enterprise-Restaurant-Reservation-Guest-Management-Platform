import React from "react";
import type { PriceBreakdown } from "../../types/booking";
import { formatMoney, pluralize } from "../../utils/format";

export function PriceSummary({ price }: {price: PriceBreakdown;}) {
  return (
    <dl className="space-y-2.5 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-ink-soft">
          {formatMoney(price.nightlyRate)} × {pluralize(price.nights, "night")}
          {price.rooms > 1 ? ` × ${price.rooms} rooms` : ""}
        </dt>
        <dd className="tabular-nums text-ink">{formatMoney(price.subtotal)}</dd>
      </div>
      {price.discount > 0 &&
      <div className="flex justify-between gap-4 text-forest-600">
          <dt>Discount ({price.promoCode})</dt>
          <dd className="tabular-nums">−{formatMoney(price.discount)}</dd>
        </div>
      }
      <div className="flex justify-between gap-4">
        <dt className="text-ink-soft">Taxes ({Math.round(price.taxRate * 100)}%)</dt>
        <dd className="tabular-nums text-ink">{formatMoney(price.taxes)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-ink-soft">Service fee ({Math.round(price.serviceFeeRate * 100)}%)</dt>
        <dd className="tabular-nums text-ink">{formatMoney(price.serviceFee)}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-4 border-t border-sand-200 pt-3">
        <dt className="font-semibold text-ink">Total</dt>
        <dd className="text-right">
          {price.discount > 0 &&
          <span className="mr-2 text-sm tabular-nums text-ink-muted line-through" aria-label={`Original total ${formatMoney(price.originalTotal)}`}>
              {formatMoney(price.originalTotal)}
            </span>
          }
          <span className="text-lg font-semibold tabular-nums text-ink">{formatMoney(price.total)}</span>
        </dd>
      </div>
      {price.discount > 0 &&
      <p className="text-right text-xs font-medium text-forest-600">
          You save {formatMoney(price.originalTotal - price.total)}
        </p>
      }
    </dl>);

}