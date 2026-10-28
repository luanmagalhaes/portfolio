import { describe, expect, it } from "vitest";
import { initialJourneyState, journeyReducer } from "@/components/journey/model/state";

describe("estado da jornada", () => {
  it("abre a fase bônus e conta o app como encontrado", () => {
    const state = journeyReducer(initialJourneyState, { type: "open-app", appId: "vitrola" });
    expect(state.dialog).toEqual({ type: "app", appId: "vitrola", live: false });
    expect(state.found).toEqual(["vitrola"]);
  });

  it("liga o app ao vivo só com uma fase bônus aberta", () => {
    expect(journeyReducer(initialJourneyState, { type: "play-live" })).toBe(initialJourneyState);
    const open = journeyReducer(initialJourneyState, { type: "open-app", appId: "flow" });
    const live = journeyReducer(open, { type: "play-live" });
    expect(live.dialog).toEqual({ type: "app", appId: "flow", live: true });
    expect(journeyReducer(live, { type: "back-to-video" }).dialog).toEqual({ type: "app", appId: "flow", live: false });
  });

  it("fecha qualquer janela", () => {
    const map = journeyReducer(initialJourneyState, { type: "open-map" });
    expect(journeyReducer(map, { type: "close" }).dialog).toEqual({ type: "none" });
    expect(journeyReducer(initialJourneyState, { type: "close" })).toBe(initialJourneyState);
  });

  it("começa com o som desligado e alterna", () => {
    expect(initialJourneyState.sound).toBe(false);
    expect(journeyReducer(initialJourneyState, { type: "toggle-sound" }).sound).toBe(true);
  });

  it("junta o progresso sem repetir e devolve o mesmo estado quando nada muda", () => {
    const first = journeyReducer(initialJourneyState, { type: "progress", update: { gems: ["a", "b"], world: "ward" } });
    expect(first.gems).toEqual(["a", "b"]);
    expect(first.world).toBe("ward");
    const second = journeyReducer(first, { type: "progress", update: { gems: ["b", "c", "c"] } });
    expect(second.gems).toEqual(["a", "b", "c"]);
    expect(journeyReducer(second, { type: "progress", update: { gems: ["a"] } })).toBe(second);
  });
});
