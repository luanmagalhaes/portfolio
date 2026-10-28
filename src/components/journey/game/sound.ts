export type SoundKind = "gem" | "flag" | "boss" | "door";

const sequences: Record<SoundKind, number[]> = {
  gem: [988, 1319],
  flag: [523, 659, 784, 1047],
  boss: [392, 330, 262, 196],
  door: [392, 523, 659],
};

let context: AudioContext | null = null;

export function playSound(kind: SoundKind): void {
  try {
    context ??= new AudioContext();
    const start = context.currentTime;
    sequences[kind].forEach((frequency, index) => {
      if (!context) return;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const at = start + index * 0.07;
      oscillator.type = "square";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.05, at + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.09);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(at);
      oscillator.stop(at + 0.1);
    });
  } catch {
    context = null;
  }
}
