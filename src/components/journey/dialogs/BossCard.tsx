import type { JourneyCopy } from "@/components/journey/copy";
import { bossSpritePath } from "@/components/journey/model/assets";
import type { Case } from "@/components/journey/game/types";
import { Sprite } from "@/components/journey/nodes/Sprite";

export function BossCard({ cases, caseId, copy, onOpen }: { cases: Case[]; caseId: string; copy: JourneyCopy; onOpen: (caseId: string) => void }) {
  const index = Math.max(0, cases.findIndex((item) => item.id === caseId));
  const item = cases[index];
  const previous = cases[(index + cases.length - 1) % cases.length];
  const next = cases[(index + 1) % cases.length];

  return (
    <>
      <p className="jr-dlg-kicker">
        {copy.boss} {index + 1}/{cases.length} · {copy.cleared}
      </p>
      <h2 className="jr-dlg-title" id="jr-boss-title">
        {item.boss}
      </h2>
      <p className="jr-dlg-lead">{item.client}</p>
      <div className="jr-boss-card">
        <Sprite src={bossSpritePath(item.id, index)} width={48} height={48} />
        <ol className="jr-boss-steps">
          <li>
            <b>{copy.problem}</b>
            {item.problem}
          </li>
          <li>
            <b>{copy.move}</b>
            <ul className="jr-boss-moves">
              {item.moves.map((move) => (
                <li key={move}>{move}</li>
              ))}
            </ul>
          </li>
          <li>
            <b>{copy.result}</b>
            {item.result}
          </li>
        </ol>
      </div>
      <ul className="jr-chips jr-boss-stack" aria-label={copy.stack}>
        {item.stack.map((entry) => (
          <li key={entry}>{entry}</li>
        ))}
      </ul>
      <nav className="jr-stage-nav" aria-label={copy.boss}>
        <button className="jr-btn jr-btn-small" type="button" onClick={() => onOpen(previous.id)}>
          <span aria-hidden="true">&lt; </span>
          {previous.boss}
        </button>
        <button className="jr-btn jr-btn-small" type="button" onClick={() => onOpen(next.id)}>
          {next.boss}
          <span aria-hidden="true"> &gt;</span>
        </button>
      </nav>
    </>
  );
}
