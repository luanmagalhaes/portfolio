import type { Ref } from "react";
import type { Portfolio } from "@/domain/view";
import { CartridgeArt } from "@/components/arcade/CartridgeArt";

type App = Portfolio["apps"][number];

export function PocketSlot({ inserted, slotRef, onOpenCart }: { inserted: App | null; slotRef: Ref<HTMLDivElement>; onOpenCart: () => void }) {
  return (
    <div className="pocket">
      <div className="pocket-slot" ref={slotRef}>
        {inserted ? (
          <div className="pocket-cart">
            <button type="button" aria-label={inserted.name} onClick={onOpenCart}>
              <CartridgeArt id={inserted.id} emblem={inserted.emblem} powered />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
