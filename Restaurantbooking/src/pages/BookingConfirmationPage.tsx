import React from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckIcon, CopyIcon, DownloadIcon, PrinterIcon, SearchXIcon } from "lucide-react";
import { toast } from "sonner";
import { BookingDetails } from "../components/booking/BookingDetails";
import { BookingStepper } from "../components/booking/BookingStepper";
import { Button, buttonClasses } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { useBookings } from "../contexts/BookingsContext";
import { buildConfirmationText, downloadTextFile } from "../utils/booking";

export function BookingConfirmationPage() {
  const { reference } = useParams();
  const { findByReference } = useBookings();
  const booking = reference ? findByReference(reference) : undefined;

  if (!booking) {
    return (
      <EmptyState
        icon={SearchXIcon}
        title="We couldn't find that booking"
        description="Demo bookings are saved in this browser only. If you booked on another device or cleared your data, it won't appear here."
        action={
        <>
            <Link to="/bookings" className={buttonClasses("primary")}>
              View my bookings
            </Link>
            <Link to="/" className={buttonClasses("outline")}>
              Return home
            </Link>
          </>
        } />);


  }

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(booking.reference);
      toast.success("Reference copied");
    } catch {
      toast.error("Couldn't copy — please select the reference manually.");
    }
  };

  const isCancelled = booking.status === "cancelled";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="print:hidden">
        <BookingStepper current={4} />
      </div>

      <div className="mt-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${isCancelled ? "bg-sand-200 text-ink-soft" : "bg-forest-700 text-white"}`}>
          
          <CheckIcon className="h-8 w-8" aria-hidden="true" />
        </motion.div>
        <h1 className="mt-6 font-display text-4xl font-medium tracking-tight text-ink">
          {isCancelled ? "This booking was cancelled" : "Your stay is confirmed"}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
          {isCancelled ?
          "This demo booking has been cancelled. The details are kept here for reference." :
          `A demo confirmation for ${booking.guest.email}. This is a simulated booking — no reservation was made with the hotel and no payment was taken.`}
        </p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-sand-200 bg-white px-5 py-3">
          <span className="text-sm text-ink-soft">Booking reference</span>
          <span className="font-mono text-lg font-semibold tracking-wider text-ink">{booking.reference}</span>
          <button
            type="button"
            onClick={copyReference}
            className="grid h-8 w-8 place-items-center rounded-full text-ink-soft hover:bg-sand-100 hover:text-ink print:hidden"
            aria-label="Copy booking reference">
            
            <CopyIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-sand-200 bg-white p-6 shadow-card md:p-8">
        <BookingDetails booking={booking} />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center print:hidden">
        <Button variant="outline" onClick={() => window.print()}>
          <PrinterIcon className="h-4 w-4" aria-hidden="true" />
          Print confirmation
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            downloadTextFile(`aurelle-${booking.reference}.txt`, buildConfirmationText(booking));
            toast.success("Confirmation downloaded");
          }}>
          
          <DownloadIcon className="h-4 w-4" aria-hidden="true" />
          Download confirmation
        </Button>
        <Link to="/bookings" className={buttonClasses("primary")}>
          View my bookings
        </Link>
        <Link to="/" className={buttonClasses("ghost")}>
          Return home
        </Link>
      </div>
    </div>);

}