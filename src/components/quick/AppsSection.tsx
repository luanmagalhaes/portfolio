import type { Portfolio } from "@/domain/view";
import type { Dictionary } from "@/i18n/dictionary";
import { AppCard } from "@/components/quick/AppCard";
import { Chips, Section } from "@/components/quick/Section";

export function AppsSection({ portfolio, dictionary }: { portfolio: Portfolio; dictionary: Dictionary }) {
  return (
    <Section id="apps" title={dictionary.apps} intro={dictionary.appsIntro}>
      <ul className="grid gap-5 lg:grid-cols-2">
        {portfolio.apps.map((app) => (
          <AppCard key={app.id} app={app} dictionary={dictionary} />
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-sm text-silver">{dictionary.appStack}</span>
        <Chips items={portfolio.appStack} />
      </div>
    </Section>
  );
}
