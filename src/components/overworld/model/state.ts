import type { SceneId, Speaker } from "@/components/overworld/art/scenes";
import { initialArena, type ArenaState } from "@/components/overworld/model/arena";
import { exploredPlaceIds, type DistrictId } from "@/components/overworld/model/map";

export type ItemsTab = string;

export type WindowState =
  | { kind: "none" }
  | { kind: "place"; place: DistrictId; fromDoor: boolean }
  | { kind: "machine"; index: number; live: boolean }
  | { kind: "arena"; fromDoor: boolean }
  | { kind: "quests" }
  | { kind: "items"; tab: ItemsTab }
  | { kind: "travel" }
  | { kind: "private" };

export interface DialogState {
  speaker: Speaker;
  lines: string[];
  index: number;
}

export interface ToastState {
  key: number;
  place: DistrictId;
  count: number;
  total: number;
}

export interface OverworldState {
  phase: "title" | "play";
  scene: SceneId;
  window: WindowState;
  dialog: DialogState | null;
  visited: DistrictId[];
  sound: boolean;
  arena: ArenaState;
  greetedArcade: boolean;
  toast: ToastState | null;
}

export type OverworldAction =
  | { type: "start" }
  | { type: "open-window"; window: WindowState }
  | { type: "close-window" }
  | { type: "show-dialog"; speaker: Speaker; lines: string[] }
  | { type: "advance-dialog" }
  | { type: "close-dialog" }
  | { type: "visit"; place: DistrictId }
  | { type: "scene"; scene: SceneId }
  | { type: "toggle-sound" }
  | { type: "arena"; arena: ArenaState }
  | { type: "machine-step"; delta: number; count: number }
  | { type: "machine-live"; live: boolean }
  | { type: "items-tab"; tab: ItemsTab }
  | { type: "greeted-arcade" }
  | { type: "arcade-entered"; greeting: string }
  | { type: "enter-place"; place: DistrictId; fromDoor: boolean }
  | { type: "open-machine"; index: number }
  | { type: "clear-toast" };

export const initialOverworldState: OverworldState = {
  phase: "title",
  scene: "town",
  window: { kind: "none" },
  dialog: null,
  visited: [],
  sound: false,
  arena: initialArena,
  greetedArcade: false,
  toast: null,
};

export function exploredCount(visited: readonly DistrictId[]): number {
  return exploredPlaceIds.filter((id) => visited.includes(id)).length;
}

function visit(state: OverworldState, place: DistrictId): OverworldState {
  if (state.visited.includes(place)) return state;
  const visited = [...state.visited, place];
  if (!exploredPlaceIds.includes(place)) return { ...state, visited };
  return { ...state, visited, toast: { key: (state.toast?.key ?? 0) + 1, place, count: exploredCount(visited), total: exploredPlaceIds.length } };
}

export function overworldReducer(state: OverworldState, action: OverworldAction): OverworldState {
  switch (action.type) {
    case "start":
      return { ...state, phase: "play" };
    case "open-window":
      return { ...state, window: action.window, dialog: null };
    case "close-window":
      return { ...state, window: { kind: "none" } };
    case "show-dialog":
      return action.lines.length ? { ...state, dialog: { speaker: action.speaker, lines: action.lines, index: 0 } } : state;
    case "advance-dialog": {
      if (!state.dialog) return state;
      const index = state.dialog.index + 1;
      return { ...state, dialog: index < state.dialog.lines.length ? { ...state.dialog, index } : null };
    }
    case "close-dialog":
      return { ...state, dialog: null };
    case "visit":
      return visit(state, action.place);
    case "scene":
      return { ...state, scene: action.scene };
    case "toggle-sound":
      return { ...state, sound: !state.sound };
    case "arena":
      return { ...state, arena: action.arena };
    case "machine-step": {
      if (state.window.kind !== "machine" || action.count <= 0) return state;
      const index = (state.window.index + action.delta + action.count) % action.count;
      return { ...state, window: { kind: "machine", index, live: false } };
    }
    case "machine-live":
      return state.window.kind === "machine" ? { ...state, window: { ...state.window, live: action.live } } : state;
    case "items-tab":
      return state.window.kind === "items" ? { ...state, window: { kind: "items", tab: action.tab } } : state;
    case "greeted-arcade":
      return { ...state, greetedArcade: true };
    case "arcade-entered": {
      const visited = visit(state, "arcade");
      if (state.greetedArcade) return visited;
      return { ...visited, greetedArcade: true, dialog: { speaker: "attendant", lines: [action.greeting], index: 0 } };
    }
    case "enter-place": {
      const visited = visit(state, action.place);
      const window: WindowState = action.place === "fort" ? { kind: "arena", fromDoor: action.fromDoor } : action.place === "arcade" ? { kind: "machine", index: 0, live: false } : { kind: "place", place: action.place, fromDoor: action.fromDoor };
      return { ...visited, window, dialog: null };
    }
    case "open-machine":
      return { ...visit(state, "arcade"), window: { kind: "machine", index: action.index, live: false }, dialog: null };
    case "clear-toast":
      return { ...state, toast: null };
    default:
      return state;
  }
}
