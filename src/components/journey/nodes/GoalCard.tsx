import Link from "next/link";
import type { Portfolio } from "@/domain/view";
import type { Locale } from "@/domain/locale";
import { pagePath } from "@/lib/routes";
import type { JourneyCopy } from "@/components/journey/copy";
import { ContactLinks } from "@/components/journey/nodes/ContactLinks";

interface GoalCardProps {
  index: number;
  profile: Portfolio["profile"];
  copy: JourneyCopy;
  locale: Locale;
  onMap: () => void;
  onRestart: () => void;
}

export function GoalCard({ index, profile, copy, locale, onMap, onRestart }: GoalCardProps) {
  return (
    <section className="jr-item jr-goal" data-node={index} aria-labelledby="jr-goal-title">
      <span className="jr-goal-pole" aria-hidden="true">
        <span className="jr-goal-cloth" />
      </span>
      <div className="jr-goal-card jr-frame-dark">
        <p className="jr-gate-kicker">{copy.goalKicker}</p>
        <h2 id="jr-goal-title">{copy.goalTitle}</h2>
        <p>{copy.goalLead}</p>
        <ContactLinks profile={profile} copy={copy} />
        <p className="jr-continue">{copy.continueText}</p>
        <div className="jr-goal-again">
          <button className="jr-btn jr-btn-small" type="button" onClick={onMap}>
            {copy.map}
          </button>
          <button className="jr-btn jr-btn-small" type="button" onClick={onRestart}>
            {copy.start}
          </button>
          <Link className="jr-btn jr-btn-small" href={pagePath("home", locale)}>
            {copy.versionsLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
