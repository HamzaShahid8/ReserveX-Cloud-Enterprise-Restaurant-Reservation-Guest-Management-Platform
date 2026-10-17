import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { toast } from "sonner";
import { usePersistentState } from "../../hooks/usePersistentState";
import { wait } from "../../utils/booking";
import { type NewsletterValues, newsletterSchema } from "../../utils/validation";
import { Button } from "../ui/Button";

export function Newsletter() {
  const [subscribers, setSubscribers] = usePersistentState<string[]>("aurelle.newsletter", []);
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema), defaultValues: { email: "" } });

  const onSubmit = async ({ email }: NewsletterValues) => {
    await wait(700);
    const normalized = email.toLowerCase();
    if (subscribers.includes(normalized)) {
      toast(`${normalized} is already on the list`);
    } else {
      setSubscribers((list) => [...list, normalized]);
      toast.success("You're subscribed (demo)");
    }
    setSubscribedEmail(normalized);
    reset();
  };

  return (
    <section aria-labelledby="newsletter-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid items-center gap-8 rounded-3xl bg-forest-700 px-6 py-12 sm:px-12 lg:grid-cols-2">
        <div>
          <h2 id="newsletter-title" className="font-display text-3xl font-medium text-white">
            Quiet season deals, once a month
          </h2>
          <p className="mt-2 text-forest-100">New hotels and member-only codes. No spam, unsubscribe anytime.</p>
        </div>
        {subscribedEmail ?
        <div role="status" className="flex items-start gap-3 rounded-2xl bg-forest-800 p-5 text-white">
            <CheckCircle2Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" aria-hidden="true" />
            <div>
              <p className="font-medium">Thanks — {subscribedEmail} is subscribed.</p>
              <p className="mt-1 text-sm text-forest-100">This demo saves your email in this browser only.</p>
              <button type="button" onClick={() => setSubscribedEmail(null)} className="mt-2 text-sm font-medium text-gold-400 underline-offset-4 hover:underline">
                Subscribe another email
              </button>
            </div>
          </div> :

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "newsletter-error" : undefined}
              {...register("email")}
              className="h-12 flex-1 rounded-full border-0 bg-white px-5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-4 focus:ring-gold-400/40" />
            
              <Button type="submit" variant="secondary" size="lg" loading={isSubmitting}>
                Subscribe
              </Button>
            </div>
            {errors.email &&
          <p id="newsletter-error" className="mt-2 flex items-center gap-1.5 px-2 text-sm font-medium text-gold-100">
                <AlertCircleIcon className="h-4 w-4" aria-hidden="true" />
                {errors.email.message}
              </p>
          }
          </form>
        }
      </div>
    </section>);

}