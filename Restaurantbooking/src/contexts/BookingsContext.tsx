import React, { createContext, useCallback, useContext, useMemo } from "react";
import { usePersistentState } from "../hooks/usePersistentState";
import type { Booking } from "../types/booking";

interface BookingsContextValue {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  findByReference: (reference: string) => Booking | undefined;
}

const BookingsContext = createContext<BookingsContextValue | null>(null);

export function BookingsProvider({ children }: {children: React.ReactNode;}) {
  const [bookings, setBookings] = usePersistentState<Booking[]>("aurelle.bookings", []);

  const addBooking = useCallback(
    (booking: Booking) =>
    setBookings((prev) => prev.some((item) => item.reference === booking.reference) ? prev : [booking, ...prev]),
    [setBookings]
  );

  const cancelBooking = useCallback(
    (bookingId: string) =>
    setBookings((prev) =>
    prev.map(
      (item): Booking =>
      item.id === bookingId ? { ...item, status: "cancelled", cancelledAt: new Date().toISOString() } : item
    )
    ),
    [setBookings]
  );

  const findByReference = useCallback(
    (reference: string) => bookings.find((item) => item.reference.toUpperCase() === reference.toUpperCase()),
    [bookings]
  );

  const value = useMemo(
    () => ({ bookings, addBooking, cancelBooking, findByReference }),
    [bookings, addBooking, cancelBooking, findByReference]
  );

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
}

export function useBookings(): BookingsContextValue {
  const context = useContext(BookingsContext);
  if (!context) throw new Error("useBookings must be used inside BookingsProvider");
  return context;
}