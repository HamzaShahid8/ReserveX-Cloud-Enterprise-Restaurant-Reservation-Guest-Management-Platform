import React from "react";
import { Link } from "react-router-dom";
import { buttonClasses } from "../../components/ui/Button";
import { images } from "../../data/images";
// this is a comment
const values = [
{ title: "Fewer, better hotels", body: "We list a dozen properties, not ten thousand. Every one has been visited by our team, and we drop hotels that slip." },
{ title: "Honest pricing", body: "Nightly rates, taxes, and fees are shown separately and added up before you confirm. The total never changes at checkout." },
{ title: "Flexibility by default", body: "Most rooms carry free cancellation. When a rate is non-refundable, we say so plainly next to the price." }];


const benefits = [
{ stat: "12", label: "handpicked hotels across six destinations" },
{ stat: "9.0", label: "average guest rating across our hotels" },
{ stat: "24h", label: "typical reply time from our concierge team" }];


export function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="font-display text-4xl font-medium tracking-tight text-ink md:text-6xl">Hotels we'd send our own families to</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Aurelle Stays started with a simple frustration: booking sites with endless results and prices that grow at checkout. We built
              the opposite — a short, trusted list and a booking flow that shows everything upfront.
            </p>
            <p className="mt-4 text-sm text-ink-muted">This is a demonstration website. The company, hotels, and figures are illustrative.</p>
          </div>
          <img src={images.lobby} alt="Hotel lobby with green velvet armchairs and arched windows" className="aspect-[4/3] w-full rounded-3xl object-cover" />
        </div>
      </section>

      <section aria-labelledby="mission-title" className="bg-forest-800 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="mission-title" className="max-w-3xl font-display text-3xl font-medium leading-snug text-white md:text-4xl">
            Our mission is to make booking a great hotel feel as considered as staying in one.
          </h2>
          <dl className="mt-14 grid gap-10 border-t border-forest-700 pt-10 sm:grid-cols-3">
            {benefits.map((benefit) =>
            <div key={benefit.label}>
                <dt className="sr-only">{benefit.label}</dt>
                <dd>
                  <span className="block font-display text-5xl font-medium text-gold-400">{benefit.stat}</span>
                  <span className="mt-2 block text-sm text-forest-100">{benefit.label}</span>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <section aria-labelledby="values-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 id="values-title" className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
          What we value
        </h2>
        <ol className="mt-10 divide-y divide-sand-200 border-y border-sand-200">
          {values.map((value) =>
          <li key={value.title} className="grid gap-2 py-8 md:grid-cols-[1fr_2fr] md:gap-10">
              <h3 className="font-display text-xl font-medium text-ink">{value.title}</h3>
              <p className="text-base leading-relaxed text-ink-soft">{value.body}</p>
            </li>
          )}
        </ol>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link to="/hotels" className={buttonClasses("primary", "lg")}>
            Explore our hotels
          </Link>
          <Link to="/contact" className={buttonClasses("outline", "lg")}>
            Talk to our team
          </Link>
        </div>
      </section>
    </div>);

}