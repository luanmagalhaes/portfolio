import type { MouseEvent } from "react";
import type { Portfolio } from "@/domain/view";
import type { ArcadeCopy } from "@/components/arcade/copy";
import { CartridgeArt } from "@/components/arcade/CartridgeArt";
import { DaysBar } from "@/components/arcade/DaysBar";
import { Emblem } from "@/components/arcade/Emblem";
import { EmblemArt } from "@/components/arcade/EmblemArt";
import { PixelSprite } from "@/components/arcade/PixelSprite";
import { ScreenHeader, type Progress } from "@/components/arcade/screens/ScreenHeader";

type App = Portfolio["apps"][number];
type PrivateApp = Portfolio["privateApps"][number];

export interface PreviewTarget {
  id: string;
  locked: boolean;
}

interface CartridgesScreenProps {
  copy: ArcadeCopy;
  apps: App[];
  privateApps: PrivateApp[];
  preview: PreviewTarget;
  reduced: boolean;
  progress: Progress;
  onBack: () => void;
  onPreview: (id: string, locked: boolean) => void;
  onInsert: (id: string, source: HTMLElement) => void;
  onLocked: (id: string, source: HTMLElement) => void;
}

function PreviewCard({ copy, apps, privateApps, preview, reduced }: Pick<CartridgesScreenProps, "copy" | "apps" | "privateApps" | "preview" | "reduced">) {
  const locked = preview.locked ? privateApps.find((item) => item.id === preview.id) : undefined;

  if (locked) {
    return (
      <figure className="preview">
        <div className="preview-frame">
          <div className="lock-card">
            <PixelSprite id="lock" scale={4} />
            <span>{copy.privateBuild}</span>
          </div>
        </div>
        <figcaption>
          <span className="preview-line">
            <strong className="preview-name">{locked.name}</strong>
            <span className="preview-days">{copy.privateBuild}</span>
          </span>
          <span className="preview-pitch">{locked.pitch}</span>
        </figcaption>
      </figure>
    );
  }

  const app = apps.find((item) => item.id === preview.id) ?? apps[0];
  const media = app.demo?.landscape;

  return (
    <figure className="preview">
      <div className="preview-frame">
        {media ? (
          <video key={app.id} muted loop playsInline autoPlay={!reduced} preload={reduced ? "none" : "auto"} poster={media.poster} aria-label={copy.demoLabel(app.name)}>
            <source src={media.webm} type="video/webm" />
            <source src={media.mp4} type="video/mp4" />
          </video>
        ) : (
          <EmblemArt name={app.name} emblem={app.emblem} label={copy.emblemLabel(app.name)} />
        )}
      </div>
      <figcaption>
        <span className="preview-line">
          <strong className="preview-name">{app.name}</strong>
          <span className="preview-days">{copy.builtIn(app.daysToBuild)}</span>
        </span>
        <span className="preview-pitch">{app.pitch}</span>
      </figcaption>
    </figure>
  );
}

export function CartridgesScreen(props: CartridgesScreenProps) {
  const { copy, apps, privateApps, preview, progress, onBack, onPreview, onInsert, onLocked } = props;
  const longest = Math.max(...apps.map((app) => app.daysToBuild));

  return (
    <section className="screen" data-screen="cartridges">
      <ScreenHeader title={copy.cartridgesTitle} copy={copy} onBack={onBack} progress={progress} />
      <p className="screen-intro">{copy.cartridgesIntro}</p>
      <div className="carts-layout">
        <ul className="pick-list pick-list--public">
          {apps.map((app) => (
            <li key={app.id}>
              <button
                type="button"
                className="pick"
                data-nav
                aria-current={!preview.locked && preview.id === app.id}
                onClick={(event: MouseEvent<HTMLButtonElement>) => onInsert(app.id, event.currentTarget)}
                onPointerEnter={() => onPreview(app.id, false)}
                onFocus={() => onPreview(app.id, false)}
              >
                <span className="pick-cart">
                  <CartridgeArt id={app.id} emblem={app.emblem} />
                </span>
                <Emblem emblem={app.emblem} className="pick-icon" />
                <span className="pick-name">{app.name}</span>
                <span className="pick-days">
                  <span className="sr-only">{copy.builtIn(app.daysToBuild)}</span>
                  <DaysBar days={app.daysToBuild} max={longest} />
                  <span aria-hidden="true">{copy.daysShort(app.daysToBuild)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="carts-side">
          <div className="pick-preview" aria-live="polite">
            <PreviewCard {...props} />
          </div>
          <section className="private-block" aria-labelledby="private-title">
            <h3 className="block-title" id="private-title">
              <PixelSprite id="lock" scale={1} />
              {copy.privateTitle}
            </h3>
            <ul className="lock-chips">
              {privateApps.map((app) => (
                <li key={app.id}>
                  <button
                    type="button"
                    className="lock-chip"
                    data-nav
                    aria-current={preview.locked && preview.id === app.id}
                    onClick={(event: MouseEvent<HTMLButtonElement>) => onLocked(app.id, event.currentTarget)}
                    onPointerEnter={() => onPreview(app.id, true)}
                    onFocus={() => onPreview(app.id, true)}
                  >
                    <PixelSprite id="lock" scale={1} />
                    <span>{app.name}</span>
                    <span className="sr-only">: {copy.privateBuild}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
