import { memo, type CSSProperties } from "react";
import { skyBands, skyGradient, sprites, themeLayerPath } from "@/components/journey/model/assets";
import type { Segment } from "@/components/journey/game/types";

const vars = (values: Record<string, string>) => values as CSSProperties;

function BackdropView({ segments }: { segments: Segment[] }) {
  return (
    <div className="jr-sky-stack" aria-hidden="true">
      {segments.map((segment, index) => {
        const sun = themeLayerPath(segment.theme, "sun");
        const strip = segment.theme === "ward" ? sprites.ecg : segment.theme === "commits" ? sprites.code : null;
        return (
          <div key={`${segment.theme}-${segment.x0}`} className={`jr-sky${index === 0 ? " jr-is-on" : ""}`} style={vars({ "--sky-bands": skyGradient(segment.theme), "--sky-last": skyBands[segment.theme].at(-1) ?? "#1d1730" })}>
            <span className="jr-sky-deco" style={{ backgroundImage: `url(${themeLayerPath(segment.theme, "deco")})` }} />
            {sun ? <span className="jr-sky-sun" style={{ backgroundImage: `url(${sun})` }} /> : null}
            <span className="jr-par jr-par-far">
              <i style={{ backgroundImage: `url(${themeLayerPath(segment.theme, "far")})` }} />
            </span>
            {strip ? (
              <span className="jr-par jr-par-strip">
                <i style={{ backgroundImage: `url(${strip})` }} />
              </span>
            ) : null}
            <span className="jr-par jr-par-mid">
              <i style={{ backgroundImage: `url(${themeLayerPath(segment.theme, "mid")})` }} />
            </span>
            {segment.theme === "snow" ? <span className="jr-snow" style={{ backgroundImage: `url(${sprites.snow})` }} /> : null}
          </div>
        );
      })}
    </div>
  );
}

export const Backdrop = memo(BackdropView);

export function Runner() {
  return (
    <div className="jr-actors" aria-hidden="true">
      <span className="jr-shadow" />
      <span className="jr-matilda" />
      <span className="jr-luan" />
    </div>
  );
}
