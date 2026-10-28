import type { Portfolio } from "@/domain/view";
import type { ArcadeCopy } from "@/components/arcade/copy";
import { CartridgeArt } from "@/components/arcade/CartridgeArt";
import { Emblem } from "@/components/arcade/Emblem";
import { PixelSprite } from "@/components/arcade/PixelSprite";
import { ScreenHeader, type Progress } from "@/components/arcade/screens/ScreenHeader";

type PrivateApp = Portfolio["privateApps"][number];

export function LockedScreen({ copy, item, progress, onBack }: { copy: ArcadeCopy; item: PrivateApp; progress: Progress; onBack: () => void }) {
  return (
    <section className="screen" data-screen="locked">
      <ScreenHeader title={copy.privateBuild} copy={copy} onBack={onBack} progress={progress} />
      <div className="locked">
        <div className="locked-art">
          <CartridgeArt id={item.id} emblem={item.emblem} locked />
        </div>
        <div className="locked-text">
          <p className="locked-badge">
            <PixelSprite id="lock" scale={1} />
            {copy.privateBuild}
          </p>
          <p className="locked-name">
            <Emblem emblem={item.emblem} />
            {item.name}
          </p>
          <p className="locked-pitch">{item.pitch}</p>
          <p className="locked-note">{copy.privateNote}</p>
          <button type="button" className="pbtn" data-nav onClick={onBack}>
            <PixelSprite id="back" />
            <span>{copy.backToShelf}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
