import type { CSSProperties } from "react";

export function SpriteAnimation({ kind, scale, className, label }: { kind: "idle" | "dog"; scale?: number; className?: string; label?: string }) {
  return (
    <span
      className={["sheet", `sheet-${kind}`, className].filter(Boolean).join(" ")}
      style={scale ? ({ "--scale": scale } as CSSProperties) : undefined}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    />
  );
}
