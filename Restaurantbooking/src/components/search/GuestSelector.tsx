import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UsersIcon } from "lucide-react";
import { useDismiss } from "../../hooks/useDismiss";
import { GUEST_LIMITS, guestSummary } from "../../utils/search";
import { Counter } from "../ui/Counter";

interface GuestValue {
  adults: number;
  children: number;
  rooms: number;
}

interface GuestSelectorProps extends GuestValue {
  onChange: (value: GuestValue) => void;
  popoverAlign?: "left" | "right";
}

export function GuestSelector({ adults, children, rooms, onChange, popoverAlign = "left" }: GuestSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useDismiss(containerRef, () => setOpen(false), open);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Guests and rooms: ${guestSummary({ adults, children, rooms })}`}
        className={`flex h-full w-full flex-col items-start rounded-xl border bg-white px-3.5 py-2 text-left transition-[border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-700/10 ${
        open ? "border-forest-700 ring-4 ring-forest-700/10" : "border-sand-300 hover:border-forest-500"}`
        }>
        
        <span className="text-xs font-medium text-ink-muted">Guests & rooms</span>
        <span className="flex w-full items-center gap-1.5 text-sm font-medium text-ink">
          <UsersIcon className="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
          <span className="truncate">{guestSummary({ adults, children, rooms })}</span>
        </span>
      </button>
      <AnimatePresence>
        {open &&
        <motion.div
          role="dialog"
          aria-label="Choose guests and rooms"
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className={`absolute top-full z-40 mt-2 w-[calc(100vw-2rem)] max-w-[320px] rounded-2xl border border-sand-200 bg-white px-5 py-3 shadow-lift ${
          popoverAlign === "right" ? "right-0" : "left-0"}`
          }>
          
            <div className="divide-y divide-sand-200">
              <Counter
              label="Adults"
              description="Ages 13 or above"
              value={adults}
              min={GUEST_LIMITS.adults.min}
              max={GUEST_LIMITS.adults.max}
              onChange={(next) => onChange({ adults: next, children, rooms: Math.min(rooms, next) })} />
            
              <Counter
              label="Children"
              description="Ages 0–12"
              value={children}
              min={GUEST_LIMITS.children.min}
              max={GUEST_LIMITS.children.max}
              onChange={(next) => onChange({ adults, children: next, rooms })} />
            
              <Counter
              label="Rooms"
              description="At least one adult per room"
              value={rooms}
              min={GUEST_LIMITS.rooms.min}
              max={Math.min(GUEST_LIMITS.rooms.max, adults)}
              onChange={(next) => onChange({ adults, children, rooms: next })} />
            
            </div>
            <div className="flex justify-end border-t border-sand-200 pt-3">
              <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-forest-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-forest-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2">
              
                Done
              </button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}