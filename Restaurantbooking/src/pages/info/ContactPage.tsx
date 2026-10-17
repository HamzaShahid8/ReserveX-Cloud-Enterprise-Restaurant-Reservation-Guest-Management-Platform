import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2Icon, ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button";
import { Field, fieldA11y, inputClasses } from "../../components/ui/Field";
import { wait } from "../../utils/booking";
import { type ContactValues, contactSchema } from "../../utils/validation";

export function ContactPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", subject: "", message: "" }
  });
  const messageLength = watch("message").length;

  const onSubmit = async (values: ContactValues) => {
    await wait(1000);
    setSentTo(values.email);
    toast.success("Message sent (demo)");
    reset();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <h1 className="font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">Contact us</h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
            Questions about a hotel, a booking, or something else? Our team usually replies within one business day.
          </p>
          <ul className="mt-10 space-y-6">
            <li className="flex gap-4">
              <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-ink">Email</p>
                <a href="mailto:hello@aurellestays.com" className="text-sm text-forest-700 underline-offset-4 hover:underline">
                  hello@aurellestays.com
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-ink">Phone</p>
                <a href="tel:+351210000000" className="text-sm text-forest-700 underline-offset-4 hover:underline">
                  +351 21 000 0000
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-ink">Hours</p>
                <p className="text-sm text-ink-soft">Monday–Saturday, 8:00–20:00 WET</p>
              </div>
            </li>
            <li className="flex gap-4">
              <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-ink">Office</p>
                <p className="text-sm text-ink-soft">Rua Augusta 120, 1100-053 Lisboa, Portugal</p>
              </div>
            </li>
          </ul>
          <div className="mt-10 border-t border-sand-200 pt-6">
            <p className="text-sm text-ink">Looking for a quick answer?</p>
            <p className="mt-1 text-sm text-ink-soft">
              Most questions about{" "}
              <Link to="/faq" className="font-medium text-forest-700 underline underline-offset-2">
                reservations, cancellations, payments, and check-in
              </Link>{" "}
              are covered in our FAQ.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-sand-200 bg-white p-6 shadow-card md:p-10">
          {sentTo ?
          <div role="status" className="py-10 text-center">
              <CheckCircle2Icon className="mx-auto h-12 w-12 text-forest-600" aria-hidden="true" />
              <h2 className="mt-4 font-display text-2xl font-medium text-ink">Thanks — we've got your message</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
                In a live site we'd reply to {sentTo}. This demo doesn't send messages anywhere.
              </p>
              <Button variant="outline" className="mt-6" onClick={() => setSentTo(null)}>
                Send another message
              </Button>
            </div> :

          <form onSubmit={handleSubmit(onSubmit)} noValidate aria-labelledby="contact-form-title">
              <h2 id="contact-form-title" className="font-display text-2xl font-medium text-ink">
                Send us a message
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field id="contact-name" label="Name" required error={errors.name?.message}>
                  <input {...register("name")} {...fieldA11y("contact-name", errors.name?.message)} autoComplete="name" className={inputClasses(!!errors.name)} />
                </Field>
                <Field id="contact-email" label="Email" required error={errors.email?.message}>
                  <input
                  {...register("email")}
                  {...fieldA11y("contact-email", errors.email?.message)}
                  type="email"
                  autoComplete="email"
                  className={inputClasses(!!errors.email)} />
                
                </Field>
                <Field id="contact-subject" label="Subject" required error={errors.subject?.message} className="sm:col-span-2">
                  <input {...register("subject")} {...fieldA11y("contact-subject", errors.subject?.message)} className={inputClasses(!!errors.subject)} />
                </Field>
                <Field
                id="contact-message"
                label="Message"
                required
                error={errors.message?.message}
                hint={`${messageLength}/1000 characters`}
                className="sm:col-span-2">
                
                  <textarea
                  {...register("message")}
                  {...fieldA11y("contact-message", errors.message?.message, "hint")}
                  rows={6}
                  className={inputClasses(!!errors.message, "h-auto py-3")} />
                
                </Field>
              </div>
              <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto" loading={isSubmitting}>
                {isSubmitting ? "Sending…" : "Send message"}
              </Button>
            </form>
          }
        </div>
      </div>
    </div>);

}