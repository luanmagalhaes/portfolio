import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";
import { staticPortfolioSource } from "@/content";
import { emblemPath as arcadeEmblem } from "@/components/arcade/themes";
import { bossSpritePath, doorArtPath, doorColorFor, emblemPath as journeyEmblem, gemPath, themeLayerPath, uiIconPath } from "@/components/journey/model/assets";
import { emblemSrc } from "@/components/overworld/model/routing";

function exact(path: string): boolean {
  const parts = path.replace(/^\//, "").split("/");
  let dir = join(process.cwd(), "public");

  for (const part of parts) {
    if (!existsSync(dir) || !readdirSync(dir).includes(part)) {
      return false;
    }

    dir = join(dir, part);
  }

  return true;
}

it("todo caminho montado existe com o nome exato", () => {
  const content = staticPortfolioSource.load();
  const emblems = [...content.jobs, ...content.milestones, ...content.apps, ...content.privateApps, ...content.aiProjects].map((item) => item.emblem);
  const paths = new Set<string>();

  for (const emblem of emblems) {
    paths.add(arcadeEmblem(emblem));
    paths.add(journeyEmblem(emblem));
    paths.add(emblemSrc(emblem));
  }

  content.cases.forEach((item, order) => paths.add(bossSpritePath(item.id, order)));
  content.apps.forEach((app, index) => paths.add(doorArtPath(doorColorFor(app.id, index))));
  (["a", "r", "s", "g", "A", "V", "Y"] as const).forEach((tone) => paths.add(gemPath(tone)));

  for (const theme of ["school", "snow", "ward", "commits", "europe", "market", "lab", "goal"] as never[]) {
    for (const layer of ["far", "mid", "top", "body", "deco", "sun"] as never[]) {
      const layerPath = themeLayerPath(theme, layer);

      if (layerPath) {
        paths.add(layerPath);
      }
    }
  }

  ["arrowLeft", "arrowRight", "arrowUp", "soundOn", "soundOff", "lock", "mail", "link"].forEach((name) => paths.add(uiIconPath(name)));

  const missing = [...paths].filter((path) => !exact(path));

  expect(missing).toEqual([]);
});
