import Image from "next/image";
import type { KeyboardEvent } from "react";
import type { Portfolio } from "@/domain/view";
import type { ArcadeCopy } from "@/components/arcade/copy";
import type { CharacterSlot, CharacterTab } from "@/components/arcade/navigation";
import { Emblem } from "@/components/arcade/Emblem";
import { SpriteAnimation } from "@/components/arcade/SpriteAnimation";
import { characterSheets } from "@/components/arcade/themes";
import { ScreenHeader, type Progress } from "@/components/arcade/screens/ScreenHeader";

interface CharacterSelectScreenProps {
  copy: ArcadeCopy;
  portfolio: Portfolio;
  slot: CharacterSlot;
  tab: CharacterTab;
  progress: Progress;
  onBack: () => void;
  onSlot: (slot: CharacterSlot) => void;
  onTab: (tab: CharacterTab) => void;
}

const tabs: CharacterTab[] = ["profile", "skills", "moves"];

function ProfileTab({ copy, portfolio }: { copy: ArcadeCopy; portfolio: Portfolio }) {
  const totalDays = portfolio.apps.reduce((sum, app) => sum + app.daysToBuild, 0);
  const counters = [
    { id: "apps", value: portfolio.apps.length, label: copy.statApps },
    { id: "private", value: portfolio.privateApps.length, label: copy.statPrivate },
    { id: "cases", value: portfolio.cases.length, label: copy.statCases },
    { id: "days", value: totalDays, label: copy.statDays },
  ];

  return (
    <>
      <dl className="facts">
        {portfolio.profile.stats.map((stat) => (
          <div key={stat.id} className="fact">
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
      <ul className="stat-grid">
        {counters.map((counter) => (
          <li key={counter.id} className="stat">
            <b>{counter.value}</b>
            <span>{counter.label}</span>
          </li>
        ))}
      </ul>
      <p className="note">{copy.statsNote}</p>
    </>
  );
}

function SkillsTab({ portfolio }: { portfolio: Portfolio }) {
  return (
    <>
      {portfolio.skills.map((group) => (
        <div key={group.id} className="skill-group">
          <h4>{group.name}</h4>
          <ul className="chips">
            {group.items.map((item) => (
              <li key={item} className="chip">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function MovesTab({ portfolio }: { portfolio: Portfolio }) {
  return (
    <ul className="moves">
      {portfolio.aiProjects.map((project) => (
        <li key={project.id} className="move">
          <Emblem emblem={project.emblem} />
          <div>
            <b>{project.name}</b>
            {project.status ? <small>{project.status}</small> : null}
            <span>{project.summary}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function OriginPanel({ copy, portfolio }: { copy: ArcadeCopy; portfolio: Portfolio }) {
  return (
    <div className="char-body">
      <p className="note">{copy.originIntro}</p>
      <ul className="origin-list">
        {portfolio.milestones.map((milestone) => (
          <li key={milestone.id}>
            <Emblem emblem={milestone.emblem} />
            <div>
              <b>{milestone.title}</b>
              <small>{milestone.period}</small>
              <span>{milestone.summary}</span>
            </div>
          </li>
        ))}
      </ul>
      <h4 className="panel-subtitle">{copy.languagesLabel}</h4>
      <ul className="chips">
        {portfolio.languages.map((language) => (
          <li key={language.id} className="chip">
            {language.name}: {language.level}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CharacterSelectScreen({ copy, portfolio, slot, tab, progress, onBack, onSlot, onTab }: CharacterSelectScreenProps) {
  const slots: { id: CharacterSlot; name: string; caption: string }[] = [
    { id: "engineer", name: portfolio.profile.name.split(" ")[0], caption: copy.slotEngineer },
    { id: "origin", name: portfolio.profile.name.split(" ")[0], caption: copy.slotOrigin },
    { id: "companion", name: "Matilda", caption: copy.slotCompanion },
  ];
  const tabLabels: Record<CharacterTab, string> = { profile: copy.tabProfile, skills: copy.tabSkills, moves: copy.tabMoves };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    onTab(tabs[(tabs.indexOf(tab) + delta + tabs.length) % tabs.length]);
  };

  return (
    <section className="screen" data-screen="character">
      <ScreenHeader title={copy.characterTitle} copy={copy} onBack={onBack} progress={progress} />
      <div className="char-slots" role="group" aria-label={copy.characterTitle}>
        {slots.map((item) => (
          <button key={item.id} type="button" className="char-slot" data-nav aria-pressed={slot === item.id} onClick={() => onSlot(item.id)}>
            {item.id === "companion" ? (
              <SpriteAnimation kind="dog" label={copy.companionAlt} />
            ) : (
              <Image className={item.id === "origin" ? "portrait portrait--origin" : "portrait"} src={characterSheets.portrait} alt={copy.portraitAlt} width={128} height={128} unoptimized />
            )}
            <span className="slot-name">{item.name}</span>
            <span className="slot-caption">{item.caption}</span>
          </button>
        ))}
      </div>
      <div className="char-panel panel">
        {slot === "companion" ? (
          <div className="char-body">
            <p>{copy.companionText}</p>
          </div>
        ) : slot === "origin" ? (
          <OriginPanel copy={copy} portfolio={portfolio} />
        ) : (
          <>
            <div className="tabs" role="tablist" aria-label={copy.tabsLabel}>
              {tabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  id={`arcade-tab-${item}`}
                  className="tab"
                  aria-selected={tab === item}
                  aria-controls="arcade-tabpanel"
                  tabIndex={tab === item ? 0 : -1}
                  data-nav
                  onClick={() => onTab(item)}
                  onKeyDown={onTabKey}
                >
                  {tabLabels[item]}
                </button>
              ))}
            </div>
            <div className="char-body" role="tabpanel" id="arcade-tabpanel" aria-labelledby={`arcade-tab-${tab}`}>
              {tab === "profile" ? <ProfileTab copy={copy} portfolio={portfolio} /> : tab === "skills" ? <SkillsTab portfolio={portfolio} /> : <MovesTab portfolio={portfolio} />}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
