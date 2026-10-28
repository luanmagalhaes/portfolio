import { useSyncExternalStore } from "react";

const offsetMs = 3 * 60 * 60 * 1000;

function brazilTime(): string {
  return new Date(Date.now() - offsetMs).toISOString().slice(11, 16);
}

function subscribe(notify: () => void): () => void {
  const timer = window.setInterval(notify, 15000);
  return () => window.clearInterval(timer);
}

export function useBrazilClock(): string {
  return useSyncExternalStore(subscribe, brazilTime, () => "--:--");
}
