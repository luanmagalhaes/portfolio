import { describe, expect, it } from "vitest";
import { createTileMap, directionBetween, move } from "@/game/grid";
import { directionForKey, isActionKey } from "@/game/input";
import { findPath, nearestWalkable } from "@/game/pathfinding";

const map = createTileMap(["#######", "#..#..#", "#..#..#", "#.....#", "#######"], ".");

describe("grade do mapa", () => {
  it("sabe o que é chão e o que é parede", () => {
    expect(map.isWalkable({ x: 1, y: 1 })).toBe(true);
    expect(map.isWalkable({ x: 3, y: 1 })).toBe(false);
    expect(map.isWalkable({ x: -1, y: 0 })).toBe(false);
    expect(map.tileAt({ x: 9, y: 9 })).toBeNull();
  });

  it("anda e descobre a direção entre vizinhos", () => {
    expect(move({ x: 2, y: 2 }, "left")).toEqual({ x: 1, y: 2 });
    expect(directionBetween({ x: 2, y: 2 }, { x: 2, y: 1 })).toBe("up");
    expect(directionBetween({ x: 2, y: 2 }, { x: 4, y: 2 })).toBeNull();
  });
});

describe("caminho até o destino", () => {
  it("contorna a parede pelo caminho mais curto", () => {
    const path = findPath(map, { x: 1, y: 1 }, { x: 5, y: 1 });

    expect(path).not.toBeNull();
    expect(path).toHaveLength(8);
    expect(path?.at(-1)).toEqual({ x: 5, y: 1 });
    expect(path?.every((point) => map.isWalkable(point))).toBe(true);
  });

  it("não acha caminho para parede nem através de obstáculo", () => {
    expect(findPath(map, { x: 1, y: 1 }, { x: 3, y: 1 })).toBeNull();
    expect(findPath(map, { x: 1, y: 1 }, { x: 5, y: 1 }, (point) => point.x === 3)).toBeNull();
    expect(findPath(map, { x: 1, y: 1 }, { x: 1, y: 1 })).toEqual([]);
  });

  it("acha o chão mais perto de um prédio tocado", () => {
    expect(nearestWalkable(map, { x: 3, y: 1 }, { x: 1, y: 1 })).toEqual({ x: 2, y: 1 });
    expect(nearestWalkable(map, { x: 2, y: 2 }, { x: 1, y: 1 })).toEqual({ x: 2, y: 2 });
  });
});

describe("teclado", () => {
  it("entende setas, WASD e as teclas de ação", () => {
    expect(directionForKey("ArrowLeft")).toBe("left");
    expect(directionForKey("w")).toBe("up");
    expect(directionForKey("x")).toBeNull();
    expect(isActionKey("Enter")).toBe(true);
    expect(isActionKey("q")).toBe(false);
  });
});
