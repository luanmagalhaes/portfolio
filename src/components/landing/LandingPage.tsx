import Link from "next/link";
import { staticPortfolioSource } from "@/content";
import { versions } from "@/content/versions";
import { resolveLocale, type Locale } from "@/domain/locale";
import { portfolioFor } from "@/domain/view";
import { dictionaryFor } from "@/i18n/dictionary";
import { pagePath } from "@/lib/routes";
import { LanguageSwitch } from "@/components/landing/LanguageSwitch";
import { PixelDuo } from "@/components/sprites/PixelDuo";
import { VersionCard } from "@/components/landing/VersionCard";
import "@/components/landing/landing.css";

export function LandingPage({ locale }: { locale: Locale }) {
  const { profile } = portfolioFor(staticPortfolioSource, locale);
  const dictionary = dictionaryFor(locale);
  const choices = resolveLocale(versions, locale);

  return (
    <div className="landing">
      <a href="#versions" className="skip-link">
        {dictionary.skipToContent}
      </a>
      <header className="landing-bar">
        <Link href={pagePath("home", locale)} className="landing-brand">
          <span className="landing-badge" aria-hidden="true">
            LM
          </span>
          <span className="landing-brand-name">{profile.name}</span>
        </Link>
        <div className="landing-actions">
          <Link className="pixel-button landing-small landing-quick-top" href={pagePath("quick", locale)}>
            {dictionary.quickView}
          </Link>
          <a className="pixel-button landing-small" href={profile.resume} download>
            {dictionary.downloadResume}
          </a>
          <LanguageSwitch locale={locale} page="home" label={dictionary.languageLabel} />
        </div>
      </header>
      <main id="versions" className="landing-main">
        <section className="landing-hero" aria-labelledby="landing-title">
          <div className="landing-copy">
            <p className="landing-eyebrow">{dictionary.chooseVersion}</p>
            <h1 id="landing-title" className="landing-title">
              {profile.name}
            </h1>
            <p className="landing-role">{profile.title}</p>
            <p className="landing-intro">{dictionary.versionsIntro}</p>
          </div>
          <PixelDuo />
        </section>
        <ul className="version-grid">
          {choices.map((version, index) => (
            <VersionCard key={version.id} version={version} index={index} locale={locale} dictionary={dictionary} />
          ))}
        </ul>
        <nav className="landing-links" aria-label={dictionary.contact}>
          <Link className="landing-quick" href={pagePath("quick", locale)}>
            {dictionary.quickViewLink}
          </Link>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </main>
      <footer className="landing-footer">{dictionary.footer}</footer>
    </div>
  );
}
