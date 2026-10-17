import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Building2Icon, MapPinIcon, Share2Icon } from "lucide-react";
import { toast } from "sonner";
import { AmenityIcon } from "../components/hotel/AmenityIcon";
import { BookingSidebar } from "../components/hotel/BookingSidebar";
import { FavoriteButton } from "../components/hotel/FavoriteButton";
import { HotelCard } from "../components/hotel/HotelCard";
import { HotelGallery } from "../components/hotel/HotelGallery";
import { HotelPolicies } from "../components/hotel/HotelPolicies";
import { Lightbox } from "../components/hotel/Lightbox";
import { LocationSection } from "../components/hotel/LocationSection";
import { ReviewsSection } from "../components/hotel/ReviewsSection";
import { RoomCard } from "../components/room/RoomCard";
import { DateRangePicker } from "../components/search/DateRangePicker";
import { GuestSelector } from "../components/search/GuestSelector";
import { Button, buttonClasses } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { RatingBadge } from "../components/ui/RatingBadge";
import { StarRating } from "../components/ui/StarRating";
import { amenities } from "../data/amenities";
import { propertyTypeLabels } from "../data/labels";
import type { SearchCriteria } from "../types/booking";
import type { Room } from "../types/hotel";
import { buildBookingParams } from "../utils/booking";
import { formatDateRange } from "../utils/dates";
import { formatPrice } from "../utils/format";
import {
  checkRoomCapacity,
  getDestination,
  getHotelById,
  getHotelReviews,
  getHotelRooms,
  getLowestPrice,
  getSimilarHotels } from
"../utils/hotels";
import { criteriaFromParams, criteriaToParams, guestSummary, validateCriteria, writeCriteriaToParams } from "../utils/search";

export function HotelDetailsPage() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const criteria = useMemo(() => criteriaFromParams(params), [params]);
  const hotel = getHotelById(hotelId);

  if (!hotel) {
    return (
      <EmptyState
        icon={Building2Icon}
        tone="error"
        title="We couldn't find that hotel"
        description="The link may be out of date, or the hotel is no longer listed."
        action={
        <Link to="/hotels" className={buttonClasses("primary")}>
            Browse all hotels
          </Link>
        } />);


  }

  const rooms = getHotelRooms(hotel);
  const selectedRoom = rooms.find((room) => room.id === params.get("room")) ?? null;
  const destination = getDestination(hotel.destinationId);
  const reviews = getHotelReviews(hotel.id);
  const similar = getSimilarHotels(hotel);
  const lowestPrice = getLowestPrice(hotel);
  const searchQuery = criteriaToParams(criteria).toString();

  const updateCriteria = (next: SearchCriteria) =>
  setParams(
    (prev) => {
      const copy = new URLSearchParams(prev);
      writeCriteriaToParams(copy, next);
      return copy;
    },
    { replace: true, preventScrollReset: true }
  );

  const selectRoom = (roomId: string) =>
  setParams(
    (prev) => {
      const copy = new URLSearchParams(prev);
      writeCriteriaToParams(copy, criteria);
      copy.set("room", roomId);
      return copy;
    },
    { replace: true, preventScrollReset: true }
  );

  const book = (room: Room) => {
    const criteriaError = validateCriteria(criteria);
    if (criteriaError) {
      toast.error(criteriaError);
      return;
    }
    const capacity = checkRoomCapacity(room, criteria);
    if (!capacity.ok) {
      toast.error(capacity.message);
      return;
    }
    navigate(`/booking?${buildBookingParams(hotel.id, room.id, criteria)}`);
  };

  const scrollToRooms = () => document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link. Copy it from the address bar instead.");
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
            <li>
              <Link to={`/hotels?${searchQuery}`} className="hover:text-ink">
                Hotels
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            {destination &&
            <>
                <li>
                  <Link to={`/destinations/${destination.id}`} className="hover:text-ink">
                    {destination.name}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
              </>
            }
            <li aria-current="page" className="truncate text-ink">
              {hotel.name}
            </li>
          </ol>
        </nav>

        <header className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <StarRating stars={hotel.stars} size="md" />
              <span aria-hidden="true">·</span>
              {propertyTypeLabels[hotel.propertyType]}
            </div>
            <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">{hotel.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
              <p className="flex items-center gap-1.5 text-sm text-ink-soft">
                <MapPinIcon className="h-4 w-4" aria-hidden="true" />
                {hotel.neighborhood}, {hotel.city}, {hotel.country}
              </p>
              <a href="#reviews" className="rounded-lg hover:opacity-80">
                <RatingBadge rating={hotel.guestRating} reviewCount={hotel.reviewCount} />
              </a>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-10" onClick={share}>
              <Share2Icon className="h-4 w-4" aria-hidden="true" />
              Share
            </Button>
            <FavoriteButton hotelId={hotel.id} hotelName={hotel.name} variant="outline" />
          </div>
        </header>

        <div className="mt-6">
          <HotelGallery images={hotel.images} hotelName={hotel.name} onOpen={setLightboxIndex} />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0 space-y-16">
            <section aria-labelledby="overview-title">
              <h2 id="overview-title" className="font-display text-2xl font-medium text-ink">
                About this stay
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-soft">{hotel.description}</p>
              <h3 className="mt-8 text-sm font-semibold text-ink">Amenities</h3>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                {hotel.amenities.map((id) =>
                <li key={id} className="flex items-center gap-3 text-sm text-ink">
                    <AmenityIcon id={id} className="h-5 w-5 text-forest-600" />
                    {amenities.find((amenity) => amenity.id === id)?.label}
                  </li>
                )}
              </ul>
            </section>

            <section id="rooms" aria-labelledby="rooms-title" className="scroll-mt-24">
              <h2 id="rooms-title" className="font-display text-2xl font-medium text-ink">
                Choose your room
              </h2>
              <p className="mt-2 text-sm text-ink-soft">
                Showing availability for {formatDateRange(criteria.checkIn, criteria.checkOut)} · {guestSummary(criteria)}
              </p>
              {!hotel.available &&
              <p className="mt-4 rounded-xl bg-sand-100 p-4 text-sm text-ink-soft">
                  This hotel is fully booked for these dates. Try different dates or{" "}
                  <a href="#similar-title" className="font-medium text-forest-700 underline underline-offset-2">
                    see similar hotels
                  </a>
                  .
                </p>
              }
              <div className="mt-5 grid gap-2 sm:grid-cols-[1.5fr_1fr] lg:hidden">
                <DateRangePicker
                  checkIn={criteria.checkIn}
                  checkOut={criteria.checkOut}
                  onChange={(dates) => updateCriteria({ ...criteria, ...dates })}
                  hasError={!!validateCriteria(criteria)} />
                
                <GuestSelector
                  adults={criteria.adults}
                  children={criteria.children}
                  rooms={criteria.rooms}
                  onChange={(guests) => updateCriteria({ ...criteria, ...guests })}
                  popoverAlign="right" />
                
              </div>
              <div className="mt-6 space-y-5">
                {rooms.map((room) =>
                <RoomCard
                  key={room.id}
                  room={room}
                  criteria={criteria}
                  freeCancellationHours={hotel.freeCancellationHours}
                  selected={selectedRoom?.id === room.id}
                  onSelect={() => selectRoom(room.id)}
                  onBook={() => book(room)} />

                )}
              </div>
            </section>

            <section aria-labelledby="policies-title">
              <h2 id="policies-title" className="mb-6 font-display text-2xl font-medium text-ink">
                Policies
              </h2>
              <HotelPolicies hotel={hotel} />
            </section>

            <section aria-labelledby="location-title">
              <h2 id="location-title" className="mb-6 font-display text-2xl font-medium text-ink">
                Location
              </h2>
              <LocationSection hotel={hotel} />
            </section>

            <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-24">
              <h2 id="reviews-title" className="mb-6 font-display text-2xl font-medium text-ink">
                Guest reviews
              </h2>
              <ReviewsSection hotel={hotel} reviews={reviews} />
            </section>
          </div>

          <aside className="hidden lg:block" aria-label="Booking summary">
            <div className="sticky top-24">
              <BookingSidebar
                lowestPrice={lowestPrice}
                criteria={criteria}
                onCriteriaChange={updateCriteria}
                selectedRoom={selectedRoom}
                onReserve={() => selectedRoom && book(selectedRoom)}
                onChooseRoom={scrollToRooms} />
              
            </div>
          </aside>
        </div>

        <section aria-labelledby="similar-title" className="mt-20 border-t border-sand-200 pt-14">
          <h2 id="similar-title" className="scroll-mt-24 font-display text-2xl font-medium text-ink">
            Similar hotels
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) =>
            <HotelCard key={item.id} hotel={item} searchQuery={searchQuery} />
            )}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand-200 bg-white px-4 py-3 shadow-lift lg:hidden print:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-ink">
              {selectedRoom ? null : <span className="text-xs text-ink-muted">from </span>}
              <span className="text-lg font-semibold tabular-nums">{formatPrice(selectedRoom?.pricePerNight ?? lowestPrice)}</span>
              <span className="text-xs text-ink-muted"> / night</span>
            </p>
            <p className="truncate text-xs text-ink-muted">{selectedRoom ? selectedRoom.name : "+ taxes & fees"}</p>
          </div>
          {selectedRoom ?
          <Button onClick={() => book(selectedRoom)}>Reserve</Button> :

          <Button onClick={scrollToRooms}>Choose a room</Button>
          }
        </div>
      </div>

      <Lightbox
        images={hotel.images}
        index={lightboxIndex}
        title={hotel.name}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex} />
      
    </>);

}