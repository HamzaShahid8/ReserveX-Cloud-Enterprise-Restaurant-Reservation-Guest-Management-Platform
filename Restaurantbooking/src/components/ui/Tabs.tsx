import React, { useRef } from "react";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel: string;
  idPrefix: string;
}

export function Tabs({ tabs, value, onChange, ariaLabel, idPrefix }: TabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    let next = -1;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next >= 0) {
      event.preventDefault();
      refs.current[next]?.focus();
      onChange(tabs[next].id);
    }
  };

  return (
    <div role="tablist" aria-label={ariaLabel} className="flex gap-1 overflow-x-auto border-b border-sand-200">
      {tabs.map((tab, index) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-500 ${
            selected ? "border-forest-700 text-forest-700" : "border-transparent text-ink-soft hover:text-ink"}`
            }>
            
            {tab.label}
            {tab.count !== undefined &&
            <span
              className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${selected ? "bg-forest-50 text-forest-700" : "bg-sand-100 text-ink-soft"}`}>
              
                {tab.count}
              </span>
            }
          </button>);

      })}
    </div>);

}