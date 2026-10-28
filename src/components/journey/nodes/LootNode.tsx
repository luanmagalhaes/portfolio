import { Sign } from "@/components/journey/nodes/Sign";

export function LootNode({ index, kicker, text, emblem }: { index: number; kicker: string; text: string; emblem: string }) {
  return (
    <article className="jr-item jr-lore" data-node={index} aria-label={kicker}>
      <span className="jr-lore-post" aria-hidden="true" />
      <Sign kicker={kicker} points={[text]} emblem={emblem} />
    </article>
  );
}
