import Link from "next/link";
import type { Locale } from "@/domain/locale";
import type { Portfolio } from "@/domain/view";
import { otherLocale, pagePath } from "@/lib/routes";
import { localeTags } from "@/domain/locale";
import type { JourneyCopy } from "@/components/journey/copy";
import { gemPath, sprites, uiIconPath } from "@/components/journey/model/assets";
import { worlds, type LevelTotals } from "@/components/journey/model/level";
import type { JourneyState } from "@/components/journey/model/state";
import { Sprite } from "@/components/journey/nodes/Sprite";

interface HudProps {
  profile: Portfolio["profile"];
  copy: JourneyCopy;
  locale: Locale;
  state: JourneyState;
  totals: LevelTotals;
  onMap: () => void;
  onApps: () => void;
  onSound: () => void;
}

export function Hud({ profile, copy, locale, state, totals, onMap, onApps, onSound }: HudProps) {
  const number = worlds.findIndex((world) => world.id === state.world) + 1;
  const stats = [
    { id: "skills", icon: gemPath("a"), value: `${state.gems.length}/${totals.skills}`, label: copy.statSkills },
    { id: "apps", icon: uiIconPath("doorIcon"), value: `${state.found.length}/${totals.apps}`, label: copy.statApps },
    { id: "bosses", icon: uiIconPath("skull"), value: `${state.cleared.length}/${totals.bosses}`, label: copy.statBosses },
    { id: "flags", icon: uiIconPath("flagIcon"), value: `${state.reached.length}/${totals.flags}`, label: copy.statFlags },
  ];
  const other = otherLocale(locale);

  return (
    <header className="jr-hud">
      <div className="jr-hud-id">
        <Sprite className="jr-hud-portrait" src={sprites.luanPortrait} width={64} height={64} />
        <span className="jr-hud-text">
          <span className="jr-hud-name">{profile.name}</span>
          <span className="jr-hud-role">{profile.title}</span>
        </span>
      </div>
      <div className="jr-hud-meter">
        <div className="jr-hud-row">
          <p className="jr-hud-world">
            <b aria-label={`${copy.world} ${number}`}>{number}</b>
            <span>{copy.worlds[state.world].name}</span>
          </p>
          <ul className="jr-hud-stats" aria-label={copy.progress}>
            {stats.map((stat) => (
              <li key={stat.id} className="jr-stat">
                <Sprite src={stat.icon} width={16} height={16} />
                <b>{stat.value}</b>
                <small>{stat.label}</small>
              </li>
            ))}
          </ul>
        </div>
        <div className="jr-hud-bar" aria-hidden="true">
          <i />
        </div>
      </div>
      <nav className="jr-hud-actions" aria-label={copy.mainNav}>
        <Link className="jr-btn jr-btn-small jr-btn-ghost jr-hud-versions" href={pagePath("home", locale)} aria-label={copy.versionsLabel}>
          <Sprite className="jr-ico" src={uiIconPath("arrowLeft")} width={16} height={16} />
          <span className="jr-hud-versions-text">{copy.versions}</span>
        </Link>
        <button className="jr-btn jr-btn-small jr-btn-ghost jr-hud-map" type="button" onClick={onMap}>
          {copy.map}
        </button>
        <button className="jr-btn jr-btn-small jr-btn-ghost jr-hud-apps" type="button" onClick={onApps}>
          {copy.apps}
        </button>
        <button className="jr-btn jr-btn-small jr-btn-ghost jr-hud-sound" type="button" onClick={onSound} aria-pressed={state.sound} aria-label={state.sound ? copy.soundOn : copy.soundOff} title={state.sound ? copy.soundOn : copy.soundOff}>
          <Sprite className="jr-ico" src={uiIconPath(state.sound ? "soundOn" : "soundOff")} width={16} height={16} />
        </button>
        <Link className="jr-btn jr-btn-small jr-btn-ghost jr-hud-lang" href={pagePath("journey", other)} hrefLang={localeTags[other]} lang={localeTags[other]} aria-label={copy.otherLanguageLabel}>
          {copy.otherLanguage}
        </Link>
        <a className="jr-btn jr-btn-small jr-btn-green jr-hud-resume" href={profile.resume} download>
          {copy.resume}
        </a>
        <Link className="jr-btn jr-btn-small jr-btn-primary jr-hud-quick" href={pagePath("quick", locale)}>
          {copy.quickView}
        </Link>
      </nav>
    </header>
  );
}
