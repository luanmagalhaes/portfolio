import Image from "next/image";
import type { ArcadeCopy } from "@/components/arcade/copy";
import { menuTargets, type MenuTarget } from "@/components/arcade/navigation";
import { PixelSprite } from "@/components/arcade/PixelSprite";
import { characterSheets } from "@/components/arcade/themes";
import { ScreenHeader, type Progress } from "@/components/arcade/screens/ScreenHeader";

interface MenuScreenProps {
  copy: ArcadeCopy;
  name: string;
  role: string;
  location: string;
  progress: Progress;
  onOpen: (target: MenuTarget) => void;
}

export function MenuScreen({ copy, name, role, location, progress, onOpen }: MenuScreenProps) {
  return (
    <section className="screen" data-screen="menu">
      <ScreenHeader title={copy.menuTitle} copy={copy} progress={progress} />
      <div className="menu-layout">
        <nav aria-label={copy.menuTitle}>
          <ul className="menu-list">
            {menuTargets.map((target) => (
              <li key={target}>
                <button type="button" className="menu-item" data-nav onClick={() => onOpen(target)}>
                  <PixelSprite id="cursor" className="cursor" />
                  <span className="menu-label">{copy.menu[target][0]}</span>
                  <span className="menu-sub">{copy.menu[target][1]}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <aside className="player-card panel" aria-label={copy.player}>
          <Image className="portrait" src={characterSheets.portrait} alt={copy.portraitAlt} width={128} height={128} unoptimized />
          <dl className="pc-list">
            <div>
              <dt>{copy.player}</dt>
              <dd>{name}</dd>
            </div>
            <div>
              <dt>{copy.classLabel}</dt>
              <dd>{role}</dd>
            </div>
            <div>
              <dt>{copy.originLabel}</dt>
              <dd>{copy.originValue}</dd>
            </div>
            <div>
              <dt>{copy.baseLabel}</dt>
              <dd>{location}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
