import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { staticPortfolioSource } from "@/content";
import { portfolioFor } from "@/domain/view";
import { bossSpritePath, doorArtPath, doorColorFor, emblemPath, gemPath, skyGradient, themeLayerPath } from "@/components/journey/model/assets";
import { buildLevel, type GemTone, type ThemeId } from "@/components/journey/model/level";

const portfolio = portfolioFor(staticPortfolioSource, "en");
const publicFile = (path: string) => existsSync(join(process.cwd(), "public", path));

describe("arquivos de arte", () => {
  it("acha o emblema de todo emprego, marco, app, projeto de IA e app privado", () => {
    const emblems = [...portfolio.jobs, ...portfolio.milestones, ...portfolio.apps, ...portfolio.aiProjects, ...portfolio.privateApps].map((item) => item.emblem);
    emblems.forEach((emblem) => expect(publicFile(emblemPath(emblem)), emblem).toBe(true));
  });

  it("tem sprite de chefão e porta para todo caso e app", () => {
    portfolio.cases.forEach((item, index) => expect(publicFile(bossSpritePath(item.id, index))).toBe(true));
    portfolio.apps.forEach((app, index) => expect(publicFile(doorArtPath(doorColorFor(app.id, index)))).toBe(true));
    expect(bossSpritePath("caso-novo", 2)).toMatch(/\/journey\/bosses\/.+\.png$/);
  });

  it("tem todas as camadas dos temas usados no nível", () => {
    const themes = new Set<ThemeId>(buildLevel(portfolio).map((node) => node.theme));
    themes.forEach((theme) => {
      (["far", "mid", "top", "body", "deco"] as const).forEach((layer) => expect(publicFile(themeLayerPath(theme, layer)!)).toBe(true));
    });
    expect(themeLayerPath("market", "sun")).toBeNull();
  });

  it("tem uma gema para cada tom", () => {
    (["a", "r", "s", "g", "A", "V", "Y"] as GemTone[]).forEach((tone) => expect(publicFile(gemPath(tone))).toBe(true));
  });

  it("monta o céu em faixas sem degradê suave", () => {
    expect(skyGradient("school")).toContain("#2d62c0 0.00% 20.00%");
  });
});
