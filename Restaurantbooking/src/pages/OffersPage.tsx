import React from "react";
import { Link } from "react-router-dom";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonClasses } from "../components/ui/Button";
import { offers } from "../data/offers";
import { formatDate } from "../utils/dates";
import { getDestination } from "../utils/hotels";

export function OffersPage() {
  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`${code} copied — apply it at checkout`);
    } catch {
      toast.error("Couldn't copy the code. Please type it at checkout.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">Offers</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          Demo promo codes you can apply on the payment step. One code per booking, and some need a minimum room subtotal.
        </p>
      </div>

      <ul className="mt-12 divide-y divide-sand-200 border-y border-sand-200">
        {offers.map((offer) => {
          const destination = getDestination(offer.destinationId);
          const hotelsHref = destination ? `/hotels?destination=${encodeURIComponent(destination.name)}` : "/hotels";
          return (
            <li key={offer.id} className="grid gap-8 py-10 md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr_220px]">
              <img src={offer.image} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover" loading="lazy" />
              <div>
                <p className="font-display text-4xl font-medium text-gold-600">{offer.discountLabel}</p>
                <h2 className="mt-2 font-display text-2xl font-medium text-ink">{offer.title}</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{offer.description}</p>
                <p className="mt-4 text-sm text-ink">
                  Valid {formatDate(offer.validFrom, "MMM d, yyyy")} – {formatDate(offer.validUntil, "MMM d, yyyy")}
                </p>
                <h3 className="mt-5 text-sm font-semibold text-ink">Conditions</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
                  {offer.conditions.map((condition) =>
                  <li key={condition} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
                      {condition}
                    </li>
                  )}
                </ul>
              </div>
              <div className="flex flex-col gap-3 md:col-start-2 lg:col-start-auto lg:items-stretch">
                <div className="flex items-center justify-between gap-2 rounded-2xl border border-dashed border-gold-500 bg-gold-50 px-4 py-3">
                  <span className="font-mono text-base font-semibold tracking-wider text-ink">{offer.promoCode}</span>
                  <Button variant="ghost" size="sm" onClick={() => copyCode(offer.promoCode)} aria-label={`Copy code ${offer.promoCode}`}>
                    <CopyIcon className="h-4 w-4" aria-hidden="true" />
                    Copy
                  </Button>
                </div>
                <Link to={hotelsHref} className={buttonClasses("primary")}>
                  View hotels{destination ? ` in ${destination.name}` : ""}
                </Link>
              </div>
            </li>);

        })}
      </ul>
    </div>);

}