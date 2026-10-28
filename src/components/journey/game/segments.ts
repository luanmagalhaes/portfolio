import type { Placed } from "@/components/journey/model/geometry";
import type { LevelNode } from "@/components/journey/model/level";
import type { Segment } from "@/components/journey/game/types";

export function themeSegments(nodes: LevelNode[], placed: Placed[]): Segment[] {
  return nodes.reduce<Segment[]>((segments, node, index) => {
    const spot = placed[index];
    const last = segments.at(-1);
    if (last && last.theme === node.theme) {
      last.x1 = spot.x + spot.w;
      return segments;
    }
    return [...segments, { theme: node.theme, x0: spot.x, x1: spot.x + spot.w }];
  }, []);
}
