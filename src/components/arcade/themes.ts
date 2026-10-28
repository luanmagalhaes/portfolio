import type { SpriteId } from "@/components/arcade/pixels";

export interface CartridgeTheme {
  label: string;
  stripe: string;
  glow: string;
}

export const defaultTheme: CartridgeTheme = { label: "L", stripe: "Y", glow: "#8452d6" };

export const cartridgeThemes: Record<string, CartridgeTheme> = {
  vitrola: { label: "Y", stripe: "r", glow: "#ffd23a" },
  cantarola: { label: "P", stripe: "Y", glow: "#ff7cbc" },
  "nao-vale": { label: "R", stripe: "Y", glow: "#ec3a52" },
  flow: { label: "s", stripe: "R", glow: "#48a8f0" },
  "de-fininho": { label: "n", stripe: "a", glow: "#4fe0c6" },
  "flip-score": { label: "a", stripe: "r", glow: "#4fe0c6" },
  "la-cuentita": { label: "A", stripe: "W", glow: "#f0962e" },
  abece: { label: "V", stripe: "A", glow: "#ff7cbc" },
};

export function themeFor(id: string): CartridgeTheme {
  return cartridgeThemes[id] ?? defaultTheme;
}

const emblemFiles: Record<string, string> = {
  "ai-pataka": "apps/pataka",
  "ai-mcp": "apps/mcp-servers",
  "ai-terminal": "apps/claude-code-setup",
  "career-credit": "career/credit-marketplace",
  "career-fashion": "career/fashion-marketplace",
  "career-real-estate": "career/real-estate",
  "career-streaming": "career/streaming-checkout",
  "career-teaching": "career/english-teacher",
  "career-canada": "career/canada-exchange",
  "career-icu": "career/icu-speech-therapy",
  "career-masters": "career/masters-degree",
  "career-internet-systems": "career/internet-systems-degree",
};

export function emblemPath(emblem: string): string {
  const mapped = emblemFiles[emblem];

  if (mapped) {
    return `/kit/emblems/${mapped}.png`;
  }

  const name = emblem.replace(/^(app|private)-/, "");

  return `/kit/emblems/apps/${name}.png`;
}

export const lockEmblem = "/kit/emblems/apps/lock-overlay.png";

const bossSprites: Record<string, SpriteId> = {
  "session-thief": "thief",
  "ghost-conversions": "ghost",
  "many-keys": "keys",
  "ten-day-launch": "clock",
  "order-inbox": "inbox",
  "two-reacts": "golem",
};

export function bossSpriteFor(caseId: string): SpriteId {
  return bossSprites[caseId] ?? "golem";
}

export const characterSheets = {
  idle: { src: "/kit/characters/luan/luan-side-idle.png", frames: 2 },
  dog: { src: "/kit/characters/matilda/matilda-side-idle.png", frames: 2 },
  portrait: "/kit/characters/luan/luan-portrait.png",
};
