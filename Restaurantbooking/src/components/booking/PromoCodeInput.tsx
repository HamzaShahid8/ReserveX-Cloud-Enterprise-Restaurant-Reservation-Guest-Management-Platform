import React, { useId, useState } from "react";
import { CheckCircle2Icon, TagIcon, XIcon } from "lucide-react";
import type { PromoResult } from "../../utils/pricing";
import { Button } from "../ui/Button";
import { inputClasses } from "../ui/Field";

interface PromoCodeInputProps {
  appliedCode: string | null;
  onApply: (code: string) => PromoResult;
  onRemove: () => void;
  disabled?: boolean;
}

export function PromoCodeInput({ appliedCode, onApply, onRemove, disabled }: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{tone: "error" | "success";text: string;} | null>(null);
  const inputId = useId();

  const apply = () => {
    const result = onApply(code);
    setMessage({ tone: result.ok ? "success" : "error", text: result.message });
    if (result.ok) setCode("");
  };

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
        Promo code
      </label>
      {appliedCode &&
      <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-forest-50 px-3.5 py-2.5 text-sm">
          <span className="flex items-center gap-2 font-medium text-forest-700">
            <TagIcon className="h-4 w-4" aria-hidden="true" />
            {appliedCode} applied
          </span>
          <button
          type="button"
          onClick={() => {
            onRemove();
            setMessage(null);
          }}
          disabled={disabled}
          className="flex items-center gap-1 text-xs font-medium text-ink-soft hover:text-ink"
          aria-label={`Remove promo code ${appliedCode}`}>
          
            <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Remove
          </button>
        </div>
      }
      <div className="flex gap-2">
        <input
          id={inputId}
          value={code}
          onChange={(event) => {
            setCode(event.target.value.toUpperCase());
            setMessage(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              apply();
            }
          }}
          placeholder="e.g. WELCOME10"
          disabled={disabled}
          aria-describedby={message ? `${inputId}-message` : `${inputId}-hint`}
          aria-invalid={message?.tone === "error" || undefined}
          className={inputClasses(message?.tone === "error", "uppercase placeholder:normal-case")} />
        
        <Button variant="outline" onClick={apply} disabled={disabled || !code.trim()}>
          Apply
        </Button>
      </div>
      {message ?
      <p
        id={`${inputId}-message`}
        role="status"
        className={`mt-1.5 flex items-start gap-1 text-xs font-medium ${message.tone === "error" ? "text-danger-600" : "text-forest-600"}`}>
        
          {message.tone === "success" && <CheckCircle2Icon className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
          {message.text}
        </p> :

      <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-ink-muted">
          Demo codes: WELCOME10, EARLY15, ALPS100, BALI20. One code per booking.
        </p>
      }
    </div>);

}