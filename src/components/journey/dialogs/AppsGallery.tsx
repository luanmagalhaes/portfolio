import Image from "next/image";
import { shortDaysLabel, type JourneyCopy } from "@/components/journey/copy";
import { doorColorFor, doorPalette, emblemPath, letterWheelPath } from "@/components/journey/model/assets";
import type { App } from "@/components/journey/game/types";
import { Sprite } from "@/components/journey/nodes/Sprite";

export function AppsGallery({ apps, appStack, copy, found, onOpen }: { apps: App[]; appStack: string[]; copy: JourneyCopy; found: string[]; onOpen: (appId: string) => void }) {
  return (
    <>
      <p className="jr-dlg-kicker">{copy.bonus}</p>
      <h2 className="jr-dlg-title" id="jr-apps-title">
        {copy.appsTitle}
      </h2>
      <p className="jr-dlg-lead">{copy.appsLead}</p>
      <ul className="jr-apps-grid">
        {apps.map((app, index) => (
          <li key={app.id}>
            <button className="jr-app-tile" type="button" onClick={() => onOpen(app.id)} style={{ ["--door-c" as string]: doorPalette[doorColorFor(app.id, index)] }}>
              {app.demo ? (
                <Image className="jr-app-shot" src={app.demo.landscape.poster} alt="" width={960} height={600} unoptimized />
              ) : (
                <span className="jr-app-shot jr-app-wheel">
                  <Sprite src={letterWheelPath} width={128} height={64} />
                </span>
              )}
              <span className="jr-app-tile-name">
                <Sprite src={emblemPath(app.emblem)} width={32} height={32} />
                <span className="jr-app-tile-title">{app.name}</span>
                <small>{shortDaysLabel(copy, app.daysToBuild)}</small>
              </span>
              <span className="jr-app-tile-line">{app.pitch}</span>
              {found.includes(app.id) ? null : (
                <span className="jr-app-tile-new" aria-hidden="true">
                  {index + 1}/{apps.length}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      <p className="jr-stage-note">
        {copy.soloNote} {appStack.join(", ")}
      </p>
    </>
  );
}
