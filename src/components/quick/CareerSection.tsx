import type { Portfolio } from "@/domain/view";
import type { Dictionary } from "@/i18n/dictionary";
import { Chips, Section } from "@/components/quick/Section";

export function CareerSection({ portfolio, dictionary }: { portfolio: Portfolio; dictionary: Dictionary }) {
  return (
    <>
      <Section id="experience" title={dictionary.career}>
        <ol className="space-y-5">
          {portfolio.jobs.map((job) => (
            <li key={job.id} className="pixel-panel p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-pixel text-xl text-cream">
                  {job.company} <span className="text-lavender">· {job.role}</span>
                </h3>
                <p className="text-sm text-silver">
                  {job.period} · {job.place}
                </p>
              </div>
              <p className="mt-2 text-sm text-silver">{job.about}</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-cream/90">
                {job.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <div className="mt-4">
                <Chips items={job.stack} />
              </div>
            </li>
          ))}
        </ol>
      </Section>
      <Section id="path" title={dictionary.path} intro={dictionary.pathIntro}>
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {portfolio.milestones.map((milestone) => (
            <li key={milestone.id} className="pixel-panel p-5">
              <p className="text-sm text-green">{milestone.period}</p>
              <h3 className="mt-1 font-pixel text-lg text-cream">{milestone.title}</h3>
              <p className="mt-2 text-sm text-silver">{milestone.summary}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
