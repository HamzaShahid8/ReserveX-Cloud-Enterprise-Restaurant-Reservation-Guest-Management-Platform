import React from "react";

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
}

export function RangeSlider({ label, min, max, step, value, onChange, formatValue = String }: RangeSliderProps) {
  const [low, high] = value;
  const percent = (current: number) => (current - min) / (max - min) * 100;

  return (
    <div>
      <div className="relative h-6">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-sand-200" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-forest-700"
          style={{ left: `${percent(low)}%`, right: `${100 - percent(high)}%` }} />
        
        <input
          type="range"
          className="range-input"
          min={min}
          max={max}
          step={step}
          value={low}
          aria-label={`Minimum ${label}`}
          aria-valuetext={formatValue(low)}
          style={{ zIndex: low > max - (max - min) * 0.1 ? 5 : 3 }}
          onChange={(event) => onChange([Math.min(Number(event.target.value), high - step), high])} />
        
        <input
          type="range"
          className="range-input"
          min={min}
          max={max}
          step={step}
          value={high}
          aria-label={`Maximum ${label}`}
          aria-valuetext={formatValue(high)}
          style={{ zIndex: 4 }}
          onChange={(event) => onChange([low, Math.max(Number(event.target.value), low + step)])} />
        
      </div>
      <div className="mt-2 flex justify-between text-sm tabular-nums text-ink-soft">
        <span>{formatValue(low)}</span>
        <span>
          {formatValue(high)}
          {high >= max ? "+" : ""}
        </span>
      </div>
    </div>);

}