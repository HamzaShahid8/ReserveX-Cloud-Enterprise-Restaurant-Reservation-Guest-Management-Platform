import React from "react";
import { FlaskConicalIcon } from "lucide-react";
import { images } from "../../data/images";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-2 lg:px-8">
      <div className="mx-auto w-full max-w-md lg:mx-0 lg:justify-self-center">
        <h1 className="font-display text-4xl font-medium tracking-tight text-ink">{title}</h1>
        <p className="mt-2 text-sm text-ink-soft">{description}</p>
        <p className="mt-5 flex items-start gap-2 rounded-xl border border-gold-100 bg-gold-50 p-3 text-xs text-ink">
          <FlaskConicalIcon className="mt-px h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
          Mock authentication for this demo. Accounts are stored in your browser only — not a secure, real account. Passwords are never saved.
        </p>
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-8 border-t border-sand-200 pt-6 text-sm text-ink-soft">{footer}</div>}
      </div>
      <div className="hidden overflow-hidden rounded-3xl lg:block">
        <img src={images.terrace} alt="" className="h-full max-h-[680px] w-full object-cover" />
      </div>
    </div>);

}