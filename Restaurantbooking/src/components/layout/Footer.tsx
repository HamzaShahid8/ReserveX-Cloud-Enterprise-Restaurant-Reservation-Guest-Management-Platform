import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRightIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { footerNav } from "./navigation";

const socials = [
{ label: "Instagram", href: "https://www.instagram.com" },
{ label: "Facebook", href: "https://www.facebook.com" },
{ label: "LinkedIn", href: "https://www.linkedin.com" }];


export function Footer() {
  return (
    <footer className="bg-forest-900 text-forest-100 print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <BrandMark tone="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-forest-200">
              Handpicked hotels in the places worth travelling for, with honest prices and flexible rates.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <MapPinIcon className="h-4 w-4 text-gold-400" aria-hidden="true" />
                Rua Augusta 120, 1100-053 Lisboa, Portugal
              </li>
              <li>
                <a href="tel:+351210000000" className="flex items-center gap-3 hover:text-white">
                  <PhoneIcon className="h-4 w-4 text-gold-400" aria-hidden="true" />
                  +351 21 000 0000
                </a>
              </li>
              <li>
                <a href="mailto:hello@aurellestays.com" className="flex items-center gap-3 hover:text-white">
                  <MailIcon className="h-4 w-4 text-gold-400" aria-hidden="true" />
                  hello@aurellestays.com
                </a>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNav.map((group) =>
            <div key={group.title}>
                <h2 className="text-sm font-semibold text-white">{group.title}</h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) =>
                <li key={link.to}>
                      <Link
                    to={link.to}
                    className="text-sm text-forest-200 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
                    
                        {link.label}
                      </Link>
                    </li>
                )}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-6 border-t border-forest-800 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-forest-200">
            © 2026 Aurelle Stays. A frontend demonstration — hotels, prices, and bookings are simulated.
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Social media">
            {socials.map(({ label, href }) =>
            <li key={label}>
                <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${label} (opens in a new tab)`}
                className="inline-flex h-9 items-center gap-1 rounded-full border border-forest-700 px-3.5 text-xs font-medium text-forest-100 transition-colors duration-150 hover:border-gold-400 hover:text-gold-400">
                
                  {label}
                  <ArrowUpRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </footer>);

}