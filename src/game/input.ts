import type { Direction } from "@/game/grid";

const keys: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
  W: "up",
  S: "down",
  A: "left",
  D: "right",
};

export function directionForKey(key: string): Direction | null {
  return keys[key] ?? null;
}

export function isActionKey(key: string): boolean {
  return key === "Enter" || key === " " || key === "e" || key === "E";
}
