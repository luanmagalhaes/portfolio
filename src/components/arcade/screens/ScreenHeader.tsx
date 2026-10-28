import type { ReactNode } from "react";
import type { ArcadeCopy } from "@/components/arcade/copy";
import { PixelSprite } from "@/components/arcade/PixelSprite";

export interface Progress {
  played: number;
  playable: number;
  cleared: number;
  bosses: number;
}

export function Hud({ copy, progress }: { copy: ArcadeCopy; progress: Progress }) {
  return (
    <p className="hud">
      <span>
        <PixelSprite id="miniCart" />
        <span className="sr-only">{copy.played}: </span>
        {progress.played}/{progress.playable}
      </span>
      <span>
        <PixelSprite id="sword" />
        <span className="sr-only">{copy.cleared}: </span>
        {progress.cleared}/{progress.bosses}
      </span>
    </p>
  );
}

export function ScreenHeader({ title, copy, onBack, progress, className, children }: { title: ReactNode; copy: ArcadeCopy; onBack?: () => void; progress?: Progress; className?: string; children?: ReactNode }) {
  return (
    <header className={["screen-head", className].filter(Boolean).join(" ")}>
      {onBack ? (
        <button type="button" className="pbtn pbtn--small" data-nav data-action="back" onClick={onBack}>
          <PixelSprite id="back" />
          <span>{copy.back}</span>
        </button>
      ) : null}
      <h2 className="screen-title" tabIndex={-1}>
        {title}
      </h2>
      {children}
      {progress ? <Hud copy={copy} progress={progress} /> : null}
    </header>
  );
}
