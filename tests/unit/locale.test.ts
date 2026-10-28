import { describe, expect, it } from "vitest";
import { isLocalized, resolveLocale } from "@/domain/locale";

describe("idioma", () => {
  it("reconhece texto com os dois idiomas", () => {
    expect(isLocalized({ en: "Tiger", pt: "Tigre" })).toBe(true);
    expect(isLocalized({ en: "Tiger" })).toBe(false);
    expect(isLocalized(["en", "pt"])).toBe(false);
    expect(isLocalized({ en: "Tiger", pt: "Tigre", extra: "x" })).toBe(false);
  });

  it("resolve o idioma em qualquer profundidade", () => {
    const content = { name: "Coruja", title: { en: "Owl", pt: "Coruja" }, items: [{ label: { en: ["a", "b"], pt: ["c", "d"] } }], empty: null, days: 3 };

    expect(resolveLocale(content, "pt")).toEqual({ name: "Coruja", title: "Coruja", items: [{ label: ["c", "d"] }], empty: null, days: 3 });
    expect(resolveLocale(content, "en").title).toBe("Owl");
  });
});
