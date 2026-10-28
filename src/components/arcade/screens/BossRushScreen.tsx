import type { Portfolio } from "@/domain/view";
import type { ArcadeCopy } from "@/components/arcade/copy";
import { PixelSprite } from "@/components/arcade/PixelSprite";
import { bossSpriteFor } from "@/components/arcade/themes";
import { ScreenHeader, type Progress } from "@/components/arcade/screens/ScreenHeader";

type Case = Portfolio["cases"][number];

export function BossRushScreen({ copy, cases, cleared, progress, onBack, onOpen }: { copy: ArcadeCopy; cases: Case[]; cleared: string[]; progress: Progress; onBack: () => void; onOpen: (id: string) => void }) {
  return (
    <section className="screen" data-screen="bosses">
      <ScreenHeader title={copy.bossesTitle} copy={copy} onBack={onBack} progress={progress} />
      <p className="screen-intro">{copy.bossesIntro}</p>
      <ul className="boss-grid">
        {cases.map((item) => {
          const done = cleared.includes(item.id);
          return (
            <li key={item.id}>
              <button type="button" className="boss-card" data-nav onClick={() => onOpen(item.id)}>
                <PixelSprite id={bossSpriteFor(item.id)} scale={3} />
                <span className="boss-info">
                  <span className="boss-name">{item.boss}</span>
                  <span className="boss-client">{item.client}</span>
                  <span className={done ? "boss-status is-cleared" : "boss-status"}>{done ? copy.clearedLabel : copy.notFought}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
