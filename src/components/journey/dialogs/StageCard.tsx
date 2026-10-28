"use client";

import { useRef, useState } from "react";
import { DemoVideo } from "@/components/media/DemoVideo";
import { daysLabel, type JourneyCopy } from "@/components/journey/copy";
import { emblemPath, letterWheelPath } from "@/components/journey/model/assets";
import type { App } from "@/components/journey/game/types";
import { Sprite } from "@/components/journey/nodes/Sprite";

interface StageCardProps {
  apps: App[];
  appId: string;
  appStack: string[];
  live: boolean;
  portrait: boolean;
  inlineLive: boolean;
  reduced: boolean;
  copy: JourneyCopy;
  onOpen: (appId: string) => void;
  onLive: () => void;
  onBack: () => void;
}

export function StageCard({ apps, appId, appStack, live, portrait, inlineLive, reduced, copy, onOpen, onLive, onBack }: StageCardProps) {
  const index = Math.max(0, apps.findIndex((item) => item.id === appId));
  const app = apps[index];
  const previous = apps[(index + apps.length - 1) % apps.length];
  const next = apps[(index + 1) % apps.length];
  const screen = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(reduced);
  const [loading, setLoading] = useState(true);
  const canFrame = inlineLive && app.embedLive;
  const host = new URL(app.liveUrl).host;

  const toggleVideo = () => {
    const video = screen.current?.querySelector("video");
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => undefined);
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  };

  return (
    <>
      <p className="jr-dlg-kicker">
        <Sprite className="jr-kicker-ico" src={emblemPath(app.emblem)} width={32} height={32} />
        {copy.bonus} {index + 1}/{apps.length}
      </p>
      <h2 className="jr-dlg-title" id="jr-app-title">
        {app.name}
      </h2>
      <p className="jr-dlg-lead">{app.pitch}</p>
      <div className="jr-stage-card">
        <figure className={`jr-screen${portrait || live ? " jr-is-portrait" : ""}${live ? " jr-is-live" : ""}${paused ? " jr-is-paused" : ""}`}>
          <div className="jr-screen-glass" ref={screen}>
            {live ? (
              <>
                <iframe src={app.liveUrl} title={`${app.name}, ${copy.liveApp}`} allow="autoplay; fullscreen" referrerPolicy="no-referrer" onLoad={() => setLoading(false)} />
                {loading ? <div className="jr-screen-loading">{copy.loadingLive}</div> : null}
              </>
            ) : app.demo ? (
              <DemoVideo key={`${app.id}-${portrait ? "p" : "l"}`} media={portrait ? app.demo.portrait : app.demo.landscape} label={`${copy.demoLoop}: ${app.name}`} />
            ) : (
              <Sprite className="jr-wheel-poster" src={letterWheelPath} width={128} height={64} alt={copy.wheelNote} />
            )}
          </div>
          <figcaption className="jr-screen-bar">
            <span className="jr-screen-led" aria-hidden="true" />
            <span className="jr-grow">{live ? `${copy.liveApp} · ${host}` : app.demo ? (paused && reduced ? copy.posterOnly : copy.demoLoop) : copy.wheelNote}</span>
            {app.demo && !live ? (
              <button className="jr-btn jr-btn-small" type="button" onClick={toggleVideo} aria-pressed={!paused}>
                {paused ? copy.playVideo : copy.pauseVideo}
              </button>
            ) : null}
          </figcaption>
        </figure>
        <div className="jr-stage-info">
          <div className="jr-stat-row">
            <div className="jr-stat-chip">
              <b>{app.daysToBuild}</b>
              <span>{daysLabel(copy, app.daysToBuild)}</span>
            </div>
          </div>
          <p className="jr-stage-note">{copy.soloNote}</p>
          <ul className="jr-chips" aria-label={copy.stack}>
            {appStack.map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
          <div className="jr-stage-actions">
            {live ? (
              <>
                <button className="jr-btn jr-btn-primary" type="button" onClick={onBack}>
                  {copy.backToVideo}
                </button>
                <a className="jr-btn" href={app.liveUrl} target="_blank" rel="noreferrer">
                  {copy.openTab}
                </a>
              </>
            ) : canFrame ? (
              <button className="jr-btn jr-btn-primary" type="button" onClick={onLive}>
                {copy.playLive}
              </button>
            ) : (
              <a className="jr-btn jr-btn-primary" href={app.liveUrl} target="_blank" rel="noreferrer">
                {copy.playLive}
                <span className="jr-sr-only"> ({copy.openTab})</span>
              </a>
            )}
            {app.codeUrl ? (
              <a className="jr-btn" href={app.codeUrl} target="_blank" rel="noreferrer">
                {copy.code}
              </a>
            ) : (
              <span className="jr-note-private">{copy.privateRepo}</span>
            )}
          </div>
          <p className="jr-stage-url">
            <a href={app.liveUrl} target="_blank" rel="noreferrer">
              {host}
            </a>
          </p>
        </div>
      </div>
      <nav className="jr-stage-nav" aria-label={copy.bonus}>
        <button className="jr-btn jr-btn-small" type="button" onClick={() => onOpen(previous.id)}>
          <span aria-hidden="true">&lt; </span>
          {previous.name}
        </button>
        <button className="jr-btn jr-btn-small" type="button" onClick={() => onOpen(next.id)}>
          {next.name}
          <span aria-hidden="true"> &gt;</span>
        </button>
      </nav>
    </>
  );
}
