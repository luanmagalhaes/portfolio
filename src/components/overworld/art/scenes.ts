import { buildingPainters, drawIcon } from "@/components/overworld/art/buildings";
import { context, createCanvas, hash2, makePen, spriteCanvas, TILE } from "@/components/overworld/art/canvas";
import { makeBush, makeFlameTree, makeFountain, makeJangada, makeLamp, makePalm, makeRock, paintShip } from "@/components/overworld/art/decor";
import type { Colors } from "@/components/overworld/art/palette";
import { coveredCabinetShape, cabinetShape, decorArt, swapChars, type NpcLook } from "@/components/overworld/art/sprites";
import { paintTerrain } from "@/components/overworld/art/terrain";
import { arcadeCollision, terrain, terrainGrid, townBuildings, townCollision, townDecor, townNpcs, townRows, townSpawn, type ArcadeLayout, type DistrictId, type FacingDirection, type TerrainType } from "@/components/overworld/model/map";

export type SceneId = "town" | "arcade";

export type LineKey = "kid" | "keeper" | "nurse" | "welcome" | "attendant" | "board";

export type Speaker = NpcLook | "sign" | "matilda";

export interface TalkEntry {
  place?: DistrictId;
  app?: string;
  privateBuilds?: boolean;
  lines?: LineKey;
  speaker?: Speaker;
}

export interface SceneShip {
  x: number;
  y: number;
  phase: number;
  canvas: HTMLCanvasElement;
}

export interface SceneNpc {
  id: string;
  look: NpcLook;
  x: number;
  y: number;
}

export interface CabinetSpot {
  appId: string;
  x: number;
  y: number;
}

export interface Scene {
  id: SceneId;
  cols: number;
  rows: number;
  ground: HTMLCanvasElement;
  upper: HTMLCanvasElement;
  skirt: HTMLCanvasElement | null;
  skirtPad: number;
  solid: Uint8Array;
  doors: Map<string, string>;
  talk: Map<string, TalkEntry>;
  shore: number[];
  depth: Float32Array | null;
  outside: "sea" | "void";
  npcs: SceneNpc[];
  ships: SceneShip[];
  cabinets: CabinetSpot[];
  spawn: { x: number; y: number; dir: FacingDirection };
}

export interface CabinetApp {
  id: string;
  skin: Record<string, string>;
}

const skirtTiles = 12;

export function buildTownScene(colors: Colors): Scene {
  const cols = townRows[0].length;
  const rows = townRows.length;
  const pad = skirtTiles;
  const grid = terrainGrid(townRows);
  const padded: TerrainType[][] = [];
  for (let ty = -pad; ty < rows + pad; ty++) {
    const line: TerrainType[] = [];
    for (let tx = -pad; tx < cols + pad; tx++) line.push(ty >= 0 && ty < rows && tx >= 0 && tx < cols ? grid[ty][tx] : terrain.WATER);
    padded.push(line);
  }
  const painted = paintTerrain(colors, padded, cols + pad * 2, rows + pad * 2);
  const skirt = painted.canvas;
  const ground = createCanvas(cols * TILE, rows * TILE);
  context(ground).drawImage(skirt, -pad * TILE, -pad * TILE);
  const shore: number[] = [];
  for (let index = 0; index < painted.shore.length; index += 2) shore.push(painted.shore[index] - pad * TILE, painted.shore[index + 1] - pad * TILE);
  const depth = new Float32Array(cols * rows);
  for (let ty = 0; ty < rows; ty++) for (let tx = 0; tx < cols; tx++) depth[ty * cols + tx] = painted.depth[(ty + pad) * (cols + pad * 2) + tx + pad];
  const upper = createCanvas(cols * TILE, rows * TILE);
  const groundCtx = context(ground);
  const upperCtx = context(upper);
  const pen = makePen(groundCtx);
  const solid = townCollision().solid;
  for (let px = 17 * TILE + 6; px < 23 * TILE; px += 14) {
    pen.fill(px, 29 * TILE, 3, 6, colors.tok("world-wood-deep"));
    pen.fill(px, 29 * TILE + 6, 3, 1, colors.tok("world-foam"));
  }
  const doors = new Map<string, string>();
  const talk = new Map<string, TalkEntry>();
  for (const building of townBuildings) {
    solid[building.door.y * cols + building.door.x] = 0;
    doors.set(building.door.x + "," + building.door.y, building.id);
  }
  const splitDraw = (canvas: HTMLCanvasElement, worldX: number, worldY: number, splitY: number): void => {
    const cut = Math.max(0, Math.min(canvas.height, splitY - worldY));
    if (cut > 0) upperCtx.drawImage(canvas, 0, 0, canvas.width, cut, worldX, worldY, canvas.width, cut);
    if (cut < canvas.height) groundCtx.drawImage(canvas, 0, cut, canvas.width, canvas.height - cut, worldX, worldY + cut, canvas.width, canvas.height - cut);
  };
  const shadowEllipse = (cx: number, cy: number, rx: number, ry: number): void => {
    groundCtx.save();
    groundCtx.globalAlpha = 0.22;
    groundCtx.fillStyle = colors.tok("world-shadow");
    groundCtx.beginPath();
    groundCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    groundCtx.fill();
    groundCtx.restore();
  };
  townDecor.rocks.forEach(([tx, ty], index) => {
    groundCtx.drawImage(makeRock(colors, index), tx * TILE, ty * TILE + 2);
  });
  townDecor.shells.forEach(([tx, ty]) => groundCtx.drawImage(spriteCanvas(decorArt.shell, colors.px), tx * TILE + 5, ty * TILE + 6));
  townDecor.umbrellas.forEach(([tx, ty]) => {
    groundCtx.drawImage(spriteCanvas(decorArt.towel, colors.px), tx * TILE - 8, ty * TILE + 6);
    splitDraw(spriteCanvas(decorArt.umbrella, colors.px), tx * TILE - 8, ty * TILE - 2, ty * TILE + 6);
  });
  groundCtx.drawImage(makeJangada(colors), townDecor.jangada[0] * TILE - 2, townDecor.jangada[1] * TILE - 2);
  for (const building of townBuildings) {
    const x = building.x * TILE;
    const y = building.y * TILE;
    const doorX = building.door.x * TILE + TILE / 2;
    buildingPainters[building.id](pen, colors, x, y, building.w * TILE, building.h * TILE, doorX);
  }
  townDecor.bushes.forEach(([tx, ty], index) => {
    shadowEllipse(tx * TILE + 8, ty * TILE + 14, 8, 2);
    groundCtx.drawImage(makeBush(colors, index), tx * TILE - 2, ty * TILE);
  });
  townDecor.palms.forEach(([tx, ty], index) => {
    const palm = makePalm(colors, index);
    const worldX = tx * TILE + 8 - palm.anchorX;
    const worldY = ty * TILE + 15 - palm.anchorY;
    shadowEllipse(tx * TILE + 9, ty * TILE + 14, 7, 2);
    splitDraw(palm.canvas, worldX, worldY, ty * TILE + 6);
  });
  const flame = makeFlameTree(colors);
  shadowEllipse(townDecor.flame[0] * TILE + 8, townDecor.flame[1] * TILE + 13, 16, 4);
  splitDraw(flame.canvas, townDecor.flame[0] * TILE + 8 - flame.anchorX, townDecor.flame[1] * TILE + 15 - flame.anchorY, townDecor.flame[1] * TILE + 6);
  const lamp = makeLamp(colors);
  townDecor.lamps.forEach(([tx, ty]) => {
    splitDraw(lamp, tx * TILE, ty * TILE + 15 - 33, ty * TILE + 4);
  });
  const bench = spriteCanvas(decorArt.bench, colors.px);
  townDecor.benches.forEach(([tx, ty]) => {
    groundCtx.drawImage(bench, tx * TILE, ty * TILE);
  });
  const [fx, fy] = townDecor.fountain;
  groundCtx.drawImage(makeFountain(colors), fx * TILE, fy * TILE + 2);
  const [dx, dy] = townDecor.doghouse;
  groundCtx.drawImage(spriteCanvas(decorArt.doghouse, colors.px), dx * TILE - 4, dy * TILE);
  const [mx, my] = townDecor.mailbox;
  groundCtx.drawImage(spriteCanvas(decorArt.mailbox, colors.px), mx * TILE, my * TILE);
  townDecor.crates.forEach(([tx, ty]) => { groundCtx.drawImage(spriteCanvas(decorArt.crate, colors.px), tx * TILE, ty * TILE); });
  townDecor.barrels.forEach(([tx, ty]) => { groundCtx.drawImage(spriteCanvas(decorArt.barrel, colors.px), tx * TILE, ty * TILE); });
  const sign = spriteCanvas(decorArt.sign, colors.px);
  townDecor.signs.forEach((entry) => {
    groundCtx.drawImage(sign, entry.x * TILE, entry.y * TILE);
    talk.set(entry.x + "," + entry.y, entry.id === "bridge" ? { place: "bridge" } : { lines: "welcome", speaker: "sign" });
  });
  for (const bollardX of [18, 20, 22]) groundCtx.drawImage(spriteCanvas(decorArt.bollard, colors.px), bollardX * TILE, 27 * TILE - 7);
  for (const npc of townNpcs) {
    talk.set(npc.x + "," + npc.y, npc.place ? { place: npc.place } : { lines: npc.lines ?? "kid", speaker: npc.look });
  }
  const shipSpecs: { x: number; y: number; sail: string; shade: string; icon: string; size: "big" | "small"; phase: number }[] = [
    { x: 18 * TILE + 2, y: 24 * TILE - 14, sail: colors.px.W, shade: colors.px.I, icon: "hanger", size: "big", phase: 0 },
    { x: 18 * TILE + 8, y: 29 * TILE - 22, sail: colors.px.L, shade: colors.px.V, icon: "hanger", size: "big", phase: 1.7 },
    { x: 21 * TILE + 6, y: 24 * TILE - 4, sail: colors.px.d, shade: colors.px.h, icon: "key", size: "small", phase: 3.1 },
  ];
  const ships: SceneShip[] = shipSpecs.map((spec) => {
    const canvas = createCanvas(64, 56);
    paintShip(context(canvas), colors, 6, 8, spec.sail, spec.shade, spec.icon, spec.size);
    return { x: spec.x, y: spec.y, phase: spec.phase, canvas };
  });
  return {
    id: "town",
    cols,
    rows,
    ground,
    upper,
    skirt,
    skirtPad: pad,
    solid,
    doors,
    talk,
    shore,
    depth,
    outside: "sea",
    npcs: townNpcs.map((npc) => ({ id: npc.id, look: npc.look, x: npc.x, y: npc.y })),
    ships,
    cabinets: [],
    spawn: townSpawn,
  };
}


export function buildArcadeScene(colors: Colors, layout: ArcadeLayout, cabinetApps: CabinetApp[]): Scene {
  const cols = layout.cols;
  const rows = layout.rows;
  const width = cols * TILE;
  const height = rows * TILE;
  const ground = createCanvas(width, height);
  const upper = createCanvas(width, height);
  const ctx = context(ground);
  const pen = makePen(ctx);
  const solid = arcadeCollision(layout).solid;
  const talk = new Map<string, TalkEntry>();
  const doors = new Map<string, string>();
  pen.fill(0, 0, width, height, colors.tok("interior-floor"));
  const dots = [colors.tok("interior-floor-dot-a"), colors.tok("interior-floor-dot-b"), colors.tok("interior-floor-dot-c")];
  for (let y = 32; y < height - 16; y += 8) {
    for (let x = 16; x < width - 16; x += 8) {
      const roll = hash2(x, y, 41);
      const color = dots[Math.floor(roll * 3)];
      const ox = x + ((y / 8) % 2 ? 4 : 0);
      if (roll < 0.33) {
        pen.dot(ox, y, color);
        pen.dot(ox + 1, y + 1, color);
      } else if (roll < 0.66) {
        pen.dot(ox, y + 1, color);
        pen.dot(ox + 1, y, color);
        pen.dot(ox + 2, y + 1, color);
      } else pen.dot(ox + 1, y + 1, color);
    }
  }
  pen.fill(0, 0, width, 32, colors.tok("interior-wall"));
  for (let x = 0; x < width; x += 8) pen.fill(x, 0, 1, 28, colors.px.N);
  pen.fill(0, 26, width, 2, colors.tok("interior-neon-a"));
  pen.fill(0, 6, width, 1, colors.tok("interior-neon-b"));
  pen.fill(0, 28, width, 4, colors.tok("interior-wall-dark"));
  pen.fill(0, 0, 16, height, colors.tok("interior-wall"));
  pen.fill(width - 16, 0, 16, height, colors.tok("interior-wall"));
  pen.fill(14, 32, 2, height - 48, colors.tok("interior-wall-dark"));
  pen.fill(width - 16, 32, 2, height - 48, colors.tok("interior-wall-dark"));
  pen.fill(0, height - 16, width, 16, colors.tok("interior-wall"));
  pen.fill(0, height - 16, width, 2, colors.tok("interior-wall-dark"));
  const exitX = layout.exits[0].x * TILE;
  pen.fill(exitX, height - 16, 32, 16, colors.tok("interior-floor"));
  pen.fill(exitX + 2, height - 12, 28, 10, colors.px.X);
  pen.fill(exitX + 4, height - 10, 24, 6, colors.px.R);
  pen.frame(exitX + 1, height - 13, 30, 12, colors.px.K);
  const board = layout.board;
  pen.fill(board.x * TILE, 8, board.w * TILE, 18, colors.px.K);
  pen.fill(board.x * TILE + 2, 10, board.w * TILE - 4, 14, colors.px.N);
  drawIcon(ctx, colors, "check", board.x * TILE + 8, 11);
  drawIcon(ctx, colors, "star", board.x * TILE + board.w * TILE - 22, 11);
  for (const [px, icon] of [[18 * TILE + 2, "fish"], [21 * TILE, "vinyl"], [12 * TILE, "mic"]] as const) {
    pen.fill(px - 2, 7, 16, 16, colors.px.W);
    pen.frame(px - 3, 6, 18, 18, colors.px.K);
    drawIcon(ctx, colors, icon, px, 9);
  }
  const cabinets: CabinetSpot[] = [];
  cabinetApps.forEach((app, index) => {
    const spot = layout.cabinets[index];
    if (!spot) return;
    ctx.save();
    ctx.globalAlpha = 0.3;
    pen.fill(spot.x * TILE + 2, spot.y * TILE + 30, 30, 4, colors.px.K);
    ctx.restore();
    ctx.drawImage(spriteCanvas(swapChars(cabinetShape, app.skin), colors.px), spot.x * TILE, spot.y * TILE - 6);
    drawIcon(ctx, colors, "star", spot.x * TILE + 10, spot.y * TILE - 5);
    talk.set(spot.x + "," + (spot.y + 1), { app: app.id });
    talk.set(spot.x + 1 + "," + (spot.y + 1), { app: app.id });
    cabinets.push({ appId: app.id, x: spot.x, y: spot.y });
  });
  const covered = spriteCanvas(coveredCabinetShape, colors.px);
  layout.covered.forEach((spot) => {
    ctx.drawImage(covered, spot.x * TILE, spot.y * TILE - 6);
    drawIcon(ctx, colors, "lock", spot.x * TILE + 10, spot.y * TILE + 12);
  });
  const rope = layout.ropeColumn;
  const ropeRow = layout.ropeRow;
  const post = (px: number, py: number): void => {
    pen.fill(px - 1, py - 10, 4, 12, colors.tok("world-stone-light"));
    pen.fill(px + 1, py - 10, 2, 12, colors.tok("world-stone"));
    pen.fill(px - 2, py - 12, 6, 3, colors.px.Y);
    pen.frame(px - 3, py - 13, 8, 16, colors.px.K);
  };
  for (let ty = rope.from; ty < rope.to; ty += 2) {
    pen.fill(rope.x * TILE + 7, ty * TILE + 4, 2, 2 * TILE, colors.px.X);
    pen.fill(rope.x * TILE + 8, ty * TILE + 4, 1, 2 * TILE, colors.px.R);
  }
  pen.fill(rope.x * TILE + 8, ropeRow.y * TILE + 4, (ropeRow.to - rope.x) * TILE + 6, 2, colors.px.X);
  pen.fill(rope.x * TILE + 8, ropeRow.y * TILE + 4, (ropeRow.to - rope.x) * TILE + 6, 1, colors.px.R);
  for (let ty = rope.from; ty <= rope.to; ty += 2) post(rope.x * TILE + 7, ty * TILE + 8);
  for (let tx = ropeRow.from + 2; tx <= ropeRow.to; tx += 2) post(tx * TILE + 7, ropeRow.y * TILE + 8);
  const signTile = layout.privateSign;
  ctx.drawImage(spriteCanvas(decorArt.sign, colors.px), signTile.x * TILE, signTile.y * TILE - 2);
  drawIcon(ctx, colors, "lock", signTile.x * TILE + 2, signTile.y * TILE - 1);
  talk.set(signTile.x + "," + signTile.y, { privateBuilds: true });
  const counter = layout.counter;
  pen.fill(counter.x * TILE, counter.y * TILE - 4, counter.w * TILE, counter.h * TILE + 2, colors.px.P);
  pen.fill(counter.x * TILE, counter.y * TILE - 4, counter.w * TILE, 5, colors.px.V);
  pen.fill(counter.x * TILE + 4, counter.y * TILE + 6, counter.w * TILE - 8, 12, colors.px.M);
  drawIcon(ctx, colors, "coin", counter.x * TILE + 18, counter.y * TILE + 6);
  pen.frame(counter.x * TILE - 1, counter.y * TILE - 5, counter.w * TILE + 2, counter.h * TILE + 4, colors.px.K);
  const sofa = layout.sofa;
  pen.fill(sofa.x * TILE, sofa.y * TILE - 2, sofa.w * TILE, 16, colors.px.X);
  pen.fill(sofa.x * TILE, sofa.y * TILE - 2, sofa.w * TILE, 6, colors.px.R);
  pen.frame(sofa.x * TILE - 1, sofa.y * TILE - 3, sofa.w * TILE + 2, 18, colors.px.K);
  layout.plants.forEach((spot, index) => {
    ctx.drawImage(makeBush(colors, index + 20), spot.x * TILE - 2, spot.y * TILE - 6);
    pen.fill(spot.x * TILE + 3, spot.y * TILE + 8, 10, 7, colors.tok("world-wood"));
    pen.frame(spot.x * TILE + 2, spot.y * TILE + 7, 12, 9, colors.px.K);
  });
  for (let tx = board.x; tx < board.x + board.w; tx++) talk.set(tx + ",1", { lines: "board", speaker: "attendant" });
  layout.exits.forEach((exit) => doors.set(exit.x + "," + exit.y, "exit"));
  talk.set(layout.attendant.x + "," + layout.attendant.y, { lines: "attendant", speaker: "attendant" });
  return {
    id: "arcade",
    cols,
    rows,
    ground,
    upper,
    skirt: null,
    skirtPad: 0,
    solid,
    doors,
    talk,
    shore: [],
    depth: null,
    outside: "void",
    npcs: [{ id: "attendant", look: "attendant", x: layout.attendant.x, y: layout.attendant.y }],
    ships: [],
    cabinets,
    spawn: { x: layout.spawn.x, y: layout.spawn.y, dir: "up" },
  };
}
