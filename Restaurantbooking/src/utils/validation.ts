import { z } from "zod";

const email = z.string().trim().min(1, "Enter your email address").email("Enter a valid email, like name@example.com");

export const guestSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name").max(50, "Keep it under 50 characters"),
  lastName: z.string().trim().min(1, "Enter your last name").max(50, "Keep it under 50 characters"),
  email,
  phone: z.
  string().
  trim().
  min(1, "Enter your phone number").
  regex(/^\+?[0-9\s\-()]+$/, "Use digits, spaces, dashes, or a leading +").
  refine((value) => {
    const digits = value.replace(/\D/g, "").length;
    return digits >= 7 && digits <= 15;
  }, "Phone numbers need 7–15 digits"),
  country: z.string().min(1, "Select your country"),
  specialRequests: z.string().max(500, "Keep requests under 500 characters").optional()
});
export type GuestFormValues = z.infer<typeof guestSchema>;

function isFutureExpiry(value: string): boolean {
  const [mm, yy] = value.split("/").map(Number);
  if (!mm || Number.isNaN(yy)) return false;
  const firstDayAfterExpiry = new Date(2000 + yy, mm, 1);
  return firstDayAfterExpiry > new Date();
}

export const paymentSchema = z.object({
  cardholderName: z.string().trim().min(2, "Enter the name shown on the card"),
  cardNumber: z.string().refine((value) => /^\d{16}$/.test(value.replace(/\s/g, "")), "Enter a 16-digit test card number"),
  expiry: z.
  string().
  regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format").
  refine(isFutureExpiry, "This expiry date has passed"),
  cvv: z.string().regex(/^\d{3,4}$/, "Enter a 3 or 4 digit CVV"),
  billingAddress: z.string().trim().min(5, "Enter your billing street address"),
  city: z.string().trim().min(2, "Enter your city"),
  postalCode: z.string().trim().min(3, "Enter a postal code").max(10, "Postal codes are 10 characters or fewer"),
  acceptTerms: z.boolean().refine((value) => value, "Please accept the terms to confirm your booking")
});
export type PaymentFormValues = z.infer<typeof paymentSchema>;

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password").min(8, "Passwords are at least 8 characters"),
  remember: z.boolean()
});
export type SignInValues = z.infer<typeof signInSchema>;

export const signUpSchema = z.
object({
  name: z.string().trim().min(2, "Enter your full name"),
  email,
  password: z.
  string().
  min(8, "Use at least 8 characters").
  regex(/[A-Za-z]/, "Include at least one letter").
  regex(/\d/, "Include at least one number"),
  confirmPassword: z.string().min(1, "Confirm your password"),
  acceptTerms: z.boolean().refine((value) => value, "Please accept the terms to create an account")
}).
refine((values) => values.password === values.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
export type SignUpValues = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({ email });
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email,
  subject: z.string().trim().min(3, "Add a short subject"),
  message: z.string().trim().min(20, "Tell us a little more (20 characters minimum)").max(1000, "Keep it under 1,000 characters")
});
export type ContactValues = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({ email });
export type NewsletterValues = z.infer<typeof newsletterSchema>;

export interface PasswordStrength {
  score: number;
  label: string;
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: "Enter a password" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] };
}