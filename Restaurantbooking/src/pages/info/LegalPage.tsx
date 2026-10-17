import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { InfoIcon } from "lucide-react";
import { legalPages } from "../../data/legal";
import { NotFoundPage } from "../NotFoundPage";

export function LegalPage() {
  const { slug } = useParams();
  const page = legalPages.find((item) => item.slug === slug);
  if (!page) return <NotFoundPage />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Policies">
          <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
            {legalPages.map((item) =>
            <li key={item.slug}>
                <NavLink
                to={`/legal/${item.slug}`}
                className={({ isActive }) =>
                `block whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors lg:rounded-xl ${
                isActive ? "bg-forest-50 text-forest-700" : "text-ink-soft hover:bg-sand-100 hover:text-ink"}`

                }>
                
                  {item.title}
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
        <article className="max-w-3xl">
          <h1 className="font-display text-4xl font-medium tracking-tight text-ink">{page.title}</h1>
          <p className="mt-3 text-base text-ink-soft">{page.summary}</p>
          <p className="mt-6 flex items-start gap-2 rounded-2xl border border-gold-100 bg-gold-50 p-4 text-sm text-ink">
            <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
            Placeholder content for a demo site. Official policies have not been supplied and this text is not legal advice.
          </p>
          <div className="mt-10 space-y-8">
            {page.sections.map((section) =>
            <section key={section.heading}>
                <h2 className="font-display text-xl font-medium text-ink">{section.heading}</h2>
                <p className="mt-2 text-base leading-relaxed text-ink-soft">{section.body}</p>
              </section>
            )}
          </div>
          <p className="mt-12 text-xs text-ink-muted">Last updated October 1, 2026</p>
        </article>
      </div>
    </div>);

}