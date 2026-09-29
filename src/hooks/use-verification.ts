import { useEffect, useSyncExternalStore } from "react";
import * as V from "@/lib/verification";

export function useVerificationQueue() {
  const q = useSyncExternalStore(V.subscribe, V.getVerificationQueue, V.getVerificationQueue);
  useEffect(() => V.loadPersisted(), []);
  return q;
}
