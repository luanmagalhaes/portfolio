export interface Point {
  x: number;
  y: number;
}

export type Direction = "up" | "down" | "left" | "right";

export interface TileMap {
  width: number;
  height: number;
  tileAt(point: Point): string | null;
  isWalkable(point: Point): boolean;
}

export const offsets: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function samePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

export function move(point: Point, direction: Direction): Point {
  return { x: point.x + offsets[direction].x, y: point.y + offsets[direction].y };
}

export function directionBetween(from: Point, to: Point): Direction | null {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) + Math.abs(dy) !== 1) {
    return null;
  }

  if (dx === 1) {
    return "right";
  }

  if (dx === -1) {
    return "left";
  }

  return dy === 1 ? "down" : "up";
}

export function createTileMap(rows: string[], walkable: string): TileMap {
  const width = Math.max(...rows.map((row) => row.length));
  const height = rows.length;
  const open = new Set(walkable.split(""));

  const tileAt = (point: Point): string | null => {
    if (point.y < 0 || point.y >= height || point.x < 0 || point.x >= width) {
      return null;
    }

    return rows[point.y][point.x] ?? null;
  };

  return {
    width,
    height,
    tileAt,
    isWalkable: (point) => {
      const tile = tileAt(point);

      return tile !== null && open.has(tile);
    },
  };
}
