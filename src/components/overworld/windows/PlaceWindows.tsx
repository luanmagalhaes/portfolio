import Image from "next/image";
import type { OverworldCopy } from "@/components/overworld/copy";
import type { DistrictId } from "@/components/overworld/model/map";
import { jobDistrict, milestoneDistrict } from "@/components/overworld/model/routing";
import { Emblem } from "@/components/overworld/ui/Emblem";
import { Greeting } from "@/components/overworld/ui/Greeting";
import { PixelIcon } from "@/components/overworld/ui/PixelIcon";
import { JobCard, MilestoneCard } from "@/components/overworld/windows/shared";
import type { Portfolio } from "@/domain/view";

interface PlaceProps {
  portfolio: Portfolio;
  copy: OverworldCopy;
  firstName: string;
}

export function jobsIn(portfolio: Portfolio, district: DistrictId): Portfolio["jobs"] {
  return portfolio.jobs.filter((job) => jobDistrict(job.emblem) === district);
}

export function milestonesIn(portfolio: Portfolio, district: DistrictId): Portfolio["milestones"] {
  return portfolio.milestones.filter((milestone) => milestoneDistrict(milestone.emblem) === district);
}

export function HouseWindow({ portfolio, copy, firstName }: PlaceProps) {
  const profile = portfolio.profile;
  return (
    <>
      <Greeting speaker="matilda" name={copy.places.house.npc} text={copy.greetings.house(firstName)} />
      <section className="sheet" aria-labelledby="ow-sheet">
        <div className="sheet__portrait">
          <Image src="/kit/characters/luan/luan-portrait.png" alt={profile.name} width={128} height={128} unoptimized />
        </div>
        <div className="sheet__main">
          <h3 className="section-title" id="ow-sheet">
            <PixelIcon name="person" />
            {copy.characterSheet}
          </h3>
          <p className="sheet__name">{profile.name}</p>
          <p className="sheet__title">{profile.title}</p>
          <dl className="stats">
            {profile.stats.map((stat) => (
              <div key={stat.id} className="stats__row">
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <p className="prose">{profile.summary}</p>
      <section aria-labelledby="ow-house-languages">
        <h3 className="section-title" id="ow-house-languages">
          <PixelIcon name="globe" />
          {copy.languages}
        </h3>
        <ul className="slots">
          {portfolio.languages.map((language) => (
            <li key={language.id} className="slot">
              <PixelIcon name="bubble" />
              <span className="slot__text">
                <strong>{language.name}</strong>
                <span>{language.level}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
      <div className="actions">
        <a className="px-btn px-btn--primary" href={profile.resume} download>
          <PixelIcon name="page" />
          {copy.resumePdf}
        </a>
        <a className="px-btn" href={`mailto:${profile.email}`}>
          <PixelIcon name="envelope" />
          {profile.email}
        </a>
      </div>
    </>
  );
}

export function JobsWindow({ portfolio, copy, district }: PlaceProps & { district: DistrictId }) {
  const jobs = jobsIn(portfolio, district);
  const greeting = district === "auction" ? (jobs[0]?.about ?? copy.places.auction.sub) : district === "bridge" ? copy.greetings.bridge : copy.greetings.harbor;
  const speaker = district === "auction" ? "auctioneer" : district === "bridge" ? "sign" : "harbor";
  return (
    <>
      <Greeting speaker={speaker} name={copy.places[district].npc} text={greeting} />
      <div className="cards">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </>
  );
}

export function MilestonesWindow({ portfolio, copy, district }: PlaceProps & { district: DistrictId }) {
  const milestones = milestonesIn(portfolio, district);
  const isSchool = district === "school";
  return (
    <>
      <Greeting speaker={isSchool ? "teacher" : "nurse"} name={copy.places[district].npc} text={isSchool ? copy.greetings.school : copy.greetings.hospital} />
      <div className="cards cards--2">
        {milestones.map((milestone) => (
          <MilestoneCard key={milestone.id} milestone={milestone} />
        ))}
      </div>
      {isSchool ? (
        <>
          <section aria-labelledby="ow-school-education">
            <h3 className="section-title" id="ow-school-education">
              <PixelIcon name="book" />
              {copy.education}
            </h3>
            <ul className="slots">
              {portfolio.education.map((entry) => (
                <li key={entry.id} className="slot slot--wide">
                  <PixelIcon name="book" />
                  <span className="slot__text">
                    <strong>{entry.title}</strong>
                    <span>{[entry.school, entry.period].filter(Boolean).join(" · ")}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="ow-school-languages">
            <h3 className="section-title" id="ow-school-languages">
              <PixelIcon name="globe" />
              {copy.languages}
            </h3>
            <ul className="slots">
              {portfolio.languages.map((language) => (
                <li key={language.id} className="slot">
                  <PixelIcon name="bubble" />
                  <span className="slot__text">
                    <strong>{language.name}</strong>
                    <span>{language.level}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </>
  );
}

export function LighthouseWindow({ portfolio, copy }: PlaceProps) {
  return (
    <>
      <Greeting speaker="keeper" name={copy.places.lighthouse.npc} text={copy.greetings.lighthouse} />
      <div className="cards">
        {portfolio.aiProjects.map((project) => (
          <article key={project.id} className="card">
            <div className="card__head">
              <Emblem emblem={project.emblem} />
              <div>
                <h3 className="card__title">{project.name}</h3>
                {project.status ? <p className="card__meta">{project.status}</p> : null}
              </div>
            </div>
            <p className="card__about">{project.summary}</p>
          </article>
        ))}
      </div>
    </>
  );
}

export function PostWindow({ portfolio, copy, firstName }: PlaceProps) {
  const profile = portfolio.profile;
  const linkedinLabel = profile.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const githubLabel = profile.github.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  return (
    <>
      <Greeting speaker="clerk" name={copy.places.post.npc} text={copy.greetings.post(firstName)} />
      <ul className="contact-list" aria-label={copy.contactTitle}>
        <li>
          <a href={`mailto:${profile.email}`}>
            <PixelIcon name="envelope" size="lg" />
            <span>
              <strong>{copy.email}</strong>
              <span>{profile.email}</span>
            </span>
          </a>
        </li>
        <li>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            <PixelIcon name="person" size="lg" />
            <span>
              <strong>{copy.linkedin}</strong>
              <span>{linkedinLabel}</span>
            </span>
          </a>
        </li>
        <li>
          <a href={profile.github} target="_blank" rel="noreferrer">
            <PixelIcon name="code" size="lg" />
            <span>
              <strong>{copy.github}</strong>
              <span>{githubLabel}</span>
            </span>
          </a>
        </li>
        <li>
          <a href={profile.resume} download>
            <PixelIcon name="page" size="lg" />
            <span>
              <strong>{copy.resumePdf}</strong>
              <span>{profile.title}</span>
            </span>
          </a>
        </li>
      </ul>
    </>
  );
}

export function PrivateBuildsWindow({ portfolio, copy }: PlaceProps) {
  return (
    <>
      <Greeting speaker="attendant" name={copy.speakers.attendant} text={copy.privateGreeting} />
      <ul className="slots">
        {portfolio.privateApps.map((app) => (
          <li key={app.id} className="slot slot--wide slot--locked">
            <Emblem emblem={app.emblem} locked />
            <span className="slot__text">
              <strong>{app.name}</strong>
              <span>{app.pitch}</span>
              <span className="badge badge--dark">{copy.privateBuild}</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
