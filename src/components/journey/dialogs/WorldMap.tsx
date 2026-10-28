import type { Portfolio } from "@/domain/view";
import type { JourneyCopy } from "@/components/journey/copy";
import { emblemPath, sprites, uiIconPath } from "@/components/journey/model/assets";
import { worlds, type LevelNode } from "@/components/journey/model/level";
import type { JourneyState } from "@/components/journey/model/state";
import { checkpointSign } from "@/components/journey/nodes/CheckpointNode";
import { Sprite } from "@/components/journey/nodes/Sprite";

const mapPoints: [number, number][] = [
  [9, 64],
  [25, 34],
  [41, 66],
  [57, 32],
  [73, 64],
  [89, 34],
];

interface WorldMapProps {
  nodes: LevelNode[];
  portfolio: Portfolio;
  copy: JourneyCopy;
  state: JourneyState;
  onJump: (index: number, fight: boolean) => void;
  onApps: () => void;
}

interface MapStop {
  index: number;
  label: string;
  icon: string;
  done: boolean;
  fight: boolean;
}

function stopFor(node: LevelNode, index: number, portfolio: Portfolio, copy: JourneyCopy, state: JourneyState): MapStop | null {
  if (node.kind === "checkpoint") {
    const sign = checkpointSign(portfolio, copy, node.source, node.id);
    return sign ? { index, label: sign.title ?? "", icon: sign.emblem, done: state.reached.includes(node.id), fight: false } : null;
  }
  if (node.kind === "door") {
    const app = portfolio.apps.find((item) => item.id === node.appId);
    return app ? { index, label: `${copy.bonus}: ${app.name}`, icon: emblemPath(app.emblem), done: state.found.includes(app.id), fight: false } : null;
  }
  if (node.kind === "boss") {
    const item = portfolio.cases.find((entry) => entry.id === node.caseId);
    return item ? { index, label: `${copy.boss}: ${item.boss}`, icon: uiIconPath("skull"), done: state.cleared.includes(item.id), fight: true } : null;
  }
  if (node.kind === "secret") return { index, label: copy.secretTitle, icon: uiIconPath("lock"), done: false, fight: false };
  if (node.kind === "goal") return { index, label: `${copy.goalKicker}: ${copy.goalTitle}`, icon: uiIconPath("star"), done: false, fight: false };
  return null;
}

export function WorldMap({ nodes, portfolio, copy, state, onJump, onApps }: WorldMapProps) {
  return (
    <>
      <p className="jr-dlg-kicker">{copy.titleKicker}</p>
      <h2 className="jr-dlg-title" id="jr-map-title">
        {copy.mapTitle}
      </h2>
      <p className="jr-dlg-lead">{copy.mapLead}</p>
      <div className="jr-map-art" aria-hidden="true">
        <Sprite src={sprites.map} width={200} height={80} />
        {worlds.map((world, index) => (
          <span key={world.id} className={`jr-map-node${state.world === world.id ? " jr-is-here" : ""}`} style={{ left: `${mapPoints[index][0]}%`, top: `${mapPoints[index][1]}%` }}>
            <b>{index + 1}</b>
          </span>
        ))}
      </div>
      <ol className="jr-map-worlds">
        {worlds.map((world, worldIndex) => {
          const gate = nodes.findIndex((node) => node.kind === "gate" && node.world === world.id);
          const stops = nodes.flatMap((node, index) => {
            if (node.world !== world.id) return [];
            const stop = stopFor(node, index, portfolio, copy, state);
            return stop ? [stop] : [];
          });
          const here = state.world === world.id;
          return (
            <li key={world.id} className={`jr-map-world${here ? " jr-is-here" : ""}`}>
              <h3>
                <Sprite src={emblemPath(world.emblem)} width={32} height={32} />
                <button className="jr-map-go" type="button" onClick={() => onJump(gate, false)}>
                  {copy.world} {worldIndex + 1}: {copy.worlds[world.id].name}
                  <small>
                    {copy.worlds[world.id].sub}
                    {here ? ` · ${copy.here}` : ""}
                  </small>
                </button>
              </h3>
              <ul className="jr-map-stops">
                {stops.map((stop) => (
                  <li key={stop.index}>
                    <button className={`jr-map-stop${stop.done ? " jr-is-done" : ""}`} type="button" onClick={() => onJump(stop.index, stop.fight)} data-jump={stop.index} data-fight={stop.fight || undefined}>
                      <Sprite src={stop.icon} width={32} height={32} />
                      <span>{stop.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
      <div className="jr-map-foot">
        <button className="jr-btn" type="button" onClick={onApps}>
          {copy.allStages}
        </button>
      </div>
    </>
  );
}
