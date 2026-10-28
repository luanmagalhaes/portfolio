import type { BossSprite } from "@/components/overworld/art/sprites";
import type { DistrictId } from "@/components/overworld/model/map";

const emblemOverrides: Record<string, string> = {
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

const emblemFolders: Record<string, string> = { app: "apps", private: "apps", ai: "apps", career: "career" };

export function emblemSrc(emblem: string): string {
  const override = emblemOverrides[emblem];
  if (override) return `/kit/emblems/${override}.png`;
  const separator = emblem.indexOf("-");
  const folder = separator > 0 ? emblemFolders[emblem.slice(0, separator)] : undefined;
  return folder ? `/kit/emblems/${folder}/${emblem.slice(separator + 1)}.png` : "/kit/ui/star.png";
}

const jobDistricts: Record<string, DistrictId> = {
  "career-credit": "auction",
  "career-fashion": "harbor",
  "career-real-estate": "harbor",
  "career-streaming": "bridge",
};

const milestoneDistricts: Record<string, DistrictId> = {
  "career-icu": "hospital",
  "career-teaching": "school",
  "career-canada": "school",
  "career-masters": "school",
  "career-internet-systems": "school",
};

export function jobDistrict(emblem: string): DistrictId {
  return jobDistricts[emblem] ?? "harbor";
}

export function milestoneDistrict(emblem: string): DistrictId {
  return milestoneDistricts[emblem] ?? "school";
}

const bossSprites: Record<string, BossSprite> = {
  "session-thief": "twins",
  "ghost-conversions": "ghost",
  "many-keys": "keys",
  "ten-day-launch": "clock",
  "order-inbox": "hydra",
  "two-reacts": "golem",
};

const bossCycle: readonly BossSprite[] = ["ghost", "hydra", "golem", "twins", "keys", "clock"];

export function bossSpriteFor(caseId: string, index: number): BossSprite {
  return bossSprites[caseId] ?? bossCycle[index % bossCycle.length];
}

const cabinetSkins: Record<string, Record<string, string>> = {
  vitrola: { 1: "K", 2: "Y", 3: "A", 4: "r", 5: "R", 6: "K", 7: "r", 8: "W", 9: "A" },
  cantarola: { 1: "P", 2: "R", 3: "P", 4: "Y", 5: "Y", 6: "W", 7: "Y", 8: "r", 9: "X" },
  "nao-vale": { 1: "K", 2: "s", 3: "b", 4: "Y", 5: "A", 6: "W", 7: "Y", 8: "R", 9: "b" },
  flow: { 1: "n", 2: "b", 3: "n", 4: "s", 5: "R", 6: "W", 7: "R", 8: "i", 9: "n" },
  "de-fininho": { 1: "N", 2: "P", 3: "M", 4: "a", 5: "a", 6: "W", 7: "L", 8: "a", 9: "M" },
  "flip-score": { 1: "n", 2: "t", 3: "n", 4: "r", 5: "Y", 6: "R", 7: "a", 8: "r", 9: "n" },
  "la-cuentita": { 1: "u", 2: "A", 3: "u", 4: "W", 5: "B", 6: "W", 7: "B", 8: "d", 9: "C" },
  abece: { 1: "V", 2: "N", 3: "M", 4: "r", 5: "r", 6: "A", 7: "V", 8: "g", 9: "M" },
};

const fallbackSkins: readonly Record<string, string>[] = [
  { 1: "K", 2: "g", 3: "l", 4: "Y", 5: "R", 6: "W", 7: "Y", 8: "s", 9: "l" },
  { 1: "K", 2: "V", 3: "P", 4: "a", 5: "Y", 6: "W", 7: "r", 8: "g", 9: "P" },
  { 1: "K", 2: "B", 3: "X", 4: "Y", 5: "W", 6: "Y", 7: "a", 8: "W", 9: "X" },
];

export function cabinetSkinFor(appId: string, index: number): Record<string, string> {
  return cabinetSkins[appId] ?? fallbackSkins[index % fallbackSkins.length];
}
