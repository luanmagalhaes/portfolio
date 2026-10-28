"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { OverworldCopy } from "@/components/overworld/copy";
import { emblemSrc } from "@/components/overworld/model/routing";
import { Greeting } from "@/components/overworld/ui/Greeting";
import { PixelIcon } from "@/components/overworld/ui/PixelIcon";
import { Chips } from "@/components/overworld/windows/shared";
import type { MediaSet } from "@/domain/portfolio";
import type { Portfolio } from "@/domain/view";

type App = Portfolio["apps"][number];

interface MachineProps {
  apps: Portfolio["apps"];
  appStack: readonly string[];
  index: number;
  live: boolean;
  copy: OverworldCopy;
  phone: boolean;
  canFrame: boolean;
  reducedMotion: boolean;
  onStep: (delta: number) => void;
  onLive: (live: boolean) => void;
}

function DemoVideoPlayer({ media, label, playing, className }: { media: MediaSet; label: string; playing: boolean; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    if (playing) void video.play().catch(() => undefined);
    else video.pause();
  }, [playing, media]);
  return (
    <video ref={ref} className={className} poster={media.poster} muted loop playsInline preload="metadata" aria-label={label}>
      <source src={media.webm} type="video/webm" />
      <source src={media.mp4} type="video/mp4" />
    </video>
  );
}

function DemoScreen({ app, copy, phone, playing }: { app: App; copy: OverworldCopy; phone: boolean; playing: boolean }) {
  if (!app.demo) {
    return (
      <div className="demo-emblem">
        <Image src={emblemSrc(app.emblem)} alt={app.name} width={128} height={128} unoptimized />
      </div>
    );
  }
  if (phone) return <DemoVideoPlayer media={app.demo.portrait} label={copy.demoLabel(app.name)} playing={playing} className="demo-poster" />;
  return (
    <>
      <DemoVideoPlayer media={app.demo.landscape} label={copy.demoLabel(app.name)} playing={playing} className="demo-poster" />
      <div className="demo-phone">
        <DemoVideoPlayer media={app.demo.portrait} label={copy.demoLabel(app.name)} playing={playing} className="demo-phone__video" />
      </div>
    </>
  );
}

function LiveScreen({ app, copy }: { app: App; copy: OverworldCopy }) {
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div className="live-phone">
      <iframe ref={ref} className="live-frame" src={app.liveUrl} title={copy.liveTitle(app.name)} allow="autoplay; microphone; fullscreen; clipboard-write" />
    </div>
  );
}

export function MachineWindow({ apps, appStack, index, live, copy, phone, canFrame, reducedMotion, onStep, onLive }: MachineProps) {
  const app = apps[index];
  const [paused, setPaused] = useState(false);
  const [started, setStarted] = useState(false);
  const playing = reducedMotion ? started : !paused;
  return (
    <>
      <Greeting speaker="attendant" name={copy.speakers.attendant} text={copy.greetings.arcade(apps.length)} />
      <div className={`machine${live ? " machine--live" : ""}`}>
        <div className="machine__demo">
          {live ? (
            <LiveScreen app={app} copy={copy} />
          ) : (
            <div className="crt">
              <div className={`crt__screen${phone ? " crt__screen--portrait" : ""}${app.demo ? "" : " crt__screen--emblem"}`}>
                <DemoScreen app={app} copy={copy} phone={phone} playing={playing} />
              </div>
              <span className="crt__label">{copy.demoLoop}</span>
            </div>
          )}
          <div className="actions machine__actions">
            {live ? (
              <>
                <button type="button" className="px-btn px-btn--dark" onClick={() => onLive(false)}>
                  <PixelIcon name="play" />
                  {copy.backToDemo}
                </button>
                <a className="px-btn px-btn--primary" href={app.liveUrl} target="_blank" rel="noreferrer">
                  <PixelIcon name="external" />
                  {copy.openTab}
                </a>
              </>
            ) : (
              <>
                {app.demo ? (
                  <button type="button" className="px-btn px-btn--dark" aria-pressed={playing} onClick={() => (reducedMotion ? setStarted((value) => !value) : setPaused((value) => !value))}>
                    <PixelIcon name={playing ? "pause" : "play"} />
                    {playing ? copy.pauseDemo : copy.playDemo}
                  </button>
                ) : null}
                <a
                  className="px-btn px-btn--primary"
                  href={app.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={copy.playLiveLabel(app.name)}
                  onClick={(event) => {
                    if (!canFrame || !app.embedLive) return;
                    event.preventDefault();
                    onLive(true);
                  }}
                >
                  <PixelIcon name="play" />
                  {copy.playLive}
                </a>
                {app.codeUrl ? (
                  <a className="px-btn" href={app.codeUrl} target="_blank" rel="noreferrer" aria-label={copy.sourceCodeLabel(app.name)}>
                    <PixelIcon name="code" />
                    {copy.sourceCode}
                  </a>
                ) : (
                  <span className="px-btn" aria-disabled="true">
                    <PixelIcon name="lock" />
                    {copy.privateRepo}
                  </span>
                )}
              </>
            )}
          </div>
          {!live && !app.demo ? <p className="note">{copy.noDemo}</p> : null}
          {!live && app.demo && reducedMotion ? <p className="note">{copy.reducedNote}</p> : null}
        </div>
        <div className="machine__info">
          <h3 className="machine__name">{app.name}</h3>
          <div className="stat">
            <span className="stat__value">{app.daysToBuild}</span>
            <span className="stat__label">
              {copy.daysToBuild(app.daysToBuild)}
              <br />
              {copy.builtSolo}
            </span>
          </div>
          <p className="lead">{app.pitch}</p>
          <p className="note note--label">{copy.appStack}</p>
          <Chips items={appStack} />
          <div className="machine-nav">
            <button type="button" className="px-btn px-btn--dark" onClick={() => onStep(-1)}>
              {copy.prevMachine}
            </button>
            <button type="button" className="px-btn px-btn--dark" onClick={() => onStep(1)}>
              {copy.nextMachine}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
