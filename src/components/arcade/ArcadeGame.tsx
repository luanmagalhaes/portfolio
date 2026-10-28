"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import type { Locale } from "@/domain/locale";
import type { Portfolio } from "@/domain/view";
import { pagePath } from "@/lib/routes";
import { ArcadeFooter } from "@/components/arcade/ArcadeFooter";
import { ArcadeHeader } from "@/components/arcade/ArcadeHeader";
import { CartridgeShelf } from "@/components/arcade/CartridgeShelf";
import { ConsoleDeck } from "@/components/arcade/ConsoleDeck";
import { CrtTv } from "@/components/arcade/CrtTv";
import { HandheldPad, type PadButton } from "@/components/arcade/HandheldPad";
import { LiveView } from "@/components/arcade/LiveView";
import { PocketSlot } from "@/components/arcade/PocketSlot";
import { arcadeCopy, type ArcadeCopy } from "@/components/arcade/copy";
import { burstNoise, flyCartridge, moveFocus, pressFocused, shake } from "@/components/arcade/dom";
import { arcadeFontClasses } from "@/components/arcade/fonts";
import { useBrazilClock } from "@/components/arcade/hooks/useBrazilClock";
import { handheldQuery, reducedMotionQuery, useMediaQuery } from "@/components/arcade/hooks/useMediaQuery";
import { useSound } from "@/components/arcade/hooks/useSound";
import { arcadeReducer, channels, hashFor, initialArcadeState, stateFromHash, type MenuTarget } from "@/components/arcade/navigation";
import { BootScreen } from "@/components/arcade/screens/BootScreen";
import { BossFightScreen } from "@/components/arcade/screens/BossFightScreen";
import { BossRushScreen } from "@/components/arcade/screens/BossRushScreen";
import { CartridgeDetail } from "@/components/arcade/screens/CartridgeDetail";
import { CartridgesScreen, type PreviewTarget } from "@/components/arcade/screens/CartridgesScreen";
import { CharacterSelectScreen } from "@/components/arcade/screens/CharacterSelectScreen";
import { ContinueScreen } from "@/components/arcade/screens/ContinueScreen";
import { HighScoresScreen } from "@/components/arcade/screens/HighScoresScreen";
import { LockedScreen } from "@/components/arcade/screens/LockedScreen";
import { MenuScreen } from "@/components/arcade/screens/MenuScreen";
import { StartScreen } from "@/components/arcade/screens/StartScreen";
import { defaultTheme, themeFor } from "@/components/arcade/themes";
import "@/components/arcade/arcade.css";

function readoutFor(target: PreviewTarget | null, apps: Portfolio["apps"], privateApps: Portfolio["privateApps"], copy: ArcadeCopy): string {
  if (!target) {
    return copy.shelfIdle;
  }

  if (target.locked) {
    const item = privateApps.find((app) => app.id === target.id);
    return item ? `${item.name.toUpperCase()} · ${copy.privateBuild} · ${item.pitch}` : copy.shelfIdle;
  }

  const app = apps.find((item) => item.id === target.id);
  return app ? `${app.name.toUpperCase()} · ${copy.days(app.daysToBuild)} · ${app.pitch}` : copy.shelfIdle;
}

export function ArcadeGame({ portfolio, locale }: { portfolio: Portfolio; locale: Locale }) {
  const copy = arcadeCopy[locale];
  const router = useRouter();
  const [state, dispatch] = useReducer(arcadeReducer, initialArcadeState);
  const [preview, setPreview] = useState<PreviewTarget | null>(null);
  const [liveId, setLiveId] = useState<string | null>(null);
  const reduced = useMediaQuery(reducedMotionQuery);
  const handheld = useMediaQuery(handheldQuery);
  const clock = useBrazilClock();
  const sound = useSound();
  const screenRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLCanvasElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const pocketRef = useRef<HTMLDivElement>(null);
  const liveTrigger = useRef<HTMLElement | null>(null);
  const firstScreen = useRef(true);
  const hashReady = useRef(false);

  const { apps, privateApps, cases, jobs, milestones, profile } = portfolio;
  const cartOrder = useMemo(() => apps.map((app) => app.id), [apps]);
  const bossOrder = useMemo(() => cases.map((item) => item.id), [cases]);
  const known = useMemo(() => ({ carts: cartOrder, locked: privateApps.map((app) => app.id), bosses: bossOrder }), [cartOrder, privateApps, bossOrder]);
  const inserted = apps.find((app) => app.id === state.cartId) ?? null;
  const liveApp = apps.find((app) => app.id === liveId) ?? null;
  const quickHref = pagePath("quick", locale);
  const progress = { played: state.played.length, playable: apps.length, cleared: state.cleared.length, bosses: cases.length };
  const glow = inserted ? themeFor(inserted.id).glow : defaultTheme.glow;
  const screenKey = `${state.screen}:${state.cartId ?? ""}:${state.bossId ?? ""}:${state.lockedId ?? ""}`;
  const hash = hashFor(state);

  const shown = preview ?? (inserted ? { id: inserted.id, locked: false } : null);
  const readout = readoutFor(shown, apps, privateApps, copy);

  const finishBoot = useCallback(() => dispatch({ type: "bootDone" }), []);

  const start = () => {
    sound.play("boot");
    dispatch(reduced ? { type: "open", screen: "menu" } : { type: "start" });
  };

  const closeLive = () => {
    const trigger = liveTrigger.current;
    setLiveId(null);
    window.requestAnimationFrame(() => trigger?.focus());
  };

  const back = () => {
    if (liveId) {
      closeLive();
      return;
    }
    sound.play("back");
    dispatch({ type: "back" });
  };

  const open = (target: MenuTarget) => {
    sound.play("select");
    dispatch({ type: "open", screen: target });
  };

  const insert = async (id: string, source: HTMLElement | null) => {
    setPreview({ id, locked: false });

    if (state.cartId === id) {
      dispatch({ type: "insert", cartId: id });
      return;
    }

    if (source && !reduced) {
      await flyCartridge(source, handheld ? pocketRef.current : slotRef.current, handheld ? 46 : 64);
    }

    sound.play("insert");
    dispatch({ type: "insert", cartId: id });
  };

  const openLocked = (id: string, source: HTMLElement | null) => {
    if (source && !reduced) {
      shake(source);
    }
    sound.play("locked");
    setPreview({ id, locked: true });
    dispatch({ type: "openLocked", id });
  };

  const eject = () => {
    setLiveId(null);
    sound.play("back");
    dispatch({ type: "eject" });
  };

  const playLive = (event: MouseEvent<HTMLAnchorElement>) => {
    if (handheld || !inserted || !inserted.embedLive) {
      return;
    }
    event.preventDefault();
    liveTrigger.current = event.currentTarget;
    sound.play("select");
    setLiveId(inserted.id);
  };

  const press = (button: PadButton) => {
    const screen = screenRef.current;

    if (button === "up" || button === "left") {
      moveFocus(screen, -1);
    } else if (button === "down" || button === "right") {
      moveFocus(screen, 1);
    } else if (button === "b") {
      back();
    } else if (button === "select") {
      router.push(quickHref);
    } else if (state.power === "off") {
      dispatch({ type: "power" });
    } else if (state.screen === "title") {
      start();
    } else if (state.screen === "boot") {
      finishBoot();
    } else if (button === "start") {
      dispatch({ type: "open", screen: "menu" });
    } else {
      pressFocused(screen);
    }
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || liveId) {
        return;
      }

      const target = event.target as HTMLElement;

      if (target.closest("input, textarea, select")) {
        return;
      }

      if (state.screen === "boot") {
        event.preventDefault();
        finishBoot();
        return;
      }

      const shelf = target.closest<HTMLElement>(".shelf");
      const root = shelf ?? screenRef.current;

      switch (event.key) {
        case "q":
        case "Q":
          event.preventDefault();
          router.push(quickHref);
          break;
        case "Escape":
          event.preventDefault();
          back();
          break;
        case "ArrowUp":
        case "ArrowLeft":
          event.preventDefault();
          moveFocus(root, -1);
          break;
        case "ArrowDown":
        case "ArrowRight":
          event.preventDefault();
          moveFocus(root, 1);
          break;
        case "Enter":
          if (target === document.body && state.screen === "title") {
            event.preventDefault();
            start();
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (firstScreen.current) {
      firstScreen.current = false;
      return;
    }

    if (!reduced && noiseRef.current) {
      burstNoise(noiseRef.current, screenRef.current);
    }

    screenRef.current?.querySelector<HTMLElement>(".screen-title")?.focus({ preventScroll: true });
  }, [screenKey, reduced]);

  useEffect(() => {
    const restored = stateFromHash(window.location.hash, known);
    let frame = 0;

    if (restored) {
      frame = window.requestAnimationFrame(() => {
        hashReady.current = true;
        dispatch({ type: "restore", state: restored });
      });
    } else {
      hashReady.current = true;
    }

    const onHash = () => {
      const next = stateFromHash(window.location.hash, known);
      if (next) {
        dispatch({ type: "restore", state: next });
      }
    };

    window.addEventListener("hashchange", onHash);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHash);
    };
  }, [known]);

  useEffect(() => {
    if (hashReady.current && window.location.hash !== hash) {
      window.history.replaceState(null, "", hash || `${window.location.pathname}${window.location.search}`);
    }
  }, [hash]);

  const renderScreen = () => {
    switch (state.screen) {
      case "title":
        return <StartScreen copy={copy} name={profile.name} role={profile.title} quickHref={quickHref} onStart={start} />;
      case "boot":
        return <BootScreen copy={copy} facts={{ apps: apps.length, privateApps: privateApps.length, cases: cases.length, player: profile.name }} onDone={finishBoot} />;
      case "menu":
        return <MenuScreen copy={copy} name={profile.name} role={profile.title} location={profile.location} progress={progress} onOpen={open} />;
      case "scores":
        return <HighScoresScreen copy={copy} jobs={jobs} milestones={milestones} selectedId={state.scoreId} progress={progress} onBack={back} onSelect={(id) => dispatch({ type: "selectScore", id })} />;
      case "character":
        return <CharacterSelectScreen copy={copy} portfolio={portfolio} slot={state.slot} tab={state.tab} progress={progress} onBack={back} onSlot={(slot) => dispatch({ type: "selectSlot", slot })} onTab={(tab) => dispatch({ type: "selectTab", tab })} />;
      case "continue":
        return <ContinueScreen copy={copy} profile={profile} reduced={reduced} progress={progress} onBack={back} />;
      default:
        break;
    }

    const bossCase = cases.find((item) => item.id === state.bossId);

    if (state.screen === "boss" && bossCase) {
      return (
        <BossFightScreen
          copy={copy}
          item={bossCase}
          round={state.round}
          progress={progress}
          onBack={back}
          onRound={(round, total) => {
            sound.play("hit");
            dispatch({ type: "setRound", round, total });
          }}
          onNextBoss={() => dispatch({ type: "nextBoss", order: bossOrder })}
        />
      );
    }

    if (state.screen === "bosses" || state.screen === "boss") {
      return <BossRushScreen copy={copy} cases={cases} cleared={state.cleared} progress={progress} onBack={back} onOpen={(id) => dispatch({ type: "openBoss", id })} />;
    }

    const lockedItem = privateApps.find((app) => app.id === state.lockedId);

    if (state.screen === "locked" && lockedItem) {
      return <LockedScreen copy={copy} item={lockedItem} progress={progress} onBack={back} />;
    }

    if (state.screen === "cart" && inserted) {
      return (
        <CartridgeDetail
          copy={copy}
          app={inserted}
          position={cartOrder.indexOf(inserted.id) + 1}
          total={apps.length}
          stack={portfolio.appStack}
          handheld={handheld}
          reduced={reduced}
          liveOpen={Boolean(liveId)}
          onBack={back}
          onStep={(delta) => {
            sound.play("move");
            dispatch({ type: "step", delta, order: cartOrder });
          }}
          onEject={eject}
          onPlayLive={playLive}
        />
      );
    }

    return (
      <CartridgesScreen
        copy={copy}
        apps={apps}
        privateApps={privateApps}
        preview={preview ?? { id: cartOrder[0], locked: false }}
        reduced={reduced}
        progress={progress}
        onBack={back}
        onPreview={(id, locked) => setPreview({ id, locked })}
        onInsert={insert}
        onLocked={openLocked}
      />
    );
  };

  return (
    <div className={`arcade ${arcadeFontClasses}`} data-power={state.power} data-cart={state.cartId ?? undefined} style={{ "--glow": glow } as CSSProperties}>
      <Link className="skip-link" href={quickHref}>
        {copy.skipToQuickView}
      </Link>
      <svg className="arcade-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <filter id="arcade-origin" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0.055 0.11 0.2 0.36 0.66 0.97" />
            <feFuncG type="discrete" tableValues="0.043 0.25 0.45 0.57 0.82 0.95" />
            <feFuncB type="discrete" tableValues="0.086 0.3 0.4 0.51 0.74 0.9" />
          </feComponentTransfer>
        </filter>
      </svg>
      <PocketSlot inserted={inserted} slotRef={pocketRef} onOpenCart={() => dispatch({ type: "insert", cartId: inserted?.id ?? cartOrder[0] })} />
      <ArcadeHeader copy={copy} locale={locale} name={profile.name} role={profile.title} location={profile.location} resume={profile.resume} soundOn={sound.enabled} onToggleSound={sound.toggle} />
      <main className="stage" id="arcade-game">
        <div className="tv-unit" id="arcade-tv">
          <CrtTv channel={liveId ? "09" : channels[state.screen]} clock={clock} clockLabel={copy.clockLabel} screenRef={screenRef} noiseRef={noiseRef}>
            {state.power === "on" ? renderScreen() : null}
          </CrtTv>
          <ConsoleDeck
            copy={copy}
            inserted={inserted}
            slotRef={slotRef}
            onPower={() => dispatch({ type: "power" })}
            onReset={() => dispatch({ type: "reset" })}
            onEject={eject}
            onOpenCart={() => inserted && dispatch({ type: "insert", cartId: inserted.id })}
          />
        </div>
        <CartridgeShelf copy={copy} apps={apps} privateApps={privateApps} insertedId={state.cartId} readout={readout} quickHref={quickHref} onInsert={insert} onLocked={openLocked} onPreview={(id, locked) => setPreview({ id, locked })} />
      </main>
      <HandheldPad copy={copy} onPress={press} />
      <ArcadeFooter copy={copy} />
      <p className="sr-only" aria-live="polite">
        {copy.screenNames[state.screen]}
      </p>
      <LiveView app={liveApp} copy={copy} onClose={closeLive} />
    </div>
  );
}
