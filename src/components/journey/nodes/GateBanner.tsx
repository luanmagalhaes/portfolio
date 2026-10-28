import type { JourneyCopy } from "@/components/journey/copy";
import type { WorldId } from "@/components/journey/model/level";

export function GateBanner({ index, worldId, number, copy }: { index: number; worldId: WorldId; number: number; copy: JourneyCopy }) {
  const world = copy.worlds[worldId];

  return (
    <header className="jr-item jr-gate" data-node={index}>
      <div className="jr-gate-banner jr-frame-dark">
        <p className="jr-gate-kicker">
          {copy.world} {number}
        </p>
        <h2 className="jr-gate-title" id={`jr-world-${worldId}`}>
          {world.name}
        </h2>
        <p className="jr-gate-era">{world.sub}</p>
      </div>
      <div className="jr-gate-posts" aria-hidden="true">
        <i />
        <i />
      </div>
    </header>
  );
}
