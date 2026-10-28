import { emblemPath } from "@/components/arcade/themes";

export function EmblemArt({ name, emblem, label }: { name: string; emblem: string; label: string }) {
  return (
    <div className="poster-art" role="img" aria-label={label}>
      <span className="poster-emblem" style={{ backgroundImage: `url(${emblemPath(emblem)})` }} />
      <span className="poster-title" aria-hidden="true">
        {name}
      </span>
    </div>
  );
}
