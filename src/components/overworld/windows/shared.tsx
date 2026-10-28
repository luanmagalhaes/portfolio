import type { Portfolio } from "@/domain/view";
import { Emblem } from "@/components/overworld/ui/Emblem";

export type Job = Portfolio["jobs"][number];

export type Milestone = Portfolio["milestones"][number];

export function Chips({ items }: { items: readonly string[] }) {
  return (
    <ul className="chips">
      {items.map((item) => (
        <li key={item} className="px-chip">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Points({ items }: { items: readonly string[] }) {
  return (
    <ul className="points">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function JobCard({ job }: { job: Job }) {
  return (
    <article className="card">
      <div className="card__head">
        <Emblem emblem={job.emblem} />
        <div>
          <h3 className="card__title">{job.company}</h3>
          <p className="card__meta">{[job.role, job.period, job.place].filter(Boolean).join(" · ")}</p>
        </div>
      </div>
      {job.about ? <p className="card__about">{job.about}</p> : null}
      <Points items={job.highlights} />
      <Chips items={job.stack} />
    </article>
  );
}

export function MilestoneCard({ milestone }: { milestone: Milestone }) {
  return (
    <article className="card">
      <div className="card__head">
        <Emblem emblem={milestone.emblem} />
        <div>
          <h3 className="card__title">{milestone.title}</h3>
          <p className="card__meta">{milestone.period}</p>
        </div>
      </div>
      <p className="card__about">{milestone.summary}</p>
    </article>
  );
}
