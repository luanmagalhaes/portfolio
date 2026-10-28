import { emblemPath } from "@/components/arcade/themes";

export function Emblem({ emblem, size = 32, className, label }: { emblem: string; size?: number; className?: string; label?: string }) {
  return (
    <span
      className={["pixel-emblem", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size, backgroundImage: `url(${emblemPath(emblem)})` }}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    />
  );
}
