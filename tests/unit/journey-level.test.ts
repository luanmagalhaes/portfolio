import { describe, expect, it } from "vitest";
import { staticPortfolioSource } from "@/content";
import { portfolioFor } from "@/domain/view";
import { buildLevel, chunk, firstYear, levelTotals, worldForEmblem, worldIds } from "@/components/journey/model/level";

const portfolio = portfolioFor(staticPortfolioSource, "en");
const nodes = buildLevel(portfolio);

describe("nível da jornada", () => {
  it("começa na tela de título e termina na chegada", () => {
    expect(nodes[0].kind).toBe("intro");
    expect(nodes.at(-1)?.kind).toBe("goal");
    expect(new Set(nodes.map((node) => node.key)).size).toBe(nodes.length);
  });

  it("abre os seis mundos na ordem, cada um com o seu portal", () => {
    const gates = nodes.filter((node) => node.kind === "gate").map((node) => node.world);
    expect(gates).toEqual([...worldIds]);
  });

  it("coloca cada emprego e cada marco como checkpoint, sem esquecer nenhum", () => {
    const checkpoints = nodes.flatMap((node) => (node.kind === "checkpoint" ? [node.id] : []));
    const expected = [...portfolio.jobs.map((job) => job.id), ...portfolio.milestones.map((item) => item.id), ...portfolio.aiProjects.map((item) => item.id)];
    expect(checkpoints.sort()).toEqual(expected.sort());
  });

  it("vira os destaques extras de cada emprego em itens no caminho", () => {
    const antecipa = portfolio.jobs[0];
    const loot = nodes.filter((node) => node.kind === "loot" && node.jobId === antecipa.id);
    expect(loot).toHaveLength(antecipa.highlights.length - 1);
  });

  it("transforma todos os casos em chefões e todos os apps em portas", () => {
    const totals = levelTotals(nodes);
    expect(totals.bosses).toBe(portfolio.cases.length);
    expect(totals.apps).toBe(portfolio.apps.length);
  });

  it("espalha todas as skills e idiomas como gemas", () => {
    const skillCount = portfolio.skills.reduce((sum, group) => sum + group.items.length, 0) + portfolio.languages.length;
    expect(levelTotals(nodes).skills).toBe(skillCount);
    nodes.forEach((node) => {
      if (node.kind === "gems") expect(node.gems.length).toBeLessThanOrEqual(5);
    });
  });

  it("muda para a neve a partir do intercâmbio no Canadá", () => {
    const canada = nodes.findIndex((node) => node.kind === "checkpoint" && node.id === "canada");
    expect(nodes[canada].theme).toBe("snow");
    expect(nodes[canada - 1].theme).toBe("school");
  });

  it("ordena os checkpoints de cada mundo pelo ano", () => {
    const overseas = nodes.filter((node) => node.kind === "checkpoint" && node.world === "overseas").map((node) => (node.kind === "checkpoint" ? node.id : ""));
    expect(overseas).toEqual(["engel-voelkers", "the-vintage-bar", "miinto"]);
  });
});

describe("ajudantes do nível", () => {
  it("lê o primeiro ano de um período", () => {
    expect(firstYear("Dec 2022 to present")).toBe(2022);
    expect(firstYear("sem ano")).toBe(Number.POSITIVE_INFINITY);
  });

  it("divide listas em fileiras", () => {
    expect(chunk([1, 2, 3, 4, 5, 6, 7], 3)).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  it("usa o mundo padrão para emblemas desconhecidos", () => {
    expect(worldForEmblem("career-credit", "lab")).toBe("market");
    expect(worldForEmblem("career-novo", "lab")).toBe("lab");
  });
});
