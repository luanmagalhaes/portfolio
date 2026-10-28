import { describe, expect, it } from "vitest";
import { otherLocale, pagePath } from "@/lib/routes";

describe("rotas", () => {
  it("monta o caminho de cada página nos dois idiomas", () => {
    expect(pagePath("home", "en")).toBe("/");
    expect(pagePath("home", "pt")).toBe("/pt");
    expect(pagePath("quick", "en")).toBe("/quick");
    expect(pagePath("arcade", "pt")).toBe("/pt/arcade");
    expect(pagePath("journey", "en")).toBe("/journey");
  });

  it("troca para o outro idioma", () => {
    expect(otherLocale("en")).toBe("pt");
    expect(otherLocale("pt")).toBe("en");
  });
});
