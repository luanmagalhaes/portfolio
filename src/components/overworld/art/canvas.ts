import type { SpriteRows } from "@/components/overworld/art/sprites";

export const TILE = 16;

export type Mask = Uint8Array;

export interface Material {
  base: string;
  light: string;
  dark: string;
  outline?: string;
  texture?: number;
}

export interface Pen {
  ctx: CanvasRenderingContext2D;
  fill(x: number, y: number, w: number, h: number, color: string): void;
  dot(x: number, y: number, color: string): void;
  frame(x: number, y: number, w: number, h: number, color: string): void;
}

export function hash2(x: number, y: number, seed = 0): number {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

const bayer4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((value) => value / 16);

export function bayer(x: number, y: number): number {
  return bayer4[(y & 3) * 4 + (x & 3)];
}

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  return canvas;
}

export function context(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is not available");
  return ctx;
}

export function drawRows(ctx: CanvasRenderingContext2D, rows: SpriteRows, x: number, y: number, palette: Record<string, string>): void {
  rows.forEach((line, row) => {
    let start = 0;
    let current = line[0] ?? ".";
    for (let col = 1; col <= line.length; col++) {
      const char = col < line.length ? line[col] : "";
      if (char !== current) {
        if (current !== "." && current !== "" && palette[current]) {
          ctx.fillStyle = palette[current];
          ctx.fillRect(x + start, y + row, col - start, 1);
        }
        current = char;
        start = col;
      }
    }
  });
}

export function spriteCanvas(rows: SpriteRows, palette: Record<string, string>, scale = 1): HTMLCanvasElement {
  const base = createCanvas(rows[0].length, rows.length);
  drawRows(context(base), rows, 0, 0, palette);
  if (scale === 1) return base;
  const scaled = createCanvas(base.width * scale, base.height * scale);
  const ctx = context(scaled);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(base, 0, 0, scaled.width, scaled.height);
  return scaled;
}

export function shadeMask(mask: Mask, width: number, height: number, materials: Record<number, Material>, outlineColor: string): HTMLCanvasElement {
  const canvas = createCanvas(width, height);
  const ctx = context(canvas);
  const at = (x: number, y: number): number => (x < 0 || y < 0 || x >= width || y >= height ? 0 : mask[y * width + x]);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const id = at(x, y);
      if (id) {
        const material = materials[id];
        let color = material.base;
        const noise = hash2(x, y, id * 7);
        if (!at(x, y - 1)) color = material.light;
        else if (!at(x, y + 1) || !at(x + 1, y)) color = material.dark;
        else if (material.texture && noise < material.texture) color = noise < material.texture / 2 ? material.dark : material.light;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      } else if (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1)) {
        const neighbor = at(x, y - 1) || at(x - 1, y) || at(x + 1, y) || at(x, y + 1);
        ctx.fillStyle = materials[neighbor].outline ?? outlineColor;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  return canvas;
}

export function plotDisc(mask: Mask, width: number, height: number, cx: number, cy: number, radius: number, id: number, squash = 1): void {
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y++) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x++) {
      const dx = x + 0.5 - cx;
      const dy = (y + 0.5 - cy) / squash;
      if (dx * dx + dy * dy <= radius * radius && x >= 0 && y >= 0 && x < width && y < height) mask[y * width + x] = id;
    }
  }
}

export function plotLine(mask: Mask, width: number, height: number, x0: number, y0: number, x1: number, y1: number, thickness: (t: number) => number, id: number): void {
  const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2);
  for (let step = 0; step <= steps; step++) {
    const t = steps === 0 ? 0 : step / steps;
    plotDisc(mask, width, height, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, thickness(t), id);
  }
}

export function makePen(ctx: CanvasRenderingContext2D): Pen {
  const fill = (x: number, y: number, w: number, h: number, color: string): void => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  };
  return {
    ctx,
    fill,
    dot: (x, y, color) => fill(x, y, 1, 1, color),
    frame: (x, y, w, h, color) => {
      fill(x, y, w, 1, color);
      fill(x, y + h - 1, w, 1, color);
      fill(x, y, 1, h, color);
      fill(x + w - 1, y, 1, h, color);
    },
  };
}
