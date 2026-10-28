import type { LevelNode, NodeKind } from "@/components/journey/model/level";

export const STEP = 40;
export const SPEED = 1.6;
export const BOSS_TAIL = 420;

const fixedWidths: Partial<Record<NodeKind, number>> = {
  gate: 560,
  checkpoint: 600,
  loot: 560,
  door: 340,
  rush: 560,
  boss: 1320,
  secret: 1340,
  goal: 1500,
};

export interface Placed {
  x: number;
  w: number;
  level: number;
}

export interface GemOffsets {
  gx: number[];
  gy: number[];
}

export interface Stop {
  index: number;
  x: number;
  boss: boolean;
}

export interface BossPhase {
  phase: 0 | 1 | 2 | 3;
  hp: number;
}

export function nodeWidth(node: LevelNode, viewportWidth: number): number {
  if (node.kind === "intro") return Math.max(Math.round(viewportWidth * 0.98), 1000);
  if (node.kind === "gems") return Math.max(560, node.gems.length * 96 + 220);
  return fixedWidths[node.kind] ?? 400;
}

export function layoutLevel(nodes: LevelNode[], viewportWidth: number): Placed[] {
  let x = 0;

  return nodes.map((node) => {
    const w = nodeWidth(node, viewportWidth);
    const placed = { x, w, level: node.level };
    x += w;
    return placed;
  });
}

export function trackWidth(placed: Placed[]): number {
  const last = placed.at(-1);

  return last ? last.x + last.w : 0;
}

export function nodeIndexAt(placed: Placed[], x: number): number {
  let low = 0;
  let high = placed.length - 1;

  while (low < high) {
    const middle = (low + high + 1) >> 1;
    if (placed[middle].x <= x) low = middle;
    else high = middle - 1;
  }

  return Math.max(0, low);
}

export function groundAt(placed: Placed[], x: number, hops: Set<number> = new Set()): number {
  const index = nodeIndexAt(placed, x);
  const node = placed[index];
  if (!node) return 0;
  const half = 44;
  const arc = 34;
  const previous = placed[index - 1];
  const next = placed[index + 1];
  let y = node.level * STEP;

  if (previous && x - node.x < half && previous.level !== node.level) {
    const u = (x - (node.x - half)) / (2 * half);
    y = (previous.level + (node.level - previous.level) * u) * STEP + Math.sin(Math.PI * u) * arc;
  } else if (next && node.x + node.w - x < half && next.level !== node.level) {
    const u = (x - (node.x + node.w - half)) / (2 * half);
    y = (node.level + (next.level - node.level) * u) * STEP + Math.sin(Math.PI * u) * arc;
  }

  if (hops.has(index)) {
    const u = (x - node.x - 70) / (node.w - 140);
    if (u > 0 && u < 1) y += Math.sin(Math.PI * u) * 96;
  }

  return y;
}

export function gemOffsets(count: number, width: number): GemOffsets {
  const span = width - 200;
  const gx = Array.from({ length: count }, (_, k) => Math.round(100 + (count === 1 ? span / 2 : (k * span) / (count - 1))));
  const gy = Array.from({ length: count }, (_, k) => Math.round(28 + Math.sin((Math.PI * (k + 0.5)) / count) * 84));

  return { gx, gy };
}

export function bossProgress(node: Placed, x: number): number {
  return Math.min(1, Math.max(0, (x - node.x) / Math.max(1, node.w - BOSS_TAIL)));
}

export function bossPhase(u: number): BossPhase {
  if (u < 0.1) return { phase: 0, hp: 1 };
  if (u < 0.42) return { phase: 1, hp: 1 };
  if (u < 0.8) return { phase: 2, hp: Math.max(0, 1 - (u - 0.42) / 0.38) };
  return { phase: 3, hp: 0 };
}

const stopOffsets: Partial<Record<NodeKind, (w: number) => number>> = {
  intro: () => 0,
  gate: () => 150,
  checkpoint: () => 4,
  loot: () => 60,
  rush: () => 60,
  door: (w) => w / 2 - 150,
  secret: () => 180,
  goal: () => 30,
};

export function stopsFor(nodes: LevelNode[], placed: Placed[]): Stop[] {
  return nodes.flatMap((node, index) => {
    const spot = placed[index];
    if (node.kind === "boss") {
      return [
        { index, x: spot.x + Math.round((spot.w - BOSS_TAIL) * 0.6), boss: true },
        { index, x: spot.x + spot.w - 300, boss: false },
      ];
    }
    const offset = stopOffsets[node.kind];
    return offset ? [{ index, x: spot.x + offset(spot.w), boss: false }] : [];
  });
}

export function nextStop(stops: Stop[], x: number, direction: 1 | -1): Stop | null {
  if (direction > 0) return stops.find((stop) => stop.x > x + 30) ?? null;
  return [...stops].reverse().find((stop) => stop.x < x - 30) ?? null;
}

export function scrollForWorldX(worldX: number, runnerX: number, maxProgress: number): number {
  return Math.round(Math.min(maxProgress, Math.max(0, worldX - runnerX)) / SPEED);
}
