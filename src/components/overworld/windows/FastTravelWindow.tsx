"use client";

import { useEffect, useRef } from "react";
import type { OverworldCopy } from "@/components/overworld/copy";
import { placeAnchor, places, townSize, TILE_SIZE, type DistrictId } from "@/components/overworld/model/map";
import { PixelIcon } from "@/components/overworld/ui/PixelIcon";

interface TravelProps {
  copy: OverworldCopy;
  visited: readonly DistrictId[];
  tagFor: (id: DistrictId) => string;
  snapshot: () => HTMLCanvasElement | null;
  onGo: (place: DistrictId) => void;
}

function TownMap({ snapshot, visited, onGo }: Pick<TravelProps, "snapshot" | "visited" | "onGo">) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const source = snapshot();
    const ctx = canvas?.getContext("2d");
    if (!canvas || !source || !ctx) return;
    ctx.drawImage(source, 0, 0);
  }, [snapshot]);
  const width = townSize.cols * TILE_SIZE;
  const height = townSize.rows * TILE_SIZE;
  return (
    <div className="travel__map" aria-hidden="true">
      <canvas ref={ref} width={width} height={height} />
      {places.map((place) => {
        const anchor = placeAnchor(place);
        return (
          <button
            key={place.id}
            type="button"
            tabIndex={-1}
            className="travel__pin"
            data-visited={visited.includes(place.id)}
            style={{ left: `${(anchor.x / width) * 100}%`, top: `${((anchor.y + 20) / height) * 100}%` }}
            onClick={() => onGo(place.id)}
          />
        );
      })}
    </div>
  );
}

export function FastTravelWindow({ copy, visited, tagFor, snapshot, onGo }: TravelProps) {
  const ordered = [...places].sort((a, b) => a.order - b.order);
  return (
    <div className="travel">
      <TownMap snapshot={snapshot} visited={visited} onGo={onGo} />
      <ul className="travel__list">
        {ordered.map((place) => (
          <li key={place.id}>
            <button type="button" className="travel__item" data-go={place.id} onClick={() => onGo(place.id)}>
              <PixelIcon name={place.icon} size="lg" />
              <span>
                <strong>
                  {copy.places[place.id].title} · {tagFor(place.id)}
                </strong>
                <span>{copy.places[place.id].sub}</span>
              </span>
              {visited.includes(place.id) ? (
                <span className="badge badge--go">{copy.visited}</span>
              ) : (
                <span className="badge" aria-hidden="true">
                  {copy.go}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
