import { aiProjects, appStack, apps, privateApps } from "@/content/projects";
import { cases } from "@/content/cases";
import { jobs, milestones } from "@/content/career";
import { profile } from "@/content/profile";
import { education, languages, skills } from "@/content/skills";
import type { PortfolioContent, PortfolioSource } from "@/domain/portfolio";

export const staticPortfolioSource: PortfolioSource = {
  load(): PortfolioContent {
    return { profile, jobs, milestones, cases, apps, appStack, privateApps, aiProjects, skills, education, languages };
  },
};
