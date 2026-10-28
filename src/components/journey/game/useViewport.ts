"use client";

import { useSyncExternalStore } from "react";
import type { Viewport } from "@/components/journey/game/types";

const serverViewport: Viewport = { width: 1440, mode: "h", reduced: false, desktop: true };
let cached: Viewport = serverViewport;

function read(): Viewport {
  const width = window.innerWidth;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktop = window.matchMedia("(min-width: 900px) and (hover: hover) and (pointer: fine)").matches;
  const mode = width < 700 ? "v" : "h";
  if (cached.width !== width || cached.reduced !== reduced || cached.desktop !== desktop || cached.mode !== mode) cached = { width, mode, reduced, desktop };
  return cached;
}

function subscribe(onChange: () => void): () => void {
  let timer = 0;
  const later = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(onChange, 150);
  };
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  window.addEventListener("resize", later);
  motion.addEventListener("change", onChange);
  pointer.addEventListener("change", onChange);
  return () => {
    window.clearTimeout(timer);
    window.removeEventListener("resize", later);
    motion.removeEventListener("change", onChange);
    pointer.removeEventListener("change", onChange);
  };
}

export function useViewport(): Viewport {
  return useSyncExternalStore(subscribe, read, () => serverViewport);
}
