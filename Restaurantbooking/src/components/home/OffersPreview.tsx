import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { offers } from "../../data/offers";
import { formatDate } from "../../utils/dates";
import { buttonClasses } from "../ui/Button";
import { SectionHeading } from "../ui/SectionHeading";

export function OffersPreview() {
  const [feature, ...others] = offers.slice(1, 4);

  return (
    <section aria-labelledby="offers-title" className="bg-forest-800 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="offers-title"
          tone="light"
          title="Special offers"
          description="Demo promo codes you can apply at checkout."
          action={
          <Link to="/offers" className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-400 underline-offset-4 hover:underline">
              All offers
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          } />
        
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <article className="overflow-hidden rounded-3xl bg-forest-900">
            <img src={feature.image} alt="" className="h-64 w-full object-cover md:h-80" loading="lazy" />
            <div className="p-7">
              <p className="font-display text-4xl font-medium text-gold-400">{feature.discountLabel}</p>
              <h3 className="mt-2 font-display text-2xl font-medium text-white">{feature.title}</h3>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-forest-100">{feature.description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <span className="rounded-full border border-dashed border-gold-400 px-3 py-1.5 font-mono text-sm text-gold-100">{feature.promoCode}</span>
                <span className="text-xs text-forest-200">Valid until {formatDate(feature.validUntil, "MMM d, yyyy")}</span>
              </div>
            </div>
          </article>
          <div className="flex flex-col divide-y divide-forest-700">
            {others.map((offer) =>
            <article key={offer.id} className="flex flex-1 flex-col justify-center gap-3 py-6 first:pt-0 last:pb-0">
                <p className="font-display text-3xl font-medium text-gold-400">{offer.discountLabel}</p>
                <h3 className="font-display text-xl font-medium text-white">{offer.title}</h3>
                <p className="text-sm leading-relaxed text-forest-100">{offer.description}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="rounded-full border border-dashed border-gold-400 px-3 py-1 font-mono text-xs text-gold-100">{offer.promoCode}</span>
                  <Link
                  to={offer.destinationId ? `/hotels?destination=${offer.destinationId}` : "/hotels"}
                  className={buttonClasses("light", "sm")}>
                  
                    View hotels
                  </Link>
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </section>);

}