import type { Localized } from "@/domain/locale";

export interface ProfileContent {
  name: string;
  title: Localized;
  location: Localized;
  email: string;
  linkedin: string;
  github: string;
  summary: Localized;
  resume: Localized;
}

export interface JobContent {
  id: string;
  company: string;
  role: Localized;
  period: Localized;
  place: Localized;
  about: Localized;
  highlights: Localized<string[]>;
  stack: string[];
  emblem: string;
}

export interface MilestoneContent {
  id: string;
  title: Localized;
  period: Localized;
  summary: Localized;
  emblem: string;
}

export interface CaseContent {
  id: string;
  boss: Localized;
  client: Localized;
  problem: Localized;
  moves: Localized<string[]>;
  result: Localized;
  stack: string[];
}

export interface AppContent {
  id: string;
  name: string;
  pitch: Localized;
  daysToBuild: number;
  liveUrl: string;
  codeUrl: string | null;
  emblem: string;
  poster: string;
}

export interface PrivateAppContent {
  id: string;
  name: string;
  pitch: Localized;
  emblem: string;
}

export interface AiProjectContent {
  id: string;
  name: Localized;
  status: Localized | null;
  summary: Localized;
  emblem: string;
}

export interface SkillGroupContent {
  id: string;
  name: Localized;
  items: Localized<string[]>;
}

export interface EducationContent {
  id: string;
  title: Localized;
  school: Localized;
  period: Localized | null;
}

export interface LanguageContent {
  id: string;
  name: Localized;
  level: Localized;
}

export interface PortfolioContent {
  profile: ProfileContent;
  jobs: JobContent[];
  milestones: MilestoneContent[];
  cases: CaseContent[];
  apps: AppContent[];
  appStack: string[];
  privateApps: PrivateAppContent[];
  aiProjects: AiProjectContent[];
  skills: SkillGroupContent[];
  education: EducationContent[];
  languages: LanguageContent[];
}

export interface PortfolioSource {
  load(): PortfolioContent;
}
