"use client";

import { useEffect, useRef, useState } from "react";
import type { Speaker } from "@/components/overworld/art/scenes";
import type { OverworldCopy } from "@/components/overworld/copy";
import { Portrait } from "@/components/overworld/ui/Portrait";

interface DialogBoxProps {
  copy: OverworldCopy;
  speaker: Speaker;
  speakerName: string;
  text: string;
  last: boolean;
  reducedMotion: boolean;
  onAdvance: () => void;
  onClose: () => void;
  onType: () => void;
}

function useTypewriter(text: string, reducedMotion: boolean, onType: () => void): [string, boolean, () => void] {
  const [progress, setProgress] = useState({ text, shown: reducedMotion ? text.length : 0 });
  const current = progress.text === text ? progress.shown : reducedMotion ? text.length : 0;
  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setProgress((value) => {
        const base = value.text === text ? value.shown : 0;
        const next = Math.min(text.length, base + 3);
        if (next % 9 === 0) onType();
        return { text, shown: next };
      });
    }, 16);
    return () => window.clearInterval(timer);
  }, [text, reducedMotion, onType]);
  const done = current >= text.length;
  return [text.slice(0, current), done, () => setProgress({ text, shown: text.length })];
}

export function DialogBox({ copy, speaker, speakerName, text, last, reducedMotion, onAdvance, onClose, onType }: DialogBoxProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [shown, done, finish] = useTypewriter(text, reducedMotion, onType);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    nextRef.current?.focus();
    const handleClose = (): void => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);
  return (
    <dialog ref={ref} className="dialog-box px-window" aria-labelledby="ow-dialog-name">
      <div className="px-dialog">
        <div className="px-dialog__portrait">
          <Portrait speaker={speaker} />
        </div>
        <div>
          <p className="px-dialog__name" id="ow-dialog-name">
            {speakerName}
          </p>
          <p className="px-dialog__text" aria-hidden="true">
            {shown}
          </p>
          <p className="sr-only" aria-live="polite">
            {text}
          </p>
          <div className="px-dialog__choices">
            <button type="button" className="px-choice dialog-next" ref={nextRef} aria-current="true" onClick={() => (done ? onAdvance() : finish())}>
              {last ? copy.letsGo : copy.continue}
            </button>
            <button type="button" className="px-choice dialog-skip" onClick={() => ref.current?.close()}>
              {copy.skip}
            </button>
          </div>
        </div>
      </div>
      <span className="px-dialog__next" aria-hidden="true" />
    </dialog>
  );
}
