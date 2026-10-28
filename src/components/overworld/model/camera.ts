export const phoneBreakpoint = 600;

export const toolbarBreakpoint = 1100;

export function computeScale(width: number, height: number, mapWidth: number): number {
  if (width < phoneBreakpoint) return Math.max(1, Math.floor(width / mapWidth));
  const byWidth = Math.floor(width / mapWidth);
  const byHeight = Math.max(1, Math.round(height / 300));
  return Math.max(1, Math.min(byWidth, byHeight));
}

export interface AxisInput {
  focus: number;
  view: number;
  scene: number;
  insetStart: number;
  insetEnd: number;
  alignStart: boolean;
}

export function cameraAxis({ focus, view, scene, insetStart, insetEnd, alignStart }: AxisInput): number {
  const available = view - insetStart - insetEnd;
  if (scene <= available) return Math.round(alignStart ? -insetStart - 4 : (scene - available) / 2 - insetStart);
  const wanted = focus - insetStart - available / 2;
  return Math.round(Math.max(-insetStart, Math.min(wanted, scene - view + insetEnd)));
}
