"use client";

import Image from "next/image";
import Link from "next/link";
import type { Ref } from "react";
import type { OverworldCopy } from "@/components/overworld/copy";
import { PixelIcon } from "@/components/overworld/ui/PixelIcon";
import { useLocalTime } from "@/components/overworld/ui/hooks";
import type { OverworldLinks } from "@/components/overworld/links";
import type { Locale } from "@/domain/locale";

interface HudProps {
  copy: OverworldCopy;
  locale: Locale;
  links: OverworldLinks;
  name: string;
  title: string;
  resume: string;
  firstName: string;
  utcOffset: number;
  explored: number;
  total: number;
  sound: boolean;
  topRef: Ref<HTMLElement>;
  nameplateRef: Ref<HTMLDivElement>;
  toolbarRef: Ref<HTMLElement>;
  onMap: () => void;
  onQuests: () => void;
  onItems: () => void;
  onSound: () => void;
}

function LanguageLink({ copy, locale, links, className }: { copy: OverworldCopy; locale: Locale; links: OverworldLinks; className: string }) {
  return (
    <Link className={className} href={links.other} hrefLang={links.otherLang} aria-label={copy.languageToggle}>
      <span data-on={locale === "en"}>EN</span>
      {" "}
      <span data-on={locale === "pt"}>PT</span>
    </Link>
  );
}

export function Hud({ copy, locale, links, name, title, resume, firstName, utcOffset, explored, total, sound, topRef, nameplateRef, toolbarRef, onMap, onQuests, onItems, onSound }: HudProps) {
  const time = useLocalTime(utcOffset);
  return (
    <header className="hud hud--top" ref={topRef}>
      <div className="nameplate px-window" ref={nameplateRef}>
        <Image className="nameplate__portrait" src="/kit/characters/luan/luan-portrait.png" alt="" width={64} height={64} unoptimized priority />
        <div className="nameplate__text">
          <p className="nameplate__name">{name}</p>
          <p className="nameplate__title">{title}</p>
          <p className="nameplate__meta">
            <span className="meter">
              {copy.explored}
              <span className="meter__bar" aria-hidden="true">
                <span className="meter__fill" style={{ width: `${Math.round((explored / total) * 100)}%` }} />
              </span>
              <span>
                {explored}/{total}
              </span>
            </span>
            <span className="nameplate__time">
              {copy.localTime(firstName)} <strong suppressHydrationWarning>{time || "--:--"}</strong> UTC{utcOffset >= 0 ? "+" : ""}{utcOffset}
            </span>
          </p>
        </div>
        <div className="nameplate__tools">
          <Link className="px-btn px-btn--dark tool-versions" href={links.home} aria-label={copy.backToVersions}>
            <PixelIcon name="house" />
          </Link>
          <LanguageLink copy={copy} locale={locale} links={links} className="px-btn px-btn--dark lang-toggle" />
        </div>
      </div>
      <nav className="toolbar" aria-label={copy.map} ref={toolbarRef}>
        <Link className="px-btn px-btn--primary" href={links.quick} data-action="quick-view">
          <PixelIcon name="skip" />
          <span>{copy.quickView}</span>
        </Link>
        <a className="px-btn" href={resume} download>
          <PixelIcon name="page" />
          <span>{copy.resume}</span>
        </a>
        <button type="button" className="px-btn px-btn--dark" data-action="map" onClick={onMap}>
          <PixelIcon name="map" />
          <span>{copy.map}</span>
        </button>
        <button type="button" className="px-btn px-btn--dark" data-action="quests" onClick={onQuests}>
          <PixelIcon name="scroll" />
          <span>{copy.quests}</span>
        </button>
        <button type="button" className="px-btn px-btn--dark" data-action="items" onClick={onItems}>
          <PixelIcon name="bag" />
          <span>{copy.items}</span>
        </button>
        <LanguageLink copy={copy} locale={locale} links={links} className="px-btn px-btn--dark lang-toggle tool-wide" />
        <button type="button" className="px-btn px-btn--dark tool-wide tool-icon" aria-pressed={sound} onClick={onSound}>
          <PixelIcon name={sound ? "soundOn" : "soundOff"} />
          <span className="sr-only">{sound ? copy.soundOn : copy.soundOff}</span>
        </button>
        <Link className="px-btn px-btn--dark tool-wide" href={links.home}>
          <PixelIcon name="house" />
          <span>{copy.backToVersions}</span>
        </Link>
      </nav>
    </header>
  );
}

export function ControlsHint({ copy }: { copy: OverworldCopy }) {
  return (
    <footer className="hud hud--bottom">
      <div className="controls px-window">
        <p>
          <span className="key">W</span>
          <span className="key">A</span>
          <span className="key">S</span>
          <span className="key">D</span>
          {copy.walk}
        </p>
        <p>
          <span className="key">Enter</span>
          {copy.talk}
        </p>
        <p>
          <span className="key">M</span>
          {copy.map}
        </p>
        <p>
          <span className="key">Q</span>
          {copy.quests}
        </p>
        <p>
          <span className="key">I</span>
          {copy.items}
        </p>
      </div>
    </footer>
  );
}
