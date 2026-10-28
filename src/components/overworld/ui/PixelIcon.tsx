import { paletteChars, type PaletteChar } from "@/components/overworld/art/palette";
import { iconRows } from "@/components/overworld/art/sprites";

function pathsFor(rows: string[]): [string, string][] {
  const paths = new Map<string, string[]>();
  rows.forEach((line, y) => {
    let x = 0;
    while (x < line.length) {
      const char = line[x];
      let end = x;
      while (end < line.length && line[end] === char) end++;
      if (char !== "." && char in paletteChars) {
        const list = paths.get(char) ?? [];
        list.push(`M${x} ${y}h${end - x}v1h-${end - x}z`);
        paths.set(char, list);
      }
      x = end;
    }
  });
  return Array.from(paths.entries()).map(([char, list]) => [paletteChars[char as PaletteChar], list.join("")]);
}

export function PixelIcon({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const rows = iconRows[name] ?? iconRows.star;
  return (
    <svg className={`icon icon--${size}`} viewBox={`0 0 ${rows[0].length} ${rows.length}`} aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      {pathsFor(rows).map(([color, d]) => (
        <path key={color} className={`f-${color}`} d={d} />
      ))}
    </svg>
  );
}
