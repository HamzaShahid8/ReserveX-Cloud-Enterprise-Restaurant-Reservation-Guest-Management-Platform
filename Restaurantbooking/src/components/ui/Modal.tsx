import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  placement?: "center" | "right";
}

const FOCUSABLE =
'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ease = [0.23, 1, 0.32, 1] as const;

export function Modal({ open, onClose, title, description, children, footer, size = "md", placement = "center" }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panelRef.current)?.focus();
    }, 30);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  const widths = { sm: "sm:max-w-md", md: "sm:max-w-lg", lg: "sm:max-w-2xl" };
  const isRight = placement === "right";

  return createPortal(
    <AnimatePresence>
      {open &&
      <div
        className={twMerge(
          "fixed inset-0 z-50 flex print:hidden",
          isRight ? "justify-end" : "items-end justify-center sm:items-center sm:p-4"
        )}>
        
          <motion.div
          className="absolute inset-0 bg-ink/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={onClose}
          aria-hidden="true" />
        
          <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1}
          className={twMerge(
            "relative flex w-full flex-col bg-white shadow-lift focus:outline-none",
            isRight ? "h-full max-w-md" : twMerge("max-h-[90vh] rounded-t-3xl sm:rounded-3xl", widths[size])
          )}
          initial={isRight ? { x: 48, opacity: 0 } : { y: 16, opacity: 0, scale: 0.98 }}
          animate={isRight ? { x: 0, opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
          exit={isRight ? { x: 48, opacity: 0 } : { y: 12, opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.24, ease }}>
          
            <div className="flex items-start justify-between gap-4 border-b border-sand-200 px-6 py-5">
              <div>
                <h2 id={titleId} className="font-display text-xl font-medium text-ink">
                  {title}
                </h2>
                {description &&
              <p id={descriptionId} className="mt-1 text-sm text-ink-soft">
                    {description}
                  </p>
              }
              </div>
              <button
              type="button"
              onClick={onClose}
              className="-mr-2 grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-soft transition-colors duration-150 hover:bg-sand-100 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              aria-label="Close dialog">
              
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && <div className="border-t border-sand-200 px-6 py-4">{footer}</div>}
          </motion.div>
        </div>
      }
    </AnimatePresence>,
    document.body
  );
}