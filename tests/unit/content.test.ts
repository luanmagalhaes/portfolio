import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { staticPortfolioSource } from "@/content";
import { isLocalized, locales } from "@/domain/locale";

const content = staticPortfolioSource.load();

function walk(value: unknown, path: string, visit: (value: unknown, path: string) => void): void {
  visit(value, path);

  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${path}[${index}]`, visit));
  } else if (typeof value === "object" && value !== null) {
    Object.entries(value).forEach(([key, item]) => walk(item, `${path}.${key}`, visit));
  }
}

function texts(): { path: string; text: string }[] {
  const found: { path: string; text: string }[] = [];

  walk(content, "content", (value, path) => {
    if (typeof value === "string") {
      found.push({ path, text: value });
    }
  });

  return found;
}

describe("conteúdo do portfólio", () => {
  it("tem todo texto traduzido e preenchido nos dois idiomas", () => {
    const missing: string[] = [];

    walk(content, "content", (value, path) => {
      if (!isLocalized(value)) {
        return;
      }

      for (const locale of locales) {
        const item = value[locale];
        const filled = Array.isArray(item) ? item.length > 0 && item.every((entry) => typeof entry === "string" && entry.trim() !== "") : typeof item === "string" && item.trim() !== "";

        if (!filled) {
          missing.push(`${path}.${locale}`);
        }
      }

      const [first, second] = locales.map((locale) => value[locale]);

      if (Array.isArray(first) && Array.isArray(second) && first.length !== second.length) {
        missing.push(`${path} tem listas de tamanhos diferentes`);
      }
    });

    expect(missing).toEqual([]);
  });

  it("não tem travessão nem emoji", () => {
    const bad = texts().filter(({ text }) => /[—–]|\p{Extended_Pictographic}/u.test(text));

    expect(bad).toEqual([]);
  });

  it("usa ids únicos em cada lista", () => {
    for (const list of [content.jobs, content.milestones, content.cases, content.apps, content.privateApps, content.aiProjects, content.skills, content.education, content.languages]) {
      const ids = list.map((item) => item.id);

      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("tem os 8 apps públicos com link https e o print no public", () => {
    expect(content.apps).toHaveLength(8);

    for (const app of content.apps) {
      expect(app.liveUrl).toMatch(/^https:\/\/[a-z0-9-]+\.vercel\.app$/);
      expect(app.codeUrl === null || app.codeUrl.startsWith("https://github.com/luanmagalhaes/")).toBe(true);
      expect(app.daysToBuild).toBeGreaterThan(0);
      expect(existsSync(join(process.cwd(), "public", app.poster))).toBe(true);
    }
  });

  it("tem os currículos em PDF no public", () => {
    for (const locale of locales) {
      expect(existsSync(join(process.cwd(), "public", content.profile.resume[locale]))).toBe(true);
    }
  });
});
