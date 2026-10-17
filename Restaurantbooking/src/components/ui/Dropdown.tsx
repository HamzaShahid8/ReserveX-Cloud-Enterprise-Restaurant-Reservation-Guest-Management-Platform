import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useDismiss } from "../../hooks/useDismiss";

interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface DropdownProps<T extends string> {
  label: string;
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function Dropdown<T extends string>({ label, options, value, onChange }: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);

  useDismiss(containerRef, () => setOpen(false), open);

  useEffect(() => {
    if (open) {
      setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)));
      listRef.current?.focus();
    }
  }, [open, options, value]);

  const choose = (index: number) => {
    onChange(options[index].value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(options.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(activeIndex);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className="flex h-10 items-center gap-2 rounded-full border border-sand-300 bg-white pl-4 pr-3 text-sm text-ink transition-colors duration-150 hover:border-forest-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
        
        <span className="text-ink-muted">{label}:</span>
        <span className="font-medium">{selected?.label}</span>
        <ChevronDownIcon
          className={`h-4 w-4 text-ink-muted transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          aria-hidden="true" />
        
      </button>
      <AnimatePresence>
        {open &&
        <motion.ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${listId}-${activeIndex}`}
          onKeyDown={onListKeyDown}
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
          className="absolute right-0 z-30 mt-2 w-60 origin-top-right rounded-2xl border border-sand-200 bg-white p-1.5 shadow-lift focus:outline-none">
          
            {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(index)}
                className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm ${
                index === activeIndex ? "bg-sand-100" : ""} ${
                isSelected ? "font-medium text-forest-700" : "text-ink"}`}>
                
                  {option.label}
                  {isSelected && <CheckIcon className="h-4 w-4" aria-hidden="true" />}
                </li>);

          })}
          </motion.ul>
        }
      </AnimatePresence>
    </div>);

}