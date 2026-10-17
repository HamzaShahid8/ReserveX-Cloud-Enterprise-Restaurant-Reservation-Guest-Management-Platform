import React, { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { fieldA11y, inputClasses } from "../ui/Field";

interface PasswordInputProps {
  id: string;
  registration: UseFormRegisterReturn;
  error?: string;
  hint?: string;
  autoComplete: "current-password" | "new-password";
}

export function PasswordInput({ id, registration, error, hint, autoComplete }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...registration}
        {...fieldA11y(id, error, hint)}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        className={inputClasses(!!error, "pr-12")} />
      
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink-muted transition-colors hover:bg-sand-100 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        aria-controls={id}>
        
        {visible ? <EyeOffIcon className="h-4 w-4" aria-hidden="true" /> : <EyeIcon className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>);

}