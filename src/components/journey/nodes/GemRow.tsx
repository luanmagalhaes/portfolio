import type { Gem } from "@/components/journey/model/level";
import { gemOffsets } from "@/components/journey/model/geometry";
import { gemPath } from "@/components/journey/model/assets";
import { Sprite } from "@/components/journey/nodes/Sprite";

export function GemRow({ index, gems, width, label }: { index: number; gems: Gem[]; width: number; label: string }) {
  const { gx, gy } = gemOffsets(gems.length, width);

  return (
    <div className="jr-item jr-gems" data-node={index} style={{ ["--gw" as string]: width }}>
      <div className="jr-gem-arc" aria-hidden="true">
        {gems.map((gem, k) => (
          <span key={gem.id} className="jr-gem-sprite" data-k={k} data-gx={gx[k]} style={{ ["--gx" as string]: gx[k], ["--gy" as string]: gy[k] }}>
            <Sprite src={gemPath(gem.tone)} width={12} height={12} />
          </span>
        ))}
      </div>
      <div className="jr-gem-list jr-frame-dark">
        <p className="jr-gem-head">
          {label} <span data-count>{`0/${gems.length}`}</span>
        </p>
        <ul>
          {gems.map((gem, k) => (
            <li key={gem.id} className="jr-gem-chip" data-k={k} data-gem={gem.id}>
              <Sprite src={gemPath(gem.tone)} width={12} height={12} />
              {gem.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
