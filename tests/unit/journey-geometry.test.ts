import { describe, expect, it } from "vitest";
import { staticPortfolioSource } from "@/content";
import { portfolioFor } from "@/domain/view";
import { buildLevel } from "@/components/journey/model/level";
import { STEP, bossPhase, bossProgress, gemOffsets, groundAt, layoutLevel, nextStop, nodeIndexAt, scrollForWorldX, stopsFor, trackWidth } from "@/components/journey/model/geometry";

const nodes = buildLevel(portfolioFor(staticPortfolioSource, "en"));
const placed = layoutLevel(nodes, 1440);

describe("geometria da pista", () => {
  it("encaixa os trechos um depois do outro, sem buracos", () => {
    placed.forEach((spot, index) => {
      if (index > 0) expect(spot.x).toBe(placed[index - 1].x + placed[index - 1].w);
    });
    expect(trackWidth(placed)).toBe(placed.at(-1)!.x + placed.at(-1)!.w);
  });

  it("acha o trecho de qualquer ponto da pista", () => {
    expect(nodeIndexAt(placed, 0)).toBe(0);
    expect(nodeIndexAt(placed, placed[5].x + 1)).toBe(5);
    expect(nodeIndexAt(placed, trackWidth(placed) + 500)).toBe(placed.length - 1);
  });

  it("sobe o chão nos degraus e pula no meio da troca de nível", () => {
    const step = placed.findIndex((spot, index) => index > 0 && spot.level === 1 && placed[index - 1].level === 0);
    expect(groundAt(placed, placed[step].x + 200)).toBe(STEP);
    expect(groundAt(placed, placed[step].x)).toBeGreaterThan(STEP / 2);
  });

  it("espalha as gemas num arco", () => {
    const { gx, gy } = gemOffsets(5, 700);
    expect(gx[0]).toBe(100);
    expect(gx.at(-1)).toBe(600);
    expect(Math.max(...gy)).toBe(gy[2]);
  });
});

describe("luta contra o chefão", () => {
  it("passa por problema, jogada e resultado conforme o avanço", () => {
    expect(bossPhase(0.05)).toEqual({ phase: 0, hp: 1 });
    expect(bossPhase(0.3)).toEqual({ phase: 1, hp: 1 });
    expect(bossPhase(0.6).phase).toBe(2);
    expect(bossPhase(0.6).hp).toBeGreaterThan(0);
    expect(bossPhase(0.9)).toEqual({ phase: 3, hp: 0 });
  });

  it("mede o avanço dentro da arena", () => {
    const spot = { x: 1000, w: 1320, level: 0 };
    expect(bossProgress(spot, 900)).toBe(0);
    expect(bossProgress(spot, 1000 + 900)).toBe(1);
  });
});

describe("paradas", () => {
  const stops = stopsFor(nodes, placed);

  it("cria duas paradas por chefão, uma no meio da luta", () => {
    const bosses = nodes.filter((node) => node.kind === "boss").length;
    expect(stops.filter((stop) => stop.boss)).toHaveLength(bosses);
  });

  it("vai para a próxima e para a anterior", () => {
    const middle = stops[4];
    expect(nextStop(stops, middle.x, 1)?.x).toBeGreaterThan(middle.x);
    expect(nextStop(stops, middle.x, -1)?.x).toBeLessThan(middle.x);
    expect(nextStop(stops, trackWidth(placed), 1)).toBeNull();
  });

  it("converte posição na pista em rolagem", () => {
    expect(scrollForWorldX(100, 300, 5000)).toBe(0);
    expect(scrollForWorldX(1900, 300, 5000)).toBe(1000);
  });
});
