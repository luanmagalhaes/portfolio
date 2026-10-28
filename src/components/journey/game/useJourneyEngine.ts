"use client";

import { useCallback, useEffect, useRef, type Dispatch, type RefObject } from "react";
import { SPEED, STEP, bossPhase, bossProgress, groundAt, nextStop, nodeIndexAt, scrollForWorldX, stopsFor, trackWidth, type Placed, type Stop } from "@/components/journey/model/geometry";
import type { LevelNode, WorldId } from "@/components/journey/model/level";
import type { JourneyAction, ProgressUpdate } from "@/components/journey/model/state";
import { playSound, type SoundKind } from "@/components/journey/game/sound";
import type { JourneyControls, Segment, Viewport } from "@/components/journey/game/types";

interface EngineOptions {
  nodes: LevelNode[];
  placed: Placed[];
  segments: Segment[];
  viewport: Viewport;
  rootRef: RefObject<HTMLDivElement | null>;
  dispatch: Dispatch<JourneyAction>;
  soundRef: RefObject<boolean>;
  labels: { reached: string; collected: string; cleared: string; world: (id: WorldId) => string };
}

interface Metrics {
  runnerX: number;
  scale: number;
  ground: number;
  maxProgress: number;
}

const toggle = (element: Element | null | undefined, name: string, on: boolean): boolean => {
  if (!element || element.classList.contains(name) === on) return false;
  element.classList.toggle(name, on);
  return true;
};

function metricsFor(viewport: Viewport, placed: Placed[]): Metrics {
  const height = typeof window === "undefined" ? 900 : window.innerHeight;
  const hud = viewport.mode === "v" ? 56 : 64;
  return {
    runnerX: Math.round(Math.max(96, viewport.width * 0.2)),
    scale: viewport.mode === "v" ? 2 : height - hud < 640 ? 3 : height - hud > 1000 ? 5 : 4,
    ground: Math.round(Math.min(148, Math.max(96, height * 0.15))),
    maxProgress: Math.max(0, trackWidth(placed) - viewport.width),
  };
}

export function spacerHeight(viewport: Viewport, placed: Placed[]): number {
  return viewport.mode === "h" ? Math.round(Math.max(0, trackWidth(placed) - viewport.width) / SPEED) : 0;
}

export function useJourneyEngine({ nodes, placed, segments, viewport, rootRef, dispatch, soundRef, labels }: EngineOptions): JourneyControls {
  const live = useRef({ progress: 0, metrics: metricsFor(viewport, placed), stops: [] as Stop[] });
  const labelsRef = useRef(labels);
  const stepRef = useRef<(direction: 1 | -1) => void>(() => undefined);

  useEffect(() => {
    labelsRef.current = labels;
  }, [labels]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const metrics = metricsFor(viewport, placed);
    const stops = stopsFor(nodes, placed);
    live.current = { ...live.current, metrics, stops };
    root.style.setProperty("--ground", `${metrics.ground}px`);
    root.style.setProperty("--s", String(metrics.scale));
    root.style.setProperty("--runner-x", `${metrics.runnerX}px`);

    const elements = new Map<number, HTMLElement>();
    root.querySelectorAll<HTMLElement>("[data-node]").forEach((element) => elements.set(Number(element.dataset.node), element));
    const track = root.querySelector<HTMLElement>(".jr-track");
    const stack = root.querySelector<HTMLElement>(".jr-sky-stack");
    const skies = [...root.querySelectorAll<HTMLElement>(".jr-sky")];
    const luan = root.querySelector<HTMLElement>(".jr-luan");
    const matilda = root.querySelector<HTMLElement>(".jr-matilda");
    const shadow = root.querySelector<HTMLElement>(".jr-shadow");
    const bar = root.querySelector<HTMLElement>(".jr-hud-bar i");
    const toastBox = root.querySelector<HTMLElement>(".jr-toast");
    const announcer = root.querySelector<HTMLElement>("[data-announcer]");
    const hops = new Set(nodes.flatMap((node, index) => (node.kind === "gems" ? [index] : [])));
    const seen = { reached: new Set<string>(), gems: new Set<string>(), cleared: new Set<string>(), found: new Set<string>() };
    const depthFar = viewport.reduced ? 0 : 0.3;
    const depthMid = viewport.reduced ? 0 : 0.6;
    let world: WorldId | null = null;
    let dirty = true;
    let lastY = window.scrollY;
    let lastMove = 0;
    let direction: 1 | -1 = 1;
    let lag = 0;
    let frame = 0;
    let pending: ProgressUpdate = {};

    const queue = (key: keyof Omit<ProgressUpdate, "world">, id: string) => {
      pending = { ...pending, [key]: [...(pending[key] ?? []), id] };
    };
    const sound = (kind: SoundKind) => {
      if (soundRef.current) playSound(kind);
    };
    const toast = (text: string) => {
      if (!toastBox || viewport.mode !== "h") return;
      const item = document.createElement("span");
      item.textContent = text;
      toastBox.append(item);
      while (toastBox.children.length > 2) toastBox.firstElementChild?.remove();
      window.setTimeout(() => item.remove(), 1700);
    };
    const textOf = (element: HTMLElement, selector: string) => element.querySelector(selector)?.textContent?.trim() ?? "";

    const reachFlag = (index: number, element: HTMLElement, hit: boolean) => {
      const node = nodes[index];
      if (node.kind !== "checkpoint") return;
      toggle(element, "jr-is-reached", hit || seen.reached.has(node.id));
      if (hit && !seen.reached.has(node.id)) {
        seen.reached.add(node.id);
        queue("reached", node.id);
        toast(`${labelsRef.current.reached}: ${textOf(element, ".jr-sign-title")}`);
        sound("flag");
      }
    };

    const collect = (element: HTMLElement, chip: HTMLElement, sprite: Element | null, got: boolean) => {
      const id = chip.dataset.gem ?? "";
      toggle(sprite, "jr-is-got", got);
      if (toggle(chip, "jr-is-got", got) && got && !seen.gems.has(id)) {
        seen.gems.add(id);
        queue("gems", id);
        toast(`+ ${chip.textContent?.trim() ?? ""}`);
        sound("gem");
      }
      const count = element.querySelector("[data-count]");
      const total = element.querySelectorAll(".jr-gem-chip").length;
      const done = element.querySelectorAll(".jr-gem-chip.jr-is-got").length;
      if (count && count.textContent !== `${done}/${total}`) count.textContent = `${done}/${total}`;
    };

    const fight = (index: number, element: HTMLElement, u: number, progress: number) => {
      const node = nodes[index];
      if (node.kind !== "boss") return;
      const { phase, hp } = bossPhase(u);
      element.querySelectorAll<HTMLElement>("[data-phase]").forEach((item) => toggle(item, "jr-is-on", Number(item.dataset.phase) <= phase));
      element.style.setProperty("--hp", hp.toFixed(3));
      toggle(element, "jr-is-hit", phase === 2);
      if (toggle(element, "jr-is-cleared", phase === 3) && phase === 3 && !seen.cleared.has(node.caseId)) {
        seen.cleared.add(node.caseId);
        queue("cleared", node.caseId);
        toast(`${labelsRef.current.cleared}: ${textOf(element, ".jr-boss-name")}`);
        sound("boss");
      }
      if (viewport.mode === "h") {
        const spot = placed[index];
        const panel = element.querySelector<HTMLElement>(".jr-boss-panel");
        const offset = Math.min(spot.w - 640, Math.max(0, progress + 24 - spot.x));
        if (panel) panel.style.transform = `translateX(${Math.round(offset)}px)`;
      }
    };

    const enterWorld = (next: WorldId) => {
      if (next === world) return;
      world = next;
      pending = { ...pending, world: next };
      if (announcer) announcer.textContent = labelsRef.current.world(next);
    };

    const flush = () => {
      if (Object.keys(pending).length === 0) return;
      dispatch({ type: "progress", update: pending });
      pending = {};
    };

    const frameHorizontal = () => {
      const progress = Math.min(metrics.maxProgress, Math.max(0, window.scrollY * SPEED));
      const runner = progress + metrics.runnerX + 12 * metrics.scale;
      const tile = 128 * metrics.scale;
      if (track) track.style.transform = `translate3d(${-progress}px,0,0)`;
      stack?.style.setProperty("--fx-far", `${-((progress * depthFar) % tile)}px`);
      stack?.style.setProperty("--fx-mid", `${-((progress * depthMid) % tile)}px`);
      stack?.style.setProperty("--fx-strip", `${-((progress * depthFar) % (96 * metrics.scale))}px`);
      const y = groundAt(placed, runner, hops);
      if (luan) luan.style.transform = `translate3d(0,${-y}px,0)`;
      if (matilda) matilda.style.transform = `translate3d(${-lag}px,${-groundAt(placed, runner - 30 * metrics.scale - lag, hops)}px,0)`;
      if (shadow) {
        const base = placed[nodeIndexAt(placed, runner)].level * STEP;
        shadow.style.transform = `translateY(${-base + 6}px) scaleX(${Math.max(0.4, 1 - (y - base) / 140)})`;
      }
      if (!dirty && Math.abs(progress - live.current.progress) < 0.5) return;
      live.current.progress = progress;
      dirty = false;
      nodes.forEach((node, index) => {
        const element = elements.get(index);
        const spot = placed[index];
        if (!element) return;
        if (node.kind === "checkpoint" || node.kind === "loot" || node.kind === "rush") {
          toggle(element, "jr-is-revealed", spot.x - progress < viewport.width * 0.74);
          reachFlag(index, element, runner >= spot.x + 4);
        } else if (node.kind === "gems") {
          element.querySelectorAll<HTMLElement>(".jr-gem-chip").forEach((chip) => {
            const k = Number(chip.dataset.k);
            const sprite = element.querySelector(`.jr-gem-sprite[data-k="${k}"]`);
            const gx = Number(sprite?.getAttribute("data-gx") ?? 0);
            collect(element, chip, sprite, runner >= spot.x + gx + 8);
          });
        } else if (node.kind === "door") {
          toggle(element, "jr-is-near", Math.abs(runner - (spot.x + spot.w / 2)) < 120);
          if (runner >= spot.x + spot.w / 2 && !seen.found.has(node.appId)) {
            seen.found.add(node.appId);
            queue("found", node.appId);
          }
        } else if (node.kind === "boss") {
          fight(index, element, bossProgress(spot, runner), progress);
        }
      });
      enterWorld(nodes[nodeIndexAt(placed, runner)].world);
      const segment = segments.findIndex((item) => runner >= item.x0 && runner < item.x1);
      skies.forEach((sky, index) => toggle(sky, "jr-is-on", index === Math.max(0, segment)));
      if (bar) bar.style.width = `${(progress / Math.max(1, metrics.maxProgress)) * 100}%`;
      flush();
    };

    const frameVertical = () => {
      if (!dirty) return;
      dirty = false;
      const line = window.innerHeight * 0.42;
      const intro = elements.get(0)?.getBoundingClientRect();
      toggle(root, "jr-v-start", !!intro && intro.bottom > line);
      nodes.forEach((node, index) => {
        const element = elements.get(index);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        if (node.kind === "checkpoint" || node.kind === "loot" || node.kind === "rush") {
          toggle(element, "jr-is-revealed", true);
          reachFlag(index, element, rect.top + 24 < line);
        } else if (node.kind === "gems") {
          element.querySelectorAll<HTMLElement>(".jr-gem-chip").forEach((chip) => collect(element, chip, null, chip.getBoundingClientRect().top < line));
        } else if (node.kind === "door") {
          toggle(element, "jr-is-near", rect.top < line && rect.bottom > line);
          if (rect.top < line && !seen.found.has(node.appId)) {
            seen.found.add(node.appId);
            queue("found", node.appId);
          }
        } else if (node.kind === "boss") {
          fight(index, element, Math.min(1, Math.max(0, (line - rect.top) / Math.max(1, rect.height - 120))), 0);
        }
        if (rect.top < line && rect.bottom > line) enterWorld(node.world);
      });
      if (bar) bar.style.width = `${(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)) * 100}%`;
      flush();
    };

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      const moving = now - lastMove < 160;
      toggle(luan, "jr-is-run", moving);
      toggle(matilda, "jr-is-run", moving || Math.abs(lag) > 6);
      toggle(luan, "jr-is-code", !moving && now - lastMove > 7000 && viewport.mode === "h");
      toggle(luan, "jr-is-left", direction < 0);
      toggle(matilda, "jr-is-left", direction < 0);
      lag += ((moving ? 34 * direction : 0) - lag) * 0.06;
      if (viewport.mode === "h") frameHorizontal();
      else frameVertical();
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (y === lastY) return;
      direction = y > lastY ? 1 : -1;
      lastY = y;
      lastMove = performance.now();
      dirty = true;
    };

    const blocked = () => !!document.querySelector("dialog[open]");

    const onKey = (event: KeyboardEvent) => {
      if (blocked() || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select")) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        stepRef.current(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepRef.current(-1);
      } else if (event.key === "ArrowUp" && viewport.mode === "h") {
        const door = root.querySelector<HTMLButtonElement>(".jr-door.jr-is-near .jr-door-btn");
        if (door) {
          event.preventDefault();
          door.click();
        }
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (viewport.mode !== "h" || blocked()) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY) && Math.abs(event.deltaX) > 2) {
        event.preventDefault();
        window.scrollBy(0, event.deltaX / SPEED);
      }
    };

    let touch: { x: number; y: number } | null = null;
    const onTouchStart = (event: TouchEvent) => {
      touch = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!touch || viewport.mode !== "h" || blocked()) return;
      const dx = event.touches[0].clientX - touch.x;
      const dy = event.touches[0].clientY - touch.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        event.preventDefault();
        window.scrollBy(0, (-dx / SPEED) * 1.4);
        touch = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }
    };

    const onFocus = (event: FocusEvent) => {
      if (viewport.mode !== "h" || !(event.target instanceof HTMLElement) || !track?.contains(event.target)) return;
      const rect = event.target.getBoundingClientRect();
      if (rect.right < 40 || rect.left > window.innerWidth - 40) {
        const worldX = live.current.progress + rect.left;
        window.scrollTo({ top: Math.round(Math.min(metrics.maxProgress, Math.max(0, worldX - window.innerWidth * 0.45)) / SPEED), behavior: "instant" });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    root.addEventListener("focusin", onFocus);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("focusin", onFocus);
    };
  }, [nodes, placed, segments, viewport, rootRef, dispatch, soundRef]);

  const scrollToStop = useCallback(
    (stop: Stop) => {
      const behavior: ScrollBehavior = viewport.reduced ? "instant" : "smooth";
      if (viewport.mode === "h") {
        const { metrics } = live.current;
        window.scrollTo({ top: scrollForWorldX(stop.x, metrics.runnerX + 12 * metrics.scale, metrics.maxProgress), behavior });
        return;
      }
      const element = rootRef.current?.querySelector<HTMLElement>(`[data-node="${stop.index}"]`);
      if (element) window.scrollTo({ top: Math.max(0, element.getBoundingClientRect().top + window.scrollY - window.innerHeight * (stop.boss ? 0.15 : 0.3)), behavior });
    },
    [rootRef, viewport],
  );

  const stepTo = useCallback(
    (direction: 1 | -1) => {
      const { metrics, progress, stops } = live.current;
      if (viewport.mode === "h") {
        const stop = nextStop(stops, progress + metrics.runnerX + 12 * metrics.scale, direction);
        if (stop) scrollToStop(stop);
        return;
      }
      const line = window.innerHeight * 0.3;
      const unique = stops.filter((stop, index) => stops.findIndex((other) => other.index === stop.index) === index);
      const tops = unique.map((stop) => ({ stop, top: rootRef.current?.querySelector(`[data-node="${stop.index}"]`)?.getBoundingClientRect().top ?? 0 }));
      const pick = direction > 0 ? tops.find((item) => item.top > line + 20) : [...tops].reverse().find((item) => item.top < line - 20);
      if (pick) scrollToStop(pick.stop);
    },
    [rootRef, scrollToStop, viewport.mode],
  );

  const goTo = useCallback(
    (index: number, fightStop: boolean) => {
      const { stops } = live.current;
      const stop = stops.find((item) => item.index === index && (!fightStop || item.boss)) ?? { index, x: (placed[index]?.x ?? 0) + 100, boss: false };
      const behavior: ScrollBehavior = "instant";
      if (viewport.mode === "h") {
        const { metrics } = live.current;
        window.scrollTo({ top: scrollForWorldX(stop.x, metrics.runnerX + 12 * metrics.scale, metrics.maxProgress), behavior });
        return;
      }
      const element = rootRef.current?.querySelector<HTMLElement>(`[data-node="${index}"]`);
      if (element) window.scrollTo({ top: Math.max(0, element.getBoundingClientRect().top + window.scrollY - window.innerHeight * (fightStop ? 0.15 : 0.3)), behavior });
    },
    [placed, rootRef, viewport.mode],
  );

  useEffect(() => {
    stepRef.current = stepTo;
  }, [stepTo]);

  return { step: stepTo, goTo };
}
