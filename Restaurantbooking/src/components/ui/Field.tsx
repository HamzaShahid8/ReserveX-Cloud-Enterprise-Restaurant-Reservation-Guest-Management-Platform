import React from "react";
import { AlertCircleIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Field({ id, label, error, hint, required, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required &&
        <span className="text-danger-600" aria-hidden="true">
            {" "}
            *
          </span>
        }
      </label>
      {children}
      {hint && !error &&
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      }
      {error &&
      <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1 text-xs font-medium text-danger-600">
          <AlertCircleIcon className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      }
    </div>);

}

export function inputClasses(hasError?: boolean, className?: string): string {
  return twMerge(
    "block h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-ink placeholder:text-ink-muted transition-[border-color,box-shadow] duration-150 ease-out focus:outline-none focus:ring-4 disabled:bg-sand-100",
    hasError ? "border-danger-600 focus:ring-danger-600/15" : "border-sand-300 focus:border-forest-700 focus:ring-forest-700/10",
    className
  );
}

export function fieldA11y(id: string, error?: string, hint?: string) {
  const describedBy = [error ? `${id}-error` : null, hint && !error ? `${id}-hint` : null].filter(Boolean).join(" ");
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined
  } as const;
}