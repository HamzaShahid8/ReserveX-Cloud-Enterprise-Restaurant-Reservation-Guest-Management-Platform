import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheckIcon } from "lucide-react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { Button, buttonClasses } from "../../components/ui/Button";
import { Field, fieldA11y, inputClasses } from "../../components/ui/Field";
import { useAuth } from "../../contexts/AuthContext";
import { type ForgotPasswordValues, forgotPasswordSchema } from "../../utils/validation";

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: "" } });

  const onSubmit = async ({ email }: ForgotPasswordValues) => {
    await requestPasswordReset(email);
    setSentTo(email);
  };

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter the email for your account and we'll send reset instructions."
      footer={
      <Link to="/sign-in" className="font-medium text-forest-700 underline underline-offset-2">
          Back to sign in
        </Link>
      }>
      
      {sentTo ?
      <div role="status" className="rounded-2xl border border-sand-200 bg-white p-6">
          <MailCheckIcon className="h-8 w-8 text-forest-600" aria-hidden="true" />
          <h2 className="mt-4 font-display text-xl font-medium text-ink">Check your inbox</h2>
          <p className="mt-2 text-sm text-ink-soft">
            If an account exists for <span className="font-medium text-ink">{sentTo}</span>, a reset link would be sent. This is a demo, so no
            email is actually delivered.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/sign-in" className={buttonClasses("primary", "sm")}>
              Return to sign in
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setSentTo(null)}>
              Use a different email
            </Button>
          </div>
        </div> :

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <Field id="forgot-email" label="Email" error={errors.email?.message}>
            <input
            {...register("email")}
            {...fieldA11y("forgot-email", errors.email?.message)}
            type="email"
            autoComplete="email"
            className={inputClasses(!!errors.email)} />
          
          </Field>
          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      }
    </AuthLayout>);

}