import type { GemTone, ThemeId } from "@/components/journey/model/level";

const careerEmblems: Record<string, string> = {
  "career-credit": "credit-marketplace",
  "career-fashion": "fashion-marketplace",
  "career-real-estate": "real-estate",
  "career-streaming": "streaming-checkout",
  "career-teaching": "english-teacher",
  "career-canada": "canada-exchange",
  "career-icu": "icu-speech-therapy",
  "career-masters": "masters-degree",
  "career-internet-systems": "internet-systems-degree",
};

const aiEmblems: Record<string, string> = {
  "ai-pataka": "pataka",
  "ai-mcp": "mcp-servers",
  "ai-terminal": "claude-code-setup",
};

export function emblemPath(key: string): string {
  if (key.startsWith("career-")) return `/kit/emblems/career/${careerEmblems[key] ?? key.slice("career-".length)}.png`;
  if (key.startsWith("app-")) return `/kit/emblems/apps/${key.slice("app-".length)}.png`;
  if (key.startsWith("private-")) return `/kit/emblems/apps/${key.slice("private-".length)}.png`;
  return `/kit/emblems/apps/${aiEmblems[key] ?? key}.png`;
}

export const letterWheelPath = "/kit/emblems/apps/abece-wheel.png";

const bossSprites: Record<string, string> = {
  "session-thief": "twins",
  "ghost-conversions": "ghost",
  "many-keys": "hydra",
  "ten-day-launch": "calendar",
  "order-inbox": "golem",
  "two-reacts": "duo",
};

const fallbackBosses = ["twins", "ghost", "hydra", "calendar", "golem", "duo"];

export function bossSpritePath(caseId: string, order: number): string {
  return `/journey/bosses/${bossSprites[caseId] ?? fallbackBosses[order % fallbackBosses.length]}.png`;
}

export const doorPalette = {
  yellow: "#ffd23a",
  red: "#ec3a52",
  amber: "#f0962e",
  sky: "#48a8f0",
  aqua: "#4fe0c6",
  pink: "#ff7cbc",
  peach: "#e0a066",
  violet: "#8452d6",
  lime: "#a8ec6c",
  silver: "#c8c4d8",
} as const;

export type DoorColor = keyof typeof doorPalette;

const appDoors: Record<string, DoorColor> = {
  vitrola: "yellow",
  cantarola: "red",
  "nao-vale": "amber",
  flow: "sky",
  "de-fininho": "aqua",
  "flip-score": "pink",
  "la-cuentita": "peach",
  abece: "violet",
};

const fallbackDoors: DoorColor[] = ["lime", "silver", "sky", "pink", "amber"];

export function doorColorFor(appId: string, index: number): DoorColor {
  return appDoors[appId] ?? fallbackDoors[index % fallbackDoors.length];
}

export function doorArtPath(color: DoorColor): string {
  return `/journey/ui/door-${color}.png`;
}

export type ThemeLayer = "far" | "mid" | "top" | "body" | "deco" | "sun";

const themesWithoutSun = new Set<ThemeId>(["market"]);

export function themeLayerPath(theme: ThemeId, layer: ThemeLayer): string | null {
  if (layer === "sun" && themesWithoutSun.has(theme)) return null;
  return `/journey/themes/${theme}-${layer}.png`;
}

const gemFiles: Record<GemTone, string> = { a: "aqua", r: "pink", s: "sky", g: "green", A: "amber", V: "violet", Y: "yellow" };

export function gemPath(tone: GemTone): string {
  return `/journey/ui/gem-${gemFiles[tone]}.png`;
}

export function uiIconPath(name: string): string {
  return `/journey/ui/icon-${name}.png`;
}

export const sprites = {
  luanRun: "/kit/characters/luan/luan-side-run.png",
  luanIdle: "/kit/characters/luan/luan-side-idle.png",
  luanCode: "/kit/characters/luan/luan-side-coding.png",
  luanPortrait: "/kit/characters/luan/luan-portrait.png",
  matildaRun: "/kit/characters/matilda/matilda-side-run.png",
  matildaIdle: "/kit/characters/matilda/matilda-side-idle.png",
  chest: "/journey/ui/chest.png",
  map: "/journey/ui/map.png",
  ecg: "/journey/fx/ecg.png",
  code: "/journey/fx/code.png",
  snow: "/journey/fx/snow.png",
  frameDark: "/journey/ui/frame-dark.png",
  frameLight: "/journey/ui/frame-light.png",
  frameGold: "/journey/ui/frame-gold.png",
} as const;

export const skyBands: Record<ThemeId, string[]> = {
  school: ["#2d62c0", "#48a8f0", "#48a8f0", "#a8e8ff", "#a8e8ff"],
  snow: ["#1b2f5e", "#2d62c0", "#563a8f", "#8452d6", "#b9a0f5"],
  ward: ["#0e0b16", "#1d1730", "#1d1730", "#1b2f5e", "#1b2f5e"],
  commits: ["#1d1730", "#33264f", "#563a8f", "#8f2346", "#cf4b2e", "#f0962e"],
  europe: ["#2d62c0", "#48a8f0", "#48a8f0", "#a8e8ff", "#f7f2e6"],
  market: ["#2b1913", "#2b1913", "#573222", "#573222", "#8f5135", "#c27e52"],
  lab: ["#0e0b16", "#0e0b16", "#1d1730", "#33264f", "#563a8f"],
  goal: ["#0e0b16", "#1d1730", "#33264f", "#563a8f", "#8f2346", "#ff7cbc"],
};

export function skyGradient(theme: ThemeId): string {
  const bands = skyBands[theme];
  const step = 100 / bands.length;
  return `linear-gradient(180deg, ${bands.map((color, index) => `${color} ${(index * step).toFixed(2)}% ${((index + 1) * step).toFixed(2)}%`).join(", ")})`;
}
