"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { Portfolio } from "@/domain/view";
import type { ArcadeCopy } from "@/components/arcade/copy";
import { PixelSprite } from "@/components/arcade/PixelSprite";

type App = Portfolio["apps"][number];

const phoneWidth = 390;
const phoneHeight = 844;
const shortestPhone = 640;
const smallestScale = 0.8;

function fit(dialog: HTMLDialogElement, sizer: HTMLElement, viewport: HTMLElement): void {
  sizer.style.width = `${phoneWidth}px`;
  sizer.style.height = "0px";
  const controls = dialog.querySelector<HTMLElement>(".live-controls")?.offsetHeight ?? 0;
  const device = dialog.querySelector<HTMLElement>(".live-device")?.offsetHeight ?? 0;
  const available = window.innerHeight - controls - device - 48;
  let height = Math.min(phoneHeight, available);
  let scale = 1;

  if (height < shortestPhone) {
    height = shortestPhone;
    scale = Math.max(smallestScale, available / shortestPhone);
  }

  viewport.style.height = `${height}px`;
  viewport.style.transform = scale === 1 ? "none" : `scale(${scale})`;
  sizer.style.width = `${Math.round(phoneWidth * scale)}px`;
  sizer.style.height = `${Math.round(height * scale)}px`;
}

function LiveFrame({ app, copy, sizerRef, viewportRef }: { app: App; copy: ArcadeCopy; sizerRef: RefObject<HTMLDivElement | null>; viewportRef: RefObject<HTMLDivElement | null> }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="live-sizer" ref={sizerRef}>
      <div className="live-viewport" ref={viewportRef}>
        <iframe src={app.liveUrl} title={copy.liveFrameLabel(app.name)} allow="autoplay; microphone; clipboard-write; fullscreen" onLoad={() => setLoaded(true)} />
      </div>
      {loaded ? null : (
        <div className="live-tuning" aria-hidden="true">
          {copy.tuning}
        </div>
      )}
    </div>
  );
}

export function LiveView({ app, copy, onClose }: { app: App | null; copy: ArcadeCopy; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (!app) {
      if (dialog.open) {
        dialog.close();
      }
      return;
    }

    if (!dialog.open) {
      dialog.showModal();
    }

    const sizer = sizerRef.current;
    const viewport = viewportRef.current;

    if (!sizer || !viewport) {
      return;
    }

    const refit = () => fit(dialog, sizer, viewport);
    refit();
    stopRef.current?.focus();
    window.addEventListener("resize", refit);
    return () => window.removeEventListener("resize", refit);
  }, [app]);

  return (
    <dialog
      ref={dialogRef}
      className="live-dialog"
      aria-labelledby="live-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      {app ? (
        <div className="live-shell">
          <div className="live-controls">
            <h2 className="live-title" id="live-title">
              <span className="live-dot" aria-hidden="true" />
              <span>
                {app.name} · {copy.live}
              </span>
            </h2>
            <span className="live-url">{app.liveUrl.replace("https://", "")}</span>
            <a className="pbtn" href={app.liveUrl} target="_blank" rel="noreferrer">
              <span>{copy.openTab}</span>
            </a>
            <button type="button" ref={stopRef} className="pbtn pbtn--primary" onClick={onClose}>
              <PixelSprite id="back" />
              <span>{copy.stop}</span>
            </button>
          </div>
          <div className="live-device">
            <div className="live-screen">
              <LiveFrame key={app.id} app={app} copy={copy} sizerRef={sizerRef} viewportRef={viewportRef} />
            </div>
            <p className="live-brand" aria-hidden="true">
              LM-16
            </p>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
