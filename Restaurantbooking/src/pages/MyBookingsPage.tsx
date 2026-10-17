import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarXIcon, LuggageIcon, SearchIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { BookingDetails } from "../components/booking/BookingDetails";
import { BookingListItem } from "../components/booking/BookingListItem";
import { Button, buttonClasses } from "../components/ui/Button";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";
import { Modal } from "../components/ui/Modal";
import { Tabs } from "../components/ui/Tabs";
import { useBookings } from "../contexts/BookingsContext";
import type { Booking } from "../types/booking";
import { type BookingGroup, cancellationSummary, getBookingGroup, wait } from "../utils/booking";
import { formatDateRange } from "../utils/dates";
import { formatMoney, pluralize } from "../utils/format";

const tabLabels: Record<BookingGroup, string> = { upcoming: "Upcoming", past: "Past", cancelled: "Cancelled" };
const emptyCopy: Record<BookingGroup, string> = {
  upcoming: "When you book a stay, it'll appear here until check-out.",
  past: "Completed stays will show up here after check-out.",
  cancelled: "Bookings you cancel are kept here for reference."
};

export function MyBookingsPage() {
  const { bookings, cancelBooking } = useBookings();
  const [tab, setTab] = useState<BookingGroup>("upcoming");
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState<Booking | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const grouped = useMemo(() => {
    const groups: Record<BookingGroup, Booking[]> = { upcoming: [], past: [], cancelled: [] };
    [...bookings].
    sort((a, b) => a.checkIn.localeCompare(b.checkIn)).
    forEach((booking) => groups[getBookingGroup(booking)].push(booking));
    groups.past.reverse();
    return groups;
  }, [bookings]);

  const normalizedQuery = query.trim().toLowerCase();
  const searchResults = normalizedQuery ?
  bookings.filter(
    (booking) => booking.reference.toLowerCase().includes(normalizedQuery) || booking.hotelName.toLowerCase().includes(normalizedQuery)
  ) :
  null;
  const list = searchResults ?? grouped[tab];
  const viewingBooking = viewing ? bookings.find((booking) => booking.id === viewing.id) ?? viewing : null;

  const confirmCancel = async () => {
    if (!cancelling) return;
    setCancelLoading(true);
    await wait(900);
    cancelBooking(cancelling.id);
    toast.success(`Demo booking ${cancelling.reference} cancelled`, {
      description: "Only your saved demo booking was updated — no hotel was contacted."
    });
    setCancelLoading(false);
    setCancelling(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-ink">My Bookings</h1>
          <p className="mt-2 text-sm text-ink-soft">Demo bookings saved in this browser. Nothing here is a real reservation.</p>
        </div>
        {bookings.length > 0 &&
        <div className="relative w-full sm:w-80">
            <label htmlFor="booking-search" className="sr-only">
              Search by booking reference or hotel
            </label>
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
            <input
            id="booking-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search reference or hotel"
            className="h-11 w-full rounded-full border border-sand-300 bg-white pl-10 pr-10 text-sm text-ink placeholder:text-ink-muted focus:border-forest-700 focus:outline-none focus:ring-4 focus:ring-forest-700/10" />
          
            {query &&
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink-muted hover:bg-sand-100 hover:text-ink"
            aria-label="Clear search">
            
                <XIcon className="h-4 w-4" aria-hidden="true" />
              </button>
          }
          </div>
        }
      </div>

      {bookings.length === 0 ?
      <EmptyState
        icon={LuggageIcon}
        title="No bookings yet"
        description="Find a hotel you love and complete the demo checkout — your booking will appear here."
        action={
        <Link to="/hotels" className={buttonClasses("primary")}>
              Find a hotel
            </Link>
        } /> :


      <div className="mt-8">
          {searchResults ?
        <p className="border-b border-sand-200 pb-3 text-sm text-ink-soft" aria-live="polite">
              {pluralize(searchResults.length, "result")} for "{query.trim()}" across all bookings
            </p> :

        <Tabs
          idPrefix="bookings"
          ariaLabel="Booking status"
          value={tab}
          onChange={(id) => setTab(id as BookingGroup)}
          tabs={(Object.keys(tabLabels) as BookingGroup[]).map((id) => ({ id, label: tabLabels[id], count: grouped[id].length }))} />

        }
          <div id="bookings-panel" role={searchResults ? undefined : "tabpanel"} aria-labelledby={searchResults ? undefined : `bookings-tab-${tab}`}>
            {list.length === 0 ?
          <EmptyState
            icon={CalendarXIcon}
            title={searchResults ? "No matching bookings" : `No ${tabLabels[tab].toLowerCase()} bookings`}
            description={searchResults ? "Check the reference — it starts with AUR- — or search by hotel name." : emptyCopy[tab]} /> :


          <ul className="divide-y divide-sand-200">
                {list.map((booking) =>
            <BookingListItem
              key={booking.id}
              booking={booking}
              group={getBookingGroup(booking)}
              onView={() => setViewing(booking)}
              onCancel={() => setCancelling(booking)} />

            )}
              </ul>
          }
          </div>
        </div>
      }

      <Modal
        open={!!viewingBooking}
        onClose={() => setViewing(null)}
        title="Reservation summary"
        size="lg"
        footer={
        viewingBooking &&
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <Link to={`/booking/confirmation/${viewingBooking.reference}`} className={buttonClasses("ghost")}>
                Open confirmation
              </Link>
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                {getBookingGroup(viewingBooking) === "upcoming" &&
            <Button
              variant="outline"
              className="text-danger-600 hover:border-danger-600 hover:text-danger-700"
              onClick={() => {
                setCancelling(viewingBooking);
                setViewing(null);
              }}>
              
                    Cancel booking
                  </Button>
            }
                <Button onClick={() => setViewing(null)}>Close</Button>
              </div>
            </div>

        }>
        
        {viewingBooking && <BookingDetails booking={viewingBooking} />}
      </Modal>

      <ConfirmDialog
        open={!!cancelling}
        title="Cancel this booking?"
        description={cancelling ? `${cancelling.hotelName} · ${formatDateRange(cancelling.checkIn, cancelling.checkOut)}` : undefined}
        confirmLabel="Cancel booking"
        cancelLabel="Keep booking"
        tone="danger"
        loading={cancelLoading}
        onConfirm={confirmCancel}
        onCancel={() => setCancelling(null)}>
        
        {cancelling &&
        <div className="space-y-4 text-sm">
            <div className="rounded-2xl bg-sand-100 p-4">
              <p className="font-medium text-ink">{cancelling.freeCancellation ? "Free cancellation" : "Non-refundable rate"}</p>
              <p className="mt-1 text-ink-soft">{cancellationSummary(cancelling)}</p>
              <p className="mt-2 text-ink">
                Booking total: <span className="font-semibold">{formatMoney(cancelling.price.total)}</span>
              </p>
            </div>
            <p className="text-ink-soft">
              This is a demo — cancelling only updates the booking saved in your browser. No hotel will be contacted.
            </p>
          </div>
        }
      </ConfirmDialog>
    </div>);

}