import type { OverworldCopy } from "@/components/overworld/copy";
import type { DistrictId } from "@/components/overworld/model/map";
import { jobDistrict, milestoneDistrict } from "@/components/overworld/model/routing";
import { Emblem } from "@/components/overworld/ui/Emblem";
import { PixelIcon } from "@/components/overworld/ui/PixelIcon";
import { Points } from "@/components/overworld/windows/shared";
import type { Portfolio } from "@/domain/view";
import type { ReactNode } from "react";

function Quest({ icon, title, meta, points, place, copy, onGo, open }: { icon: ReactNode; title: string; meta: string; points: readonly string[]; place: DistrictId; copy: OverworldCopy; onGo: (place: DistrictId) => void; open?: boolean }) {
  return (
    <details className="quest" open={open}>
      <summary>
        {icon}
        <span>
          <span className="quest__title">{title}</span>
          <span className="quest__meta">{meta}</span>
        </span>
        <span className="quest__chevron" aria-hidden="true" />
      </summary>
      <div className="quest__body">
        <Points items={points} />
        <div className="actions">
          <button type="button" className="px-btn px-btn--dark" onClick={() => onGo(place)}>
            <PixelIcon name="map" />
            {copy.goThere}
          </button>
        </div>
      </div>
    </details>
  );
}

export function QuestLogWindow({ portfolio, copy, onGo }: { portfolio: Portfolio; copy: OverworldCopy; onGo: (place: DistrictId) => void }) {
  return (
    <>
      <section aria-labelledby="ow-quests-experience">
        <h3 className="section-title" id="ow-quests-experience">
          <PixelIcon name="star" />
          {copy.experience}
        </h3>
        {portfolio.jobs.map((job, index) => (
          <Quest key={job.id} icon={<Emblem emblem={job.emblem} />} title={job.company} meta={[job.role, job.period, job.place].filter(Boolean).join(" · ")} points={job.highlights} place={jobDistrict(job.emblem)} copy={copy} onGo={onGo} open={index === 0} />
        ))}
      </section>
      <section aria-labelledby="ow-quests-cases">
        <h3 className="section-title" id="ow-quests-cases">
          <PixelIcon name="swords" />
          {copy.clientProjects}
        </h3>
        <Quest icon={<PixelIcon name="swords" size="lg" />} title={copy.bosses} meta={copy.bossCount(portfolio.cases.length)} points={portfolio.cases.map((item) => `${item.boss}: ${item.result}`)} place="fort" copy={copy} onGo={onGo} />
      </section>
      <section aria-labelledby="ow-quests-path">
        <h3 className="section-title" id="ow-quests-path">
          <PixelIcon name="bridge" />
          {copy.path}
        </h3>
        {portfolio.milestones.map((milestone) => (
          <Quest key={milestone.id} icon={<Emblem emblem={milestone.emblem} />} title={milestone.title} meta={milestone.period} points={[milestone.summary]} place={milestoneDistrict(milestone.emblem)} copy={copy} onGo={onGo} />
        ))}
      </section>
      <section aria-labelledby="ow-quests-side">
        <h3 className="section-title" id="ow-quests-side">
          <PixelIcon name="arcade" />
          {copy.sideQuests}
        </h3>
        <Quest icon={<PixelIcon name="arcade" size="lg" />} title={copy.places.arcade.title} meta={copy.appsCount(portfolio.apps.length)} points={portfolio.apps.map((app) => `${app.name}: ${app.pitch}`)} place="arcade" copy={copy} onGo={onGo} />
        {portfolio.aiProjects.map((project) => (
          <Quest key={project.id} icon={<Emblem emblem={project.emblem} />} title={project.name} meta={project.status ?? copy.places.lighthouse.title} points={[project.summary]} place="lighthouse" copy={copy} onGo={onGo} />
        ))}
      </section>
    </>
  );
}
