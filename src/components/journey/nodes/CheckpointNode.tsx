import type { Portfolio } from "@/domain/view";
import type { JourneyCopy } from "@/components/journey/copy";
import { emblemPath } from "@/components/journey/model/assets";
import { Sign, type SignProps } from "@/components/journey/nodes/Sign";
import { Sprite } from "@/components/journey/nodes/Sprite";

type Source = "job" | "milestone" | "ai";

export function checkpointSign(portfolio: Portfolio, copy: JourneyCopy, source: Source, id: string): SignProps | null {
  if (source === "job") {
    const job = portfolio.jobs.find((item) => item.id === id);
    if (!job) return null;
    return { kicker: copy.checkpoint, when: job.period, title: job.company, org: `${job.role} · ${job.place}`, points: [job.about, ...job.highlights.slice(0, 1)], emblem: emblemPath(job.emblem) };
  }
  if (source === "milestone") {
    const milestone = portfolio.milestones.find((item) => item.id === id);
    if (!milestone) return null;
    return { kicker: copy.checkpoint, when: milestone.period, title: milestone.title, points: [milestone.summary], emblem: emblemPath(milestone.emblem) };
  }
  const project = portfolio.aiProjects.find((item) => item.id === id);
  if (!project) return null;
  return { kicker: copy.checkpoint, title: project.name, org: project.status ?? undefined, points: [project.summary], emblem: emblemPath(project.emblem) };
}

interface CheckpointNodeProps {
  index: number;
  sign: SignProps;
  flagColor: string;
}

export function CheckpointNode({ index, sign, flagColor }: CheckpointNodeProps) {
  const titleId = `jr-stop-${index}`;

  return (
    <article className="jr-item jr-flag" data-node={index} aria-labelledby={titleId}>
      <div className="jr-pole" aria-hidden="true">
        <span className="jr-cloth" style={{ ["--flag-c" as string]: flagColor }}>
          <Sprite src={sign.emblem} width={32} height={32} />
        </span>
      </div>
      <Sign {...sign} titleId={titleId} />
    </article>
  );
}
