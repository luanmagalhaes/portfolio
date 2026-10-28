export type BattleStage = "problem" | "move" | "result";

export interface ArenaState {
  selected: number;
  steps: Record<string, number>;
  defeated: string[];
}

export const initialArena: ArenaState = { selected: 0, steps: {}, defeated: [] };

export function stageOf(step: number, moveCount: number): BattleStage {
  if (step <= 0) return "problem";
  if (step > moveCount) return "result";
  return "move";
}

export function bossHp(step: number, moveCount: number): number {
  if (step <= 0) return 100;
  if (step > moveCount) return 0;
  return Math.round(100 - (step / (moveCount + 1)) * 100);
}

export function stepFor(state: ArenaState, caseId: string): number {
  return state.steps[caseId] ?? 0;
}

export function selectBoss(state: ArenaState, index: number): ArenaState {
  return { ...state, selected: index };
}

export function showProblem(state: ArenaState, caseId: string): ArenaState {
  return { ...state, steps: { ...state.steps, [caseId]: 0 } };
}

export function nextMove(state: ArenaState, caseId: string, moveCount: number): ArenaState {
  const current = stepFor(state, caseId);
  const next = current >= 1 && current < moveCount ? current + 1 : 1;
  return { ...state, steps: { ...state.steps, [caseId]: Math.min(next, Math.max(1, moveCount)) } };
}

export function showResult(state: ArenaState, caseId: string, moveCount: number): ArenaState {
  const defeated = state.defeated.includes(caseId) ? state.defeated : [...state.defeated, caseId];
  return { ...state, steps: { ...state.steps, [caseId]: moveCount + 1 }, defeated };
}

export function nextBossIndex(state: ArenaState, caseIds: readonly string[]): number {
  for (let offset = 1; offset <= caseIds.length; offset++) {
    const index = (state.selected + offset) % caseIds.length;
    if (!state.defeated.includes(caseIds[index])) return index;
  }
  return (state.selected + 1) % Math.max(1, caseIds.length);
}
