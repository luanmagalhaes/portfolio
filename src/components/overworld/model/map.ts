export const TILE_SIZE = 16;

export type DistrictId = "house" | "arcade" | "auction" | "harbor" | "fort" | "lighthouse" | "school" | "hospital" | "bridge" | "post";

export type BuildingId = Exclude<DistrictId, "harbor" | "bridge">;

export type FacingDirection = "up" | "down" | "left" | "right";

export interface TilePoint {
  x: number;
  y: number;
}

export interface Building {
  id: BuildingId;
  x: number;
  y: number;
  w: number;
  h: number;
  door: TilePoint;
}

export interface Place {
  id: DistrictId;
  icon: string;
  kind: "door" | "npc" | "sign";
  entry: TilePoint;
  face: FacingDirection;
  anchor: TilePoint | null;
  order: number;
}

export interface Npc {
  id: string;
  look: "kid" | "harbor" | "keeper" | "nurse";
  x: number;
  y: number;
  place: DistrictId | null;
  lines: "kid" | "keeper" | "nurse" | null;
}

export const terrain = { WATER: 1, RIVER: 2, SAND: 3, GRASS: 4, ROAD: 5, PLAZA: 6, BRIDGE: 7, PIER: 8 } as const;

export type TerrainType = (typeof terrain)[keyof typeof terrain];

const terrainByChar: Record<string, TerrainType> = { "~": 1, r: 2, ".": 3, ",": 4, ":": 5, "#": 6, "=": 7, p: 8 };

export const townRows: readonly string[] = [
  "~~~~~~~~~~~~~~~~~~~~~~~~",
  "~~~~~.........~~.,,,.~~~",
  "~~.,,,,,,,,,::,,,,,,,,.~",
  "~~.,,,,,,,,,::,,,,,,,,.~",
  "~.,,,,,,,,,,::,,,,,,,,.~",
  "~.,,,,,,,,,,::,,,,,,,,.~",
  "~.,,,,,,,,,,::,,,,:,,,.~",
  "~.,,,,,,,,,,::,,,,:,,,.~",
  "~.,::::::::::::::::::,.~",
  "~.,,,,,,,,,,::,,,,,,,,.~",
  "~.,,,,,,,,,,::,,,,,,,,.~",
  "~.,,,,,,,,,,::,,,,,,,,.~",
  "~.,,,,,,,,,,::,,,,,,,,.~",
  "~.,,,,,,,,,,::,,,,,,,,.~",
  "~.,,,,,,,,,,::,,,,,,,,.~",
  "~.,,,,,,,,,,::,,,,,,,,.~",
  "~.::::::::::::::::::::.~",
  "~.,,,,,,#######,,,,,,,.~",
  "~.,,,,,,#######,,,,,,,.~",
  "~~,,,,,,#######,,,,,,,.~",
  "~~,,,,,,#######,,,,,,,.~",
  "~.,,,,,,#######,,,,,,,.~",
  "~.,,,,,,#######,,,,,,,.~",
  "~.::::::#######,,,,,,,.~",
  "~.::::::::::::::::::::.~",
  "~.....,,,,,,:::::.~~~~~~",
  "~.....,,,,,,:::::.~~~~~~",
  "~.....,,,,,,:::::pppppp~",
  "~.....,,,,,,:::::pppppp~",
  "~.....,,,,,,:::::.~~~~~~",
  "~~....,,,,,,::,,..~~~~~~",
  "rrrrrrrrrrrr==rrrrrrrrrr",
  "rrrrrrrrrrrr==rrrrrrrrrr",
  "~.::::::::::::::::::::.~",
  "~.,,,,,,,,,,::,,,,,,,,.~",
  "~.,,,,,,,,,,::,,,,,,,,.~",
  "~.,,,,,,,,,,::,,,,,,,,.~",
  "~.,,,,,,,,,,::,,,,,,,,.~",
  "~.,,,,,,,,,,::,,,,,,,,.~",
  "~.,,,,,,,,,,::,,,,,,,,.~",
  "~.::::::::::::::::::::.~",
  "~~....................~~",
  "~~~~................~~~~",
  "~~~~~~~~~~~~~~~~~~~~~~~~",
];

export const townSize = { cols: townRows[0].length, rows: townRows.length };

export function terrainGrid(rows: readonly string[]): TerrainType[][] {
  return rows.map((line) => line.split("").map((char) => terrainByChar[char] ?? terrain.WATER));
}

export function isWaterType(type: TerrainType): boolean {
  return type === terrain.WATER || type === terrain.RIVER;
}

export const townBuildings: readonly Building[] = [
  { id: "fort", x: 3, y: 2, w: 9, h: 6, door: { x: 7, y: 7 } },
  { id: "lighthouse", x: 17, y: 1, w: 3, h: 5, door: { x: 18, y: 5 } },
  { id: "arcade", x: 2, y: 10, w: 9, h: 6, door: { x: 6, y: 15 } },
  { id: "post", x: 16, y: 11, w: 5, h: 5, door: { x: 18, y: 15 } },
  { id: "house", x: 2, y: 18, w: 5, h: 5, door: { x: 4, y: 22 } },
  { id: "auction", x: 15, y: 18, w: 7, h: 6, door: { x: 18, y: 23 } },
  { id: "hospital", x: 2, y: 34, w: 7, h: 6, door: { x: 5, y: 39 } },
  { id: "school", x: 15, y: 34, w: 7, h: 6, door: { x: 18, y: 39 } },
];

export const townDecor = {
  palms: [[14, 3], [20, 7], [21, 10], [21, 13], [1, 17], [3, 25], [5, 29], [2, 30], [22, 22], [22, 18], [9, 35], [14, 37], [1, 37], [22, 38], [6, 41], [17, 41], [1, 9]],
  bushes: [[11, 11], [11, 14], [14, 11], [14, 14], [7, 19], [9, 39], [14, 35], [14, 39], [21, 9], [10, 34], [3, 9], [9, 9]],
  rocks: [[0, 6], [0, 13], [23, 19], [23, 36], [0, 34], [16, 1], [20, 1], [23, 9], [21, 29]],
  lamps: [[11, 9], [14, 9], [11, 25], [11, 34], [14, 34]],
  benches: [[9, 18], [9, 22]],
  fountain: [10, 19],
  flame: [14, 17],
  doghouse: [7, 21],
  mailbox: [15, 15],
  signs: [
    { id: "welcome", x: 7, y: 17 },
    { id: "bridge", x: 11, y: 30 },
  ],
  crates: [[16, 25], [16, 29], [15, 29]],
  barrels: [[14, 29]],
  umbrellas: [[2, 26], [3, 28]],
  shells: [[4, 25], [2, 41], [12, 42], [19, 41], [6, 27]],
  jangada: [1, 27],
} as const;

export const townNpcs: readonly Npc[] = [
  { id: "kid", look: "kid", x: 10, y: 21, place: null, lines: "kid" },
  { id: "harbor", look: "harbor", x: 17, y: 26, place: "harbor", lines: null },
  { id: "keeper", look: "keeper", x: 20, y: 5, place: null, lines: "keeper" },
  { id: "nurse", look: "nurse", x: 7, y: 40, place: null, lines: "nurse" },
];

export const places: readonly Place[] = [
  { id: "house", icon: "house", kind: "door", entry: { x: 4, y: 23 }, face: "up", anchor: null, order: 1 },
  { id: "arcade", icon: "arcade", kind: "door", entry: { x: 6, y: 16 }, face: "up", anchor: null, order: 2 },
  { id: "auction", icon: "gavel", kind: "door", entry: { x: 18, y: 24 }, face: "up", anchor: null, order: 3 },
  { id: "harbor", icon: "anchor", kind: "npc", entry: { x: 17, y: 27 }, face: "up", anchor: { x: 20, y: 25 }, order: 4 },
  { id: "fort", icon: "swords", kind: "door", entry: { x: 7, y: 8 }, face: "up", anchor: null, order: 5 },
  { id: "lighthouse", icon: "lighthouse", kind: "door", entry: { x: 18, y: 6 }, face: "up", anchor: null, order: 6 },
  { id: "school", icon: "book", kind: "door", entry: { x: 18, y: 40 }, face: "up", anchor: null, order: 7 },
  { id: "hospital", icon: "heart", kind: "door", entry: { x: 5, y: 40 }, face: "up", anchor: null, order: 8 },
  { id: "bridge", icon: "bridge", kind: "sign", entry: { x: 12, y: 30 }, face: "left", anchor: { x: 12, y: 31 }, order: 9 },
  { id: "post", icon: "envelope", kind: "door", entry: { x: 18, y: 16 }, face: "up", anchor: null, order: 10 },
];

export const exploredPlaceIds: readonly DistrictId[] = places.filter((place) => place.id !== "bridge").map((place) => place.id);

export const townSpawn = { x: 9, y: 19, dir: "down" as FacingDirection };

export function buildingById(id: DistrictId): Building | undefined {
  return townBuildings.find((building) => building.id === id);
}

export function placeById(id: DistrictId): Place {
  const place = places.find((entry) => entry.id === id);
  if (!place) throw new Error("Unknown place " + id);
  return place;
}

export function placeAnchor(place: Place): { x: number; y: number } {
  const building = buildingById(place.id);
  if (building) {
    const lift: Partial<Record<DistrictId, number>> = { lighthouse: 10, school: 22 };
    return { x: (building.x + building.w / 2) * TILE_SIZE, y: building.y * TILE_SIZE - 2 - (lift[place.id] ?? 0) };
  }
  const anchor = place.anchor ?? place.entry;
  return { x: anchor.x * TILE_SIZE + TILE_SIZE / 2, y: anchor.y * TILE_SIZE };
}

export function placeAtTile(x: number, y: number): DistrictId | null {
  const building = townBuildings.find((entry) => x >= entry.x && x < entry.x + entry.w && y >= entry.y - 1 && y < entry.y + entry.h);
  if (building) return building.id;
  if (x >= 17 && y >= 24 && y <= 30) return "harbor";
  if (x === townDecor.signs[1].x && y === townDecor.signs[1].y) return "bridge";
  return null;
}

export interface ArcadeLayout {
  cols: number;
  rows: number;
  cabinets: TilePoint[];
  covered: TilePoint[];
  ropeColumn: { x: number; from: number; to: number };
  ropeRow: { y: number; from: number; to: number };
  privateSign: TilePoint;
  counter: { x: number; y: number; w: number; h: number };
  attendant: TilePoint;
  board: { x: number; w: number };
  plants: TilePoint[];
  sofa: { x: number; y: number; w: number };
  exits: TilePoint[];
  spawn: TilePoint;
}

export function arcadeLayoutFor(appCount: number, privateCount: number): ArcadeLayout {
  const cabinetRows = Math.max(1, Math.ceil(appCount / 4));
  const coveredRows = Math.max(1, Math.ceil(privateCount / 3));
  const ropeY = Math.max(2 + cabinetRows * 5 - 2, 2 + coveredRows * 4);
  const bottomStart = Math.max(2 + cabinetRows * 5, ropeY + 2);
  const rows = bottomStart + 4;
  const cabinets = Array.from({ length: appCount }, (_, index) => ({ x: 1 + (index % 4) * 4, y: 2 + Math.floor(index / 4) * 5 }));
  const covered = Array.from({ length: privateCount }, (_, index) => {
    const row = Math.floor(index / 3);
    return { x: 16 + (index % 3) * 2 + (row % 2), y: 2 + row * 4 };
  });
  return {
    cols: 24,
    rows,
    cabinets,
    covered,
    ropeColumn: { x: 15, from: 2, to: ropeY },
    ropeRow: { y: ropeY, from: 15, to: 22 },
    privateSign: { x: 19, y: ropeY },
    counter: { x: 1, y: bottomStart + 1, w: 3, h: 2 },
    attendant: { x: 2, y: bottomStart },
    board: { x: 4, w: 6 },
    plants: [
      { x: 22, y: rows - 2 },
      { x: 10, y: rows - 2 },
    ],
    sofa: { x: 17, y: rows - 2, w: 3 },
    exits: [
      { x: 11, y: rows - 1 },
      { x: 12, y: rows - 1 },
    ],
    spawn: { x: 11, y: rows - 2 },
  };
}

export interface Collision {
  cols: number;
  rows: number;
  solid: Uint8Array;
}

export function isWalkableTile(collision: Collision, x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < collision.cols && y < collision.rows && collision.solid[y * collision.cols + x] === 0;
}

export function townCollision(): Collision {
  const { cols, rows } = townSize;
  const solid = new Uint8Array(cols * rows);
  const block = (x: number, y: number): void => {
    if (x >= 0 && y >= 0 && x < cols && y < rows) solid[y * cols + x] = 1;
  };
  terrainGrid(townRows).forEach((line, y) => line.forEach((type, x) => {
    if (isWaterType(type)) block(x, y);
  }));
  for (const building of townBuildings) {
    for (let y = building.y; y < building.y + building.h; y++) for (let x = building.x; x < building.x + building.w; x++) block(x, y);
  }
  const decor = townDecor;
  const points: readonly (readonly [number, number])[] = [...decor.rocks, ...decor.umbrellas, ...decor.bushes, ...decor.palms, ...decor.lamps, ...decor.benches, ...decor.crates, ...decor.barrels, decor.flame, decor.doghouse, decor.mailbox];
  for (const [x, y] of points) block(x, y);
  const [fx, fy] = decor.fountain;
  block(fx, fy);
  block(fx + 1, fy);
  block(fx, fy + 1);
  block(fx + 1, fy + 1);
  const [jx, jy] = decor.jangada;
  block(jx, jy + 1);
  block(jx + 1, jy + 1);
  for (const sign of decor.signs) block(sign.x, sign.y);
  for (const npc of townNpcs) block(npc.x, npc.y);
  for (const building of townBuildings) solid[building.door.y * cols + building.door.x] = 0;
  return { cols, rows, solid };
}

export function arcadeCollision(layout: ArcadeLayout): Collision {
  const { cols, rows } = layout;
  const solid = new Uint8Array(cols * rows);
  const block = (x: number, y: number): void => {
    if (x >= 0 && y >= 0 && x < cols && y < rows) solid[y * cols + x] = 1;
  };
  const footprint = (spot: TilePoint): void => {
    block(spot.x, spot.y);
    block(spot.x + 1, spot.y);
    block(spot.x, spot.y + 1);
    block(spot.x + 1, spot.y + 1);
  };
  layout.cabinets.forEach(footprint);
  layout.covered.forEach(footprint);
  for (let y = layout.ropeColumn.from; y <= layout.ropeColumn.to; y++) block(layout.ropeColumn.x, y);
  for (let x = layout.ropeRow.from; x <= layout.ropeRow.to; x++) block(x, layout.ropeRow.y);
  for (let y = layout.counter.y; y < layout.counter.y + layout.counter.h; y++) for (let x = layout.counter.x; x < layout.counter.x + layout.counter.w; x++) block(x, y);
  for (let x = layout.sofa.x; x < layout.sofa.x + layout.sofa.w; x++) block(x, layout.sofa.y);
  layout.plants.forEach((spot) => block(spot.x, spot.y));
  for (let x = 0; x < cols; x++) {
    block(x, 0);
    block(x, 1);
    block(x, rows - 1);
  }
  for (let y = 0; y < rows; y++) {
    block(0, y);
    block(cols - 1, y);
  }
  block(layout.attendant.x, layout.attendant.y);
  layout.exits.forEach((exit) => {
    solid[exit.y * cols + exit.x] = 0;
  });
  return { cols, rows, solid };
}
