"use client";

import { useSyncExternalStore } from "react";
import { localTime } from "@/components/overworld/model/clock";

function mediaStore(query: string) {
  return {
    subscribe(callback: () => void): () => void {
      const list = window.matchMedia(query);
      list.addEventListener("change", callback);
      return () => list.removeEventListener("change", callback);
    },
    snapshot(): boolean {
      return window.matchMedia(query).matches;
    },
  };
}

const reducedMotionStore = mediaStore("(prefers-reduced-motion: reduce)");
const phoneStore = mediaStore("(max-width: 599px)");
const framingStore = mediaStore("(min-width: 700px)");
const coarseStore = mediaStore("(pointer: coarse)");

const serverFalse = (): boolean => false;

export function useReducedMotion(): boolean {
  return useSyncExternalStore(reducedMotionStore.subscribe, reducedMotionStore.snapshot, serverFalse);
}

export function usePhone(): boolean {
  return useSyncExternalStore(phoneStore.subscribe, phoneStore.snapshot, serverFalse);
}

export function useCanFrame(): boolean {
  return useSyncExternalStore(framingStore.subscribe, framingStore.snapshot, serverFalse);
}

export function useCoarsePointer(): boolean {
  return useSyncExternalStore(coarseStore.subscribe, coarseStore.snapshot, serverFalse);
}

function subscribeMinute(callback: () => void): () => void {
  const timer = window.setInterval(callback, 15000);
  return () => window.clearInterval(timer);
}

export function useLocalTime(offsetHours: number): string {
  return useSyncExternalStore(subscribeMinute, () => localTime(new Date(), offsetHours), () => "");
}
