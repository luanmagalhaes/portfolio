import { useCallback, useRef, useState } from "react";

export type SoundEffect = "move" | "select" | "back" | "insert" | "boot" | "hit" | "locked";

const notes: Record<SoundEffect, [number, number, number][]> = {
  move: [[660, 0.04, 0]],
  select: [[523, 0.06, 0], [784, 0.08, 0.06]],
  back: [[523, 0.05, 0], [392, 0.07, 0.05]],
  insert: [[196, 0.05, 0], [392, 0.06, 0.07], [587, 0.1, 0.14]],
  boot: [[262, 0.08, 0], [330, 0.08, 0.08], [392, 0.08, 0.16], [523, 0.08, 0.24]],
  hit: [[150, 0.08, 0], [110, 0.12, 0.06]],
  locked: [[140, 0.08, 0], [140, 0.08, 0.12]],
};

export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const context = useRef<AudioContext | null>(null);

  const play = useCallback(
    (effect: SoundEffect) => {
      if (!enabled) {
        return;
      }

      context.current = context.current ?? new AudioContext();
      const audio = context.current;

      for (const [frequency, duration, delay] of notes[effect]) {
        const start = audio.currentTime + delay;
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.035, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        oscillator.connect(gain).connect(audio.destination);
        oscillator.start(start);
        oscillator.stop(start + duration + 0.02);
      }
    },
    [enabled],
  );

  const toggle = useCallback(() => setEnabled((value) => !value), []);

  return { enabled, toggle, play };
}
