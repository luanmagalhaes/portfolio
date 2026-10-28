"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { localeTags, locales, type Locale } from "@/domain/locale";
import { pagePath } from "@/lib/routes";
import type { ArcadeCopy } from "@/components/arcade/copy";
import { PixelSprite } from "@/components/arcade/PixelSprite";

interface ArcadeHeaderProps {
  copy: ArcadeCopy;
  locale: Locale;
  name: string;
  role: string;
  location: string;
  resume: string;
  soundOn: boolean;
  onToggleSound: () => void;
}

export function ArcadeHeader({ copy, locale, name, role, location, resume, soundOn, onToggleSound }: ArcadeHeaderProps) {
  const router = useRouter();

  const switchLanguage = (event: MouseEvent<HTMLAnchorElement>, target: Locale) => {
    event.preventDefault();
    router.push(pagePath("arcade", target) + window.location.hash);
  };

  return (
    <header className="marquee">
      <div className="marquee-inner" id="arcade-header">
        <div className="brand">
          <span className="brand-badge" aria-hidden="true">
            LM
          </span>
          <div className="brand-text">
            <h1 className="brand-name">{name}</h1>
            <p className="brand-role">
              {role} · {location}
            </p>
          </div>
        </div>
        <nav className="actions" aria-label={copy.siteNav}>
          <Link className="pbtn pbtn--ghost versions-link" href={pagePath("home", locale)}>
            <PixelSprite id="back" />
            <span className="versions-label">{copy.versions}</span>
          </Link>
          <Link className="pbtn pbtn--primary" href={pagePath("quick", locale)}>
            <PixelSprite id="doc" />
            <span>{copy.quickView}</span>
          </Link>
          <a className="pbtn" href={resume} download>
            <PixelSprite id="doc" />
            <span>{copy.resume}</span>
          </a>
          <div className="lang" role="group" aria-label={copy.languageLabel}>
            {locales.map((item) => (
              <a key={item} href={pagePath("arcade", item)} hrefLang={localeTags[item]} aria-current={item === locale ? "page" : undefined} onClick={(event) => switchLanguage(event, item)}>
                {item.toUpperCase()}
              </a>
            ))}
          </div>
          <button type="button" className="pbtn pbtn--icon" id="sound-btn" aria-pressed={soundOn} onClick={onToggleSound}>
            <PixelSprite id={soundOn ? "soundOn" : "soundOff"} className="wide" />
            <span className="sound-label">{soundOn ? copy.soundOn : copy.soundOff}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
