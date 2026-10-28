import type { Portfolio } from "@/domain/view";
import type { ArcadeCopy } from "@/components/arcade/copy";
import { Emblem } from "@/components/arcade/Emblem";
import { ScreenHeader, type Progress } from "@/components/arcade/screens/ScreenHeader";

type Job = Portfolio["jobs"][number];
type Milestone = Portfolio["milestones"][number];

interface HighScoresScreenProps {
  copy: ArcadeCopy;
  jobs: Job[];
  milestones: Milestone[];
  selectedId: string | null;
  progress: Progress;
  onBack: () => void;
  onSelect: (id: string) => void;
}

function JobDetail({ copy, job }: { copy: ArcadeCopy; job: Job }) {
  return (
    <>
      <div className="detail-head">
        <Emblem emblem={job.emblem} size={64} />
        <div>
          <h3 className="detail-title">{job.company}</h3>
          <p className="detail-meta">{[job.role, job.period, job.place].join(" · ")}</p>
        </div>
      </div>
      <p className="detail-about">{job.about}</p>
      <ul className="detail-points">
        {job.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
      <p className="detail-stack">
        <b>{copy.stackLabel}</b> {job.stack.join(", ")}
      </p>
    </>
  );
}

function MilestoneDetail({ milestone }: { milestone: Milestone }) {
  return (
    <>
      <div className="detail-head">
        <Emblem emblem={milestone.emblem} size={64} />
        <div>
          <h3 className="detail-title">{milestone.title}</h3>
          <p className="detail-meta">{milestone.period}</p>
        </div>
      </div>
      <p className="detail-about">{milestone.summary}</p>
    </>
  );
}

export function HighScoresScreen({ copy, jobs, milestones, selectedId, progress, onBack, onSelect }: HighScoresScreenProps) {
  const selectedJob = jobs.find((job) => job.id === selectedId) ?? (selectedId ? undefined : jobs[0]);
  const selectedMilestone = milestones.find((milestone) => milestone.id === selectedId);
  const activeId = selectedJob?.id ?? selectedMilestone?.id;

  return (
    <section className="screen" data-screen="scores">
      <ScreenHeader title={copy.scoresTitle} copy={copy} onBack={onBack} progress={progress} />
      <div className="scores-layout">
        <div className="score-board">
          <p className="stage-label">{copy.softwareStage}</p>
          <ol className="score-list">
            {jobs.map((job) => (
              <li key={job.id}>
                <button type="button" className="score-row" data-nav aria-pressed={activeId === job.id} onClick={() => onSelect(job.id)}>
                  <Emblem emblem={job.emblem} />
                  <span className="score-name">
                    <b>{job.company}</b>
                    <small>
                      {job.role} · {job.period}
                    </small>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="continue-divider">
            <b>{copy.continueYes}</b>
            <span>{copy.switchNote}</span>
          </p>
          <p className="stage-label">{copy.originStage}</p>
          <ol className="score-list">
            {milestones.map((milestone) => (
              <li key={milestone.id}>
                <button type="button" className="score-row" data-nav aria-pressed={activeId === milestone.id} onClick={() => onSelect(milestone.id)}>
                  <Emblem emblem={milestone.emblem} />
                  <span className="score-name">
                    <b>{milestone.title}</b>
                    <small>{milestone.period}</small>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <article className="score-detail panel" aria-live="polite">
          {selectedMilestone ? <MilestoneDetail milestone={selectedMilestone} /> : selectedJob ? <JobDetail copy={copy} job={selectedJob} /> : null}
        </article>
      </div>
    </section>
  );
}
