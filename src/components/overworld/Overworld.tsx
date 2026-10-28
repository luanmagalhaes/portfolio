"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { overworldCopy } from "@/components/overworld/copy";
import { OverworldEngine, type EngineCallbacks, type SoundKind } from "@/components/overworld/engine/engine";
import { playSound } from "@/components/overworld/engine/sound";
import type { OverworldLinks } from "@/components/overworld/links";
import { utcOffsetFrom } from "@/components/overworld/model/clock";
import { arcadeLayoutFor, exploredPlaceIds, placeById, type DistrictId } from "@/components/overworld/model/map";
import { cabinetSkinFor } from "@/components/overworld/model/routing";
import { exploredCount, initialOverworldState, overworldReducer, type OverworldState, type WindowState } from "@/components/overworld/model/state";
import { DialogBox } from "@/components/overworld/ui/DialogBox";
import { Emblem } from "@/components/overworld/ui/Emblem";
import { GameWindow } from "@/components/overworld/ui/GameWindow";
import { ControlsHint, Hud } from "@/components/overworld/ui/Hud";
import { useCanFrame, useCoarsePointer, usePhone, useReducedMotion } from "@/components/overworld/ui/hooks";
import { PixelIcon } from "@/components/overworld/ui/PixelIcon";
import { arcadeTags, PlaceTags, townTags, type TagEntry } from "@/components/overworld/ui/PlaceTags";
import { TitleScreen } from "@/components/overworld/ui/TitleScreen";
import { Toast } from "@/components/overworld/ui/Toast";
import { ArenaWindow } from "@/components/overworld/windows/ArenaWindow";
import { FastTravelWindow } from "@/components/overworld/windows/FastTravelWindow";
import { InventoryWindow, inventoryTabs } from "@/components/overworld/windows/InventoryWindow";
import { MachineWindow } from "@/components/overworld/windows/MachineWindow";
import { HouseWindow, JobsWindow, jobsIn, LighthouseWindow, MilestonesWindow, PostWindow, PrivateBuildsWindow } from "@/components/overworld/windows/PlaceWindows";
import { QuestLogWindow } from "@/components/overworld/windows/QuestLogWindow";
import { overworldFontClasses } from "@/components/overworld/fonts";
import { directionForKey, isActionKey } from "@/game/input";
import type { Locale } from "@/domain/locale";
import type { Portfolio } from "@/domain/view";
import "@/components/overworld/overworld.css";

interface OverworldProps {
  portfolio: Portfolio;
  locale: Locale;
  links: OverworldLinks;
}

export function Overworld({ portfolio, locale, links }: OverworldProps) {
  const copy = overworldCopy(locale);
  const [state, dispatch] = useReducer(overworldReducer, initialOverworldState);
  const reducedMotion = useReducedMotion();
  const phone = usePhone();
  const canFrame = useCanFrame();
  const coarse = useCoarsePointer();
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tagLayerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLElement>(null);
  const nameplateRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLElement>(null);
  const engineRef = useRef<OverworldEngine | null>(null);
  const stateRef = useRef<OverworldState>(state);
  const soundRef = useRef(false);
  const { profile, apps, privateApps, cases } = portfolio;
  const firstName = profile.name.split(" ")[0];
  const utcOffset = utcOffsetFrom(profile.location);
  const layout = useMemo(() => arcadeLayoutFor(apps.length, privateApps.length), [apps.length, privateApps.length]);
  const cabinetApps = useMemo(() => apps.map((app, index) => ({ id: app.id, skin: cabinetSkinFor(app.id, index) })), [apps]);
  const thumbs = useMemo(() => Object.fromEntries(apps.flatMap((app) => (app.demo ? [[app.id, app.demo.landscape.poster]] : []))), [apps]);
  const auctionCompany = jobsIn(portfolio, "auction")[0]?.company;

  const tagFor = useCallback(
    (id: DistrictId): string => {
      if (id === "arcade") return copy.appsCount(apps.length);
      if (id === "auction") return auctionCompany ?? copy.auctionFallback;
      return copy.places[id].tag;
    },
    [copy, apps.length, auctionCompany],
  );

  const sound = useCallback((kind: SoundKind): void => {
    if (soundRef.current) playSound(kind);
  }, []);

  useEffect(() => {
    stateRef.current = state;
    soundRef.current = state.sound;
  }, [state]);

  useEffect(() => {
    const root = rootRef.current;
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const tagLayer = tagLayerRef.current;
    if (!root || !host || !canvas || !tagLayer) return;
    const callbacks: EngineCallbacks = {
      onPlace: (place, fromDoor) => dispatch({ type: "enter-place", place, fromDoor }),
      onApp: (appId) => dispatch({ type: "open-machine", index: Math.max(0, apps.findIndex((app) => app.id === appId)) }),
      onPrivate: () => dispatch({ type: "open-window", window: { kind: "private" } }),
      onTalk: (speaker, lines) => dispatch({ type: "show-dialog", speaker, lines: [copy.lines[lines](firstName)] }),
      onSceneChange: (scene) => dispatch({ type: "scene", scene }),
      onArcadeEntered: () => dispatch({ type: "arcade-entered", greeting: copy.greetings.arcade(apps.length) }),
      onSound: sound,
    };
    const engine = new OverworldEngine({
      root,
      canvas,
      host,
      tagLayer,
      topBar: () => (window.innerWidth < 600 ? topRef.current : nameplateRef.current),
      bottomBar: () => toolbarRef.current,
      cabinetApps,
      layout,
      thumbs,
      callbacks,
    });
    engineRef.current = engine;
    engine.start();
    const handleResize = (): void => engine.resize();
    window.addEventListener("resize", handleResize);
    const observer = new MutationObserver(() => engine.rebuildIfPaletteChanged());
    observer.observe(root, { attributes: true, attributeFilter: ["style"] });
    return () => {
      engine.destroy();
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      engineRef.current = null;
    };
  }, [apps, cabinetApps, copy, firstName, layout, sound, thumbs]);

  useEffect(() => {
    engineRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    engineRef.current?.setPaused(state.phase !== "play" || state.window.kind !== "none" || state.dialog !== null);
  }, [state.phase, state.window.kind, state.dialog]);

  useEffect(() => {
    if (state.phase === "play" && state.window.kind === "none" && !state.dialog) hostRef.current?.focus({ preventScroll: true });
  }, [state.phase, state.window.kind, state.dialog]);

  useEffect(() => {
    engineRef.current?.resize();
  }, [state.phase, phone, locale]);

  useEffect(() => {
    engineRef.current?.refreshTags();
  }, [state.scene, state.visited, phone, locale]);

  useEffect(() => {
    if (!state.toast) return;
    const timer = window.setTimeout(() => dispatch({ type: "clear-toast" }), 3200);
    return () => window.clearTimeout(timer);
  }, [state.toast]);

  const openWindow = useCallback((window: WindowState): void => {
    sound("open");
    dispatch({ type: "open-window", window });
  }, [sound]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const engine = engineRef.current;
      const current = stateRef.current;
      if (!engine || current.phase !== "play" || current.window.kind !== "none" || current.dialog) return;
      const target = event.target as HTMLElement;
      const onStage = target === document.body || target === hostRef.current || target.classList.contains("place-tag");
      const dir = directionForKey(event.key);
      if (dir && (event.key.startsWith("Arrow") || onStage)) {
        event.preventDefault();
        engine.press(dir);
        return;
      }
      if (!onStage || event.altKey || event.ctrlKey || event.metaKey) return;
      if (isActionKey(event.key) && target.tagName !== "BUTTON") {
        event.preventDefault();
        engine.interactFacing();
        return;
      }
      const key = event.key.toLowerCase();
      if (key === "m") openWindow({ kind: "travel" });
      else if (key === "q") openWindow({ kind: "quests" });
      else if (key === "i") openWindow({ kind: "items", tab: "" });
    };
    const handleKeyUp = (event: KeyboardEvent): void => {
      const dir = directionForKey(event.key);
      if (dir) engineRef.current?.release(dir);
    };
    const handleBlur = (): void => engineRef.current?.releaseAll();
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [openWindow]);

  const closeWindow = useCallback((): void => {
    const current = stateRef.current.window;
    const engine = engineRef.current;
    if (engine && current.kind === "place" && current.fromDoor) engine.stepOutOfDoor(current.place);
    if (engine && current.kind === "arena" && current.fromDoor) engine.stepOutOfDoor("fort");
    dispatch({ type: "close-window" });
  }, []);

  const closeDialog = useCallback((): void => dispatch({ type: "close-dialog" }), []);

  const travelTo = useCallback((place: DistrictId): void => {
    dispatch({ type: "close-window" });
    const engine = engineRef.current;
    if (!engine) return;
    engine.setPaused(false);
    engine.goToPlace(place, true);
  }, []);

  const activateTag = useCallback((entry: TagEntry): void => {
    const engine = engineRef.current;
    if (!engine) return;
    sound("select");
    if (entry.kind === "place") engine.goToPlace(entry.id as DistrictId);
    else if (entry.kind === "cabinet") engine.goToCabinet(entry.id.replace(/^app-/, ""));
    else if (entry.kind === "private") engine.goToPrivate();
    else void engine.exitArcade();
  }, [sound]);

  const hoverTag = useCallback((entry: TagEntry | null): void => engineRef.current?.setHover(entry ? entry.id : null), []);

  const focusTag = useCallback((entry: TagEntry): void => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.setHover(entry.id);
    engine.focusAnchor(entry.x, entry.y);
  }, []);

  const start = useCallback((): void => {
    dispatch({ type: "start" });
    dispatch({ type: "show-dialog", speaker: "matilda", lines: coarse ? copy.introTouch : copy.intro });
  }, [coarse, copy]);

  const tags = state.scene === "town" ? townTags(copy, state.visited, tagFor) : arcadeTags(copy, apps, layout);
  const explored = exploredCount(state.visited);
  const toastMessage = state.toast ? (state.toast.count === state.toast.total ? copy.allExplored : copy.toastExplored(copy.places[state.toast.place].title, state.toast.count, state.toast.total)) : null;
  const dialog = state.dialog;
  const windowView = renderWindow();

  function renderWindow(): { title: string; icon: React.ReactNode; wide: boolean; body: React.ReactNode } | null {
    const view = state.window;
    if (view.kind === "none") return null;
    if (view.kind === "machine") {
      const app = apps[view.index] ?? apps[0];
      if (!app) return null;
      return {
        title: `${copy.places.arcade.title} · ${app.name}`,
        icon: <Emblem emblem={app.emblem} />,
        wide: true,
        body: <MachineWindow apps={apps} appStack={portfolio.appStack} index={view.index} live={view.live} copy={copy} phone={phone} canFrame={canFrame} reducedMotion={reducedMotion} onStep={(delta) => dispatch({ type: "machine-step", delta, count: apps.length })} onLive={(live) => dispatch({ type: "machine-live", live })} />,
      };
    }
    if (view.kind === "arena") {
      return { title: copy.places.fort.title, icon: <PixelIcon name="swords" size="lg" />, wide: true, body: <ArenaWindow heroName={firstName} cases={cases} arena={state.arena} copy={copy} reducedMotion={reducedMotion} onArena={(arena) => dispatch({ type: "arena", arena })} onSound={sound} /> };
    }
    if (view.kind === "quests") return { title: copy.questLog, icon: <PixelIcon name="scroll" size="lg" />, wide: true, body: <QuestLogWindow portfolio={portfolio} copy={copy} onGo={travelTo} /> };
    if (view.kind === "items") {
      const tab = view.tab || inventoryTabs(portfolio, copy)[0].id;
      return { title: copy.inventory, icon: <PixelIcon name="bag" size="lg" />, wide: true, body: <InventoryWindow portfolio={portfolio} copy={copy} tab={tab} onTab={(next) => dispatch({ type: "items-tab", tab: next })} /> };
    }
    if (view.kind === "travel") {
      return { title: copy.fastTravel, icon: <PixelIcon name="map" size="lg" />, wide: true, body: <FastTravelWindow copy={copy} visited={state.visited} tagFor={tagFor} snapshot={() => engineRef.current?.townSnapshot() ?? null} onGo={travelTo} /> };
    }
    if (view.kind === "private") return { title: copy.privateBuilds, icon: <PixelIcon name="lock" size="lg" />, wide: false, body: <PrivateBuildsWindow portfolio={portfolio} copy={copy} firstName={firstName} /> };
    const place = view.place;
    const icon = <PixelIcon name={placeById(place).icon} size="lg" />;
    const title = place === "house" ? copy.houseTitle(firstName) : place === "auction" && auctionCompany ? `${copy.places.auction.title} · ${auctionCompany}` : copy.places[place].title;
    const props = { portfolio, copy, firstName };
    if (place === "house") return { title, icon, wide: true, body: <HouseWindow {...props} /> };
    if (place === "auction" || place === "harbor" || place === "bridge") return { title, icon, wide: true, body: <JobsWindow {...props} district={place} /> };
    if (place === "hospital" || place === "school") return { title, icon, wide: true, body: <MilestonesWindow {...props} district={place} /> };
    if (place === "lighthouse") return { title, icon, wide: true, body: <LighthouseWindow {...props} /> };
    if (place === "post") return { title, icon, wide: false, body: <PostWindow {...props} /> };
    return null;
  }

  return (
    <div ref={rootRef} className={`ow ${overworldFontClasses}`} data-phase={state.phase} data-scene={state.scene}>
      <a className="ow-skip-link" href={links.quick}>
        {copy.skipToQuickView}
      </a>
      <div className="game">
        <div ref={hostRef} className="stage-host" tabIndex={0} role="application" aria-roledescription="game" aria-label={copy.stageLabel}>
          <canvas ref={canvasRef} className="stage" aria-hidden="true" />
          <div ref={tagLayerRef} className="tag-layer">
            <PlaceTags scene={state.scene} entries={tags} onActivate={activateTag} onHover={hoverTag} onFocusTag={focusTag} />
          </div>
          {state.scene === "arcade" ? (
            <div className="arcade-list">
              {apps.map((app) => (
                <button key={app.id} type="button" className="px-btn px-btn--dark" data-cabinet={app.id} onClick={() => engineRef.current?.goToCabinet(app.id)}>
                  <Emblem emblem={app.emblem} />
                  <span>{app.name}</span>
                </button>
              ))}
              <button type="button" className="px-btn px-btn--dark" onClick={() => engineRef.current?.goToPrivate()}>
                <PixelIcon name="lock" />
                <span>{copy.privateBuilds}</span>
              </button>
              <button type="button" className="px-btn" data-action="exit-arcade" onClick={() => void engineRef.current?.exitArcade()}>
                <PixelIcon name="house" />
                <span>{copy.exitArcade}</span>
              </button>
            </div>
          ) : null}
          <span className="stage-focus" aria-hidden="true" />
        </div>
        <Hud
          copy={copy}
          locale={locale}
          links={links}
          name={profile.name}
          title={profile.title}
          resume={profile.resume}
          firstName={firstName}
          utcOffset={utcOffset}
          explored={explored}
          total={exploredPlaceIds.length}
          sound={state.sound}
          topRef={topRef}
          nameplateRef={nameplateRef}
          toolbarRef={toolbarRef}
          onMap={() => openWindow({ kind: "travel" })}
          onQuests={() => openWindow({ kind: "quests" })}
          onItems={() => openWindow({ kind: "items", tab: "" })}
          onSound={() => {
            if (!state.sound) playSound("select");
            dispatch({ type: "toggle-sound" });
          }}
        />
        <ControlsHint copy={copy} />
      </div>
      {state.phase === "title" ? <TitleScreen copy={copy} locale={locale} links={links} name={profile.name} title={profile.title} location={profile.location} resume={profile.resume} touch={coarse} onStart={start} /> : null}
      {dialog ? (
        <DialogBox
          copy={copy}
          speaker={dialog.speaker}
          speakerName={copy.speakers[dialog.speaker]}
          text={dialog.lines[dialog.index]}
          last={dialog.index === dialog.lines.length - 1}
          reducedMotion={reducedMotion}
          onAdvance={() => dispatch({ type: "advance-dialog" })}
          onClose={closeDialog}
          onType={() => sound("text")}
        />
      ) : null}
      {windowView ? (
        <GameWindow title={windowView.title} icon={windowView.icon} wide={windowView.wide} closeLabel={copy.close} onClose={closeWindow}>
          {windowView.body}
        </GameWindow>
      ) : null}
      <Toast message={toastMessage} />
    </div>
  );
}
