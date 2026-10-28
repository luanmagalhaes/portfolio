import Link from "next/link";
import type { ArcadeCopy } from "@/components/arcade/copy";
import { PixelSprite } from "@/components/arcade/PixelSprite";
import { SpriteAnimation } from "@/components/arcade/SpriteAnimation";

export function StartScreen({ copy, name, role, quickHref, onStart }: { copy: ArcadeCopy; name: string; role: string; quickHref: string; onStart: () => void }) {
  const [first, ...rest] = name.split(" ");

  return (
    <section className="screen screen--title" data-screen="title" aria-label={copy.screenNames.title}>
      <div className="sky" aria-hidden="true" />
      <p className="title-kicker">{copy.titleKicker}</p>
      <p className="title-logo">
        <span>{first}</span>
        <span>{rest.join(" ")}</span>
      </p>
      <p className="title-role">{role}</p>
      <p className="title-tagline">{copy.tagline}</p>
      <button type="button" className="press-start" data-nav onClick={onStart}>
        <PixelSprite id="cursor" />
        <span>{copy.pressStart}</span>
      </button>
      <Link className="title-quick" href={quickHref} data-nav>
        {copy.titleQuick}
      </Link>
      <div className="title-scene" role="img" aria-label={copy.sceneLabel}>
        <SpriteAnimation kind="idle" />
        <SpriteAnimation kind="dog" />
      </div>
      <p className="title-foot" aria-hidden="true">
        {copy.titleFoot}
      </p>
    </section>
  );
}
