import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheckIcon, ChevronDownIcon, HeartIcon, LogOutIcon, MenuIcon, UserIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useDismiss } from "../../hooks/useDismiss";
import { buttonClasses } from "../ui/Button";
import { BrandMark } from "./BrandMark";
import { MobileNav } from "./MobileNav";
import { primaryNav } from "./navigation";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const { count } = useFavorites();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  useDismiss(accountRef, () => setAccountOpen(false), accountOpen);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  const handleSignOut = () => {
    signOut();
    setAccountOpen(false);
    toast("You've been signed out of the demo account");
    navigate("/");
  };

  const navLinkClass = ({ isActive }: {isActive: boolean;}) =>
  `relative rounded-full px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${
  isActive ? "bg-forest-50 text-forest-700" : "text-ink-soft hover:text-ink"}`;


  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/95 backdrop-blur print:hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8">
        <Link to="/" className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500" aria-label="Aurelle Stays home">
          <BrandMark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) =>
          <NavLink key={item.to} to={item.to} className={navLinkClass} end={item.to === "/"}>
              {item.label}
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
            `relative grid h-10 w-10 place-items-center rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${
            isActive ? "bg-forest-50 text-forest-700" : "text-ink hover:bg-sand-100"}`

            }
            aria-label={`Favorites, ${count} saved`}>
            
            <HeartIcon className="h-5 w-5" aria-hidden="true" />
            {count > 0 &&
            <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-gold-500 px-1 text-[11px] font-semibold tabular-nums text-ink">
                {count}
              </span>
            }
          </NavLink>
          <NavLink to="/bookings" className={(state) => `hidden md:inline-flex ${navLinkClass(state)}`}>
            My Bookings
          </NavLink>

          {user ?
          <div ref={accountRef} className="relative hidden md:block">
              <button
              type="button"
              onClick={() => setAccountOpen((open) => !open)}
              aria-expanded={accountOpen}
              aria-haspopup="menu"
              className="flex h-10 items-center gap-2 rounded-full border border-sand-300 bg-white pl-1.5 pr-3 text-sm font-medium text-ink transition-colors hover:border-forest-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
              
                <span className="grid h-7 w-7 place-items-center rounded-full bg-forest-700 text-xs font-semibold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[8rem] truncate">{user.name.split(" ")[0]}</span>
                <ChevronDownIcon className="h-4 w-4 text-ink-muted" aria-hidden="true" />
              </button>
              <AnimatePresence>
                {accountOpen &&
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                className="absolute right-0 mt-2 w-60 origin-top-right rounded-2xl border border-sand-200 bg-white p-1.5 shadow-lift">
                
                    <div className="px-3 py-2.5">
                      <p className="truncate text-sm font-medium text-ink">{user.name}</p>
                      <p className="truncate text-xs text-ink-muted">{user.email} · demo account</p>
                    </div>
                    <Link role="menuitem" to="/bookings" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-sand-100">
                      <CalendarCheckIcon className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                      My Bookings
                    </Link>
                    <Link role="menuitem" to="/favorites" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-sand-100">
                      <HeartIcon className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                      Favorites
                    </Link>
                    <button
                  role="menuitem"
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-ink hover:bg-sand-100">
                  
                      <LogOutIcon className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                      Sign out
                    </button>
                  </motion.div>
              }
              </AnimatePresence>
            </div> :

          <div className="hidden items-center gap-1 md:flex">
              <Link to="/sign-in" className={buttonClasses("ghost", "sm")}>
                <UserIcon className="h-4 w-4" aria-hidden="true" />
                Sign in
              </Link>
              <Link to="/sign-up" className={buttonClasses("primary", "sm")}>
                Sign up
              </Link>
            </div>
          }

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-sand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation">
            
            <MenuIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} onSignOut={handleSignOut} />
    </header>);

}