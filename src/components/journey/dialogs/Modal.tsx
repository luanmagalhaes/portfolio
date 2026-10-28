"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  labelledBy: string;
  closeLabel: string;
  className?: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ labelledBy, closeLabel, className = "", onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      className="jr-dialog"
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={`jr-dlg-box jr-frame-dark ${className}`}>
        <button className="jr-btn jr-btn-small jr-dlg-close" type="button" onClick={onClose} autoFocus>
          {closeLabel}
        </button>
        {children}
      </div>
    </dialog>
  );
}
