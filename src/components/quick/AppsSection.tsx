import Image from "next/image";
import type { Portfolio } from "@/domain/view";
import type { Dictionary } from "@/i18n/dictionary";
import { Chips, Section } from "@/components/quick/Section";

export function AppsSection({ portfolio, dictionary }: { portfolio: Portfolio; dictionary: Dictionary }) {
  return (
    <Section id="apps" title={dictionary.apps} intro={dictionary.appsIntro}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {portfolio.apps.map((app) => (
          <li key={app.id} className="pixel-panel flex flex-col overflow-hidden">
            <Image src={app.poster} alt={dictionary.screenshotOf(app.name)} width={1440} height={900} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="aspect-[16/10] w-full border-b-4 border-ink object-cover object-top" />
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-pixel text-xl text-cream">{app.name}</h3>
              <p className="mt-1 text-sm text-green">{dictionary.builtIn(app.daysToBuild)}</p>
              <p className="mt-2 flex-1 text-sm text-silver">{app.pitch}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a className="pixel-button pixel-button-primary" href={app.liveUrl} target="_blank" rel="noreferrer">
                  {dictionary.openApp}
                </a>
                {app.codeUrl ? (
                  <a className="pixel-button" href={app.codeUrl} target="_blank" rel="noreferrer">
                    {dictionary.sourceCode}
                  </a>
                ) : (
                  <span className="self-center text-xs text-grey">{dictionary.privateCode}</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Chips items={portfolio.appStack} />
      </div>
    </Section>
  );
}
