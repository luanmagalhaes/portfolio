"use client";

import { useEffect, useRef, useState } from "react";
import type { Portfolio } from "@/domain/view";
import type { ArcadeCopy } from "@/components/arcade/copy";
import { EmblemArt } from "@/components/arcade/EmblemArt";
import { PixelSprite } from "@/components/arcade/PixelSprite";

type App = Portfolio["apps"][number];

interface DemoPlayerProps {
  app: App;
  copy: ArcadeCopy;
  reduced: boolean;
  suspended: boolean;
}

export function DemoPlayer({ app, copy, reduced, suspended }: DemoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [choice, setChoice] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const playing = !suspended && (choice ?? !reduced);
  const media = app.demo?.portrait ?? null;

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;

    if (playing) {
      video.play().catch(() => setChoice(false));
    } else {
      video.pause();
    }
  }, [playing]);

  const toggle = () => setChoice(!playing);

  return (
    <div className="demo" data-demo={playing ? "playing" : "paused"} data-kind={media ? "video" : "art"}>
      <figure className="demo-screen">
        {media ? (
          <video
            ref={videoRef}
            className="demo-video"
            muted
            loop
            playsInline
            preload={reduced ? "none" : "auto"}
            poster={media.poster}
            aria-label={copy.demoLabel(app.name)}
            onTimeUpdate={(event) => {
              const { currentTime, duration } = event.currentTarget;
              setProgress(Number.isFinite(duration) && duration > 0 ? (currentTime / duration) * 100 : 0);
            }}
          >
            <source src={media.webm} type="video/webm" />
            <source src={media.mp4} type="video/mp4" />
          </video>
        ) : (
          <EmblemArt name={app.name} emblem={app.emblem} label={copy.emblemLabel(app.name)} />
        )}
        {playing ? null : (
          <button type="button" className="demo-play" data-nav onClick={toggle}>
            <PixelSprite id="play" />
            <span>{copy.playDemo}</span>
          </button>
        )}
        <span className="demo-tag" aria-hidden="true">
          <i />
          {copy.demo}
        </span>
      </figure>
      <div className="demo-bar">
        <button type="button" className="pbtn pbtn--icon" data-nav aria-pressed={playing} aria-label={playing ? copy.pauseDemo : copy.resumeDemo} onClick={toggle}>
          <PixelSprite id={playing ? "pause" : "play"} />
        </button>
        <div className="demo-progress" aria-hidden="true">
          <i style={{ width: `${progress.toFixed(2)}%` }} />
        </div>
      </div>
    </div>
  );
}
