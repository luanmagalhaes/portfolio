import type { SoundKind } from "@/components/overworld/engine/engine";

const notes: Record<SoundKind, [number, number][]> = {
  step: [[180, 0.03]],
  bump: [[90, 0.06]],
  door: [[392, 0.06], [523, 0.06], [659, 0.08]],
  select: [[660, 0.05]],
  text: [[520, 0.02]],
  hit: [[140, 0.08], [90, 0.1]],
  win: [[523, 0.08], [659, 0.08], [784, 0.08], [1046, 0.14]],
  open: [[440, 0.05], [660, 0.07]],
};

let audio: AudioContext | null = null;

export function playSound(kind: SoundKind): void {
  try {
    audio = audio ?? new AudioContext();
    let when = audio.currentTime;
    for (const [frequency, duration] of notes[kind]) {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = "square";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.035, when);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(when);
      oscillator.stop(when + duration);
      when += duration;
    }
  } catch {
    audio = null;
  }
}
