import Image from "next/image";
import type { Portfolio } from "@/domain/view";
import type { Dictionary } from "@/i18n/dictionary";
import { DemoVideo } from "@/components/media/DemoVideo";
import { PhoneFrame } from "@/components/quick/PhoneFrame";

type App = Portfolio["apps"][number];

export function AppCard({ app, dictionary }: { app: App; dictionary: Dictionary }) {
  return (
    <li className="pixel-panel flex gap-4 p-4 sm:gap-5 sm:p-5">
      <div className="w-[38%] max-w-[10.5rem] shrink-0">
        <PhoneFrame>
          {app.demo ? (
            <DemoVideo media={app.demo.portrait} label={dictionary.demoOf(app.name)} className="h-full w-full object-cover object-top" />
          ) : (
            <Image src={app.poster} alt={dictionary.screenshotOf(app.name)} width={1440} height={900} sizes="160px" className="h-full w-full object-cover" />
          )}
        </PhoneFrame>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-pixel text-2xl leading-tight text-cream">{app.name}</h3>
        <p className="mt-1 text-sm text-green">{dictionary.builtIn(app.daysToBuild)}</p>
        <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-silver">{app.pitch}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a className="pixel-button pixel-button-primary" href={app.liveUrl} target="_blank" rel="noreferrer" aria-label={dictionary.playLiveLabel(app.name)}>
            {dictionary.playLive}
          </a>
          {app.codeUrl ? (
            <a className="pixel-button" href={app.codeUrl} target="_blank" rel="noreferrer" aria-label={dictionary.sourceCodeLabel(app.name)}>
              {dictionary.sourceCode}
            </a>
          ) : (
            <span className="self-center text-xs text-grey">{dictionary.privateCode}</span>
          )}
        </div>
      </div>
    </li>
  );
}
