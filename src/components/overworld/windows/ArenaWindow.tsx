"use client";

import { useEffect, useRef, useState } from "react";
import { context, hash2, spriteCanvas } from "@/components/overworld/art/canvas";
import { readColors, type Colors } from "@/components/overworld/art/palette";
import { bossArt } from "@/components/overworld/art/sprites";
import type { OverworldCopy } from "@/components/overworld/copy";
import { bossHp, nextBossIndex, nextMove, selectBoss, showProblem, showResult, stageOf, stepFor, type ArenaState } from "@/components/overworld/model/arena";
import { bossSpriteFor } from "@/components/overworld/model/routing";
import { Greeting } from "@/components/overworld/ui/Greeting";
import type { Portfolio } from "@/domain/view";

type Case = Portfolio["cases"][number];

interface ArenaProps {
  heroName: string;
  cases: Portfolio["cases"];
  arena: ArenaState;
  copy: OverworldCopy;
  reducedMotion: boolean;
  onArena: (arena: ArenaState) => void;
  onSound: (kind: "hit" | "win" | "select") => void;
}

interface StageState {
  sprite: ReturnType<typeof bossSpriteFor>;
  step: number;
  moves: number;
  defeated: boolean;
  hits: number;
  reduced: boolean;
}

function loadFrame(src: string): HTMLImageElement {
  const image = new Image();
  image.src = src;
  return image;
}

const heroIdle = typeof window === "undefined" ? [] : [0, 1].map((frame) => loadFrame(`/kit/characters/luan/frames/luan-side-idle-${frame}.png`));

const heroRun = typeof window === "undefined" ? [] : [0, 1, 2, 3].map((frame) => loadFrame(`/kit/characters/luan/frames/luan-side-run-${frame}.png`));

function drawBackdrop(ctx: CanvasRenderingContext2D, colors: Colors): void {
  ctx.fillStyle = colors.tok("arena-sky");
  ctx.fillRect(0, 0, 160, 72);
  ctx.fillStyle = colors.tok("arena-sky-light");
  ctx.fillRect(0, 14, 160, 3);
  for (let x = 0; x < 160; x += 12) {
    ctx.fillStyle = colors.tok("world-stone");
    ctx.fillRect(x, 18, 8, 6);
    ctx.fillStyle = colors.tok("world-stone-light");
    ctx.fillRect(x, 18, 8, 1);
  }
  ctx.fillStyle = colors.tok("world-stone");
  ctx.fillRect(0, 24, 160, 14);
  ctx.fillStyle = colors.tok("world-stone-dark");
  for (let row = 24; row < 38; row += 5) {
    ctx.fillRect(0, row + 4, 160, 1);
    for (let x = (row / 5) % 2 ? 4 : 0; x < 160; x += 9) ctx.fillRect(x, row, 1, 4);
  }
  ctx.fillStyle = colors.px.K;
  ctx.fillRect(0, 38, 160, 1);
  ctx.fillStyle = colors.tok("arena-sand");
  ctx.fillRect(0, 39, 160, 33);
  ctx.fillStyle = colors.tok("arena-sand-shade");
  for (let index = 0; index < 60; index++) ctx.fillRect(Math.floor(hash2(index, 1) * 160), 40 + Math.floor(hash2(1, index) * 31), 1, 1);
  for (const bx of [30, 122]) {
    ctx.fillStyle = colors.px.X;
    ctx.fillRect(bx, 24, 8, 12);
    ctx.fillStyle = colors.px.R;
    ctx.fillRect(bx + 1, 24, 6, 11);
    ctx.fillStyle = colors.px.Y;
    ctx.fillRect(bx + 3, 28, 2, 2);
  }
}

function ArenaStage({ state, label }: { state: StageState; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const root = canvas?.closest(".ow");
    if (!canvas || !root) return;
    const ctx = context(canvas);
    const colors = readColors(root);
    const sprites = Object.fromEntries(Object.entries(bossArt).map(([name, rows]) => [name, spriteCanvas(rows, colors.px)]));
    let frameId = 0;
    let fade = 0;
    let last = 0;
    let seenHits = stateRef.current.hits;
    let hitStart = -10000;
    const draw = (now: number): void => {
      const current = stateRef.current;
      if (current.hits !== seenHits) {
        seenHits = current.hits;
        hitStart = now;
      }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const time = current.reduced ? 0 : now / 1000;
      const sinceHit = (now - hitStart) / 1000;
      const lunge = current.reduced || sinceHit > 0.35 ? 0 : Math.round(Math.sin((sinceHit / 0.35) * Math.PI) * 18);
      ctx.imageSmoothingEnabled = false;
      drawBackdrop(ctx, colors);
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = colors.px.K;
      ctx.fillRect(26 + lunge, 66, 20, 2);
      ctx.fillRect(100, 66, 28, 2);
      ctx.restore();
      const hero = lunge ? heroRun[Math.floor(now / 100) % heroRun.length] : heroIdle[Math.floor(time * 2) % heroIdle.length];
      if (hero && hero.complete && hero.naturalWidth) ctx.drawImage(hero, 24 + lunge, 36);
      fade = current.defeated ? Math.min(1, fade + (current.reduced ? 1 : dt * 1.5)) : 0;
      const bob = current.reduced ? 0 : Math.round(Math.sin(time * 2.4) * 1.5);
      const shake = !current.reduced && sinceHit < 0.4 ? (Math.floor(now / 33) % 2 ? 1 : -1) : 0;
      const sprite = sprites[current.sprite];
      ctx.save();
      ctx.globalAlpha = 1 - fade;
      if (current.sprite === "twins" || current.sprite === "keys") {
        ctx.globalAlpha = (1 - fade) * 0.85;
        ctx.drawImage(sprite, 112 + shake, 30 + bob);
        ctx.globalAlpha = 1 - fade;
        ctx.drawImage(sprite, 98 + shake, 34 - bob);
      } else ctx.drawImage(sprite, 100 + shake, 34 + bob);
      ctx.restore();
      if (!current.reduced && sinceHit < 0.4) {
        const size = Math.round(2 + (sinceHit / 0.4) * 8);
        ctx.fillStyle = colors.px.Y;
        ctx.fillRect(114 - size, 48, size * 2, 1);
        ctx.fillRect(114, 48 - size, 1, size * 2);
        ctx.fillStyle = colors.px.W;
        ctx.fillRect(113, 47, 3, 3);
      }
      if (current.defeated && fade >= 1) {
        ctx.fillStyle = colors.px.Y;
        for (let index = 0; index < 5; index++) {
          const angle = time * 1.5 + index * 1.25;
          ctx.fillRect(Math.round(114 + Math.cos(angle) * 12), Math.round(48 + Math.sin(angle) * 6), 2, 2);
        }
      }
      frameId = requestAnimationFrame(draw);
    };
    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, []);
  return <canvas ref={canvasRef} className="arena__canvas" width={160} height={72} role="img" aria-label={label} />;
}

function BossThumb({ sprite }: { sprite: ReturnType<typeof bossSpriteFor> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const root = canvas?.closest(".ow");
    if (!canvas || !root) return;
    const ctx = context(canvas);
    ctx.clearRect(0, 0, 32, 32);
    ctx.drawImage(spriteCanvas(bossArt[sprite], readColors(root).px), 0, 0);
  }, [sprite]);
  return <canvas ref={ref} width={32} height={32} aria-hidden="true" />;
}

function battleText(item: Case, step: number, copy: OverworldCopy): { kicker: string; text: string } {
  const stage = stageOf(step, item.moves.length);
  if (stage === "problem") return { kicker: copy.appears(item.boss), text: item.problem };
  if (stage === "move") return { kicker: copy.moveOf(step, item.moves.length), text: item.moves[step - 1] };
  return { kicker: copy.bossDown, text: item.result };
}

export function ArenaWindow({ heroName, cases, arena, copy, reducedMotion, onArena, onSound }: ArenaProps) {
  const [hits, setHits] = useState(0);
  const item = cases[arena.selected] ?? cases[0];
  if (!item) return null;
  const step = stepFor(arena, item.id);
  const stage = stageOf(step, item.moves.length);
  const hp = bossHp(step, item.moves.length);
  const text = battleText(item, step, copy);
  const sprite = bossSpriteFor(item.id, arena.selected);
  const command = (name: "problem" | "move" | "result" | "next"): void => {
    if (name === "next") {
      onArena(selectBoss(arena, nextBossIndex(arena, cases.map((entry) => entry.id))));
      onSound("select");
      return;
    }
    if (name === "problem") onArena(showProblem(arena, item.id));
    if (name === "move") {
      setHits((count) => count + 1);
      onArena(nextMove(arena, item.id, item.moves.length));
      onSound("hit");
    }
    if (name === "result") {
      onArena(showResult(arena, item.id, item.moves.length));
      onSound("win");
    }
  };
  return (
    <>
      <Greeting speaker="guard" name={copy.places.fort.npc} text={copy.greetings.fort(cases.length)} />
      <div className="arena">
        <div className="arena__bosses" role="group" aria-label={copy.bosses}>
          {cases.map((entry, index) => (
            <button key={entry.id} type="button" className="boss-tab" data-boss={index} aria-pressed={index === arena.selected} onClick={() => onArena(selectBoss(arena, index))}>
              <BossThumb sprite={bossSpriteFor(entry.id, index)} />
              <span>
                {entry.boss}
                <span className="boss-tab__state">{arena.defeated.includes(entry.id) ? copy.defeated : `${copy.hp} ${bossHp(stepFor(arena, entry.id), entry.moves.length)}`}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="arena__stage">
          <ArenaStage state={{ sprite, step, moves: item.moves.length, defeated: stage === "result", hits, reduced: reducedMotion }} label={item.boss} />
          <div className="hp hp--hero">
            <span className="hp__name">{heroName}</span>
            <span className="hp__bar">
              {copy.hp}
              <span className="hp__track">
                <span className="hp__fill" style={{ width: "100%" }} />
              </span>
            </span>
          </div>
          <div className="hp hp--boss">
            <span className="hp__name">{item.boss}</span>
            <span className="hp__bar">
              {copy.hp}
              <span className="hp__track">
                <span className="hp__fill" data-low={hp < 50} style={{ width: `${hp}%` }} />
              </span>
            </span>
          </div>
        </div>
        <div className="arena__console">
          <ul className="commands">
            {(["problem", "move", "result"] as const).map((name) => (
              <li key={name}>
                <button type="button" className="px-choice" data-command={name} aria-current={stage === name} onClick={() => command(name)}>
                  {copy[name]}
                </button>
              </li>
            ))}
            {stage === "result" && cases.length > 1 ? (
              <li>
                <button type="button" className="px-choice" data-command="next" onClick={() => command("next")}>
                  {copy.nextBoss}
                </button>
              </li>
            ) : null}
          </ul>
          <div className="battle-log" aria-live="polite">
            <p className="battle-log__kicker">{text.kicker}</p>
            <p className="battle-log__text">{text.text}</p>
            <p className="note">{item.client}</p>
          </div>
        </div>
        <p className="note">{copy.bossesBeaten(arena.defeated.length, cases.length)}</p>
      </div>
    </>
  );
}
