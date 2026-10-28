import Link from "next/link";
import { localePaths, type Locale } from "@/domain/locale";
import type { Portfolio } from "@/domain/view";
import type { Dictionary } from "@/i18n/dictionary";

export function QuickHeader({ portfolio, dictionary, locale }: { portfolio: Portfolio; dictionary: Dictionary; locale: Locale }) {
  const { profile } = portfolio;
  const other: Locale = locale === "en" ? "pt" : "en";

  return (
    <header className="border-b-4 border-ink bg-plum/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-pixel text-sm uppercase tracking-[0.2em] text-green">{dictionary.quickView}</p>
          <h1 className="mt-2 font-pixel text-4xl text-cream sm:text-5xl">{profile.name}</h1>
          <p className="mt-2 text-lg text-lavender">{profile.title}</p>
          <p className="mt-1 text-silver">{profile.location}</p>
        </div>
        <nav aria-label={dictionary.contact} className="flex flex-wrap gap-2">
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
          <Link className="pixel-button" href={localePaths[other]} hrefLang={other === "pt" ? "pt-BR" : "en"} aria-label={dictionary.otherLanguageLabel}>
            {dictionary.otherLanguage}
          </Link>
        </nav>
      </div>
    </header>
  );
}
