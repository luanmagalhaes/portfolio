import type { ReactNode, Ref } from "react";
import { PixelSprite } from "@/components/arcade/PixelSprite";

interface CrtTvProps {
  channel: string;
  clock: string;
  clockLabel: string;
  screenRef: Ref<HTMLDivElement>;
  noiseRef: Ref<HTMLCanvasElement>;
  children: ReactNode;
}

export function CrtTv({ channel, clock, clockLabel, screenRef, noiseRef, children }: CrtTvProps) {
  return (
    <div className="crt">
      <div className="crt-screen" ref={screenRef}>
        <div className="screens">{children}</div>
        <span className="power-dot" aria-hidden="true" />
        <canvas className="noise" ref={noiseRef} width={160} height={120} aria-hidden="true" />
        <div className="scanlines" aria-hidden="true" />
        <div className="glass" aria-hidden="true" />
      </div>
      <div className="crt-chin">
        <span className="tv-brand" aria-hidden="true">
          LM-16
        </span>
        <span className="tv-channel" aria-hidden="true">
          <small>CH</small>
          <span>{channel}</span>
        </span>
        <span className="tv-channel tv-clock" role="img" aria-label={`${clockLabel}: ${clock}`}>
          <span>{clock}</span>
          <small>UTC-3</small>
        </span>
        <span className="tv-led" aria-hidden="true" />
        <span className="tv-grille" aria-hidden="true" />
        <span className="tv-knob" aria-hidden="true">
          <PixelSprite id="knob" scale={3} />
        </span>
        <span className="tv-knob" aria-hidden="true">
          <PixelSprite id="knob" scale={3} />
        </span>
      </div>
    </div>
  );
}
