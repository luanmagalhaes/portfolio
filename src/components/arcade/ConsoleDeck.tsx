import type { Ref } from "react";
import type { Portfolio } from "@/domain/view";
import type { ArcadeCopy } from "@/components/arcade/copy";
import { CartridgeArt } from "@/components/arcade/CartridgeArt";

type App = Portfolio["apps"][number];

interface ConsoleDeckProps {
  copy: ArcadeCopy;
  inserted: App | null;
  slotRef: Ref<HTMLSpanElement>;
  onPower: () => void;
  onReset: () => void;
  onEject: () => void;
  onOpenCart: () => void;
}

export function ConsoleDeck({ copy, inserted, slotRef, onPower, onReset, onEject, onOpenCart }: ConsoleDeckProps) {
  return (
    <div className="cabinet">
      <div className="bay">
        {inserted ? (
          <div className="slot-cart">
            <button type="button" aria-label={inserted.name} onClick={onOpenCart}>
              <CartridgeArt id={inserted.id} emblem={inserted.emblem} powered />
            </button>
          </div>
        ) : null}
        <div className="console">
          <span className="console-slot" ref={slotRef} />
          <span className="console-led" aria-hidden="true" />
          <span className="console-brand" aria-hidden="true">
            LM-16
          </span>
          <div className="console-btns">
            <button type="button" className="cbtn cbtn--power" onClick={onPower}>
              <i />
              <span>{copy.power}</span>
            </button>
            <button type="button" className="cbtn" onClick={onReset}>
              <i />
              <span>{copy.reset}</span>
            </button>
            <button type="button" className="cbtn" onClick={onEject}>
              <i />
              <span>{copy.eject}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
