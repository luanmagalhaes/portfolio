import type { ThemeId } from "@/components/journey/model/level";
import type { Portfolio } from "@/domain/view";

export type Mode = "h" | "v";

export interface Viewport {
  width: number;
  mode: Mode;
  reduced: boolean;
  desktop: boolean;
}

export interface Segment {
  theme: ThemeId;
  x0: number;
  x1: number;
}

export type App = Portfolio["apps"][number];
export type Job = Portfolio["jobs"][number];
export type Milestone = Portfolio["milestones"][number];
export type Case = Portfolio["cases"][number];
export type AiProject = Portfolio["aiProjects"][number];

export interface JourneyControls {
  step: (direction: 1 | -1) => void;
  goTo: (index: number, fight: boolean) => void;
}
