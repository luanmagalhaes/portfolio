import type { Portfolio } from "@/domain/view";
import type { Dictionary } from "@/i18n/dictionary";
import { Section } from "@/components/quick/Section";

export function AiSection({ portfolio, dictionary }: { portfolio: Portfolio; dictionary: Dictionary }) {
  return (
    <Section id="ai" title={dictionary.ai}>
      <ul className="grid gap-5 md:grid-cols-3">
        {portfolio.aiProjects.map((project) => (
          <li key={project.id} className="pixel-panel p-5">
            <h3 className="font-pixel text-xl text-cream">{project.name}</h3>
            {project.status ? <p className="mt-1 text-sm text-yellow">{project.status}</p> : null}
            <p className="mt-2 text-sm text-silver">{project.summary}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function PrivateSection({ portfolio, dictionary }: { portfolio: Portfolio; dictionary: Dictionary }) {
  return (
    <Section id="private" title={dictionary.privateBuilds} intro={dictionary.privateBuildsIntro}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {portfolio.privateApps.map((app) => (
          <li key={app.id} className="pixel-panel p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-pixel text-lg text-cream">{app.name}</h3>
              <span className="chip">{dictionary.privateBuild}</span>
            </div>
            <p className="mt-2 text-sm text-silver">{app.pitch}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function SkillsSection({ portfolio, dictionary }: { portfolio: Portfolio; dictionary: Dictionary }) {
  return (
    <Section id="skills" title={dictionary.skills}>
      <dl className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {portfolio.skills.map((group) => (
          <div key={group.id} className="pixel-panel p-5">
            <dt className="font-pixel text-lg text-green">{group.name}</dt>
            <dd className="mt-2 text-sm text-silver">{group.items.join(" · ")}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

export function EducationSection({ portfolio, dictionary }: { portfolio: Portfolio; dictionary: Dictionary }) {
  return (
    <Section id="education" title={dictionary.education}>
      <div className="grid gap-5 md:grid-cols-3">
        <ul className="pixel-panel space-y-3 p-5 md:col-span-2">
          {portfolio.education.map((item) => (
            <li key={item.id}>
              <p className="text-cream">{item.title}</p>
              <p className="text-sm text-silver">
                {item.school}
                {item.period ? ` · ${item.period}` : ""}
              </p>
            </li>
          ))}
        </ul>
        <div className="pixel-panel p-5">
          <h3 className="font-pixel text-lg text-green">{dictionary.languages}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {portfolio.languages.map((language) => (
              <li key={language.id} className="text-silver">
                <span className="text-cream">{language.name}</span>, {language.level}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
