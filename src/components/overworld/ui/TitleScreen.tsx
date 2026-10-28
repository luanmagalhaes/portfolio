"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { OverworldCopy } from "@/components/overworld/copy";
import type { OverworldLinks } from "@/components/overworld/links";
import type { Locale } from "@/domain/locale";

interface TitleProps {
  copy: OverworldCopy;
  locale: Locale;
  links: OverworldLinks;
  name: string;
  title: string;
  location: string;
  resume: string;
  touch: boolean;
  onStart: () => void;
}

export function TitleScreen({ copy, locale, links, name, title, location, resume, touch, onStart }: TitleProps) {
  const startRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    startRef.current?.focus({ preventScroll: true });
  }, []);
  return (
    <div className="title-screen">
      <section className="title-card px-window" aria-labelledby="ow-title-name">
        <div className="title-card__heroes" aria-hidden="true">
          <Image src="/kit/characters/luan/frames/luan-side-idle-0.png" alt="" width={72} height={96} unoptimized priority />
          <Image className="title-card__dog" src="/kit/characters/matilda/frames/matilda-side-idle-0.png" alt="" width={66} height={48} unoptimized priority />
        </div>
        <p className="title-card__kicker">{copy.titleKicker}</p>
        <h1 className="title-card__name" id="ow-title-name">
          {name}
        </h1>
        <p className="title-card__role">{title}</p>
        <p className="title-card__tagline">{copy.pathIntro}</p>
        <p className="title-card__meta">{location}</p>
        <ul className="title-menu">
          <li>
            <button type="button" className="px-choice title-start" ref={startRef} onClick={onStart} aria-current="true">
              {copy.start}
            </button>
          </li>
          <li>
            <Link className="px-choice" href={links.quick}>
              {copy.quickViewNoGame}
            </Link>
          </li>
          <li>
            <a className="px-choice" href={resume} download>
              {copy.downloadResume}
            </a>
          </li>
        </ul>
        <p className="title-card__hint">{touch ? copy.titleHintTouch : copy.titleHintKeys}</p>
        <div className="title-card__links">
          <Link className="px-btn px-btn--dark" href={links.home}>
            {copy.backToVersions}
          </Link>
          <Link className="px-btn px-btn--dark lang-toggle" href={links.other} hrefLang={links.otherLang} aria-label={copy.languageToggle}>
            <span data-on={locale === "en"}>EN</span>
            {" "}
            <span data-on={locale === "pt"}>PT</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
