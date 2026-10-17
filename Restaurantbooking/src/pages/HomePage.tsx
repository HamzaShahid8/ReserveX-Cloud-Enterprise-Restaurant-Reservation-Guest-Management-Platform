import React from "react";
import { FeaturedDestinations } from "../components/home/FeaturedDestinations";
import { GuestReviews } from "../components/home/GuestReviews";
import { Hero } from "../components/home/Hero";
import { Newsletter } from "../components/home/Newsletter";
import { OffersPreview } from "../components/home/OffersPreview";
import { RecommendedHotels } from "../components/home/RecommendedHotels";
import { RoomCategories } from "../components/home/RoomCategories";
import { WhyBook } from "../components/home/WhyBook";

export function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedDestinations />
      <RecommendedHotels />
      <RoomCategories />
      <OffersPreview />
      <WhyBook />
      <GuestReviews />
      <Newsletter />
    </>);

}