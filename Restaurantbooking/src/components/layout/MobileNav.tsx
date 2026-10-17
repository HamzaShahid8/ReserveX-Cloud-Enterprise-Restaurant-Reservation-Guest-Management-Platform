import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import { buttonClasses } from "../ui/Button";
import { BrandMark } from "./BrandMark";
import { primaryNav } from "./navigation";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

export function MobileNav({ open, onClose, onSignOut }: MobileNavProps) {
  const { user } = useAuth();
  const { count } = useFavorites();
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => closeRef.current?.focus(), 30);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const linkClass = ({ isActive }: {isActive: boolean;}) =>
  `flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
  isActive ? "bg-forest-50 text-forest-700" : "text-ink hover:bg-sand-100"}`;


  return createPortal(
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
          className="absolute inset-0 bg-ink/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          aria-hidden="true" />
        
          <motion.nav
          id="mobile-navigation"
          aria-label="Mobile"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.26, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-sand-50 shadow-lift">
          
            <div className="flex h-16 items-center justify-between border-b border-sand-200 px-4">
              <BrandMark />
              <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-sand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              aria-label="Close menu">
              
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="space-y-1">
                <li>
                  <NavLink to="/" end className={linkClass} onClick={onClose}>
                    Home
                  </NavLink>
                </li>
                {primaryNav.map((item) =>
              <li key={item.to}>
                    <NavLink to={item.to} className={linkClass} onClick={onClose}>
                      {item.label}
                    </NavLink>
                  </li>
              )}
              </ul>
              <div className="my-4 h-px bg-sand-200" />
              <ul className="space-y-1">
                <li>
                  <NavLink to="/bookings" className={linkClass} onClick={onClose}>
                    My Bookings
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/favorites" className={linkClass} onClick={onClose}>
                    Favorites
                    {count > 0 &&
                  <span className="rounded-full bg-gold-500 px-2 py-0.5 text-xs font-semibold text-ink">{count}</span>
                  }
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/faq" className={linkClass} onClick={onClose}>
                    FAQ
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="border-t border-sand-200 p-4">
              {user ?
            <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{user.name}</p>
                    <p className="truncate text-xs text-ink-muted">Demo account</p>
                  </div>
                  <button
                type="button"
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className={buttonClasses("outline", "sm")}>
                
                    Sign out
                  </button>
                </div> :

            <div className="grid grid-cols-2 gap-2">
                  <Link to="/sign-in" onClick={onClose} className={buttonClasses("outline", "md")}>
                    Sign in
                  </Link>
                  <Link to="/sign-up" onClick={onClose} className={buttonClasses("primary", "md")}>
                    Sign up
                  </Link>
                </div>
            }
            </div>
          </motion.nav>
        </div>
      }
    </AnimatePresence>,
    document.body
  );
}