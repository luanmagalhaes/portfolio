export const menuTargets = ["cartridges", "scores", "character", "bosses", "continue"] as const;

export type MenuTarget = (typeof menuTargets)[number];

export type ScreenId = "title" | "boot" | "menu" | "cart" | "locked" | "boss" | MenuTarget;

export type CharacterSlot = "engineer" | "origin" | "companion";

export type CharacterTab = "profile" | "skills" | "moves";

export interface ArcadeState {
  screen: ScreenId;
  power: "on" | "off";
  cartId: string | null;
  lockedId: string | null;
  scoreId: string | null;
  slot: CharacterSlot;
  tab: CharacterTab;
  bossId: string | null;
  round: number;
  played: string[];
  cleared: string[];
}

export type ArcadeAction =
  | { type: "start" }
  | { type: "bootDone" }
  | { type: "open"; screen: MenuTarget | "menu" | "title" }
  | { type: "back" }
  | { type: "insert"; cartId: string }
  | { type: "eject" }
  | { type: "step"; delta: number; order: readonly string[] }
  | { type: "openLocked"; id: string }
  | { type: "selectScore"; id: string }
  | { type: "selectSlot"; slot: CharacterSlot }
  | { type: "selectTab"; tab: CharacterTab }
  | { type: "openBoss"; id: string }
  | { type: "setRound"; round: number; total: number }
  | { type: "nextBoss"; order: readonly string[] }
  | { type: "power" }
  | { type: "reset" }
  | { type: "restore"; state: Partial<ArcadeState> };

export const initialArcadeState: ArcadeState = {
  screen: "title",
  power: "on",
  cartId: null,
  lockedId: null,
  scoreId: null,
  slot: "engineer",
  tab: "profile",
  bossId: null,
  round: 0,
  played: [],
  cleared: [],
};

const parents: Record<ScreenId, ScreenId | null> = {
  title: null,
  boot: null,
  menu: "title",
  cartridges: "menu",
  cart: "cartridges",
  locked: "cartridges",
  scores: "menu",
  character: "menu",
  bosses: "menu",
  boss: "bosses",
  continue: "menu",
};

export const channels: Record<ScreenId, string> = {
  title: "00",
  boot: "00",
  menu: "01",
  cartridges: "02",
  cart: "03",
  locked: "03",
  scores: "04",
  character: "05",
  bosses: "06",
  boss: "07",
  continue: "08",
};

export function parentOf(screen: ScreenId): ScreenId | null {
  return parents[screen];
}

function remember(list: string[], id: string): string[] {
  return list.includes(id) ? list : [...list, id];
}

function wrap(index: number, length: number): number {
  return ((index % length) + length) % length;
}

export function arcadeReducer(state: ArcadeState, action: ArcadeAction): ArcadeState {
  switch (action.type) {
    case "start":
      return { ...state, power: "on", screen: "boot" };
    case "bootDone":
      return state.screen === "boot" ? { ...state, screen: "menu" } : state;
    case "open":
      return { ...state, power: "on", screen: action.screen };
    case "back": {
      const parent = parentOf(state.screen);
      return parent ? { ...state, screen: parent } : state;
    }
    case "insert":
      return { ...state, power: "on", screen: "cart", cartId: action.cartId, played: remember(state.played, action.cartId) };
    case "eject":
      return { ...state, screen: "cartridges", cartId: null };
    case "step": {
      if (action.order.length === 0) {
        return state;
      }
      const current = state.cartId ? action.order.indexOf(state.cartId) : -1;
      const next = action.order[wrap(current + action.delta, action.order.length)];
      return { ...state, screen: "cart", cartId: next, played: remember(state.played, next) };
    }
    case "openLocked":
      return { ...state, power: "on", screen: "locked", lockedId: action.id };
    case "selectScore":
      return { ...state, scoreId: action.id };
    case "selectSlot":
      return { ...state, slot: action.slot, tab: "profile" };
    case "selectTab":
      return { ...state, tab: action.tab };
    case "openBoss":
      return { ...state, screen: "boss", bossId: action.id, round: 0 };
    case "setRound": {
      if (!state.bossId || action.total < 1) {
        return state;
      }
      const round = Math.max(0, Math.min(action.total - 1, action.round));
      const cleared = round === action.total - 1 ? remember(state.cleared, state.bossId) : state.cleared;
      return { ...state, round, cleared };
    }
    case "nextBoss": {
      if (action.order.length === 0) {
        return state;
      }
      const current = state.bossId ? action.order.indexOf(state.bossId) : -1;
      return { ...state, screen: "boss", bossId: action.order[wrap(current + 1, action.order.length)], round: 0 };
    }
    case "power":
      return state.power === "on" ? { ...state, power: "off" } : { ...state, power: "on", screen: "title" };
    case "reset":
      return { ...state, power: "on", screen: "menu" };
    case "restore":
      return { ...state, ...action.state };
    default:
      return state;
  }
}

export function hashFor(state: ArcadeState): string {
  switch (state.screen) {
    case "title":
    case "boot":
      return "";
    case "cart":
      return state.cartId ? `#/cart/${state.cartId}` : "#/cartridges";
    case "locked":
      return state.lockedId ? `#/locked/${state.lockedId}` : "#/cartridges";
    case "boss":
      return state.bossId ? `#/boss/${state.bossId}` : "#/bosses";
    default:
      return `#/${state.screen}`;
  }
}

export interface KnownIds {
  carts: readonly string[];
  locked: readonly string[];
  bosses: readonly string[];
}

const plainScreens: readonly ScreenId[] = ["menu", ...menuTargets];

export function stateFromHash(hash: string, known: KnownIds): Partial<ArcadeState> | null {
  const match = /^#\/([a-z]+)(?:\/([a-z0-9-]+))?$/.exec(hash);

  if (!match) {
    return null;
  }

  const [, name, id] = match;

  if (name === "cart" && id && known.carts.includes(id)) {
    return { screen: "cart", cartId: id, played: [id] };
  }

  if (name === "locked" && id && known.locked.includes(id)) {
    return { screen: "locked", lockedId: id };
  }

  if (name === "boss" && id && known.bosses.includes(id)) {
    return { screen: "boss", bossId: id, round: 0 };
  }

  if (!id && (plainScreens as readonly string[]).includes(name)) {
    return { screen: name as ScreenId };
  }

  return null;
}
