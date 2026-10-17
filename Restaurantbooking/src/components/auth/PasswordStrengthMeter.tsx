import React from "react";
import { getPasswordStrength } from "../../utils/validation";

const barColors = ["bg-danger-600", "bg-danger-600", "bg-gold-500", "bg-forest-500", "bg-forest-700"];

export function PasswordStrengthMeter({ password }: {password: string;}) {
  const { score, label } = getPasswordStrength(password);

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((segment) =>
        <span
          key={segment}
          className={`h-1 flex-1 rounded-full transition-colors duration-200 ${password && segment <= Math.max(score, 1) ? barColors[score] : "bg-sand-200"}`} />

        )}
      </div>
      <p className="mt-1.5 text-xs text-ink-muted">
        Password strength: <span className="font-medium text-ink">{label}</span>
        {password && score < 3 ? " — try 12+ characters with a mix of cases, numbers and symbols" : ""}
      </p>
    </div>);

}