import type { Portfolio } from "@/domain/view";
import type { ArcadeCopy } from "@/components/arcade/copy";
import { PixelSprite } from "@/components/arcade/PixelSprite";
import { SpriteAnimation } from "@/components/arcade/SpriteAnimation";
import { bossSpriteFor } from "@/components/arcade/themes";
import { ScreenHeader, type Progress } from "@/components/arcade/screens/ScreenHeader";

type Case = Portfolio["cases"][number];

export interface Round {
  label: string;
  text: string;
}

export function roundsFor(item: Case, copy: ArcadeCopy): Round[] {
  return [{ label: copy.problem, text: item.problem }, ...item.moves.map((move) => ({ label: copy.move, text: move })), { label: copy.result, text: item.result }];
}

interface BossFightScreenProps {
  copy: ArcadeCopy;
  item: Case;
  round: number;
  progress: Progress;
  onBack: () => void;
  onRound: (round: number, total: number) => void;
  onNextBoss: () => void;
}

export function BossFightScreen({ copy, item, round, progress, onBack, onRound, onNextBoss }: BossFightScreenProps) {
  const rounds = roundsFor(item, copy);
  const total = rounds.length;
  const hits = total - 1;
  const left = hits - round;
  const done = round === total - 1;
  const current = rounds[round];

  return (
    <section className="screen" data-screen="boss">
      <ScreenHeader title={item.boss} copy={copy} onBack={onBack} progress={progress} />
      <p className="screen-intro">{item.client}</p>
      <div className={done ? "arena is-defeated" : "arena"}>
        <div className="fighter">
          <SpriteAnimation kind="idle" scale={3} label={copy.portraitAlt} />
          <span>P1</span>
        </div>
        <span className="vs" aria-hidden="true">
          VS
        </span>
        <div className="fighter fighter--boss">
          <PixelSprite id={bossSpriteFor(item.id)} scale={4} />
          <span className="ko" aria-hidden="true">
            {copy.defeated}
          </span>
        </div>
        <div className="hp" role="img" aria-label={`${copy.bossHp}: ${left}/${hits}`}>
          <small>{copy.bossHp}</small>
          <span className="hp-bar">
            {Array.from({ length: hits }, (_, index) => (
              <i key={index} className={index < left ? undefined : "is-spent"} />
            ))}
          </span>
        </div>
      </div>
      <div className="dialog" aria-live="polite">
        <p className="dialog-label">
          {copy.round} {round + 1}/{total} · {current.label}
        </p>
        <p className="dialog-text">{current.text}</p>
      </div>
      <div className="boss-actions">
        <span className="round-tabs" role="group" aria-label={copy.roundsLabel}>
          {rounds.map((entry, index) => (
            <button key={`${entry.label}-${index}`} type="button" className="round-tab" aria-label={`${copy.round} ${index + 1}: ${entry.label}`} aria-current={index === round ? "step" : undefined} data-nav onClick={() => onRound(index, total)}>
              {index + 1}
            </button>
          ))}
        </span>
        <button type="button" className="pbtn" data-nav disabled={round === 0} onClick={() => onRound(round - 1, total)}>
          <PixelSprite id="back" />
          <span>{copy.previousRound}</span>
        </button>
        {done ? (
          <button type="button" className="pbtn pbtn--primary" data-nav onClick={onNextBoss}>
            <span>{copy.nextBoss}</span>
            <PixelSprite id="next" />
          </button>
        ) : (
          <button type="button" className="pbtn pbtn--primary" data-nav onClick={() => onRound(round + 1, total)}>
            <span>{copy.nextRound}</span>
            <PixelSprite id="next" />
          </button>
        )}
      </div>
    </section>
  );
}
