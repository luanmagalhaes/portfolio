import { uiIconPath } from "@/components/journey/model/assets";
import { Sign } from "@/components/journey/nodes/Sign";

export function RushSign({ index, title, lead }: { index: number; title: string; lead: string }) {
  return (
    <article className="jr-item jr-lore" data-node={index} aria-labelledby={`jr-stop-${index}`}>
      <span className="jr-lore-post" aria-hidden="true" />
      <Sign kicker={title} title={title} titleId={`jr-stop-${index}`} points={[lead]} emblem={uiIconPath("skull")} />
    </article>
  );
}
