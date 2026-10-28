import { describe, expect, it } from "vitest";
import { cartridgeRows, palette, pixelRuns, sprites, spriteIds } from "@/components/arcade/pixels";
import { bossSpriteFor, cartridgeThemes, emblemPath, themeFor } from "@/components/arcade/themes";
import { staticPortfolioSource } from "@/content";

const knownChars = new Set([".", ...Object.keys(palette), "1", "2", "3", "4", "5", "6", "7"]);

describe("pixel art do fliperama", () => {
  it("tem linhas do mesmo tamanho em cada sprite", () => {
    for (const id of spriteIds) {
      const widths = new Set(sprites[id].map((row) => row.length));
      expect(widths.size, id).toBe(1);
    }
    expect(new Set(cartridgeRows.map((row) => row.length))).toEqual(new Set([40]));
    expect(cartridgeRows).toHaveLength(48);
  });

  it("usa só cores da paleta", () => {
    for (const rows of [...spriteIds.map((id) => sprites[id]), cartridgeRows]) {
      for (const row of rows) {
        for (const char of row) {
          expect(knownChars.has(char), char).toBe(true);
        }
      }
    }
  });

  it("junta pixels vizinhos da mesma cor em uma faixa", () => {
    expect(pixelRuns(["KK.W"])).toEqual([
      { x: 0, y: 0, width: 2, fill: palette.K },
      { x: 3, y: 0, width: 1, fill: palette.W },
    ]);
    expect(pixelRuns(["W"], palette, 4, 2)).toEqual([{ x: 4, y: 2, width: 1, fill: palette.W }]);
  });

  it("acha o emblema, o tema e o chefão de cada item do conteúdo", () => {
    const content = staticPortfolioSource.load();
    expect(emblemPath("app-vitrola")).toBe("/kit/emblems/apps/vitrola.png");
    expect(emblemPath("private-washing-issues")).toBe("/kit/emblems/apps/washing-issues.png");
    expect(emblemPath("career-icu")).toBe("/kit/emblems/career/icu-speech-therapy.png");
    for (const app of content.apps) {
      expect(cartridgeThemes[app.id], app.id).toBeDefined();
    }
    expect(themeFor("app-nova").glow).toMatch(/^#/);
    for (const item of content.cases) {
      expect(sprites[bossSpriteFor(item.id)], item.id).toBeDefined();
    }
  });
});
