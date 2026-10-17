import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { countries } from "../../data/countries";
import type { Guest } from "../../types/booking";
import { type GuestFormValues, guestSchema } from "../../utils/validation";
import { Button } from "../ui/Button";
import { Field, fieldA11y, inputClasses } from "../ui/Field";

interface GuestInfoStepProps {
  defaultValues: Partial<Guest>;
  onDraftChange: (values: Partial<Guest>) => void;
  onSubmit: (guest: Guest) => void;
}

export function GuestInfoStep({ defaultValues, onDraftChange, onSubmit }: GuestInfoStepProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: defaultValues.firstName ?? "",
      lastName: defaultValues.lastName ?? "",
      email: defaultValues.email ?? "",
      phone: defaultValues.phone ?? "",
      country: defaultValues.country ?? "",
      specialRequests: defaultValues.specialRequests ?? ""
    }
  });

  useEffect(() => {
    const subscription = watch((values) => onDraftChange(values as Partial<Guest>));
    return () => subscription.unsubscribe();
  }, [watch, onDraftChange]);

  const requestLength = watch("specialRequests")?.length ?? 0;

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} noValidate aria-labelledby="guest-step-title">
      <h2 id="guest-step-title" className="font-display text-2xl font-medium text-ink">
        Who's checking in?
      </h2>
      <p className="mt-1 text-sm text-ink-soft">We'll send the demo confirmation to this email. Fields marked * are required.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id="firstName" label="First name" required error={errors.firstName?.message}>
          <input {...register("firstName")} {...fieldA11y("firstName", errors.firstName?.message)} autoComplete="given-name" className={inputClasses(!!errors.firstName)} />
        </Field>
        <Field id="lastName" label="Last name" required error={errors.lastName?.message}>
          <input {...register("lastName")} {...fieldA11y("lastName", errors.lastName?.message)} autoComplete="family-name" className={inputClasses(!!errors.lastName)} />
        </Field>
        <Field id="email" label="Email" required error={errors.email?.message}>
          <input {...register("email")} {...fieldA11y("email", errors.email?.message)} type="email" autoComplete="email" placeholder="name@example.com" className={inputClasses(!!errors.email)} />
        </Field>
        <Field id="phone" label="Phone number" required error={errors.phone?.message} hint="Include your country code, e.g. +44 20 7946 0958">
          <input
            {...register("phone")}
            {...fieldA11y("phone", errors.phone?.message, "hint")}
            type="tel"
            autoComplete="tel"
            placeholder="+1 555 010 0199"
            className={inputClasses(!!errors.phone)} />
          
        </Field>
        <Field id="country" label="Country of residence" required error={errors.country?.message} className="sm:col-span-2">
          <select {...register("country")} {...fieldA11y("country", errors.country?.message)} autoComplete="country-name" className={inputClasses(!!errors.country)}>
            <option value="">Select a country</option>
            {countries.map((country) =>
            <option key={country} value={country}>
                {country}
              </option>
            )}
          </select>
        </Field>
        <Field
          id="specialRequests"
          label="Special requests (optional)"
          error={errors.specialRequests?.message}
          hint={`Early check-in, dietary needs, accessibility… ${requestLength}/500`}
          className="sm:col-span-2">
          
          <textarea
            {...register("specialRequests")}
            {...fieldA11y("specialRequests", errors.specialRequests?.message, "hint")}
            rows={4}
            className={inputClasses(!!errors.specialRequests, "h-auto py-3")} />
          
        </Field>
      </div>

      <div className="mt-8 flex justify-end">
        <Button type="submit" size="lg">
          Continue to review
        </Button>
      </div>
    </form>);

}