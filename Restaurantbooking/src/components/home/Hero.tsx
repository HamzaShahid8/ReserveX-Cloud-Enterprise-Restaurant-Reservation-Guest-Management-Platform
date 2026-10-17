import React from "react";
import { Link } from "react-router-dom";
import { images } from "../../data/images";
import { SearchForm } from "../search/SearchForm";
import { buttonClasses } from "../ui/Button";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate z-10">
      <img src={images.hero} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-forest-900/55" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 md:pb-16 md:pt-28 lg:px-8 lg:pt-36">
        <div className="max-w-3xl">
          <h1 id="hero-title" className="font-display text-5xl font-medium leading-[1.05] tracking-tight text-white md:text-7xl">
            Find Your Perfect Stay
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90">
            Search handpicked hotels in six of the world's most rewarding destinations, compare rooms side by side, and book in a few calm
            steps — with every tax and fee shown upfront.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/hotels" className={buttonClasses("light", "lg")}>
              Explore Hotels
            </Link>
            <Link to="/offers" className={buttonClasses("outline", "lg", "border-white/60 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white")}>
              View Offers
            </Link>
          </div>
        </div>
        <div className="mt-12 md:mt-16">
          <SearchForm />
        </div>
      </div>
    </section>);

}