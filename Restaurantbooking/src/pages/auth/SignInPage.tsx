import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { PasswordInput } from "../../components/auth/PasswordInput";
import { Button } from "../../components/ui/Button";
import { Field, fieldA11y, inputClasses } from "../../components/ui/Field";
import { useAuth } from "../../contexts/AuthContext";
import { type SignInValues, signInSchema } from "../../utils/validation";

export function SignInPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", remember: true }
  });

  const onSubmit = async (values: SignInValues) => {
    setFormError(null);
    try {
      await signIn(values.email, values.remember);
      toast.success("Signed in to your demo account");
      navigate("/bookings");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Sign-in failed. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to see your demo bookings and saved hotels."
      footer={
      <>
          New to Aurelle?{" "}
          <Link to="/sign-up" className="font-medium text-forest-700 underline underline-offset-2">
            Create an account
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
        <Field id="signin-email" label="Email" error={errors.email?.message} hint="Try demo@aurelle.com">
          <input
            {...register("email")}
            {...fieldA11y("signin-email", errors.email?.message, "hint")}
            type="email"
            autoComplete="email"
            className={inputClasses(!!errors.email)} />
          
        </Field>
        <Field id="signin-password" label="Password" error={errors.password?.message} hint="Any password with 8+ characters">
          <PasswordInput id="signin-password" registration={register("password")} error={errors.password?.message} hint="hint" autoComplete="current-password" />
        </Field>
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="remember" className="flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input id="remember" type="checkbox" {...register("remember")} className="h-4 w-4 rounded accent-forest-700" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-forest-700 underline-offset-4 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthLayout>);

}