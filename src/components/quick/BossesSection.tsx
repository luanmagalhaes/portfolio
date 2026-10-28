import type { Portfolio } from "@/domain/view";
import type { Dictionary } from "@/i18n/dictionary";
import { Chips, Section } from "@/components/quick/Section";

export function BossesSection({ portfolio, dictionary }: { portfolio: Portfolio; dictionary: Dictionary }) {
  return (
    <Section id="bosses" title={dictionary.bosses} intro={dictionary.bossesIntro}>
      <ul className="grid gap-5 md:grid-cols-2">
        {portfolio.cases.map((item) => (
          <li key={item.id} className="pixel-panel p-5">
            <h3 className="font-pixel text-xl text-cream">{item.boss}</h3>
            <p className="mt-1 text-sm text-lavender">{item.client}</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-pixel text-red">{dictionary.problem}</dt>
                <dd className="mt-1 text-silver">{item.problem}</dd>
              </div>
              <div>
                <dt className="font-pixel text-sky">{dictionary.moves}</dt>
                <dd className="mt-1">
                  <ul className="list-disc space-y-1 pl-5 text-silver">
                    {item.moves.map((move) => (
                      <li key={move}>{move}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="font-pixel text-green">{dictionary.result}</dt>
                <dd className="mt-1 text-cream">{item.result}</dd>
              </div>
            </dl>
            <div className="mt-4">
              <Chips items={item.stack} />
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
