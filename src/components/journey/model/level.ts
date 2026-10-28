import type { Portfolio } from "@/domain/view";

export const worldIds = ["chalk", "ward", "commits", "overseas", "market", "lab"] as const;

export type WorldId = (typeof worldIds)[number];

export type ThemeId = "school" | "snow" | "ward" | "commits" | "europe" | "market" | "lab" | "goal";

export type GemTone = "a" | "r" | "s" | "g" | "A" | "V" | "Y";

export interface WorldSpec {
  id: WorldId;
  theme: ThemeId;
  flag: string;
  emblem: string;
}

export const worlds: WorldSpec[] = [
  { id: "chalk", theme: "school", flag: "#ec3a52", emblem: "career-teaching" },
  { id: "ward", theme: "ward", flag: "#4fe0c6", emblem: "career-icu" },
  { id: "commits", theme: "commits", flag: "#3ec45a", emblem: "career-internet-systems" },
  { id: "overseas", theme: "europe", flag: "#48a8f0", emblem: "career-real-estate" },
  { id: "market", theme: "market", flag: "#ffd23a", emblem: "career-credit" },
  { id: "lab", theme: "lab", flag: "#ff7cbc", emblem: "ai-terminal" },
];

const worldByEmblem: Record<string, WorldId> = {
  "career-teaching": "chalk",
  "career-canada": "chalk",
  "career-icu": "ward",
  "career-masters": "ward",
  "career-streaming": "commits",
  "career-internet-systems": "commits",
  "career-real-estate": "overseas",
  "career-fashion": "overseas",
  "career-credit": "market",
};

const snowEmblems = new Set(["career-canada"]);

const doorWorld: Record<string, WorldId> = {
  abece: "chalk",
  "nao-vale": "ward",
  cantarola: "ward",
  "flip-score": "commits",
  vitrola: "overseas",
  flow: "overseas",
  "la-cuentita": "market",
  "de-fininho": "lab",
};

const gemWorld: Record<string, WorldId> = {
  engineering: "commits",
  "front-end": "overseas",
  "back-end": "market",
  "data-infra": "market",
  ai: "lab",
  integrations: "lab",
};

const gemTones: Record<string, GemTone> = {
  engineering: "a",
  ai: "r",
  "front-end": "s",
  "back-end": "g",
  "data-infra": "A",
  integrations: "V",
};

const fallbackTones: GemTone[] = ["a", "r", "s", "g", "A", "V"];

export const GEMS_PER_ROW = 5;

export interface Gem {
  id: string;
  label: string;
  tone: GemTone;
}

type NodeBody =
  | { kind: "intro" }
  | { kind: "gate" }
  | { kind: "checkpoint"; source: "job" | "milestone" | "ai"; id: string }
  | { kind: "loot"; jobId: string; index: number }
  | { kind: "gems"; gems: Gem[] }
  | { kind: "door"; appId: string }
  | { kind: "rush" }
  | { kind: "boss"; caseId: string; order: number; total: number }
  | { kind: "secret" }
  | { kind: "goal" };

export type LevelNode = NodeBody & { key: string; world: WorldId; theme: ThemeId; level: number };

export type NodeKind = LevelNode["kind"];

interface Checkpoint {
  source: "job" | "milestone";
  id: string;
  emblem: string;
  year: number;
  order: number;
  loot: number;
}

interface Bucket {
  checkpoints: Checkpoint[];
  extras: NodeBody[];
}

export function firstYear(period: string): number {
  const match = period.match(/\d{4}/);

  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

export function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];

  for (let start = 0; start < items.length; start += size) {
    rows.push(items.slice(start, start + size));
  }

  return rows;
}

export function worldForEmblem(emblem: string, fallback: WorldId): WorldId {
  return worldByEmblem[emblem] ?? fallback;
}

function interleave(doors: NodeBody[], gems: NodeBody[]): NodeBody[] {
  const mixed: NodeBody[] = [];
  const longest = Math.max(doors.length, gems.length);

  for (let index = 0; index < longest; index += 1) {
    if (gems[index]) mixed.push(gems[index]);
    if (doors[index]) mixed.push(doors[index]);
  }

  return mixed;
}

function fillBuckets(portfolio: Portfolio): Map<WorldId, Bucket> {
  const buckets = new Map<WorldId, Bucket>(worldIds.map((id) => [id, { checkpoints: [], extras: [] }]));
  const doors = new Map<WorldId, NodeBody[]>(worldIds.map((id) => [id, []]));
  const gems = new Map<WorldId, NodeBody[]>(worldIds.map((id) => [id, []]));

  portfolio.milestones.forEach((milestone, order) => {
    buckets.get(worldForEmblem(milestone.emblem, "commits"))?.checkpoints.push({ source: "milestone", id: milestone.id, emblem: milestone.emblem, year: firstYear(milestone.period), order, loot: 0 });
  });

  [...portfolio.jobs].reverse().forEach((job, order) => {
    buckets.get(worldForEmblem(job.emblem, "overseas"))?.checkpoints.push({ source: "job", id: job.id, emblem: job.emblem, year: firstYear(job.period), order: order + 100, loot: Math.max(0, job.highlights.length - 1) });
  });

  portfolio.apps.forEach((app, index) => {
    doors.get(doorWorld[app.id] ?? worldIds[index % worldIds.length])?.push({ kind: "door", appId: app.id });
  });

  if (portfolio.languages.length > 0) {
    gems.get("chalk")?.push({ kind: "gems", gems: portfolio.languages.map((language) => ({ id: `language:${language.id}`, label: `${language.name}: ${language.level}`, tone: "Y" })) });
  }

  portfolio.skills.forEach((group, index) => {
    const tone = gemTones[group.id] ?? fallbackTones[index % fallbackTones.length];
    chunk(group.items, GEMS_PER_ROW).forEach((row) => {
      gems.get(gemWorld[group.id] ?? "lab")?.push({ kind: "gems", gems: row.map((label) => ({ id: `${group.id}:${label}`, label, tone })) });
    });
  });

  worldIds.forEach((id) => {
    const bucket = buckets.get(id);
    if (!bucket) return;
    bucket.checkpoints.sort((a, b) => a.year - b.year || a.order - b.order);
    bucket.extras = interleave(doors.get(id) ?? [], gems.get(id) ?? []);
  });

  return buckets;
}

function levelFor(body: NodeBody, index: number): number {
  if (body.kind === "loot" || body.kind === "door") return 1;
  if (body.kind === "gems") return index % 2;
  return 0;
}

export function buildLevel(portfolio: Portfolio): LevelNode[] {
  const buckets = fillBuckets(portfolio);
  const nodes: LevelNode[] = [];
  const push = (body: NodeBody, world: WorldId, theme: ThemeId) => {
    nodes.push({ ...body, key: `${body.kind}-${nodes.length}`, world, theme, level: levelFor(body, nodes.length) });
  };

  push({ kind: "intro" }, "chalk", "school");

  worlds.forEach((world) => {
    const bucket = buckets.get(world.id);
    if (!bucket) return;
    let theme = world.theme;
    const extras = [...bucket.extras];
    push({ kind: "gate" }, world.id, theme);

    if (world.id === "lab") {
      if (portfolio.cases.length > 0) push({ kind: "rush" }, world.id, theme);
      portfolio.cases.forEach((item, order) => push({ kind: "boss", caseId: item.id, order, total: portfolio.cases.length }, world.id, theme));
      portfolio.aiProjects.forEach((project) => {
        push({ kind: "checkpoint", source: "ai", id: project.id }, world.id, theme);
        const extra = extras.shift();
        if (extra) push(extra, world.id, theme);
      });
    }

    bucket.checkpoints.forEach((checkpoint) => {
      if (snowEmblems.has(checkpoint.emblem)) theme = "snow";
      push({ kind: "checkpoint", source: checkpoint.source, id: checkpoint.id }, world.id, theme);
      for (let index = 1; index <= checkpoint.loot; index += 1) push({ kind: "loot", jobId: checkpoint.id, index }, world.id, theme);
      const extra = extras.shift();
      if (extra) push(extra, world.id, theme);
    });

    extras.forEach((extra) => push(extra, world.id, theme));

    if (world.id === "lab") {
      if (portfolio.privateApps.length > 0) push({ kind: "secret" }, world.id, theme);
      push({ kind: "goal" }, world.id, "goal");
    }
  });

  return nodes;
}

export interface LevelTotals {
  skills: number;
  apps: number;
  bosses: number;
  flags: number;
}

export function levelTotals(nodes: LevelNode[]): LevelTotals {
  return nodes.reduce<LevelTotals>(
    (totals, node) => ({
      skills: totals.skills + (node.kind === "gems" ? node.gems.length : 0),
      apps: totals.apps + (node.kind === "door" ? 1 : 0),
      bosses: totals.bosses + (node.kind === "boss" ? 1 : 0),
      flags: totals.flags + (node.kind === "checkpoint" ? 1 : 0),
    }),
    { skills: 0, apps: 0, bosses: 0, flags: 0 },
  );
}
