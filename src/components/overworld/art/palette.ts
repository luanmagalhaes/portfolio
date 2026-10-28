export const paletteChars = {
  K: "ink",
  N: "night",
  M: "plum",
  P: "purple",
  V: "violet",
  L: "lavender",
  S: "slate",
  G: "grey",
  I: "silver",
  W: "cream",
  n: "navy",
  b: "blue",
  s: "sky",
  i: "ice",
  t: "teal",
  a: "aqua",
  p: "pine",
  l: "leaf",
  g: "green",
  m: "lime",
  c: "cocoa",
  u: "umber",
  C: "clay",
  T: "tan",
  h: "peach",
  d: "sand",
  Y: "yellow",
  A: "amber",
  B: "brick",
  X: "crimson",
  R: "red",
  r: "pink",
} as const;

export type PaletteChar = keyof typeof paletteChars;

export type PaletteName = (typeof paletteChars)[PaletteChar];

export type Rgb = readonly [number, number, number];

export interface Colors {
  px: Record<string, string>;
  tok(name: string): string;
  rgbTok(name: string): Rgb;
}

function hexToRgb(hex: string): Rgb {
  const value = hex.replace("#", "").trim();
  const full = value.length === 3 ? value.split("").map((char) => char + char).join("") : value;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

export function readColors(root: Element): Colors {
  const css = getComputedStyle(root);
  const cache = new Map<string, string>();
  const rgbCache = new Map<string, Rgb>();
  const tok = (name: string): string => {
    const cached = cache.get(name);
    if (cached) return cached;
    const value = css.getPropertyValue("--" + name).trim() || "#ff00ff";
    cache.set(name, value);
    return value;
  };
  const px: Record<string, string> = {};
  for (const [char, name] of Object.entries(paletteChars)) px[char] = css.getPropertyValue("--px-" + name).trim();
  return {
    px,
    tok,
    rgbTok: (name: string): Rgb => {
      const cached = rgbCache.get(name);
      if (cached) return cached;
      const value = hexToRgb(tok(name));
      rgbCache.set(name, value);
      return value;
    },
  };
}

export function paletteSignature(root: Element): string {
  const css = getComputedStyle(root);
  return Object.values(paletteChars).map((name) => css.getPropertyValue("--px-" + name).trim()).join("") + css.getPropertyValue("--world-sea").trim();
}
