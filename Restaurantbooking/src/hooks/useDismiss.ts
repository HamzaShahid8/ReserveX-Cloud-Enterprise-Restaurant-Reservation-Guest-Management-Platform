import { RefObject, useEffect, useRef } from "react";

/** Calls `onDismiss` on outside pointer-down or Escape while `enabled`. */
export function useDismiss<T extends HTMLElement>(ref: RefObject<T>, onDismiss: () => void, enabled: boolean) {
  const handlerRef = useRef(onDismiss);
  handlerRef.current = onDismiss;

  useEffect(() => {
    if (!enabled) return;
    const onPointer = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      if (!element || element.contains(event.target as Node)) return;
      handlerRef.current();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handlerRef.current();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, enabled]);
}