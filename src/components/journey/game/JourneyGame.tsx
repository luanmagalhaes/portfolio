"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import type { Locale } from "@/domain/locale";
import type { Portfolio } from "@/domain/view";
import { pagePath } from "@/lib/routes";
import type { JourneyCopy } from "@/components/journey/copy";
import { uiIconPath } from "@/components/journey/model/assets";
import { layoutLevel } from "@/components/journey/model/geometry";
import { levelTotals, type LevelNode, type WorldId } from "@/components/journey/model/level";
import { initialJourneyState, journeyReducer, type JourneyAction } from "@/components/journey/model/state";
import { AppsGallery } from "@/components/journey/dialogs/AppsGallery";
import { BossCard } from "@/components/journey/dialogs/BossCard";
import { Modal } from "@/components/journey/dialogs/Modal";
import { StageCard } from "@/components/journey/dialogs/StageCard";
import { WorldMap } from "@/components/journey/dialogs/WorldMap";
import { Backdrop, Runner } from "@/components/journey/game/Backdrop";
import { Hud } from "@/components/journey/game/Hud";
import { Track } from "@/components/journey/game/Track";
import { themeSegments } from "@/components/journey/game/segments";
import { spacerHeight, useJourneyEngine } from "@/components/journey/game/useJourneyEngine";
import { useViewport } from "@/components/journey/game/useViewport";
import { playSound } from "@/components/journey/game/sound";
import { Sprite } from "@/components/journey/nodes/Sprite";

interface JourneyGameProps {
  portfolio: Portfolio;
  copy: JourneyCopy;
  locale: Locale;
  nodes: LevelNode[];
  fontClasses: string;
}

export function JourneyGame({ portfolio, copy, locale, nodes, fontClasses }: JourneyGameProps) {
  const [state, dispatch] = useReducer(journeyReducer, initialJourneyState);
  const viewport = useViewport();
  const rootRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef(false);
  const dialogRef = useRef(state.dialog.type);
  const openerRef = useRef<HTMLElement | null>(null);
  const restoreRef = useRef(true);
  const placed = useMemo(() => layoutLevel(nodes, viewport.width), [nodes, viewport.width]);
  const segments = useMemo(() => themeSegments(nodes, placed), [nodes, placed]);
  const totals = useMemo(() => levelTotals(nodes), [nodes]);
  const labels = useMemo(
    () => ({ reached: copy.reached, collected: copy.collected, cleared: copy.cleared, world: (id: WorldId) => `${copy.world}: ${copy.worlds[id].name}` }),
    [copy],
  );
  const controls = useJourneyEngine({ nodes, placed, segments, viewport, rootRef, dispatch, soundRef, labels });

  useEffect(() => {
    soundRef.current = state.sound;
  }, [state.sound]);

  useEffect(() => {
    const before = dialogRef.current;
    dialogRef.current = state.dialog.type;
    if (before !== "none" && state.dialog.type === "none") {
      if (restoreRef.current && openerRef.current?.isConnected) openerRef.current.focus({ preventScroll: true });
      restoreRef.current = true;
    }
  }, [state.dialog.type]);

  const open = useCallback((action: JourneyAction) => {
    if (dialogRef.current === "none" && document.activeElement instanceof HTMLElement) openerRef.current = document.activeElement;
    dispatch(action);
  }, []);

  const onOpenApp = useCallback(
    (appId: string) => {
      if (soundRef.current) playSound("door");
      open({ type: "open-app", appId });
    },
    [open],
  );
  const onOpenBoss = useCallback((caseId: string) => open({ type: "open-boss", caseId }), [open]);
  const onMap = useCallback(() => open({ type: "open-map" }), [open]);
  const onApps = useCallback(() => open({ type: "open-apps" }), [open]);
  const onClose = useCallback(() => dispatch({ type: "close" }), []);
  const onStart = useCallback(() => controls.step(1), [controls]);
  const onRestart = useCallback(() => {
    window.scrollTo({ top: 0, behavior: viewport.reduced ? "instant" : "smooth" });
    rootRef.current?.querySelector<HTMLElement>(".jr-title-actions button")?.focus({ preventScroll: true });
  }, [viewport.reduced]);
  const onJump = useCallback(
    (index: number, fight: boolean) => {
      restoreRef.current = false;
      dispatch({ type: "close" });
      window.requestAnimationFrame(() => {
        controls.goTo(index, fight);
        window.requestAnimationFrame(() => {
          const node = rootRef.current?.querySelector<HTMLElement>(`[data-node="${index}"]`);
          const target = node?.querySelector<HTMLElement>(fight ? ".jr-boss-foe" : "h2, h3, button, a");
          if (!target) return;
          if (!target.matches("button, a")) target.tabIndex = -1;
          target.focus({ preventScroll: true });
        });
      });
    },
    [controls],
  );

  const dialog = state.dialog;
  const quickPath = pagePath("quick", locale);

  return (
    <div ref={rootRef} className={`jr-root jr-mode-${viewport.mode} ${fontClasses}`}>
      <a className="jr-skip" href={quickPath}>
        {copy.skip}
      </a>
      <Hud profile={portfolio.profile} copy={copy} locale={locale} state={state} totals={totals} onMap={onMap} onApps={onApps} onSound={() => dispatch({ type: "toggle-sound" })} />
      <main className="jr-journey" aria-labelledby="jr-title">
        <h1 id="jr-title" className="jr-sr-only">
          {copy.journeyTitle}
        </h1>
        <noscript>
          <p className="jr-noscript">
            {copy.noscript} <a href={quickPath}>{copy.quickView}</a>
          </p>
        </noscript>
        <div className="jr-stage">
          <Backdrop segments={segments} />
          <Track nodes={nodes} placed={placed} portfolio={portfolio} copy={copy} locale={locale} onOpenApp={onOpenApp} onOpenBoss={onOpenBoss} onMap={onMap} onStart={onStart} onRestart={onRestart} />
          <Runner />
          <div className="jr-toast" aria-hidden="true" />
          <nav className="jr-pad" aria-label={copy.journeyNav}>
            <button className="jr-btn jr-btn-small" type="button" onClick={() => controls.step(-1)} aria-label={copy.prevStop}>
              <Sprite className="jr-ico" src={uiIconPath("arrowLeft")} width={16} height={16} />
            </button>
            <button className="jr-btn jr-btn-small jr-btn-primary" type="button" onClick={() => controls.step(1)} aria-label={copy.nextStop}>
              <Sprite className="jr-ico" src={uiIconPath("arrowRight")} width={16} height={16} />
            </button>
          </nav>
        </div>
        <div className="jr-spacer" style={{ height: spacerHeight(viewport, placed) }} aria-hidden="true" />
      </main>
      <p className="jr-sr-only" aria-live="polite" data-announcer="" />
      {dialog.type === "app" ? (
        <Modal labelledBy="jr-app-title" closeLabel={copy.close} className="jr-app-box" onClose={onClose}>
          <StageCard
            key={`${dialog.appId}-${dialog.live}`}
            apps={portfolio.apps}
            appId={dialog.appId}
            appStack={portfolio.appStack}
            live={dialog.live}
            portrait={viewport.mode === "v"}
            inlineLive={viewport.desktop}
            reduced={viewport.reduced}
            copy={copy}
            onOpen={(appId) => dispatch({ type: "open-app", appId })}
            onLive={() => dispatch({ type: "play-live" })}
            onBack={() => dispatch({ type: "back-to-video" })}
          />
        </Modal>
      ) : null}
      {dialog.type === "boss" ? (
        <Modal labelledBy="jr-boss-title" closeLabel={copy.close} onClose={onClose}>
          <BossCard cases={portfolio.cases} caseId={dialog.caseId} copy={copy} onOpen={(caseId) => dispatch({ type: "open-boss", caseId })} />
        </Modal>
      ) : null}
      {dialog.type === "map" ? (
        <Modal labelledBy="jr-map-title" closeLabel={copy.close} className="jr-map-box" onClose={onClose}>
          <WorldMap nodes={nodes} portfolio={portfolio} copy={copy} state={state} onJump={onJump} onApps={() => dispatch({ type: "open-apps" })} />
        </Modal>
      ) : null}
      {dialog.type === "apps" ? (
        <Modal labelledBy="jr-apps-title" closeLabel={copy.close} className="jr-apps-box" onClose={onClose}>
          <AppsGallery apps={portfolio.apps} appStack={portfolio.appStack} copy={copy} found={state.found} onOpen={(appId) => dispatch({ type: "open-app", appId })} />
        </Modal>
      ) : null}
    </div>
  );
}
