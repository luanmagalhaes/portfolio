export const palette: Record<string, string> = {
  K: "#0e0b16",
  N: "#1d1730",
  M: "#33264f",
  P: "#563a8f",
  V: "#8452d6",
  L: "#b9a0f5",
  S: "#4d4a66",
  G: "#8b88a3",
  I: "#c8c4d8",
  W: "#f7f2e6",
  n: "#1b2f5e",
  b: "#2d62c0",
  s: "#48a8f0",
  i: "#a8e8ff",
  t: "#5b9282",
  a: "#4fe0c6",
  p: "#143f33",
  l: "#23804a",
  g: "#3ec45a",
  m: "#a8ec6c",
  c: "#2b1913",
  u: "#573222",
  C: "#8f5135",
  T: "#c27e52",
  h: "#e0a066",
  d: "#f3d59a",
  Y: "#ffd23a",
  A: "#f0962e",
  B: "#cf4b2e",
  X: "#8f2346",
  R: "#ec3a52",
  r: "#ff7cbc",
};

export interface PixelRun {
  x: number;
  y: number;
  width: number;
  fill: string;
}

export function pixelRuns(rows: readonly string[], colors: Record<string, string> = palette, offsetX = 0, offsetY = 0): PixelRun[] {
  const runs: PixelRun[] = [];

  rows.forEach((row, y) => {
    let x = 0;

    while (x < row.length) {
      const char = row[x];
      const fill = colors[char];

      if (!fill) {
        x += 1;
        continue;
      }

      let end = x + 1;

      while (end < row.length && row[end] === char) {
        end += 1;
      }

      runs.push({ x: x + offsetX, y: y + offsetY, width: end - x, fill });
      x = end;
    }
  });

  return runs;
}

const repeat = (text: string, count: number) => text.repeat(count);

export const cartridgeRows: readonly string[] = [
  "..." + repeat("K", 12) + repeat(".", 10) + repeat("K", 12) + "...",
  "..K" + repeat("4", 11) + "K" + repeat(".", 10) + "K" + repeat("4", 11) + "K..",
  ".K" + repeat("4", 13) + "K" + repeat(".", 8) + "K" + repeat("4", 13) + "K.",
  "K4" + repeat("3", 14) + repeat("K", 8) + repeat("3", 14) + "5K",
  "K4" + repeat("3", 36) + "5K",
  "K4" + repeat("3", 11) + repeat("K", 14) + repeat("3", 11) + "5K",
  "K4" + repeat("3", 36) + "5K",
  "K4" + repeat("3", 11) + repeat("K", 14) + repeat("3", 11) + "5K",
  "K4" + repeat("3", 36) + "5K",
  "K4333" + repeat("7", 30) + "3335K",
  ...Array.from({ length: 19 }, () => "K43337" + repeat("1", 28) + "73335K"),
  "K43337" + repeat("2", 28) + "73335K",
  ".K3337" + repeat("2", 28) + "7333K.",
  ".K3337" + repeat("2", 28) + "7333K.",
  ".K3337" + repeat("1", 28) + "7333K.",
  ".K3337" + repeat("1", 28) + "7333K.",
  ".K333" + repeat("7", 30) + "333K.",
  ".K" + repeat("3", 36) + "K.",
  "K4" + repeat("3", 31) + "66" + "333" + "5K",
  "K4" + repeat("3", 36) + "5K",
  "K4" + repeat("3", 36) + "5K",
  "K4" + repeat("3", 36) + "5K",
  "K4" + repeat("3", 36) + "5K",
  "K" + repeat("5", 38) + "K",
  ".K" + repeat("5", 36) + "K.",
  "..K" + repeat("5", 34) + "K..",
  "..." + repeat("K", 34) + "...",
  "....." + "K" + repeat("YN", 14) + "K" + ".....",
  "....." + "K" + repeat("YN", 14) + "K" + ".....",
  "....." + repeat("K", 30) + ".....",
];

export const spriteIds = [
  "cursor",
  "back",
  "next",
  "left",
  "right",
  "up",
  "down",
  "play",
  "pause",
  "eject",
  "code",
  "mail",
  "card",
  "doc",
  "soundOn",
  "soundOff",
  "miniCart",
  "sword",
  "lock",
  "knob",
  "manual",
  "clock",
  "inbox",
  "golem",
  "thief",
  "ghost",
  "keys",
] as const;

export type SpriteId = (typeof spriteIds)[number];

export const sprites: Record<SpriteId, readonly string[]> = {
  cursor: ["K......", "KKK....", "KYYKK..", "KYYYYK.", "KYYKK..", "KKK....", "K......"],
  back: ["...K...", "..KWK..", ".KWWKKK", "KWWWWWK", ".KWWKKK", "..KWK..", "...K..."],
  next: ["...K...", "..KWK..", "KKKWWK.", "KWWWWWK", "KKKWWK.", "..KWK..", "...K..."],
  left: ["...W...", "..WW...", ".WWWWWW", "WWWWWWW", ".WWWWWW", "..WW...", "...W..."],
  right: ["...W...", "...WW..", "WWWWWW.", "WWWWWWW", "WWWWWW.", "...WW..", "...W..."],
  up: ["...W...", "..WWW..", ".WWWWW.", "WWWWWWW", "..WWW..", "..WWW..", "..WWW.."],
  down: ["..WWW..", "..WWW..", "..WWW..", "WWWWWWW", ".WWWWW.", "..WWW..", "...W..."],
  play: ["KK.....", "KWKK...", "KWWWKK.", "KWWWWWK", "KWWWKK.", "KWKK...", "KK....."],
  pause: ["KKK.KKK", "KWK.KWK", "KWK.KWK", "KWK.KWK", "KWK.KWK", "KWK.KWK", "KKK.KKK"],
  eject: ["...K...", "..KWK..", ".KWWWK.", "KWWWWWK", "KKKKKKK", "KWWWWWK", "KKKKKKK"],
  code: ["...W..WW...", "..W...W.W..", ".W...W...W.", "W....W....W", ".W...W...W.", "..W.W...W..", "...WW..W..."],
  mail: ["KKKKKKKKKKK", "KWKWWWWWKWK", "KWWKWWWKWWK", "KWWWKWKWWWK", "KWWWWKWWWWK", "KWWWWWWWWWK", "KWWWWWWWWWK", "KKKKKKKKKKK"],
  card: ["KKKKKKKKKKK", "KWWWWWWWWWK", "KWKKKWGGGWK", "KWKLKWWWWWK", "KWKKKWGGGWK", "KWVVVWWWWWK", "KWWWWWGGWWK", "KKKKKKKKKKK"],
  doc: ["KKKKKK...", "KWWWWKK..", "KWGGWKIK.", "KWWWWKKKK", "KWGGGGGWK", "KWWWYWWWK", "KWWWYWWWK", "KWYYYYYWK", "KWWYYYWWK", "KWWWYWWWK", "KKKKKKKKK"],
  soundOn: ["....W.....", "...WW..W..", "WWWWW...W.", "WWWWW.W.W.", "WWWWW.W.W.", "WWWWW...W.", "...WW..W..", "....W....."],
  soundOff: ["....W.....", "...WW.....", "WWWWW.R..R", "WWWWW..RR.", "WWWWW..RR.", "WWWWW.R..R", "...WW.....", "....W....."],
  miniCart: [".KKKKKK.", "KGGKKGGK", "KGGGGGGK", "KGYYYYGK", "KGYYYYGK", "KGYYYYGK", "KGGGGGGK", ".KKKKKK.", "..KYYK.."],
  sword: ["......KK", ".....KIK", "....KIK.", "K..KIK..", "KKKIK...", ".KYK....", "KYKK....", "KK......"],
  lock: ["....KKKK....", "...KIIIIK...", "..KIKKKKIK..", "..KIK..KIK..", "..KIK..KIK..", ".KKKKKKKKKK.", ".KYYYYYYYYK.", ".KYYYKKYYYK.", ".KYYYKKYYYK.", ".KYYYYKYYYK.", ".KAYYYKYYAK.", ".KAAAAAAAAK.", ".KKKKKKKKKK.", "............"],
  knob: ["..KKKKK..", ".KGGGGGK.", "KGIIGGGSK", "KGIGGGGSK", "KGGGKGGSK", "KGGGKGGSK", "KGGGGGSSK", ".KSSSSSK.", "..KKKKK.."],
  manual: ["KKKKKKKKKKKKK...", "KVVVVVVVVVVVKK..", "KVLLLLLLLLLVKWK.", "KVLVVVVVVVLVKWK.", "KVLVYYYYYVLVKWK.", "KVLVVVVVVVLVKWK.", "KVLLLLLLLLLVKWK.", "KVVVVVVVVVVVKWK.", "KVVVSSSSSVVVKWK.", "KVVSGGGGGSVVKWK.", "KVVSGYYYGSVVKWK.", "KVVSGYYYGSVVKWK.", "KVVSGGGGGSVVKWK.", "KVVVSSSSSVVVKWK.", "KVVVVVVVVVVVKWK.", "KVVVYYYYYVVVKWK.", "KVVVVVVVVVVVKWK.", "KKKKKKKKKKKKKWK.", ".KWWWWWWWWWWWWK.", "..KKKKKKKKKKKKK."],
  clock: ["...KKKK..........KKKK...", "..KYYYYK...KK...KYYYYK..", "..KYYYYAK..KK..KAYYYYK..", ".KKKKKKKKK.KK.KKKKKKKKK.", "........KKKKKKKK........", "......KKRRRRRRRRKK......", ".....KRRRWWWWWWRRRK.....", "....KRRWWWWWWWWWWRRK....", "...KRRWWKWWWWWWKWWRRK...", "...KRWWWWKWWWWKWWWWRK...", "..KRRWWWWWKWWKWWWWWRRK..", "..KRWWWWWWWKKWWWWWWWRK..", "..KRWWKKKWWWWWWKKKWWRK..", "..KRWWKRKWWWWWWKRKWWRK..", "..KRWWKKKWWWWWWKKKWWRK..", "..KRWWWWWWWWWWWWWWWWRK..", "..KRWWWWKKKKKKKKWWWWRK..", "...KRWWWWKWWWWKWWWWRK...", "...KRRWWWWKKKKWWWWRRK...", "....KRRWWWWWWWWWWRRK....", ".....KRRRWWWWWWRRRK.....", "......KKXXXXXXXXKK......", "........KKKKKKKK........", "......KKKK....KKKK......"],
  inbox: [".............KKKKKK.....", ".....KKKKKK..KWgWgK.....", ".....KWWWRK..KggggK.....", ".....KWGGWK..KWgWgK.....", ".....KWWWWK..KggggK.....", ".....KWGGWK..KWgWgK.....", ".KKKKKKKKKKKKKKKKKKKKKK.", ".KWKWWWWWWWWWWWWWWWWKWK.", ".KWWKWWWWWWWWWWWWWWKWWK.", ".KWWWKWWYYWWWWYYWWKWWWK.", ".KWWWWKWYKWWWWKYWKWWWWK.", ".KWWWWWKWWWWWWWWKWWWWWK.", ".KWWWWWWKWWWWWWKWWWWWWK.", ".KWWWWWWWKWWWWKWWWWWWWK.", ".KWWWWWWWWKKKKWWWWWWWWK.", ".KWWWKKKKKKKKKKKKKKWWWK.", ".KWWKWRWRWRWRWRWRWRKWWK.", ".KWWKRRRRRRRRRRRRRRKWWK.", ".KWWKRWRWRWRWRWRWRWKWWK.", ".KWWWKKKKKKKKKKKKKKWWWK.", ".KIIIIIIIIIIIIIIIIIIIIK.", ".KKKKKKKKKKKKKKKKKKKKKK.", "...KKK............KKK...", "..KKKKK..........KKKKK.."],
  golem: ["...KKKKKKK....KKKKKKK...", "...KIGGGGK....KIGGGGK...", "...KGaaGSK....KGrrGSK...", "...KGaaGSK....KGrrGSK...", "...KGGGGSK....KGGGGSK...", "...KSKKKSK....KSKKKSK...", "...KSSSSSK....KSSSSSK...", "..KKKKKKKKKKKKKKKKKKKK..", ".KIGGGGGGGGGGGGGGGGGGSK.", "KIGGGGGGGGGGGGGGGGGGGGSK", "KGGSKGGGGGGGGGGGGGGKGGSK", "KGGSKGGGGIGGGGIGGGGKGGSK", "KGGSKGGGGGIIIIGGGGGKGGSK", "KGGSKGGGGGGGGGGGGGGKGGSK", "KGGSKSSSSSSSSSSSSSSKGGSK", "KSSSKGGGGGGGGGGGGGGKSSSK", "KKKKKGGGGGGGGGGGGGGKKKKK", "....KGGGGGGGGGGGGGGK....", "....KSSSSSSSSSSSSSSK....", "....KGGGGK....KGGGGK....", "....KGGGSK....KGGGSK....", "....KGGGSK....KGGGSK....", "...KKKKKKK....KKKKKKK...", "........................"],
  thief: ["........KKKKKK..........", "......KKVVVVVVKK........", ".....KVVLLLLVVVVK.......", "....KVLLVVVVVVVVVK......", "....KVLVhhhhhhhVVK......", "...KVVLKKKKKKKKKVVK.....", "...KVVKWWKKKKWWKKVK.....", "...KVVLKKKKKKKKKVVK.....", "...KVVLhhhhhhhhhVVK.....", "...KVVVhhhKKKhhhVVK.....", "....KVVVhhhhhhhVVK......", ".....KKVVVVVVVVVK.......", "....KPPPVVVVVVVPPPK.....", "...KPPPPPVVVVVPPPPPK....", "..KPPPPPPPPPPPPPPPPKKKK.", "..KPPPPPPPPPPPPPPPhhKYK.", "..KPPPPPPPPPPPPPPPKKKYK.", "..KPPPPPPPPPPPPPPPK.KYK.", "..KPPPPPPPPPPPPPPPK.KYYK", "..KPPPPPPPPPPPPPPPK.KYK.", "..KPPPPPPPPPPPPPPPK.KYYK", "...KPPPPPPPPPPPPPPK..KK.", "...KKKKKKKKKKKKKKKK.....", "........................"],
  ghost: ["........KKKKKKKK........", "......KKWWWWWWWWKK......", ".....KWWWWWWWWWWWWK.....", "....KWWWWWWWWWWWWWWK....", "...KWWWWWWWWWWWWWWWWK...", "...KWWKKKWWWWWWKKKWWK...", "...KWWKRKWWWWWWKRKWWK...", "...KWWKKKWWWWWWKKKWWK...", "...KWWWWWWWWWWWWWWWWK...", "..KWWWWWWWKKKKWWWWWWWK..", "..KWWWWWWKIIIIKWWWWWWK..", "..KWWWWWWWKKKKWWWWWWWK..", "..KWWGGGGGGWWGGGGGGWWK..", "..KWWWWWWWWWWWWWWWWWWK..", "..KWWGGGGWWWWGGGGGGWWK..", "..KWWWWWWWWWWWWWWWWWWK..", "..KWWGGGGGGGGWWWGGGWWK..", "..KWWWWWWWWWWWWWWWWWWK..", "..KWWWWWWWWWWWWWWWWWWK..", "..KWWKWWWKWWWWKWWWKWWK..", "..KWK.KWK.KWWK.KWK.KWK..", "..KK...K...KK...K...KK..", "........................", "........................"],
  keys: ["......KKKKKKKKKK........", ".....KYYYYYYYYYYK.......", "....KYYAAAAAAAAYYK......", "...KYYAKKKAAKKKAYYK.....", "...KYAAKWKAAKWKAAYK.....", "...KYAAKKKAAKKKAAYK.....", "...KYAAAAAAAAAAAAYK.....", "...KYAAAKKKKKKAAAYK.....", "...KYYAAAAAAAAAAYYK.....", "....KYYYAAAAAAYYYK......", ".....KKYYYYYYYYKK.......", ".......KKYYYYKK.........", "........KYYYYK..........", "........KYYYYK..........", "........KYYYYKKKK.......", "........KYYYYYYYYK......", "........KYYYYKKKK.......", "........KYYYYK..........", "........KYYYYKKK........", "........KYYYYYYYK.......", "........KYYYYKKK........", "........KYYYYK..........", "........KAAAAK..........", ".........KKKK..........."],
};

export function spriteSize(id: SpriteId): { width: number; height: number } {
  const rows = sprites[id];
  return { width: rows[0].length, height: rows.length };
}
