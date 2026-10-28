import { pixelRuns, sprites, spriteSize, type SpriteId } from "@/components/arcade/pixels";

export function PixelSprite({ id, scale = 2, className, label }: { id: SpriteId; scale?: number; className?: string; label?: string }) {
  const { width, height } = spriteSize(id);
  const accessibility = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };

  return (
    <svg className={["pixel-sprite", className].filter(Boolean).join(" ")} viewBox={`0 0 ${width} ${height}`} width={width * scale} height={height * scale} shapeRendering="crispEdges" focusable="false" {...accessibility}>
      {pixelRuns(sprites[id]).map((run) => (
        <rect key={`${run.x}-${run.y}`} x={run.x} y={run.y} width={run.width} height={1} fill={run.fill} />
      ))}
    </svg>
  );
}
