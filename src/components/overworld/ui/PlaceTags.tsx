"use client";

import type { SceneId } from "@/components/overworld/art/scenes";
import { placeAnchor, places, TILE_SIZE, type ArcadeLayout, type DistrictId } from "@/components/overworld/model/map";
import type { OverworldCopy } from "@/components/overworld/copy";
import { PixelIcon } from "@/components/overworld/ui/PixelIcon";
import type { Portfolio } from "@/domain/view";

export interface TagEntry {
  id: string;
  kind: "place" | "cabinet" | "private" | "exit";
  label: string;
  aria: string;
  icon: string;
  x: number;
  y: number;
  visited: boolean;
}

export function townTags(copy: OverworldCopy, visited: readonly DistrictId[], tagFor: (id: DistrictId) => string): TagEntry[] {
  return places.map((place) => {
    const anchor = placeAnchor(place);
    const label = tagFor(place.id);
    const { title, sub } = copy.places[place.id];

    return { id: place.id, kind: "place", label, aria: label === title ? `${title}: ${sub}` : `${label}, ${title}: ${sub}`, icon: place.icon, x: anchor.x, y: anchor.y, visited: visited.includes(place.id) };
  });
}

export function arcadeTags(copy: OverworldCopy, apps: Portfolio["apps"], layout: ArcadeLayout): TagEntry[] {
  const cabinets: TagEntry[] = apps.flatMap((app, index) => {
    const spot = layout.cabinets[index];
    if (!spot) return [];
    const below = spot.y === layout.cabinets[0].y;
    return [{ id: `app-${app.id}`, kind: "cabinet" as const, label: app.name, aria: `${app.name}: ${app.pitch}`, icon: "arcade", x: (spot.x + 1) * TILE_SIZE, y: below ? spot.y * TILE_SIZE + 44 : spot.y * TILE_SIZE - 8, visited: false }];
  });
  const sign = layout.privateSign;
  const exit = layout.exits[0];
  return [
    ...cabinets,
    { id: "private", kind: "private", label: copy.privateBuilds, aria: copy.privateBuilds, icon: "lock", x: (sign.x + 0.5) * TILE_SIZE, y: sign.y * TILE_SIZE - 4, visited: false },
    { id: "exit", kind: "exit", label: copy.exitArcade, aria: copy.exitArcade, icon: "house", x: (exit.x + 1) * TILE_SIZE, y: exit.y * TILE_SIZE - 2, visited: false },
  ];
}

interface PlaceTagsProps {
  scene: SceneId;
  entries: TagEntry[];
  onActivate: (entry: TagEntry) => void;
  onHover: (entry: TagEntry | null) => void;
  onFocusTag: (entry: TagEntry) => void;
}

export function PlaceTags({ scene, entries, onActivate, onHover, onFocusTag }: PlaceTagsProps) {
  return (
    <div className="tags" data-scene={scene}>
      {entries.map((entry) => (
        <button
          key={entry.id}
          type="button"
          className="place-tag"
          data-tag-id={entry.id}
          data-kind={entry.kind}
          data-anchor-x={entry.x}
          data-anchor-y={entry.y}
          data-visited={entry.visited || undefined}
          aria-label={entry.aria}
          onClick={() => onActivate(entry)}
          onFocus={() => onFocusTag(entry)}
          onBlur={() => onHover(null)}
          onMouseEnter={() => onHover(entry)}
          onMouseLeave={() => onHover(null)}
        >
          <PixelIcon name={entry.icon} />
          <span>{entry.label}</span>
        </button>
      ))}
    </div>
  );
}
