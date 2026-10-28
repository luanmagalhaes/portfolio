import Link from "next/link";
import type { Portfolio } from "@/domain/view";
import type { Locale } from "@/domain/locale";
import { pagePath } from "@/lib/routes";
import type { JourneyCopy } from "@/components/journey/copy";

interface TitleCardProps {
  index: number;
  portfolio: Portfolio;
  copy: JourneyCopy;
  locale: Locale;
  onStart: () => void;
  onMap: () => void;
}

export function TitleCard({ index, portfolio, copy, locale, onStart, onMap }: TitleCardProps) {
  const { profile } = portfolio;

  return (
    <div className="jr-item jr-title-card" data-node={index}>
      <div className="jr-title-inner jr-frame-dark">
        <p className="jr-title-kicker">{copy.titleKicker}</p>
        <p className="jr-title-name">{profile.name}</p>
        <p className="jr-title-role">{profile.title}</p>
        <p className="jr-title-tag">{copy.tagline}</p>
        <dl className="jr-title-facts">
          {profile.stats.map((stat) => (
            <div key={stat.id}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
          <div>
            <dt>{copy.apps}</dt>
            <dd>
              {portfolio.apps.length} {copy.publicApps}
            </dd>
          </div>
        </dl>
        <div className="jr-title-actions">
          <button className="jr-btn jr-btn-primary" type="button" onClick={onStart}>
            {copy.start}
          </button>
          <Link className="jr-btn" href={pagePath("quick", locale)}>
            {copy.quickView}
          </Link>
          <button className="jr-btn jr-btn-ghost" type="button" onClick={onMap}>
            {copy.map}
          </button>
        </div>
        <p className="jr-title-hint">
          <span className="jr-press">{copy.pressStart}</span>
          <span className="jr-hint-keys">{copy.hintKeys}</span>
          <span className="jr-hint-touch">{copy.hintTouch}</span>
        </p>
      </div>
    </div>
  );
}
