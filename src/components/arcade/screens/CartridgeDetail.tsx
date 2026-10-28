import type { MouseEvent } from "react";
import type { Portfolio } from "@/domain/view";
import type { ArcadeCopy } from "@/components/arcade/copy";
import { DemoPlayer } from "@/components/arcade/DemoPlayer";
import { PixelSprite } from "@/components/arcade/PixelSprite";

type App = Portfolio["apps"][number];

interface CartridgeDetailProps {
  copy: ArcadeCopy;
  app: App;
  position: number;
  total: number;
  stack: string[];
  handheld: boolean;
  reduced: boolean;
  liveOpen: boolean;
  onBack: () => void;
  onStep: (delta: number) => void;
  onEject: () => void;
  onPlayLive: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export function CartridgeDetail({ copy, app, position, total, stack, handheld, reduced, liveOpen, onBack, onStep, onEject, onPlayLive }: CartridgeDetailProps) {
  return (
    <section className="screen" data-screen="cart">
      <header className="cart-bar">
        <button type="button" className="pbtn" data-nav data-action="back" onClick={onBack}>
          <PixelSprite id="back" />
          <span>{copy.back}</span>
        </button>
        <div className="cart-titles">
          <h2 className="screen-title" tabIndex={-1}>
            {app.name}
          </h2>
          <p className="cart-sub">
            <span className="days-long">{copy.builtIn(app.daysToBuild)}</span>
            <span className="days-short">{copy.days(app.daysToBuild)}</span>
          </p>
        </div>
        <div className="cart-pager">
          <button type="button" className="pbtn pbtn--icon" aria-label={copy.previous} data-nav onClick={() => onStep(-1)}>
            <PixelSprite id="left" />
          </button>
          <span aria-hidden="true">
            {position}/{total}
          </span>
          <span className="sr-only">{copy.cartCount(position, total)}</span>
          <button type="button" className="pbtn pbtn--icon" aria-label={copy.next} data-nav onClick={() => onStep(1)}>
            <PixelSprite id="right" />
          </button>
        </div>
      </header>
      <div className="cart-body">
        <div className="cart-about">
          <p className="cart-pitch">{app.pitch}</p>
          <p className="cart-spec">
            {stack.join(", ")}. {copy.builtWith}.
          </p>
        </div>
        <DemoPlayer key={app.id} app={app} copy={copy} reduced={reduced} suspended={liveOpen} />
        <div className="cart-actions">
          <a className="pbtn pbtn--go" href={app.liveUrl} target="_blank" rel="noreferrer" data-nav onClick={onPlayLive}>
            <PixelSprite id="play" />
            <span>{copy.playLive}</span>
          </a>
          {app.codeUrl ? (
            <a className="pbtn" href={app.codeUrl} target="_blank" rel="noreferrer" data-nav>
              <PixelSprite id="code" className="wide" />
              <span>{copy.code}</span>
            </a>
          ) : (
            <span className="pbtn pbtn--ghost is-static">{copy.privateRepo}</span>
          )}
          <button type="button" className="pbtn" data-nav onClick={onEject}>
            <PixelSprite id="eject" />
            <span>{copy.eject}</span>
          </button>
          <p className="cart-hint">{handheld ? copy.liveHintPhone : copy.liveHint}</p>
        </div>
      </div>
    </section>
  );
}
