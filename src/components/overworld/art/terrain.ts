import { bayer, context, createCanvas, hash2, TILE } from "@/components/overworld/art/canvas";
import type { Colors, Rgb } from "@/components/overworld/art/palette";
import { isWaterType, terrain, type TerrainType } from "@/components/overworld/model/map";

export interface PaintedTerrain {
  canvas: HTMLCanvasElement;
  shore: number[];
  depth: Float32Array;
}

const isGround = (type: TerrainType): boolean => type === terrain.SAND || type === terrain.GRASS || type === terrain.ROAD || type === terrain.PLAZA;

function buildPixelTypes(grid: TerrainType[][], cols: number, rows: number): Uint8Array {
  const width = cols * TILE;
  const types = new Uint8Array(width * rows * TILE);
  const typeAt = (tx: number, ty: number): TerrainType => (tx < 0 || ty < 0 || tx >= cols || ty >= rows ? terrain.WATER : grid[ty][tx]);
  const corners: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  for (let ty = 0; ty < rows; ty++) {
    for (let tx = 0; tx < cols; tx++) {
      const type = typeAt(tx, ty);
      for (let ly = 0; ly < TILE; ly++) {
        for (let lx = 0; lx < TILE; lx++) {
          let pixelType: TerrainType = type;
          for (const [dx, dy] of corners) {
            const inCornerX = dx < 0 ? lx : TILE - 1 - lx;
            const inCornerY = dy < 0 ? ly : TILE - 1 - ly;
            const horizontal = typeAt(tx + dx, ty);
            const vertical = typeAt(tx, ty + dy);
            const diagonal = typeAt(tx + dx, ty + dy);
            if (isGround(type) && isWaterType(horizontal) && isWaterType(vertical)) {
              const radius = 7;
              if (inCornerX < radius && inCornerY < radius && Math.hypot(inCornerX + 0.5 - radius, inCornerY + 0.5 - radius) > radius) pixelType = horizontal;
            } else if (type === terrain.GRASS && horizontal !== terrain.GRASS && horizontal === vertical && isGround(horizontal)) {
              const radius = 4;
              if (inCornerX < radius && inCornerY < radius && Math.hypot(inCornerX + 0.5 - radius, inCornerY + 0.5 - radius) > radius) pixelType = horizontal;
            } else if (isWaterType(type) && isGround(horizontal) && horizontal === vertical && diagonal === horizontal) {
              if (Math.hypot(inCornerX + 0.5, inCornerY + 0.5) < 6) pixelType = horizontal;
            }
          }
          types[(ty * TILE + ly) * width + tx * TILE + lx] = pixelType;
        }
      }
    }
  }
  return types;
}

function waterDepths(grid: TerrainType[][], cols: number, rows: number): Float32Array {
  const depth = new Float32Array(cols * rows).fill(99);
  const queue: [number, number][] = [];
  for (let ty = 0; ty < rows; ty++) {
    for (let tx = 0; tx < cols; tx++) {
      if (!isWaterType(grid[ty][tx])) {
        depth[ty * cols + tx] = 0;
        queue.push([tx, ty]);
      }
    }
  }
  let head = 0;
  while (head < queue.length) {
    const [tx, ty] = queue[head++];
    const current = depth[ty * cols + tx];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = tx + dx;
      const ny = ty + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const index = ny * cols + nx;
      if (depth[index] > current + 1) {
        depth[index] = current + 1;
        queue.push([nx, ny]);
      }
    }
  }
  for (let ty = 0; ty < rows; ty++) {
    for (let tx = 0; tx < cols; tx++) {
      if (grid[ty][tx] === terrain.RIVER) depth[ty * cols + tx] = Math.min(depth[ty * cols + tx], 1.6);
    }
  }
  return depth;
}

function sampleDepth(depth: Float32Array, cols: number, rows: number, px: number, py: number): number {
  const fx = (px - TILE / 2) / TILE;
  const fy = (py - TILE / 2) / TILE;
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const get = (tx: number, ty: number): number => {
    const cx = Math.min(cols - 1, Math.max(0, tx));
    const cy = Math.min(rows - 1, Math.max(0, ty));
    return depth[cy * cols + cx] + Math.abs(tx - cx) + Math.abs(ty - cy);
  };
  const ax = fx - x0;
  const ay = fy - y0;
  const top = get(x0, y0) * (1 - ax) + get(x0 + 1, y0) * ax;
  const bottom = get(x0, y0 + 1) * (1 - ax) + get(x0 + 1, y0 + 1) * ax;
  return top * (1 - ay) + bottom * ay;
}

function waterColorAt(colors: Colors, value: number, x: number, y: number): Rgb {
  const dithered = value + (bayer(x, y) - 0.5) * 0.9;
  if (dithered < 1.3) return colors.rgbTok("world-shallow");
  if (dithered < 2.2) return colors.rgbTok("world-lagoon");
  if (dithered < 3.6) return colors.rgbTok("world-sea");
  return colors.rgbTok("world-sea-deep");
}

export function paintTerrain(colors: Colors, grid: TerrainType[][], cols: number, rows: number): PaintedTerrain {
  const width = cols * TILE;
  const height = rows * TILE;
  const types = buildPixelTypes(grid, cols, rows);
  const depth = waterDepths(grid, cols, rows);
  const canvas = createCanvas(width, height);
  const ctx = context(canvas);
  const image = ctx.createImageData(width, height);
  const data = image.data;
  const shore: number[] = [];
  const typeAt = (x: number, y: number): TerrainType => (x < 0 || y < 0 || x >= width || y >= height ? terrain.WATER : (types[y * width + x] as TerrainType));
  const notWater = (x: number, y: number): boolean => !isWaterType(typeAt(x, y));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const type = types[index] as TerrainType;
      const up = typeAt(x, y - 1);
      const down = typeAt(x, y + 1);
      const left = typeAt(x - 1, y);
      const right = typeAt(x + 1, y);
      let rgb: Rgb;
      if (isWaterType(type)) {
        const touchesLand = notWater(x, y - 1) || notWater(x, y + 1) || notWater(x - 1, y) || notWater(x + 1, y);
        const nearLand = notWater(x, y - 2) || notWater(x, y + 2) || notWater(x - 2, y) || notWater(x + 2, y);
        if (touchesLand) {
          rgb = colors.rgbTok("world-foam");
          shore.push(x, y);
        } else if (nearLand && hash2(x, y, 4) < 0.55) rgb = colors.rgbTok("world-shallow");
        else rgb = waterColorAt(colors, sampleDepth(depth, cols, rows, x + 0.5, y + 0.5), x, y);
      } else if (type === terrain.SAND) {
        const wet = [1, 2].some((d) => isWaterType(typeAt(x, y - d)) || isWaterType(typeAt(x, y + d)) || isWaterType(typeAt(x - d, y)) || isWaterType(typeAt(x + d, y)));
        const noise = hash2(x, y, 11);
        if (up === terrain.GRASS) rgb = colors.rgbTok("world-sand-dark");
        else if (typeAt(x, y - 2) === terrain.GRASS) rgb = colors.rgbTok("world-sand-shade");
        else if (wet && bayer(x, y) < 0.6) rgb = colors.rgbTok("world-sand-shade");
        else if (noise < 0.035) rgb = colors.rgbTok("world-sand-dark");
        else if (noise < 0.11) rgb = colors.rgbTok("world-sand-shade");
        else rgb = colors.rgbTok("world-sand");
      } else if (type === terrain.GRASS) {
        if (down !== terrain.GRASS) rgb = colors.rgbTok("world-grass-deep");
        else if (typeAt(x, y + 2) !== terrain.GRASS) rgb = colors.rgbTok("world-grass-dark");
        else if (left !== terrain.GRASS || right !== terrain.GRASS || up !== terrain.GRASS) rgb = colors.rgbTok("world-grass-dark");
        else {
          const cellX = Math.floor(x / 7);
          const cellY = Math.floor(y / 6);
          const roll = hash2(cellX, cellY, 21);
          const lx = x - (cellX * 7 + 1 + Math.floor(hash2(cellX, cellY, 22) * 4));
          const ly = y - (cellY * 6 + 1 + Math.floor(hash2(cellX, cellY, 23) * 3));
          rgb = colors.rgbTok("world-grass");
          if (roll < 0.62) {
            if (lx === 1 && ly === 0) rgb = colors.rgbTok("world-grass-light");
            else if ((lx === 0 || lx === 2) && ly === 1) rgb = colors.rgbTok("world-grass-dark");
          } else if (roll > 0.94) {
            const petal = roll > 0.97 ? "world-flower-a" : "world-flower-c";
            if (lx === 1 && ly === 1) rgb = colors.rgbTok("world-flower-b");
            else if (((lx === 0 || lx === 2) && ly === 1) || (lx === 1 && (ly === 0 || ly === 2))) rgb = colors.rgbTok(petal);
          }
        }
      } else if (type === terrain.ROAD) {
        if (up === terrain.GRASS) rgb = colors.rgbTok("world-road-gap");
        else {
          const row = Math.floor(y / 5);
          const shift = row % 2 ? 3 : 0;
          const lx = (x + shift) % 7;
          const ly = y % 5;
          const tint = hash2(Math.floor((x + shift) / 7), row, 31);
          if (lx === 6 || ly === 4) rgb = colors.rgbTok("world-road-gap");
          else if ((lx === 0 || lx === 5) && (ly === 0 || ly === 3)) rgb = colors.rgbTok("world-road-shade");
          else if (ly === 0) rgb = colors.rgbTok("world-plaza-light");
          else if (ly === 3) rgb = colors.rgbTok("world-road-shade");
          else rgb = tint < 0.18 ? colors.rgbTok("world-road-shade") : colors.rgbTok("world-road");
        }
      } else if (type === terrain.PLAZA) {
        const edge = [1, 2].some((d) => typeAt(x, y - d) !== terrain.PLAZA || typeAt(x, y + d) !== terrain.PLAZA || typeAt(x - d, y) !== terrain.PLAZA || typeAt(x + d, y) !== terrain.PLAZA);
        if (edge) rgb = colors.rgbTok("world-road-shade");
        else {
          const wave = Math.round(2.5 * Math.sin((x * Math.PI) / 10));
          const band = (((y + wave) % 7) + 7) % 7;
          rgb = band < 2 ? colors.rgbTok("world-plaza-dark") : colors.rgbTok("world-plaza-light");
        }
      } else if (type === terrain.BRIDGE) {
        const lx = x % TILE;
        const leftEdge = typeAt(x - (lx + 1), y) !== terrain.BRIDGE;
        const rightEdge = typeAt(x + (TILE - lx), y) !== terrain.BRIDGE;
        if ((leftEdge && lx < 2) || (rightEdge && lx > TILE - 3)) rgb = y % 8 < 3 ? colors.rgbTok("world-wood-deep") : colors.rgbTok("world-wood-dark");
        else if (y % 4 === 3) rgb = colors.rgbTok("world-wood-deep");
        else rgb = Math.floor(y / 4) % 2 ? colors.rgbTok("world-wood") : colors.rgbTok("world-wood-light");
      } else {
        const ly = y % TILE;
        const topEdge = typeAt(x, y - (ly + 1)) !== terrain.PIER;
        const bottomEdge = typeAt(x, y + (TILE - ly)) !== terrain.PIER;
        if ((topEdge && ly < 2) || (bottomEdge && ly > TILE - 3)) rgb = colors.rgbTok("world-wood-dark");
        else if (x % 5 === 4) rgb = colors.rgbTok("world-wood-deep");
        else rgb = Math.floor(x / 5) % 2 ? colors.rgbTok("world-wood") : colors.rgbTok("world-wood-light");
      }
      data[index * 4] = rgb[0];
      data[index * 4 + 1] = rgb[1];
      data[index * 4 + 2] = rgb[2];
      data[index * 4 + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  return { canvas, shore, depth };
}
