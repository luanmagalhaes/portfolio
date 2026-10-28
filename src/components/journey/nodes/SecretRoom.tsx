import type { Portfolio } from "@/domain/view";
import type { JourneyCopy } from "@/components/journey/copy";
import { emblemPath, sprites, uiIconPath } from "@/components/journey/model/assets";
import { Sprite } from "@/components/journey/nodes/Sprite";

export function SecretRoom({ index, privateApps, copy }: { index: number; privateApps: Portfolio["privateApps"]; copy: JourneyCopy }) {
  return (
    <section className="jr-item jr-secret" data-node={index} aria-labelledby="jr-secret-title">
      <div className="jr-secret-head jr-frame-dark">
        <h3 id="jr-secret-title">{copy.secretTitle}</h3>
        <p>{copy.secretLead}</p>
      </div>
      <ul className="jr-chests">
        {privateApps.map((app) => (
          <li key={app.id} className="jr-chest">
            <div className="jr-chest-card jr-frame-dark">
              <h4>{app.name}</h4>
              <p>{app.pitch}</p>
              <span className="jr-lock">
                <Sprite src={uiIconPath("lock")} width={16} height={16} />
                {copy.privateBuild}
              </span>
            </div>
            <span className="jr-chest-art" aria-hidden="true">
              <Sprite className="jr-chest-icon" src={emblemPath(app.emblem)} width={32} height={32} />
              <Sprite className="jr-chest-box" src={sprites.chest} width={24} height={22} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
