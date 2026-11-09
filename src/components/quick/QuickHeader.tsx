import Link from "next/link";
import { localeTags, type Locale } from "@/domain/locale";
import { otherLocale, pagePath } from "@/lib/routes";
import type { Portfolio } from "@/domain/view";
import type { Dictionary } from "@/i18n/dictionary";
import { SectionNav } from "@/components/quick/SectionNav";

const anchors = ["about", "apps", "bosses", "experience", "ai", "skills", "contact"] as const;

function anchorLabel(anchor: (typeof anchors)[number], dictionary: Dictionary): string {
  const labels: Record<(typeof anchors)[number], string> = {
    about: dictionary.about,
    apps: dictionary.apps,
    bosses: dictionary.bosses,
    experience: dictionary.career,
    ai: dictionary.ai,
    skills: dictionary.skills,
    contact: dictionary.contact,
  };

  return labels[anchor];
}

export function TopBar({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  const other = otherLocale(locale);

  return (
    <div className="sticky top-0 z-40 border-b-4 border-ink bg-night/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-5 py-2.5 sm:px-8">
        <Link className="pixel-button shrink-0" href={pagePath("home", locale)}>
          {dictionary.backToVersions}
        </Link>
        <SectionNav label={dictionary.sections}>
          <ul className="flex gap-1 whitespace-nowrap">
            {anchors.map((anchor) => (
              <li key={anchor}>
                <a href={`#${anchor}`} className="nav-link">
                  {anchorLabel(anchor, dictionary)}
                </a>
              </li>
            ))}
          </ul>
        </SectionNav>
        <Link className="pixel-button shrink-0" href={pagePath("quick", other)} hrefLang={localeTags[other]} aria-label={dictionary.otherLanguageLabel}>
          {dictionary.otherLanguage}
        </Link>
      </div>
    </div>
  );
}

export function QuickHeader({ portfolio, dictionary }: { portfolio: Portfolio; dictionary: Dictionary }) {
  const { profile } = portfolio;

  return (
    <header className="hero">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1.2fr_1fr] md:items-center md:py-16">
        <div>
          <p className="font-pixel text-sm uppercase tracking-[0.25em] text-green">{dictionary.player}</p>
          <h1 className="hero-name mt-3 font-pixel text-5xl leading-none text-cream sm:text-6xl">{profile.name}</h1>
          <p className="mt-4 text-xl text-lavender">{profile.title}</p>
          <p className="mt-1 text-silver">{profile.location}</p>
          <div className="mt-7 flex flex-wrap gap-2">
            <a className="pixel-button pixel-button-primary" href={profile.resume} download>
              {dictionary.downloadResume}
            </a>
            <a className="pixel-button" href={`mailto:${profile.email}`}>
              {dictionary.email}
            </a>
            <a className="pixel-button" href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="pixel-button" href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
        <dl className="pixel-panel grid gap-3 p-5 text-sm">
          {profile.stats.map((stat) => (
            <div key={stat.id} className="grid grid-cols-[minmax(0,9rem)_1fr] gap-3">
              <dt className="font-pixel text-yellow">{stat.label}</dt>
              <dd className="text-cream">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
