import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpIcon } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible &&
      <motion.button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        className="fixed bottom-24 right-4 z-30 grid h-11 w-11 place-items-center rounded-full border border-sand-300 bg-white text-ink shadow-card transition-colors hover:border-forest-700 hover:text-forest-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 lg:bottom-8 lg:right-8 print:hidden"
        aria-label="Back to top">
        
          <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      }
    </AnimatePresence>);

}