import { drawRows, hash2, spriteCanvas, type Pen } from "@/components/overworld/art/canvas";
import type { Colors } from "@/components/overworld/art/palette";
import { iconRows } from "@/components/overworld/art/sprites";
import type { BuildingId } from "@/components/overworld/model/map";

type BuildingPainter = (pen: Pen, colors: Colors, x: number, y: number, w: number, h: number, doorX: number) => void;

export function paintRoof(pen: Pen, colors: Colors, x: number, y: number, w: number, h: number): void {
  const base = colors.tok("world-roof");
  const dark = colors.tok("world-roof-dark");
  const light = colors.tok("world-roof-light");
  pen.fill(x, y, w, h, base);
  for (let row = 0; row < h; row += 5) {
    for (let col = 0; col < w; col += 4) {
      const offset = (row / 5) % 2 ? 2 : 0;
      pen.fill(x + ((col + offset) % w), y + row + 1, 1, 3, light);
      pen.fill(x + ((col + offset + 3) % w), y + row, 1, 4, dark);
    }
    pen.fill(x, y + row + 4, w, 1, dark);
  }
  pen.fill(x, y, w, 2, dark);
  pen.fill(x, y + 2, w, 1, light);
  pen.fill(x - 2, y + h, w + 4, 2, colors.px.X);
  pen.frame(x - 1, y - 1, w + 2, h + 1, colors.px.K);
  pen.fill(x - 3, y + h, 1, 2, colors.px.K);
  pen.fill(x + w + 2, y + h, 1, 2, colors.px.K);
  pen.fill(x - 3, y + h + 2, w + 6, 1, colors.px.K);
}

export function paintWall(pen: Pen, colors: Colors, x: number, y: number, w: number, h: number, base: string, shade: string): void {
  pen.fill(x, y, w, h, base);
  for (let index = 0; index < (w * h) / 26; index++) {
    pen.dot(x + Math.floor(hash2(index, x, y) * w), y + Math.floor(hash2(y, index, x) * h), shade);
  }
  pen.fill(x, y, w, 3, shade);
  pen.fill(x + w - 2, y, 2, h, shade);
  pen.fill(x, y + h - 3, w, 3, colors.tok("world-stone-dark"));
  pen.fill(x, y + h - 3, w, 1, colors.tok("world-stone"));
  pen.frame(x - 1, y, w + 2, h + 1, colors.px.K);
}

export function paintWindow(pen: Pen, colors: Colors, x: number, y: number, w: number, h: number, shutter: boolean): void {
  if (shutter) {
    pen.fill(x - 4, y, 4, h, colors.tok("facade-shutter"));
    pen.fill(x + w, y, 4, h, colors.tok("facade-shutter"));
    for (let row = 1; row < h; row += 2) {
      pen.fill(x - 4, y + row, 4, 1, colors.tok("world-grass-deep"));
      pen.fill(x + w, y + row, 4, 1, colors.tok("world-grass-deep"));
    }
    pen.frame(x - 5, y - 1, w + 10, h + 2, colors.px.K);
  }
  pen.fill(x, y, w, h, colors.tok("facade-trim"));
  pen.fill(x + 1, y + 1, w - 2, h - 2, colors.tok("world-glass"));
  pen.fill(x + 2, y + 2, 2, 1, colors.tok("world-glass-light"));
  pen.fill(x + 2, y + 3, 1, 2, colors.tok("world-glass-light"));
  pen.fill(x + Math.floor(w / 2), y + 1, 1, h - 2, colors.tok("facade-trim"));
  pen.fill(x - 1, y + h, w + 2, 2, colors.tok("facade-trim"));
  pen.fill(x - 1, y + h + 2, w + 2, 1, colors.px.K);
  if (!shutter) pen.frame(x - 1, y - 1, w + 2, h + 2, colors.px.K);
}

export function paintDoor(pen: Pen, colors: Colors, cx: number, bottom: number, w: number, h: number, base: string, shade: string): void {
  const x = Math.round(cx - w / 2);
  const y = bottom - h;
  pen.fill(x - 1, y + 2, w + 2, h - 2, colors.px.K);
  pen.fill(x + 1, y, w - 2, 2, colors.px.K);
  pen.fill(x, y + 1, w, h - 1, base);
  pen.fill(x + 2, y + 1, w - 4, 1, shade);
  pen.fill(x + 1, y + 2, 1, h - 3, shade);
  pen.fill(x + Math.floor(w / 2), y + 2, 1, h - 3, shade);
  pen.fill(x + 2, y + 4, Math.floor(w / 2) - 3, Math.floor(h / 2) - 4, shade);
  pen.fill(x + Math.floor(w / 2) + 2, y + 4, Math.floor(w / 2) - 3, Math.floor(h / 2) - 4, shade);
  pen.fill(x + Math.floor(w / 2) - 2, y + Math.floor(h / 2) + 1, 1, 2, colors.px.Y);
  pen.fill(x + Math.floor(w / 2) + 2, y + Math.floor(h / 2) + 1, 1, 2, colors.px.Y);
}

export function paintBuildingShadow(pen: Pen, colors: Colors, x: number, y: number, w: number, h: number): void {
  const ctx = pen.ctx;
  ctx.save();
  ctx.globalAlpha = 0.28;
  pen.fill(x + w + 1, y + 8, 4, h - 6, colors.tok("world-shadow"));
  ctx.restore();
}

export function drawIcon(ctx: CanvasRenderingContext2D, colors: Colors, name: string, x: number, y: number, scale = 1): void {
  const rows = iconRows[name];
  if (!rows) return;
  if (scale === 1) drawRows(ctx, rows, x, y, colors.px);
  else {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spriteCanvas(rows, colors.px), x, y, rows[0].length * scale, rows.length * scale);
  }
}

export const buildingPainters: Record<BuildingId, BuildingPainter> = {
  house(pen, colors, x, y, w, h, doorX) {
    paintBuildingShadow(pen, colors, x, y, w, h);
    paintRoof(pen, colors, x + 3, y + 2, w - 6, 30);
    pen.fill(x + w - 20, y - 4, 8, 10, colors.tok("world-stone"));
    pen.fill(x + w - 20, y - 4, 8, 2, colors.tok("world-stone-light"));
    pen.frame(x + w - 21, y - 5, 10, 11, colors.px.K);
    paintWall(pen, colors, x + 4, y + 34, w - 8, h - 34, colors.tok("facade-house"), colors.tok("facade-house-shade"));
    pen.fill(x + 4, y + 34, w - 8, 2, colors.tok("facade-trim"));
    pen.fill(x + 4, y + 34, 2, h - 37, colors.tok("facade-trim"));
    pen.fill(x + w - 6, y + 34, 2, h - 37, colors.tok("facade-trim"));
    paintWindow(pen, colors, x + 14, y + 44, 12, 13, true);
    paintWindow(pen, colors, x + w - 26, y + 44, 12, 13, true);
    for (const wx of [x + 12, x + w - 28]) {
      pen.fill(wx, y + 59, 16, 3, colors.tok("world-wood-dark"));
      for (let index = 0; index < 5; index++) pen.dot(wx + 1 + index * 3, y + 58, index % 2 ? colors.tok("world-flower-a") : colors.tok("world-grass-light"));
    }
    paintDoor(pen, colors, doorX, y + h, 12, 20, colors.tok("world-wood"), colors.tok("world-wood-dark"));
    pen.fill(doorX - 3, y + 39, 6, 4, colors.px.Y);
    pen.frame(doorX - 4, y + 38, 8, 6, colors.px.K);
  },
  post(pen, colors, x, y, w, h, doorX) {
    paintBuildingShadow(pen, colors, x, y, w, h);
    paintRoof(pen, colors, x + 4, y + 4, w - 8, 18);
    paintWall(pen, colors, x + 2, y + 26, w - 4, h - 26, colors.tok("facade-post"), colors.tok("facade-post-shade"));
    pen.fill(x + 1, y + 20, w - 2, 7, colors.tok("facade-trim"));
    pen.fill(x + 1, y + 26, w - 2, 1, colors.tok("facade-auction-shade"));
    pen.fill(x + w / 2 - 12, y + 14, 24, 6, colors.tok("facade-trim"));
    pen.fill(x + w / 2 - 6, y + 10, 12, 4, colors.tok("facade-trim"));
    pen.frame(x, y + 19, w, 9, colors.px.K);
    pen.frame(x + w / 2 - 13, y + 13, 26, 7, colors.px.K);
    pen.frame(x + w / 2 - 7, y + 9, 14, 5, colors.px.K);
    paintWindow(pen, colors, x + 12, y + 40, 11, 13, false);
    paintWindow(pen, colors, x + w - 23, y + 40, 11, 13, false);
    pen.fill(doorX - 10, y + 31, 20, 14, colors.px.b);
    pen.frame(doorX - 11, y + 30, 22, 16, colors.px.K);
    drawIcon(pen.ctx, colors, "envelope", doorX - 6, y + 32);
    paintDoor(pen, colors, doorX, y + h, 14, 20, colors.px.b, colors.px.n);
  },
  auction(pen, colors, x, y, w, h, doorX) {
    paintBuildingShadow(pen, colors, x, y, w, h);
    paintRoof(pen, colors, x + 6, y + 4, w - 12, 16);
    const base = colors.tok("facade-auction");
    const shade = colors.tok("facade-auction-shade");
    for (let row = 0; row < 16; row++) {
      const half = Math.round(((row + 1) / 16) * (w / 2 - 6));
      pen.fill(x + w / 2 - half, y + 10 + row, half * 2, 1, row === 15 ? shade : base);
      pen.dot(x + w / 2 - half - 1, y + 10 + row, colors.px.K);
      pen.dot(x + w / 2 + half, y + 10 + row, colors.px.K);
    }
    pen.fill(x + w / 2 - 2, y + 9, 4, 1, colors.px.K);
    drawIcon(pen.ctx, colors, "gavel", doorX - 6, y + 13);
    pen.fill(x + 4, y + 26, w - 8, 7, base);
    pen.fill(x + 4, y + 31, w - 8, 2, shade);
    pen.frame(x + 3, y + 25, w - 6, 9, colors.px.K);
    pen.fill(x + 8, y + 34, w - 16, h - 46, colors.tok("world-stone-dark"));
    pen.fill(x + 8, y + 34, w - 16, 4, colors.px.M);
    pen.frame(x + 7, y + 33, w - 14, h - 44, colors.px.K);
    paintDoor(pen, colors, doorX, y + h - 11, 16, 26, colors.tok("world-wood"), colors.tok("world-wood-dark"));
    for (const cx of [x + 14, x + 34, x + w - 42, x + w - 22]) {
      pen.fill(cx - 1, y + 34, 10, 3, base);
      pen.fill(cx, y + 37, 8, h - 50, base);
      pen.fill(cx + 5, y + 37, 3, h - 50, shade);
      pen.fill(cx + 2, y + 37, 1, h - 50, colors.px.W);
      pen.frame(cx - 2, y + 33, 12, 5, colors.px.K);
      pen.fill(cx - 1, y + 37, 1, h - 50, colors.px.K);
      pen.fill(cx + 8, y + 37, 1, h - 50, colors.px.K);
      pen.fill(cx - 1, y + h - 14, 10, 3, shade);
    }
    for (let step = 0; step < 3; step++) {
      pen.fill(x + 2 - step * 2, y + h - 11 + step * 4, w - 4 + step * 4, 4, step % 2 ? colors.tok("world-stone") : colors.tok("world-stone-light"));
      pen.fill(x + 2 - step * 2, y + h - 8 + step * 4, w - 4 + step * 4, 1, colors.tok("world-stone-dark"));
    }
    pen.frame(x - 5, y + h - 12, w + 10, 13, colors.px.K);
  },
  arcade(pen, colors, x, y, w, h, doorX) {
    paintBuildingShadow(pen, colors, x, y, w, h);
    const base = colors.tok("facade-arcade");
    const shade = colors.tok("facade-arcade-shade");
    const light = colors.tok("facade-arcade-light");
    pen.fill(x + 2, y + 4, w - 4, 30, shade);
    for (let index = 0; index < 40; index++) pen.dot(x + 3 + Math.floor(hash2(index, 4) * (w - 6)), y + 5 + Math.floor(hash2(4, index) * 26), colors.px.N);
    pen.frame(x + 1, y + 3, w - 2, 32, colors.px.K);
    pen.fill(x + 2, y + 30, w - 4, 4, light);
    pen.fill(x + 10, y + 8, 14, 9, colors.tok("world-stone"));
    pen.fill(x + 10, y + 8, 14, 2, colors.tok("world-stone-light"));
    pen.frame(x + 9, y + 7, 16, 11, colors.px.K);
    pen.fill(x + w - 26, y + 9, 12, 8, colors.tok("world-stone"));
    pen.frame(x + w - 27, y + 8, 14, 10, colors.px.K);
    paintWall(pen, colors, x + 2, y + 34, w - 4, h - 34, base, shade);
    for (let px = x + 4; px < x + w - 4; px += 34) pen.fill(px, y + 37, 3, h - 40, light);
    for (const wx of [x + 8, x + w - 46]) {
      pen.fill(wx, y + 50, 38, 26, colors.px.N);
      pen.frame(wx - 1, y + 49, 40, 28, colors.px.K);
      for (let index = 0; index < 4; index++) {
        const cx = wx + 3 + index * 9;
        pen.fill(cx, y + 58, 6, 18, colors.px.M);
        pen.fill(cx + 1, y + 60, 4, 5, index % 2 ? colors.px.a : colors.px.r);
        pen.fill(cx, y + 57, 6, 2, index % 2 ? colors.px.Y : colors.px.V);
      }
      pen.fill(wx + 1, y + 51, 12, 1, colors.tok("world-glass-light"));
      pen.fill(wx + 1, y + 52, 1, 6, colors.tok("world-glass-light"));
    }
    pen.fill(doorX - 14, y + 58, 28, h - 58, colors.px.r);
    pen.fill(doorX - 12, y + 60, 24, h - 60, colors.px.n);
    pen.fill(doorX, y + 60, 1, h - 60, colors.px.r);
    pen.fill(doorX - 9, y + 63, 2, 9, colors.tok("world-glass-light"));
    pen.fill(doorX + 4, y + 63, 2, 9, colors.tok("world-glass-light"));
    pen.fill(doorX - 3, y + 76, 2, 4, colors.px.Y);
    pen.fill(doorX + 2, y + 76, 2, 4, colors.px.Y);
    pen.frame(doorX - 15, y + 57, 30, h - 56, colors.px.K);
    pen.fill(doorX - 46, y + 10, 92, 30, colors.px.K);
    pen.fill(doorX - 44, y + 12, 88, 26, colors.px.Y);
    pen.fill(doorX - 42, y + 14, 84, 22, colors.px.A);
    pen.fill(doorX - 41, y + 15, 82, 20, colors.px.Y);
    drawIcon(pen.ctx, colors, "arcade", doorX - 12, y + 13, 2);
    drawIcon(pen.ctx, colors, "star", doorX - 36, y + 19);
    drawIcon(pen.ctx, colors, "star", doorX + 24, y + 19);
    pen.fill(doorX - 2, y + 40, 4, 10, colors.px.K);
    pen.fill(doorX - 30, y + 40, 3, 8, colors.px.K);
    pen.fill(doorX + 27, y + 40, 3, 8, colors.px.K);
  },
  fort(pen, colors, x, y, w, h, doorX) {
    paintBuildingShadow(pen, colors, x, y, w, h);
    const stone = colors.tok("world-stone");
    const light = colors.tok("world-stone-light");
    const dark = colors.tok("world-stone-dark");
    const blocks = (bx: number, by: number, bw: number, bh: number): void => {
      pen.fill(bx, by, bw, bh, stone);
      for (let row = 0; row < bh; row += 5) {
        const offset = (row / 5) % 2 ? 4 : 0;
        pen.fill(bx, by + row + 4, bw, 1, dark);
        for (let col = offset; col < bw; col += 8) pen.fill(bx + col, by + row, 1, 4, dark);
        pen.fill(bx, by + row, bw, 1, light);
      }
    };
    pen.fill(x + 12, y + 12, w - 24, 34, colors.tok("arena-sand"));
    for (let index = 0; index < 50; index++) pen.dot(x + 13 + Math.floor(hash2(index, 7) * (w - 26)), y + 13 + Math.floor(hash2(7, index) * 32), colors.tok("arena-sand-shade"));
    const ringX = x + w / 2;
    const ringY = y + 30;
    for (let angle = 0; angle < Math.PI * 2; angle += 0.04) {
      pen.dot(ringX + Math.cos(angle) * 30, ringY + Math.sin(angle) * 11, colors.tok("arena-sand-shade"));
      pen.dot(ringX + Math.cos(angle) * 29, ringY + Math.sin(angle) * 10, colors.px.C);
    }
    drawIcon(pen.ctx, colors, "swords", ringX - 6, ringY - 6);
    blocks(x + 2, y + 2, w - 4, 10);
    blocks(x + 2, y + 12, 10, 36);
    blocks(x + w - 12, y + 12, 10, 36);
    pen.frame(x + 1, y + 1, w - 2, 47, colors.px.K);
    pen.frame(x + 11, y + 11, w - 22, 36, colors.px.K);
    blocks(x + 2, y + 50, w - 4, h - 50);
    for (let mx = x + 2; mx < x + w - 4; mx += 10) {
      pen.fill(mx, y + 44, 6, 6, stone);
      pen.fill(mx, y + 44, 6, 1, light);
      pen.frame(mx - 1, y + 43, 8, 8, colors.px.K);
    }
    pen.frame(x + 1, y + 49, w - 2, h - 48, colors.px.K);
    for (const tx of [x - 3, x + w - 21]) {
      pen.fill(tx, y + 34, 24, h - 34, stone);
      for (let row = y + 36; row < y + h; row += 5) {
        pen.fill(tx, row + 4, 24, 1, dark);
        pen.fill(tx + 1, row, 22, 1, light);
      }
      pen.fill(tx + 19, y + 34, 5, h - 34, dark);
      for (let mx = tx; mx < tx + 24; mx += 8) {
        pen.fill(mx, y + 29, 5, 5, stone);
        pen.frame(mx - 1, y + 28, 7, 7, colors.px.K);
      }
      pen.frame(tx - 1, y + 33, 26, h - 32, colors.px.K);
      pen.fill(tx + 9, y + 50, 5, 10, colors.px.K);
    }
    pen.fill(doorX - 13, y + 62, 26, h - 62, colors.px.K);
    pen.fill(doorX - 11, y + 60, 22, 2, colors.px.K);
    pen.fill(doorX - 11, y + 64, 22, h - 64, colors.px.N);
    for (let bar = doorX - 10; bar < doorX + 11; bar += 4) pen.fill(bar, y + 64, 1, 12, colors.tok("world-stone"));
    pen.fill(doorX - 11, y + 75, 22, 1, colors.tok("world-stone"));
    for (const bx of [doorX - 26, doorX + 18]) {
      pen.fill(bx, y + 54, 8, 20, colors.px.X);
      pen.fill(bx + 1, y + 54, 6, 18, colors.px.R);
      pen.fill(bx, y + 72, 2, 3, colors.px.X);
      pen.fill(bx + 6, y + 72, 2, 3, colors.px.X);
      pen.fill(bx + 3, y + 60, 2, 2, colors.px.Y);
      pen.fill(bx + 2, y + 62, 4, 1, colors.px.Y);
      pen.fill(bx - 1, y + 53, 10, 1, colors.px.K);
    }
  },
  lighthouse(pen, colors, x, y, w, h, doorX) {
    const cream = colors.px.W;
    const shade = colors.px.I;
    const red = colors.px.R;
    const crimson = colors.px.X;
    for (let row = 0; row < 50; row++) {
      const half = Math.round(9 + (row / 50) * 6);
      const ry = y + 16 + row;
      const band = (row >= 10 && row < 17) || (row >= 30 && row < 37);
      pen.fill(doorX - half, ry, half * 2, 1, band ? red : cream);
      pen.fill(doorX + half - 4, ry, 4, 1, band ? crimson : shade);
      pen.fill(doorX - half + 1, ry, 1, 1, band ? colors.px.r : colors.px.W);
      pen.dot(doorX - half - 1, ry, colors.px.K);
      pen.dot(doorX + half, ry, colors.px.K);
    }
    pen.fill(doorX - 14, y + 12, 28, 4, colors.px.K);
    pen.fill(doorX - 13, y + 13, 26, 2, colors.tok("world-stone"));
    pen.fill(doorX - 8, y + 2, 16, 10, colors.px.K);
    pen.fill(doorX - 6, y + 3, 12, 8, colors.px.Y);
    pen.fill(doorX - 1, y + 3, 2, 8, colors.px.A);
    pen.fill(doorX - 7, y - 2, 14, 4, red);
    pen.fill(doorX - 5, y - 4, 10, 2, red);
    pen.fill(doorX - 1, y - 7, 2, 3, colors.px.K);
    pen.frame(doorX - 8, y - 3, 16, 6, colors.px.K);
    paintDoor(pen, colors, doorX, y + 66, 8, 12, colors.tok("world-wood"), colors.tok("world-wood-dark"));
    pen.fill(doorX - 4, y + 34, 3, 4, colors.tok("world-glass"));
    pen.frame(doorX - 5, y + 33, 5, 6, colors.px.K);
    const rocks = [[x - 2, y + 64, 12], [x + 30, y + 64, 12], [x + 4, y + 68, 10], [x + 34, y + 69, 9]];
    for (const [rx, ry, size] of rocks) {
      pen.fill(rx, ry, size, size - 3, colors.tok("world-stone"));
      pen.fill(rx, ry, size, 2, colors.tok("world-stone-light"));
      pen.fill(rx + size - 3, ry + 2, 3, size - 5, colors.tok("world-stone-dark"));
      pen.frame(rx - 1, ry - 1, size + 2, size - 1, colors.px.K);
    }
  },
  hospital(pen, colors, x, y, w, h, doorX) {
    paintBuildingShadow(pen, colors, x, y, w, h);
    pen.fill(x + 2, y + 4, w - 4, 30, colors.tok("world-stone-light"));
    for (let index = 0; index < 40; index++) pen.dot(x + 3 + Math.floor(hash2(index, 11) * (w - 6)), y + 5 + Math.floor(hash2(11, index) * 28), colors.tok("world-stone"));
    pen.frame(x + 1, y + 3, w - 2, 32, colors.px.K);
    const padX = x + w / 2;
    const padY = y + 18;
    for (let py = -11; py <= 11; py++) {
      for (let px = -13; px <= 13; px++) {
        const distance = (px * px) / 169 + (py * py) / 121;
        if (distance <= 1) pen.dot(padX + px, padY + py, distance > 0.72 ? colors.px.Y : colors.tok("world-stone"));
      }
    }
    pen.fill(padX - 5, padY - 5, 2, 11, colors.px.W);
    pen.fill(padX + 3, padY - 5, 2, 11, colors.px.W);
    pen.fill(padX - 3, padY, 6, 2, colors.px.W);
    paintWall(pen, colors, x + 2, y + 34, w - 4, h - 34, colors.tok("facade-hospital"), colors.tok("facade-hospital-shade"));
    pen.fill(x + 2, y + 36, w - 4, 6, colors.tok("facade-hospital-band"));
    pen.fill(x + 2, y + 42, w - 4, 1, colors.px.t);
    for (const row of [y + 47, y + 63]) {
      for (const col of [x + 8, x + 22, x + w - 30, x + w - 16]) {
        pen.fill(col, row, 8, 9, colors.tok("world-glass"));
        pen.fill(col + 1, row + 1, 2, 1, colors.tok("world-glass-light"));
        pen.frame(col - 1, row - 1, 10, 11, colors.px.K);
      }
    }
    pen.fill(doorX - 9, y + 34, 18, 16, colors.px.W);
    pen.frame(doorX - 10, y + 33, 20, 18, colors.px.K);
    drawIcon(pen.ctx, colors, "heart", doorX - 6, y + 36);
    pen.fill(doorX - 16, y + 66, 32, 5, colors.tok("facade-hospital-band"));
    for (let stripe = doorX - 16; stripe < doorX + 16; stripe += 6) pen.fill(stripe, y + 66, 3, 5, colors.px.W);
    pen.frame(doorX - 17, y + 65, 34, 7, colors.px.K);
    pen.fill(doorX - 10, y + 72, 20, h - 72, colors.tok("world-glass"));
    pen.fill(doorX, y + 72, 1, h - 72, colors.px.W);
    pen.fill(doorX - 7, y + 74, 2, 6, colors.tok("world-glass-light"));
    pen.frame(doorX - 11, y + 71, 22, h - 70, colors.px.K);
  },
  school(pen, colors, x, y, w, h, doorX) {
    paintBuildingShadow(pen, colors, x, y, w, h);
    paintRoof(pen, colors, x + 3, y + 4, w - 6, 28);
    pen.fill(doorX - 9, y - 12, 18, 26, colors.tok("facade-trim"));
    pen.fill(doorX + 5, y - 12, 4, 26, colors.tok("facade-auction-shade"));
    pen.fill(doorX - 5, y - 7, 10, 12, colors.px.K);
    pen.fill(doorX - 3, y - 4, 6, 5, colors.px.Y);
    pen.fill(doorX - 1, y + 1, 2, 2, colors.px.A);
    pen.frame(doorX - 10, y - 13, 20, 28, colors.px.K);
    pen.fill(doorX - 11, y - 18, 22, 6, colors.tok("world-roof"));
    pen.fill(doorX - 9, y - 21, 18, 3, colors.tok("world-roof-dark"));
    pen.frame(doorX - 12, y - 22, 24, 11, colors.px.K);
    paintWall(pen, colors, x + 4, y + 34, w - 8, h - 34, colors.tok("facade-school"), colors.tok("facade-school-shade"));
    pen.fill(x + 4, y + 34, w - 8, 3, colors.tok("facade-trim"));
    for (const px of [x + 4, x + w - 7, doorX - 14, doorX + 12]) pen.fill(px, y + 37, 3, h - 40, colors.tok("facade-trim"));
    for (const wx of [x + 14, x + 32, x + w - 42, x + w - 24]) paintWindow(pen, colors, wx, y + 46, 10, 15, true);
    pen.fill(doorX - 8, y + 39, 16, 10, colors.px.W);
    pen.frame(doorX - 9, y + 38, 18, 12, colors.px.K);
    drawIcon(pen.ctx, colors, "book", doorX - 6, y + 37);
    paintDoor(pen, colors, doorX, y + h - 3, 16, 24, colors.tok("world-wood"), colors.tok("world-wood-dark"));
    pen.fill(doorX - 12, y + h - 3, 24, 3, colors.tok("world-stone-light"));
    pen.frame(doorX - 13, y + h - 4, 26, 5, colors.px.K);
  }
};
