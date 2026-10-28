import { describe, expect, it } from "vitest";
import { arcadeReducer, hashFor, initialArcadeState, parentOf, stateFromHash, type ArcadeState } from "@/components/arcade/navigation";

const order = ["vitrola", "cantarola", "flow"];

function run(...actions: Parameters<typeof arcadeReducer>[1][]): ArcadeState {
  return actions.reduce(arcadeReducer, initialArcadeState);
}

describe("navegação do fliperama", () => {
  it("liga, faz o boot e chega ao menu", () => {
    expect(run({ type: "start" }).screen).toBe("boot");
    expect(run({ type: "start" }, { type: "bootDone" }).screen).toBe("menu");
  });

  it("ignora o fim do boot fora da tela de boot", () => {
    expect(run({ type: "open", screen: "scores" }, { type: "bootDone" }).screen).toBe("scores");
  });

  it("encaixa um cartucho e registra que ele foi jogado uma vez só", () => {
    const state = run({ type: "insert", cartId: "flow" }, { type: "back" }, { type: "insert", cartId: "flow" });
    expect(state.screen).toBe("cart");
    expect(state.cartId).toBe("flow");
    expect(state.played).toEqual(["flow"]);
  });

  it("volta da tela do cartucho para a estante e ejeta", () => {
    expect(run({ type: "insert", cartId: "flow" }, { type: "back" }).screen).toBe("cartridges");
    const ejected = run({ type: "insert", cartId: "flow" }, { type: "eject" });
    expect(ejected.cartId).toBeNull();
    expect(ejected.screen).toBe("cartridges");
  });

  it("passa para o próximo e o anterior dando a volta na lista", () => {
    expect(run({ type: "insert", cartId: "flow" }, { type: "step", delta: 1, order }).cartId).toBe("vitrola");
    expect(run({ type: "insert", cartId: "vitrola" }, { type: "step", delta: -1, order }).cartId).toBe("flow");
  });

  it("limita a rodada e marca o chefão como vencido na última", () => {
    const fight = run({ type: "openBoss", id: "session-thief" }, { type: "setRound", round: 9, total: 4 });
    expect(fight.round).toBe(3);
    expect(fight.cleared).toEqual(["session-thief"]);
    expect(run({ type: "openBoss", id: "session-thief" }, { type: "setRound", round: -2, total: 4 }).round).toBe(0);
  });

  it("vai para o próximo chefão começando da primeira rodada", () => {
    const state = run({ type: "openBoss", id: "b" }, { type: "setRound", round: 2, total: 3 }, { type: "nextBoss", order: ["a", "b"] });
    expect(state.bossId).toBe("a");
    expect(state.round).toBe(0);
  });

  it("desliga e religa voltando para a tela de título", () => {
    const off = run({ type: "open", screen: "menu" }, { type: "power" });
    expect(off.power).toBe("off");
    const on = arcadeReducer(off, { type: "power" });
    expect(on.power).toBe("on");
    expect(on.screen).toBe("title");
  });

  it("conhece a tela de cima de cada tela", () => {
    expect(parentOf("menu")).toBe("title");
    expect(parentOf("boss")).toBe("bosses");
    expect(parentOf("title")).toBeNull();
    expect(run({ type: "back" }).screen).toBe("title");
  });

  it("escolhe o slot do personagem voltando para a aba de perfil", () => {
    const state = run({ type: "selectTab", tab: "skills" }, { type: "selectSlot", slot: "origin" });
    expect(state.slot).toBe("origin");
    expect(state.tab).toBe("profile");
  });

  it("gera e lê o hash de cada tela", () => {
    const known = { carts: order, locked: ["reps"], bosses: ["session-thief"] };
    expect(hashFor(run({ type: "insert", cartId: "flow" }))).toBe("#/cart/flow");
    expect(hashFor(initialArcadeState)).toBe("");
    expect(stateFromHash("#/cart/flow", known)).toEqual({ screen: "cart", cartId: "flow", played: ["flow"] });
    expect(stateFromHash("#/boss/session-thief", known)).toEqual({ screen: "boss", bossId: "session-thief", round: 0 });
    expect(stateFromHash("#/scores", known)).toEqual({ screen: "scores" });
    expect(stateFromHash("#/cart/unknown", known)).toBeNull();
    expect(stateFromHash("#resume", known)).toBeNull();
  });
});
