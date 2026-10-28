import type { Speaker } from "@/components/overworld/art/scenes";
import { Portrait } from "@/components/overworld/ui/Portrait";

export function Greeting({ speaker, name, text }: { speaker: Speaker; name: string; text: string }) {
  return (
    <div className="greeting">
      <div className="greeting__portrait">
        <Portrait speaker={speaker} />
      </div>
      <p className="greeting__text">
        <span className="greeting__name">{name}</span>
        {text}
      </p>
    </div>
  );
}
