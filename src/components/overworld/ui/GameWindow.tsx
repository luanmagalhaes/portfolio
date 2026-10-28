"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { PixelIcon } from "@/components/overworld/ui/PixelIcon";

export function GameWindow({ title, icon, wide, closeLabel, onClose, children }: { title: string; icon: ReactNode; wide: boolean; closeLabel: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();
    const handleClose = (): void => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [title]);
  return (
    <dialog ref={ref} className={`panel px-window${wide ? "" : " panel--narrow"}`} aria-labelledby="ow-window-title" onClick={(event) => event.target === ref.current && ref.current?.close()}>
      <div className="panel__head">
        <h2 className="panel__heading" id="ow-window-title">
          {icon}
          <span>{title}</span>
        </h2>
        <button type="button" ref={closeRef} className="px-btn panel__close" onClick={() => ref.current?.close()}>
          <PixelIcon name="close" />
          <span>{closeLabel}</span>
        </button>
      </div>
      <div className="panel__body" ref={bodyRef}>
        {children}
      </div>
    </dialog>
  );
}
