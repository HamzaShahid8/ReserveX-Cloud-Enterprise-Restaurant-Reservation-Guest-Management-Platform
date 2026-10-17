import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangleIcon, FlaskConicalIcon } from "lucide-react";
import { toast } from "sonner";
import { BookingStepper } from "../components/booking/BookingStepper";
import { BookingSummaryAside } from "../components/booking/BookingSummaryAside";
import { GuestInfoStep } from "../components/booking/GuestInfoStep";
import { PaymentStep } from "../components/booking/PaymentStep";
import { ReviewStep } from "../components/booking/ReviewStep";
import { buttonClasses } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { useAuth } from "../contexts/AuthContext";
import { useBookings } from "../contexts/BookingsContext";
import { usePersistentState } from "../hooks/usePersistentState";
import type { Booking, Guest } from "../types/booking";
import { generateReference, wait } from "../utils/booking";
import { nightsBetween } from "../utils/dates";
import { checkRoomCapacity, getHotelById, getRoom } from "../utils/hotels";
import { type PromoResult, calculatePrice, findPromo, validatePromoCode } from "../utils/pricing";
import { criteriaFromParams, criteriaToParams, validateCriteria } from "../utils/search";
import { guestSchema } from "../utils/validation";

export function BookingPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { addBooking } = useBookings();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [guestDraft, setGuestDraft] = usePersistentState<Partial<Guest>>("aurelle.bookingGuest", {}, "session");
  const criteria = useMemo(() => criteriaFromParams(params), [params]);

  const hotel = getHotelById(params.get("hotel"));
  const room = hotel ? getRoom(hotel, params.get("room")) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleDraftChange = useCallback(
    (values: Partial<Guest>) => setGuestDraft((previous) => ({ ...previous, ...values })),
    [setGuestDraft]
  );

  if (!hotel || !room) {
    return (
      <EmptyState
        icon={AlertTriangleIcon}
        tone="error"
        title="This booking link is incomplete"
        description="We couldn't find the hotel or room for this booking. Start again from the hotel page."
        action={
        <Link to="/hotels" className={buttonClasses("primary")}>
            Browse hotels
          </Link>
        } />);


  }

  const hotelParams = criteriaToParams(criteria);
  hotelParams.set("room", room.id);
  const hotelHref = `/hotels/${hotel.id}?${hotelParams.toString()}`;
  const blockingError = validateCriteria(criteria) ?? (checkRoomCapacity(room, criteria).ok ? null : checkRoomCapacity(room, criteria).message);

  if (blockingError) {
    return (
      <EmptyState
        icon={AlertTriangleIcon}
        tone="error"
        title="Let's fix your stay details"
        description={blockingError ?? "Something about these dates or guests doesn't work."}
        action={
        <Link to={hotelHref} className={buttonClasses("primary")}>
            Back to {hotel.name}
          </Link>
        } />);


  }

  const nights = nightsBetween(criteria.checkIn, criteria.checkOut);
  const price = calculatePrice({ nightlyRate: room.pricePerNight, nights, rooms: criteria.rooms, promo: findPromo(promoCode) });
  const parsedGuest = guestSchema.safeParse(guestDraft);
  const guest: Guest | null = parsedGuest.success ? parsedGuest.data : null;
  const currentStep = guest ? step : 0;

  const [firstName, ...lastNameParts] = user?.name.split(" ") ?? [];
  const guestDefaults: Partial<Guest> = {
    ...(user ? { firstName, lastName: lastNameParts.join(" "), email: user.email } : {}),
    ...Object.fromEntries(Object.entries(guestDraft).filter(([, value]) => value))
  };

  const applyPromo = (code: string): PromoResult => {
    const normalized = code.trim().toUpperCase();
    if (promoCode && normalized === promoCode) return { ok: false, message: `${promoCode} is already applied to this booking.` };
    if (promoCode) return { ok: false, message: "Only one promo code can be used per booking. Remove the current code first." };
    const result = validatePromoCode(code, price.subtotal);
    if (result.ok) setPromoCode(result.promo.code);
    return result;
  };

  const confirmBooking = async () => {
    if (!guest || !criteria.checkIn || !criteria.checkOut) throw new Error("Missing booking details");
    await wait(1600);
    const reference = generateReference();
    const booking: Booking = {
      id: `${reference}-${Date.now()}`,
      reference,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelImage: hotel.images[0],
      location: `${hotel.neighborhood}, ${hotel.city}, ${hotel.country}`,
      roomTypeId: room.id,
      roomName: room.name,
      checkIn: criteria.checkIn,
      checkOut: criteria.checkOut,
      adults: criteria.adults,
      children: criteria.children,
      rooms: criteria.rooms,
      guest,
      price,
      freeCancellation: room.freeCancellation,
      freeCancellationHours: hotel.freeCancellationHours,
      status: "confirmed",
      createdAt: new Date().toISOString()
    };
    addBooking(booking);
    setGuestDraft({});
    toast.success("Demo booking confirmed", { description: `Reference ${reference}` });
    navigate(`/booking/confirmation/${reference}`, { replace: true });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link to={hotelHref} className="text-sm font-medium text-forest-700 underline-offset-4 hover:underline">
            ← Back to {hotel.name}
          </Link>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">Complete your booking</h1>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-ink-soft">
          <FlaskConicalIcon className="h-4 w-4 text-gold-600" aria-hidden="true" />
          Demo booking — nothing is charged
        </p>
      </div>

      <div className="mt-8">
        <BookingStepper current={currentStep} />
      </div>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_380px]">
        <div className="rounded-3xl border border-sand-200 bg-white p-6 shadow-card md:p-10">
          {currentStep === 0 &&
          <GuestInfoStep
            defaultValues={guestDefaults}
            onDraftChange={handleDraftChange}
            onSubmit={(values) => {
              setGuestDraft(values);
              setStep(1);
            }} />

          }
          {currentStep === 1 && guest &&
          <ReviewStep
            hotel={hotel}
            room={room}
            criteria={criteria}
            guest={guest}
            price={price}
            editStayHref={hotelHref}
            onEditGuest={() => setStep(0)}
            onContinue={() => setStep(2)} />

          }
          {currentStep === 2 && guest &&
          <PaymentStep
            price={price}
            appliedPromo={promoCode}
            defaultCardholder={`${guest.firstName} ${guest.lastName}`}
            onApplyPromo={applyPromo}
            onRemovePromo={() => setPromoCode(null)}
            onBack={() => setStep(1)}
            onConfirm={confirmBooking} />

          }
        </div>
        <div className="lg:sticky lg:top-24">
          <BookingSummaryAside hotel={hotel} room={room} criteria={criteria} price={price} />
        </div>
      </div>
    </div>);

}