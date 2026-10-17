import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { PasswordInput } from "../../components/auth/PasswordInput";
import { PasswordStrengthMeter } from "../../components/auth/PasswordStrengthMeter";
import { Button } from "../../components/ui/Button";
import { Field, fieldA11y, inputClasses } from "../../components/ui/Field";
import { useAuth } from "../../contexts/AuthContext";
import { type SignUpValues, signUpSchema } from "../../utils/validation";

export function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", acceptTerms: false }
  });
  const password = watch("password");

  const onSubmit = async (values: SignUpValues) => {
    setFormError(null);
    try {
      await signUp(values.name, values.email);
      toast.success("Demo account created — you're signed in");
      navigate("/");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Couldn't create the account. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Save favorites and keep your demo bookings in one place."
      footer={
      <>
          Already have an account?{" "}
          <Link to="/sign-in" className="font-medium text-forest-700 underline underline-offset-2">
            Sign in
          </Link>
        </>
      }>
      
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {formError &&
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger-50 p-3 text-sm font-medium text-danger-700">
            <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {formError}
          </p>
        }
        <Field id="signup-name" label="Full name" error={errors.name?.message}>
          <input {...register("name")} {...fieldA11y("signup-name", errors.name?.message)} autoComplete="name" className={inputClasses(!!errors.name)} />
        </Field>
        <Field id="signup-email" label="Email" error={errors.email?.message}>
          <input
            {...register("email")}
            {...fieldA11y("signup-email", errors.email?.message)}
            type="email"
            autoComplete="email"
            className={inputClasses(!!errors.email)} />
          
        </Field>
        <Field id="signup-password" label="Password" error={errors.password?.message}>
          <PasswordInput id="signup-password" registration={register("password")} error={errors.password?.message} autoComplete="new-password" />
          <PasswordStrengthMeter password={password} />
        </Field>
        <Field id="signup-confirm" label="Confirm password" error={errors.confirmPassword?.message}>
          <PasswordInput id="signup-confirm" registration={register("confirmPassword")} error={errors.confirmPassword?.message} autoComplete="new-password" />
        </Field>
        <div>
          <label htmlFor="signup-terms" className="flex cursor-pointer items-start gap-2 text-sm text-ink">
            <input
              id="signup-terms"
              type="checkbox"
              {...register("acceptTerms")}
              aria-invalid={errors.acceptTerms ? true : undefined}
              aria-describedby={errors.acceptTerms ? "signup-terms-error" : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 rounded accent-forest-700" />
            
            <span>
              I agree to the{" "}
              <Link to="/legal/terms" className="font-medium text-forest-700 underline underline-offset-2">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/legal/privacy" className="font-medium text-forest-700 underline underline-offset-2">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.acceptTerms &&
          <p id="signup-terms-error" className="mt-1.5 flex items-center gap-1 pl-6 text-xs font-medium text-danger-600">
              <AlertCircleIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {errors.acceptTerms.message}
            </p>
          }
        </div>
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>);

}