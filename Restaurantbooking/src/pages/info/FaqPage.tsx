import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SearchIcon, SearchXIcon } from "lucide-react";
import { Accordion } from "../../components/ui/Accordion";
import { Button, buttonClasses } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { faqs } from "../../data/faqs";
import type { FaqItem } from "../../types/offer";

const topics: (FaqItem["topic"] | "All")[] = ["All", "Reservations", "Cancellations", "Payments", "Check-in"];

export function FaqPage() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<(typeof topics)[number]>("All");
  const normalized = query.trim().toLowerCase();
  const results = faqs.filter(
    (faq) =>
    (topic === "All" || faq.topic === topic) && (
    !normalized || faq.question.toLowerCase().includes(normalized) || faq.answer.toLowerCase().includes(normalized))
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
      <h1 className="font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">Frequently asked questions</h1>
      <p className="mt-3 text-base text-ink-soft">Everything about reservations, cancellations, payments, and check-in.</p>

      <div className="relative mt-8">
        <label htmlFor="faq-search" className="sr-only">
          Search questions
        </label>
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search questions, e.g. promo code"
          className="h-12 w-full rounded-full border border-sand-300 bg-white pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-forest-700 focus:outline-none focus:ring-4 focus:ring-forest-700/10" />
        
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
        {topics.map((item) =>
        <button
          key={item}
          type="button"
          onClick={() => setTopic(item)}
          aria-pressed={topic === item}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${
          topic === item ? "border-forest-700 bg-forest-700 text-white" : "border-sand-300 bg-white text-ink hover:border-forest-700"}`
          }>
          
            {item}
          </button>
        )}
      </div>

      <div className="mt-10">
        {results.length === 0 ?
        <EmptyState
          icon={SearchXIcon}
          title="No questions match"
          description="Try a different word, or ask our team directly."
          action={
          <>
                <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setTopic("All");
              }}>
              
                  Clear search
                </Button>
                <Link to="/contact" className={buttonClasses("primary")}>
                  Contact us
                </Link>
              </>
          } /> :


        <Accordion key={`${topic}-${normalized}`} items={results.map((faq) => ({ id: faq.id, title: faq.question, content: faq.answer }))} />
        }
      </div>

      <p className="mt-12 text-sm text-ink-soft">
        Still need help?{" "}
        <Link to="/contact" className="font-medium text-forest-700 underline underline-offset-2">
          Send us a message
        </Link>
        .
      </p>
    </div>);

}