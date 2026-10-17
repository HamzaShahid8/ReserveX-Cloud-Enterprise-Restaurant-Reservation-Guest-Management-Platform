import { useEffect, useState } from "react";

type StorageKind = "local" | "session";

function getStorage(kind: StorageKind): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function usePersistentState<T>(key: string, initialValue: T, kind: StorageKind = "local") {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = getStorage(kind)?.getItem(key);
      return raw ? JSON.parse(raw) as T : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      getStorage(kind)?.setItem(key, JSON.stringify(value));
    } catch {

      // Storage may be full or unavailable (private mode); the in-memory state still works.
    }}, [key, kind, value]);

  return [value, setValue] as const;
}