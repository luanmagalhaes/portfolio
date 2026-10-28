"use client";

import { useEffect, useState } from "react";
import type { Portfolio } from "@/domain/view";
import type { ArcadeCopy } from "@/components/arcade/copy";
import { PixelSprite } from "@/components/arcade/PixelSprite";
import { ScreenHeader, type Progress } from "@/components/arcade/screens/ScreenHeader";

type Profile = Portfolio["profile"];

export function ContinueScreen({ copy, profile, reduced, progress, onBack }: { copy: ArcadeCopy; profile: Profile; reduced: boolean; progress: Progress; onBack: () => void }) {
  const [count, setCount] = useState(9);

  useEffect(() => {
    if (reduced) {
      return;
    }
    const timer = window.setInterval(() => setCount((value) => (value > 0 ? value - 1 : value)), 1000);
    return () => window.clearInterval(timer);
  }, [reduced]);

  const finished = reduced || count === 0;

  return (
    <section className="screen" data-screen="continue">
      <ScreenHeader title={copy.continueTitle} copy={copy} onBack={onBack} progress={progress} className="sr-head" />
      <div className="continue">
        <div className="continue-row" aria-hidden="true">
          <p className="continue-title">{copy.continueTitle}</p>
          {finished ? null : <p className="countdown">{count}</p>}
        </div>
        <p className="continue-lead">{finished && !reduced ? copy.continueEnd : copy.continueLead}</p>
        <ul className="contact-grid">
          <li>
            <a className="pbtn pbtn--primary" href={`mailto:${profile.email}`} data-nav>
              <PixelSprite id="mail" />
              <span>{profile.email}</span>
            </a>
          </li>
          <li>
            <a className="pbtn pbtn--go" href={profile.resume} download data-nav>
              <PixelSprite id="doc" />
              <span>{copy.downloadResume}</span>
            </a>
          </li>
          <li>
            <a className="pbtn" href={profile.linkedin} target="_blank" rel="noreferrer" data-nav>
              <PixelSprite id="card" />
              <span>LinkedIn</span>
            </a>
          </li>
          <li>
            <a className="pbtn" href={profile.github} target="_blank" rel="noreferrer" data-nav>
              <PixelSprite id="code" className="wide" />
              <span>GitHub</span>
            </a>
          </li>
        </ul>
        <p className="continue-note">{copy.continueNote(profile.location)}</p>
      </div>
    </section>
  );
}
