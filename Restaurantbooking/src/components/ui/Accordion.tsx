import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
}

export function Accordion({ items, defaultOpenId }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className="divide-y divide-sand-200 border-y border-sand-200">
      {items.map((item) => {
        const open = openId === item.id;
        const buttonId = `accordion-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;
        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-base font-medium text-ink transition-colors duration-150 hover:text-forest-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
                
                {item.title}
                <ChevronDownIcon
                  className={`h-5 w-5 shrink-0 text-ink-muted transition-transform duration-200 ease-out ${open ? "rotate-180" : ""}`}
                  aria-hidden="true" />
                
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open &&
              <motion.div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden">
                
                  <div className="max-w-3xl pb-5 pr-8 text-sm leading-relaxed text-ink-soft">{item.content}</div>
                </motion.div>
              }
            </AnimatePresence>
          </div>);

      })}
    </div>);

}