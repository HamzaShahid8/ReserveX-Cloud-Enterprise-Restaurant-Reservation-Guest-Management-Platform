import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, XIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";

interface LightboxProps {
  images: string[];
  index: number | null;
  title: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function Lightbox({ images, index, title, onClose, onIndexChange }: LightboxProps) {
  const [zoomed, setZoomed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const stateRef = useRef({ index, onClose, onIndexChange, length: images.length });
  stateRef.current = { index, onClose, onIndexChange, length: images.length };

  useEffect(() => setZoomed(false), [index]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      const { index: current, length, onClose: close, onIndexChange: change } = stateRef.current;
      if (current === null) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") change((current + 1) % length);
      if (event.key === "ArrowLeft") change((current - 1 + length) % length);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open]);

  const controlClass =
  "grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors duration-150 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400";

  return createPortal(
    <AnimatePresence>
      {open && index !== null &&
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${title} photo gallery`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] flex flex-col bg-ink/95">
        
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <p className="text-sm text-white/80" aria-live="polite">
              <span className="font-medium text-white">{title}</span> · {index + 1} / {images.length}
            </p>
            <div className="flex gap-2">
              <button
              type="button"
              onClick={() => setZoomed((value) => !value)}
              className={controlClass}
              aria-pressed={zoomed}
              aria-label={zoomed ? "Zoom out" : "Zoom in"}>
              
                {zoomed ? <ZoomOutIcon className="h-5 w-5" aria-hidden="true" /> : <ZoomInIcon className="h-5 w-5" aria-hidden="true" />}
              </button>
              <button ref={closeRef} type="button" onClick={onClose} className={controlClass} aria-label="Close gallery">
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
            <div className={`h-full w-full ${zoomed ? "overflow-auto" : "flex items-center justify-center overflow-hidden"}`}>
              <motion.img
              key={index}
              src={images[index]}
              alt={`${title} — photo ${index + 1} of ${images.length}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              onClick={() => setZoomed((value) => !value)}
              className={zoomed ? "w-[200%] max-w-none cursor-zoom-out" : "max-h-full max-w-full cursor-zoom-in rounded-lg object-contain"} />
            
            </div>
            <button
            type="button"
            onClick={() => onIndexChange((index - 1 + images.length) % images.length)}
            className={`${controlClass} absolute left-3 top-1/2 -translate-y-1/2 sm:left-6`}
            aria-label="Previous photo">
            
              <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
            type="button"
            onClick={() => onIndexChange((index + 1) % images.length)}
            className={`${controlClass} absolute right-3 top-1/2 -translate-y-1/2 sm:right-6`}
            aria-label="Next photo">
            
              <ChevronRightIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="flex justify-center gap-2 overflow-x-auto px-4 py-4">
            {images.map((image, thumbIndex) =>
          <button
            key={`${image}-${thumbIndex}`}
            type="button"
            onClick={() => onIndexChange(thumbIndex)}
            aria-label={`Show photo ${thumbIndex + 1}`}
            aria-current={thumbIndex === index}
            className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-[border-color,opacity] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
            thumbIndex === index ? "border-gold-400 opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`
            }>
            
                <img src={image} alt="" className="h-full w-full object-cover" />
              </button>
          )}
          </div>
        </motion.div>
      }
    </AnimatePresence>,
    document.body
  );
}