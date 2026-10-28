import { context, createCanvas, hash2, makePen, plotDisc, plotLine, shadeMask, type Material } from "@/components/overworld/art/canvas";
import type { Colors } from "@/components/overworld/art/palette";
import { drawIcon } from "@/components/overworld/art/buildings";

export function makePalm(colors: Colors, variant: number): { canvas: HTMLCanvasElement; anchorX: number; anchorY: number } {
  const width = 44;
  const height = 52;
  const mask = new Uint8Array(width * height);
  const lean = variant % 2 ? 4 : -3;
  const baseX = 22;
  const baseY = 50;
  const crownX = baseX + lean;
  const crownY = 15;
  for (let step = 0; step <= 60; step++) {
    const t = step / 60;
    const x = baseX + lean * t * t + Math.sin(t * 3) * (variant % 3 === 0 ? 1.5 : 0.5);
    const y = baseY - (baseY - crownY) * t;
    plotDisc(mask, width, height, x, y, 2.4 - t * 0.6, Math.floor(y) % 4 === 0 ? 2 : 1);
  }
  const fronds: [number, number, number][] = [
    [-2.75, 15, 0.55], [-2.1, 16, 0.35], [-1.45, 14, 0.25], [-0.95, 13, 0.2], [-0.4, 15, 0.45], [0.15, 16, 0.6], [-3.3, 13, 0.7], [0.75, 12, 0.85]
  ];
  for (const [angle, length, droop] of fronds) {
    let px = crownX;
    let py = crownY;
    for (let step = 1; step <= 24; step++) {
      const t = step / 24;
      const x = crownX + Math.cos(angle) * length * t;
      const y = crownY + Math.sin(angle) * length * t + droop * length * t * t;
      plotLine(mask, width, height, px, py, x, y, () => Math.max(0.6, 2.2 * (1 - t) + 0.4), 3);
      if (step % 3 === 0 && t < 0.92) {
        plotDisc(mask, width, height, x + Math.cos(angle + 1.6) * 1.6, y + 2, 0.9, 4);
      }
      px = x;
      py = y;
    }
  }
  plotDisc(mask, width, height, crownX - 2, crownY + 3, 1.6, 5);
  plotDisc(mask, width, height, crownX + 2, crownY + 3, 1.6, 5);
  plotDisc(mask, width, height, crownX, crownY + 5, 1.6, 5);
  const materials: Record<number, Material> = {
    1: { base: colors.px.C, light: colors.px.T, dark: colors.px.u, outline: colors.px.c },
    2: { base: colors.px.u, light: colors.px.C, dark: colors.px.c, outline: colors.px.c },
    3: { base: colors.tok("world-grass"), light: colors.tok("world-grass-light"), dark: colors.tok("world-grass-dark"), outline: colors.tok("world-grass-deep"), texture: 0.12 },
    4: { base: colors.tok("world-grass-dark"), light: colors.tok("world-grass"), dark: colors.tok("world-grass-deep"), outline: colors.tok("world-grass-deep") },
    5: { base: colors.px.u, light: colors.px.C, dark: colors.px.c, outline: colors.px.c }
  };
  return { canvas: shadeMask(mask, width, height, materials, colors.px.K), anchorX: baseX, anchorY: baseY };
}

export function makeBush(colors: Colors, seed: number): HTMLCanvasElement {
  const width = 20;
  const height = 16;
  const mask = new Uint8Array(width * height);
  plotDisc(mask, width, height, 10, 10, 6.5, 1, 0.8);
  plotDisc(mask, width, height, 6, 8, 4.5, 1);
  plotDisc(mask, width, height, 14, 8, 4.5, 1);
  plotDisc(mask, width, height, 10, 6, 4.5, 1);
  const materials: Record<number, Material> = {
    1: { base: colors.tok("world-grass-dark"), light: colors.tok("world-grass"), dark: colors.tok("world-grass-deep"), outline: colors.px.K, texture: 0.22 }
  };
  const canvas = shadeMask(mask, width, height, materials, colors.px.K);
  const ctx = context(canvas);
  const flowers = [colors.tok("world-flower-a"), colors.tok("world-flower-b"), colors.tok("world-flower-c")];
  for (let index = 0; index < 4; index++) {
    const fx = 4 + Math.floor(hash2(seed, index, 3) * 12);
    const fy = 4 + Math.floor(hash2(index, seed, 5) * 8);
    if (mask[fy * width + fx]) {
      ctx.fillStyle = flowers[(seed + index) % flowers.length];
      ctx.fillRect(fx, fy, 1, 1);
    }
  }
  return canvas;
}

export function makeRock(colors: Colors, seed: number): HTMLCanvasElement {
  const width = 16;
  const height = 13;
  const mask = new Uint8Array(width * height);
  plotDisc(mask, width, height, 8, 8, 5.5 + hash2(seed, 1) * 1.2, 1, 0.75);
  plotDisc(mask, width, height, 5 + hash2(seed, 2) * 2, 6, 3.4, 1);
  const materials: Record<number, Material> = { 1: { base: colors.tok("world-stone"), light: colors.tok("world-stone-light"), dark: colors.tok("world-stone-dark"), outline: colors.px.K, texture: 0.1 } };
  return shadeMask(mask, width, height, materials, colors.px.K);
}

export function makeFlameTree(colors: Colors): { canvas: HTMLCanvasElement; anchorX: number; anchorY: number } {
  const width = 56;
  const height = 50;
  const mask = new Uint8Array(width * height);
  for (let step = 0; step <= 30; step++) {
    const t = step / 30;
    plotDisc(mask, width, height, 28 + Math.sin(t * 2) * 1.5, 48 - t * 22, 2.6 - t * 0.6, 1);
  }
  plotLine(mask, width, height, 28, 30, 18, 22, () => 1.3, 1);
  plotLine(mask, width, height, 28, 30, 38, 21, () => 1.3, 1);
  const blobs: [number, number, number][] = [[28, 16, 11], [16, 19, 9], [40, 19, 9], [22, 10, 8], [35, 10, 8], [10, 24, 6], [46, 24, 6], [28, 24, 9]];
  for (const [x, y, r] of blobs) plotDisc(mask, width, height, x, y, r, 2, 0.78);
  for (let index = 0; index < 18; index++) {
    const x = 6 + Math.floor(hash2(index, 9) * 44);
    const y = 6 + Math.floor(hash2(9, index) * 22);
    if (mask[y * width + x] === 2) plotDisc(mask, width, height, x, y, 1.2, 3);
  }
  const materials: Record<number, Material> = {
    1: { base: colors.px.u, light: colors.px.C, dark: colors.px.c, outline: colors.px.c },
    2: { base: colors.tok("world-bloom"), light: colors.tok("world-bloom-light"), dark: colors.tok("world-bloom-dark"), outline: colors.px.K, texture: 0.2 },
    3: { base: colors.tok("world-grass-dark"), light: colors.tok("world-grass"), dark: colors.tok("world-grass-deep"), outline: colors.px.K }
  };
  return { canvas: shadeMask(mask, width, height, materials, colors.px.K), anchorX: 28, anchorY: 48 };
}

export function paintShip(ctx: CanvasRenderingContext2D, colors: Colors, x: number, y: number, sailColor: string, sailShade: string, icon: string, size: "big" | "small"): void {
  const pen = makePen(ctx);
  const length = size === "small" ? 26 : 44;
  const mastHeight = size === "small" ? 18 : 28;
  const hullY = y + mastHeight + 4;
  pen.fill(x + 4, hullY, length - 6, 8, colors.tok("world-wood"));
  pen.fill(x + 2, hullY, 2, 5, colors.tok("world-wood"));
  pen.fill(x + 4, hullY, length - 6, 2, colors.tok("world-wood-light"));
  pen.fill(x + 4, hullY + 4, length - 6, 2, colors.px.W);
  pen.fill(x + 6, hullY + 7, length - 10, 2, colors.tok("world-wood-dark"));
  pen.frame(x + 1, hullY - 1, length - 2, 11, colors.px.K);
  const mastX = x + Math.floor(length / 2);
  pen.fill(mastX, y + 2, 2, mastHeight + 2, colors.tok("world-wood-dark"));
  pen.fill(mastX - 1, y + 2, 1, mastHeight + 2, colors.px.K);
  const sailWidth = size === "small" ? 14 : 22;
  for (let row = 0; row < mastHeight - 4; row++) {
    const width = Math.round(sailWidth * (0.55 + 0.45 * Math.sin((row / (mastHeight - 4)) * Math.PI)));
    pen.fill(mastX + 3, y + 4 + row, width, 1, row % 6 === 5 ? sailShade : sailColor);
    pen.fill(mastX + 2 + width, y + 4 + row, 1, 1, colors.px.K);
  }
  pen.fill(mastX + 3, y + 3, sailWidth - 4, 1, colors.px.K);
  pen.fill(mastX + 3, y + mastHeight, sailWidth - 4, 1, colors.px.K);
  drawIcon(ctx, colors, icon, mastX + 3 + Math.floor((sailWidth - 12) / 2) + 1, y + 4 + Math.floor((mastHeight - 16) / 2));
  pen.fill(mastX + 2, y - 2, 7, 3, colors.px.r);
  pen.fill(mastX + 2, y - 2, 7, 1, colors.px.K);
}

export function makeJangada(colors: Colors): HTMLCanvasElement {
  const canvas = createCanvas(36, 34);
  const ctx = context(canvas);
  const pen = makePen(ctx);
  for (let log = 0; log < 5; log++) {
    pen.fill(2, 24 + log * 2, 32, 2, log % 2 ? colors.tok("world-wood-light") : colors.tok("world-wood"));
  }
  pen.frame(1, 23, 34, 11, colors.px.K);
  pen.fill(16, 2, 2, 22, colors.tok("world-wood-dark"));
  for (let row = 0; row < 20; row++) {
    const width = Math.round(2 + row * 0.75);
    pen.fill(18, 3 + row, width, 1, row > 12 && row < 16 ? colors.px.r : colors.px.W);
    pen.dot(18 + width, 3 + row, colors.px.K);
  }
  pen.fill(18, 22, 16, 1, colors.px.K);
  return canvas;
}

export function makeLamp(colors: Colors): HTMLCanvasElement {
  const canvas = createCanvas(16, 34);
  const pen = makePen(context(canvas));
  pen.fill(7, 10, 2, 22, colors.tok("world-stone-dark"));
  pen.fill(6, 10, 1, 22, colors.px.K);
  pen.fill(9, 10, 1, 22, colors.px.K);
  pen.fill(5, 30, 6, 3, colors.tok("world-stone-dark"));
  pen.frame(4, 29, 8, 5, colors.px.K);
  pen.fill(4, 2, 8, 8, colors.px.Y);
  pen.fill(5, 3, 2, 5, colors.px.W);
  pen.frame(3, 1, 10, 10, colors.px.K);
  pen.fill(4, 0, 8, 1, colors.px.K);
  return canvas;
}

export function makeFountain(colors: Colors): HTMLCanvasElement {
  const canvas = createCanvas(32, 30);
  const ctx = context(canvas);
  const pen = makePen(ctx);
  for (let py = 0; py < 18; py++) {
    for (let px = 0; px < 32; px++) {
      const dx = (px + 0.5 - 16) / 15.5;
      const dy = (py + 0.5 - 9) / 8.5;
      const distance = dx * dx + dy * dy;
      if (distance <= 1) {
        let color = colors.tok("world-stone-light");
        if (distance > 0.82) color = colors.px.K;
        else if (distance > 0.58) color = py > 9 ? colors.tok("world-stone") : colors.tok("world-stone-light");
        else color = hash2(px, py, 3) < 0.15 ? colors.tok("world-foam") : colors.tok("world-shallow");
        pen.dot(px, py + 10, color);
      }
    }
  }
  pen.fill(1, 19, 30, 6, colors.tok("world-stone"));
  pen.fill(1, 19, 30, 1, colors.tok("world-stone-light"));
  pen.fill(1, 24, 30, 1, colors.tok("world-stone-dark"));
  pen.frame(0, 18, 32, 8, colors.px.K);
  pen.fill(14, 6, 4, 14, colors.tok("world-stone-light"));
  pen.fill(16, 6, 2, 14, colors.tok("world-stone"));
  pen.frame(13, 5, 6, 15, colors.px.K);
  pen.fill(11, 4, 10, 3, colors.tok("world-stone-light"));
  pen.frame(10, 3, 12, 5, colors.px.K);
  return canvas;
}
