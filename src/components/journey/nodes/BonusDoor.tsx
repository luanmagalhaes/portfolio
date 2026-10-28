import type { JourneyCopy } from "@/components/journey/copy";
import { doorArtPath, doorPalette, emblemPath, uiIconPath, type DoorColor } from "@/components/journey/model/assets";
import type { App } from "@/components/journey/game/types";
import { Sprite } from "@/components/journey/nodes/Sprite";

export function BonusDoor({ index, app, color, copy, onOpen }: { index: number; app: App; color: DoorColor; copy: JourneyCopy; onOpen: (appId: string) => void }) {
  return (
    <div className="jr-item jr-door" data-node={index}>
      <span className="jr-door-prompt" aria-hidden="true">
        <Sprite src={uiIconPath("arrowUp")} width={16} height={16} />
        {copy.enter}
      </span>
      <button className="jr-door-btn" type="button" onClick={() => onOpen(app.id)} style={{ ["--door-c" as string]: doorPalette[color] }}>
        <span className="jr-door-tag">
          {copy.bonus}{" "}
          <small>{app.name}</small>
        </span>
        <span className="jr-door-body">
          <Sprite className="jr-door-art" src={doorArtPath(color)} width={40} height={52} />
          <Sprite className="jr-door-emblem" src={emblemPath(app.emblem)} width={32} height={32} />
        </span>
      </button>
    </div>
  );
}
