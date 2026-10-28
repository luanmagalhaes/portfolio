import Link from "next/link";
import type { MouseEvent } from "react";
import type { Portfolio } from "@/domain/view";
import type { ArcadeCopy } from "@/components/arcade/copy";
import { CartridgeArt } from "@/components/arcade/CartridgeArt";
import { PixelSprite } from "@/components/arcade/PixelSprite";
import { SpriteAnimation } from "@/components/arcade/SpriteAnimation";

type App = Portfolio["apps"][number];
type PrivateApp = Portfolio["privateApps"][number];

interface CartridgeShelfProps {
  copy: ArcadeCopy;
  apps: App[];
  privateApps: PrivateApp[];
  insertedId: string | null;
  readout: string;
  quickHref: string;
  onInsert: (id: string, source: HTMLElement) => void;
  onLocked: (id: string, source: HTMLElement) => void;
  onPreview: (id: string, locked: boolean) => void;
}

export function CartridgeShelf({ copy, apps, privateApps, insertedId, readout, quickHref, onInsert, onLocked, onPreview }: CartridgeShelfProps) {
  return (
    <section className="shelf" id="arcade-shelf" aria-labelledby="shelf-title">
      <div className="shelf-head">
        <h2 className="shelf-title" id="shelf-title">
          {copy.cartridgesTitle}
        </h2>
        <p className="shelf-count">{copy.shelfCount(apps.length, privateApps.length)}</p>
      </div>
      <div className="shelf-display" aria-hidden="true">
        {readout}
      </div>
      <ul className="shelf-grid">
        {apps.map((app) => (
          <li key={app.id} className="shelf-item">
            <button
              type="button"
              className={app.id === insertedId ? "shelf-cart is-out" : "shelf-cart"}
              data-nav
              onClick={(event: MouseEvent<HTMLButtonElement>) => onInsert(app.id, event.currentTarget)}
              onPointerEnter={() => onPreview(app.id, false)}
              onFocus={() => onPreview(app.id, false)}
            >
              <CartridgeArt id={app.id} emblem={app.emblem} />
              <span className="cart-tag">
                <span>{app.name}</span>
                <small>{copy.days(app.daysToBuild)}</small>
              </span>
              <span className="sr-only">{app.pitch}</span>
            </button>
          </li>
        ))}
      </ul>
      <h3 className="shelf-sub">
        <PixelSprite id="lock" scale={1} />
        {copy.privateTitle}
      </h3>
      <ul className="shelf-grid shelf-grid--locked">
        {privateApps.map((app) => (
          <li key={app.id} className="shelf-item">
            <button
              type="button"
              className="shelf-cart"
              data-nav
              onClick={(event: MouseEvent<HTMLButtonElement>) => onLocked(app.id, event.currentTarget)}
              onPointerEnter={() => onPreview(app.id, true)}
              onFocus={() => onPreview(app.id, true)}
            >
              <CartridgeArt id={app.id} emblem={app.emblem} locked />
              <span className="cart-tag">
                <span>{app.name}</span>
                <small>{copy.privateBuild}</small>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <ul className="shelf-grid shelf-grid--extras">
        <li className="shelf-item">
          <Link className="shelf-cart shelf-manual" href={quickHref}>
            <PixelSprite id="manual" scale={4} />
            <span className="cart-tag">
              <span>{copy.manual}</span>
              <small>{copy.quickView}</small>
            </span>
          </Link>
        </li>
        <li className="shelf-item shelf-item--last">
          <span className="shelf-figure">
            <span className="shelf-frame">
              <SpriteAnimation kind="dog" scale={3} label={copy.companionAlt} />
            </span>
            <span className="cart-tag">
              <span>Matilda</span>
              <small>{copy.companion}</small>
            </span>
          </span>
        </li>
      </ul>
    </section>
  );
}
