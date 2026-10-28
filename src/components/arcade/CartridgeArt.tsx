import { cartridgeRows, palette, pixelRuns } from "@/components/arcade/pixels";
import { emblemPath, lockEmblem, themeFor } from "@/components/arcade/themes";

interface CartridgeArtProps {
  id: string;
  emblem: string;
  locked?: boolean;
  powered?: boolean;
  className?: string;
}

function cartridgeColors(id: string, locked: boolean, powered: boolean): Record<string, string> {
  const theme = themeFor(id);

  return {
    ...palette,
    1: locked ? palette.S : palette[theme.label],
    2: locked ? palette.M : palette[theme.stripe],
    3: locked ? palette.M : palette.S,
    4: locked ? palette.S : palette.G,
    5: locked ? palette.N : palette.M,
    6: powered ? palette.g : palette.X,
    7: palette.K,
  };
}

export function CartridgeArt({ id, emblem, locked = false, powered = false, className }: CartridgeArtProps) {
  const runs = pixelRuns(cartridgeRows, cartridgeColors(id, locked, powered));

  return (
    <svg className={["cart-art", className].filter(Boolean).join(" ")} viewBox="0 0 40 48" width={80} height={96} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {runs.map((run) => (
        <rect key={`${run.x}-${run.y}`} x={run.x} y={run.y} width={run.width} height={1} fill={run.fill} />
      ))}
      <image href={locked ? lockEmblem : emblemPath(emblem)} x={12} y={11} width={16} height={16} className="cart-emblem" preserveAspectRatio="xMidYMid meet" />
    </svg>
  );
}
