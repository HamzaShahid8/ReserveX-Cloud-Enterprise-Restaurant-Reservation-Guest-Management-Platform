import React from "react";
import { BadgePercentIcon, HeadsetIcon, ReceiptTextIcon, ShieldCheckIcon } from "lucide-react";
import { images } from "../../data/images";

const reasons = [
{ icon: ReceiptTextIcon, title: "The price you see is the price you pay", body: "Taxes and service fees are itemized before you confirm. No surprises at checkout." },
{ icon: ShieldCheckIcon, title: "Flexible rates on most rooms", body: "Free cancellation up to 24–72 hours before check-in on rates marked flexible." },
{ icon: BadgePercentIcon, title: "Member offers, applied in one step", body: "Promo codes are validated instantly and shown clearly in your breakdown." },
{ icon: HeadsetIcon, title: "People who know these hotels", body: "Our team has stayed at every property we list and answers within a day." }];


export function WhyBook() {
  return (
    <section aria-labelledby="why-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="overflow-hidden rounded-3xl">
          <img src={images.concierge} alt="Reception desk with a brass bell and fresh flowers" className="aspect-[4/3] w-full object-cover" loading="lazy" />
        </div>
        <div>
          <h2 id="why-title" className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
            Why book with Aurelle
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-soft">
            A short list of hotels we'd send our own families to, and a booking flow that respects your time.
          </p>
          <ul className="mt-8 divide-y divide-sand-200 border-t border-sand-200">
            {reasons.map(({ icon: Icon, title, body }) =>
            <li key={title} className="flex gap-4 py-5">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                <div>
                  <h3 className="font-medium text-ink">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{body}</p>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>);

}