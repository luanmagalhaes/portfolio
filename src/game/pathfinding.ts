import { move, samePoint, type Direction, type Point, type TileMap } from "@/game/grid";

const directions: Direction[] = ["up", "down", "left", "right"];

function key(point: Point): string {
  return `${point.x},${point.y}`;
}

export function findPath(map: TileMap, from: Point, to: Point, blocked: (point: Point) => boolean = () => false): Point[] | null {
  if (samePoint(from, to)) {
    return [];
  }

  if (!map.isWalkable(to) || blocked(to)) {
    return null;
  }

  const previous = new Map<string, Point | null>([[key(from), null]]);
  const queue: Point[] = [from];

  while (queue.length > 0) {
    const current = queue.shift()!;

    for (const direction of directions) {
      const next = move(current, direction);
      const id = key(next);

      if (previous.has(id) || !map.isWalkable(next) || blocked(next)) {
        continue;
      }

      previous.set(id, current);

      if (samePoint(next, to)) {
        const path: Point[] = [next];
        let step = current;

        while (!samePoint(step, from)) {
          path.unshift(step);
          step = previous.get(key(step))!;
        }

        return path;
      }

      queue.push(next);
    }
  }

  return null;
}

export function nearestWalkable(map: TileMap, target: Point, from: Point): Point | null {
  if (map.isWalkable(target)) {
    return target;
  }

  let best: { point: Point; distance: number } | null = null;

  for (let radius = 1; radius <= Math.max(map.width, map.height) && !best; radius += 1) {
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) {
          continue;
        }

        const point = { x: target.x + dx, y: target.y + dy };

        if (!map.isWalkable(point)) {
          continue;
        }

        const distance = Math.abs(point.x - from.x) + Math.abs(point.y - from.y);

        if (!best || distance < best.distance) {
          best = { point, distance };
        }
      }
    }
  }

  return best?.point ?? null;
}
