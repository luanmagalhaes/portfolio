import type { WorldId } from "@/components/journey/model/level";

export type DialogState =
  | { type: "none" }
  | { type: "app"; appId: string; live: boolean }
  | { type: "boss"; caseId: string }
  | { type: "map" }
  | { type: "apps" };

export interface JourneyState {
  dialog: DialogState;
  sound: boolean;
  world: WorldId;
  reached: string[];
  gems: string[];
  cleared: string[];
  found: string[];
}

export interface ProgressUpdate {
  world?: WorldId;
  reached?: string[];
  gems?: string[];
  cleared?: string[];
  found?: string[];
}

export type JourneyAction =
  | { type: "open-app"; appId: string }
  | { type: "open-boss"; caseId: string }
  | { type: "open-map" }
  | { type: "open-apps" }
  | { type: "close" }
  | { type: "play-live" }
  | { type: "back-to-video" }
  | { type: "toggle-sound" }
  | { type: "progress"; update: ProgressUpdate };

export const initialJourneyState: JourneyState = {
  dialog: { type: "none" },
  sound: false,
  world: "chalk",
  reached: [],
  gems: [],
  cleared: [],
  found: [],
};

function union(current: string[], extra: string[] | undefined): string[] {
  if (!extra || extra.every((item) => current.includes(item))) return current;
  return [...current, ...extra.filter((item, index) => !current.includes(item) && extra.indexOf(item) === index)];
}

function applyProgress(state: JourneyState, update: ProgressUpdate): JourneyState {
  const next: JourneyState = {
    ...state,
    world: update.world ?? state.world,
    reached: union(state.reached, update.reached),
    gems: union(state.gems, update.gems),
    cleared: union(state.cleared, update.cleared),
    found: union(state.found, update.found),
  };
  const changed = next.world !== state.world || next.reached !== state.reached || next.gems !== state.gems || next.cleared !== state.cleared || next.found !== state.found;

  return changed ? next : state;
}

export function journeyReducer(state: JourneyState, action: JourneyAction): JourneyState {
  switch (action.type) {
    case "open-app":
      return { ...state, dialog: { type: "app", appId: action.appId, live: false }, found: union(state.found, [action.appId]) };
    case "open-boss":
      return { ...state, dialog: { type: "boss", caseId: action.caseId } };
    case "open-map":
      return { ...state, dialog: { type: "map" } };
    case "open-apps":
      return { ...state, dialog: { type: "apps" } };
    case "close":
      return state.dialog.type === "none" ? state : { ...state, dialog: { type: "none" } };
    case "play-live":
      return state.dialog.type === "app" ? { ...state, dialog: { ...state.dialog, live: true } } : state;
    case "back-to-video":
      return state.dialog.type === "app" ? { ...state, dialog: { ...state.dialog, live: false } } : state;
    case "toggle-sound":
      return { ...state, sound: !state.sound };
    case "progress":
      return applyProgress(state, action.update);
  }
}
