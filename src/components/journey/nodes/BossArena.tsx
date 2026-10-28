import type { JourneyCopy } from "@/components/journey/copy";
import { bossSpritePath } from "@/components/journey/model/assets";
import type { Case } from "@/components/journey/game/types";
import { Sprite } from "@/components/journey/nodes/Sprite";

interface BossArenaProps {
  index: number;
  item: Case;
  order: number;
  total: number;
  width: number;
  copy: JourneyCopy;
  onOpen: (caseId: string) => void;
}

export function BossArena({ index, item, order, total, width, copy, onOpen }: BossArenaProps) {
  const titleId = `jr-boss-${item.id}`;

  return (
    <section className="jr-item jr-boss" data-node={index} style={{ ["--len" as string]: width }} aria-labelledby={titleId}>
      <div className="jr-boss-panel jr-frame-dark">
        <p className="jr-boss-kicker">
          {copy.boss} {order + 1}/{total}
        </p>
        <h3 className="jr-boss-name" id={titleId}>
          {item.boss}
        </h3>
        <p className="jr-boss-project">{item.client}</p>
        <div className="jr-hp" aria-hidden="true">
          {copy.hp}
          <span className="jr-hp-bar">
            <i />
          </span>
        </div>
        <ol className="jr-boss-log">
          <li data-phase="1">
            <b>{copy.problem}</b>
            <span>{item.problem}</span>
          </li>
          <li data-phase="2">
            <b>{copy.move}</b>
            <ul className="jr-boss-moves">
              {item.moves.map((move) => (
                <li key={move}>{move}</li>
              ))}
            </ul>
          </li>
          <li data-phase="3">
            <b>{copy.result}</b>
            <span>{item.result}</span>
          </li>
        </ol>
        <span className="jr-boss-stamp" aria-hidden="true">
          {copy.cleared}
        </span>
      </div>
      <button className="jr-boss-foe" type="button" onClick={() => onOpen(item.id)} aria-label={`${copy.boss} ${order + 1}, ${item.boss}: ${copy.openBoss}`}>
        <Sprite src={bossSpritePath(item.id, order)} width={48} height={48} />
        <span className="jr-boss-fx" aria-hidden="true" />
        <span className="jr-boss-foe-tag">
          {copy.boss} {order + 1}
        </span>
      </button>
    </section>
  );
}
