import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, FlaskConicalIcon, LockIcon } from "lucide-react";
import type { PriceBreakdown } from "../../types/booking";
import { formatMoney } from "../../utils/format";
import type { PromoResult } from "../../utils/pricing";
import { type PaymentFormValues, paymentSchema } from "../../utils/validation";
import { Button } from "../ui/Button";
import { Field, fieldA11y, inputClasses } from "../ui/Field";
import { PriceSummary } from "./PriceSummary";
import { PromoCodeInput } from "./PromoCodeInput";

interface PaymentStepProps {
  price: PriceBreakdown;
  appliedPromo: string | null;
  defaultCardholder: string;
  onApplyPromo: (code: string) => PromoResult;
  onRemovePromo: () => void;
  onBack: () => void;
  onConfirm: () => Promise<void>;
}

const DECLINE_TEST_CARD = "4000000000000002";

function formatCardNumber(value: string): string {
  return value.
  replace(/\D/g, "").
  slice(0, 16).
  replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function PaymentStep({ price, appliedPromo, defaultCardholder, onApplyPromo, onRemovePromo, onBack, onConfirm }: PaymentStepProps) {
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    mode: "onTouched",
    defaultValues: {
      cardholderName: defaultCardholder,
      cardNumber: "",
      expiry: "",
      cvv: "",
      billingAddress: "",
      city: "",
      postalCode: "",
      acceptTerms: false
    }
  });

  const cardField = register("cardNumber");
  const expiryField = register("expiry");
  const cvvField = register("cvv");

  const submit = async (values: PaymentFormValues) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setPaymentError(null);
    setProcessing(true);
    // Card details are only checked locally to choose a mock outcome; they are never stored or sent.
    const declined = values.cardNumber.replace(/\s/g, "") === DECLINE_TEST_CARD;
    if (declined) {
      await new Promise((resolve) => window.setTimeout(resolve, 1200));
      setPaymentError("The demo payment was declined (test card 4000 0000 0000 0002). Try 4242 4242 4242 4242 instead.");
      setProcessing(false);
      submittingRef.current = false;
      return;
    }
    try {
      await onConfirm();
    } catch {
      setPaymentError("Something went wrong while confirming the demo booking. Please try again.");
      setProcessing(false);
      submittingRef.current = false;
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate aria-labelledby="payment-step-title">
      <h2 id="payment-step-title" className="font-display text-2xl font-medium text-ink">
        Demo payment
      </h2>
      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-gold-100 bg-gold-50 p-4 text-sm text-ink">
        <FlaskConicalIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
        <div>
          <p className="font-semibold">This is a test checkout. No real payment is processed.</p>
          <p className="mt-1 text-ink-soft">
            Don't enter real card details. Use <span className="font-mono font-medium text-ink">4242 4242 4242 4242</span> with any future
            expiry and any CVV. Use <span className="font-mono font-medium text-ink">4000 0000 0000 0002</span> to simulate a decline.
          </p>
        </div>
      </div>

      <fieldset disabled={processing} className="mt-6">
        <legend className="text-base font-semibold text-ink">Test card</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field id="cardholderName" label="Cardholder name" required error={errors.cardholderName?.message} className="sm:col-span-2">
            <input {...register("cardholderName")} {...fieldA11y("cardholderName", errors.cardholderName?.message)} autoComplete="off" className={inputClasses(!!errors.cardholderName)} />
          </Field>
          <Field id="cardNumber" label="Test card number" required error={errors.cardNumber?.message} className="sm:col-span-2">
            <input
              {...cardField}
              {...fieldA11y("cardNumber", errors.cardNumber?.message)}
              onChange={(event) => {
                event.target.value = formatCardNumber(event.target.value);
                cardField.onChange(event);
              }}
              inputMode="numeric"
              autoComplete="off"
              placeholder="4242 4242 4242 4242"
              className={inputClasses(!!errors.cardNumber, "font-mono tracking-wide")} />
            
          </Field>
          <Field id="expiry" label="Expiry (MM/YY)" required error={errors.expiry?.message}>
            <input
              {...expiryField}
              {...fieldA11y("expiry", errors.expiry?.message)}
              onChange={(event) => {
                event.target.value = formatExpiry(event.target.value);
                expiryField.onChange(event);
              }}
              inputMode="numeric"
              autoComplete="off"
              placeholder="12/28"
              className={inputClasses(!!errors.expiry, "font-mono")} />
            
          </Field>
          <Field id="cvv" label="CVV" required error={errors.cvv?.message}>
            <input
              {...cvvField}
              {...fieldA11y("cvv", errors.cvv?.message)}
              onChange={(event) => {
                event.target.value = event.target.value.replace(/\D/g, "").slice(0, 4);
                cvvField.onChange(event);
              }}
              inputMode="numeric"
              autoComplete="off"
              placeholder="123"
              className={inputClasses(!!errors.cvv, "font-mono")} />
            
          </Field>
        </div>
      </fieldset>

      <fieldset disabled={processing} className="mt-8">
        <legend className="text-base font-semibold text-ink">Billing address</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field id="billingAddress" label="Street address" required error={errors.billingAddress?.message} className="sm:col-span-2">
            <input {...register("billingAddress")} {...fieldA11y("billingAddress", errors.billingAddress?.message)} autoComplete="street-address" className={inputClasses(!!errors.billingAddress)} />
          </Field>
          <Field id="city" label="City" required error={errors.city?.message}>
            <input {...register("city")} {...fieldA11y("city", errors.city?.message)} autoComplete="address-level2" className={inputClasses(!!errors.city)} />
          </Field>
          <Field id="postalCode" label="Postal code" required error={errors.postalCode?.message}>
            <input {...register("postalCode")} {...fieldA11y("postalCode", errors.postalCode?.message)} autoComplete="postal-code" className={inputClasses(!!errors.postalCode)} />
          </Field>
        </div>
      </fieldset>

      <div className="mt-8 border-t border-sand-200 pt-6">
        <PromoCodeInput appliedCode={appliedPromo} onApply={onApplyPromo} onRemove={onRemovePromo} disabled={processing} />
      </div>

      <div className="mt-6 rounded-2xl bg-sand-100 p-5">
        <PriceSummary price={price} />
      </div>

      <div className="mt-6">
        <label htmlFor="acceptTerms" className="flex cursor-pointer items-start gap-3 text-sm text-ink">
          <input
            {...register("acceptTerms")}
            {...fieldA11y("acceptTerms", errors.acceptTerms?.message)}
            type="checkbox"
            disabled={processing}
            className="mt-0.5 h-4 w-4 shrink-0 rounded accent-forest-700" />
          
          <span>
            I agree to the{" "}
            <Link to="/legal/terms" target="_blank" className="font-medium text-forest-700 underline underline-offset-2">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link to="/legal/cancellation" target="_blank" className="font-medium text-forest-700 underline underline-offset-2">
              Cancellation Policy
            </Link>
            , and understand this is a demo booking.
          </span>
        </label>
        {errors.acceptTerms &&
        <p id="acceptTerms-error" className="mt-1.5 flex items-center gap-1 pl-7 text-xs font-medium text-danger-600">
            <AlertCircleIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {errors.acceptTerms.message}
          </p>
        }
      </div>

      {paymentError &&
      <p role="alert" className="mt-6 flex items-start gap-2 rounded-xl bg-danger-50 p-4 text-sm font-medium text-danger-700">
          <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {paymentError}
        </p>
      }

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="outline" size="lg" onClick={onBack} disabled={processing}>
          Back
        </Button>
        <Button type="submit" size="lg" loading={processing}>
          {processing ?
          "Confirming booking…" :

          <>
              <LockIcon className="h-4 w-4" aria-hidden="true" />
              Confirm booking · {formatMoney(price.total)}
            </>
          }
        </Button>
      </div>
    </form>);

}