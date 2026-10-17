import { useEffect, useState } from "react";

/** Shows a short loading state whenever `key` changes, simulating a network round-trip. */
export function useSimulatedLoading(key: string, duration = 450): boolean {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), duration);
    return () => window.clearTimeout(timer);
  }, [key, duration]);

  return loading;
}