import { Sprite } from "@/components/journey/nodes/Sprite";

export interface SignProps {
  kicker: string;
  when?: string;
  title?: string;
  titleId?: string;
  org?: string;
  points: string[];
  emblem: string;
  gold?: boolean;
}

export function Sign({ kicker, when, title, titleId, org, points, emblem, gold = false }: SignProps) {
  return (
    <div className={`jr-sign ${gold ? "jr-frame-gold jr-is-gold" : "jr-frame-dark"}`}>
      <div className="jr-sign-head">
        <Sprite className="jr-sign-icon" src={emblem} width={32} height={32} />
        <p className="jr-sign-kicker">
          {kicker}
          {when ? (
            <>
              {" · "}
              <span>{when}</span>
            </>
          ) : null}
        </p>
      </div>
      {title ? (
        <h3 className="jr-sign-title" id={titleId}>
          {title}
        </h3>
      ) : null}
      {org ? <p className="jr-sign-org">{org}</p> : null}
      {points.length > 0 ? (
        <ul className="jr-sign-points">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      ) : null}
      <div className="jr-sign-cover" aria-hidden="true">
        <b>?</b>
      </div>
    </div>
  );
}
