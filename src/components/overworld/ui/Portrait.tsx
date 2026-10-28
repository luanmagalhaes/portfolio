"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { spriteCanvas } from "@/components/overworld/art/canvas";
import { readColors } from "@/components/overworld/art/palette";
import { decorArt, npcRows, type NpcLook } from "@/components/overworld/art/sprites";
import type { Speaker } from "@/components/overworld/art/scenes";

const npcLooks: readonly string[] = ["keeper", "harbor", "nurse", "teacher", "clerk", "auctioneer", "attendant", "guard", "kid"];

function SpritePortrait({ speaker }: { speaker: Speaker }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const root = canvas?.closest(".ow");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !root || !ctx) return;
    const rows = speaker === "sign" ? decorArt.sign : npcRows((npcLooks.includes(speaker) ? speaker : "attendant") as NpcLook).slice(0, 16);
    const sprite = spriteCanvas(rows, readColors(root).px);
    ctx.clearRect(0, 0, 16, 16);
    ctx.drawImage(sprite, 0, 0);
  }, [speaker]);
  return <canvas ref={ref} className="portrait__pixels" width={16} height={16} aria-hidden="true" />;
}

export function Portrait({ speaker }: { speaker: Speaker | "luan" }) {
  if (speaker === "luan") return <Image className="portrait__image" src="/kit/characters/luan/luan-portrait.png" alt="" width={64} height={64} unoptimized />;
  if (speaker === "matilda") return <Image className="portrait__image" src="/kit/characters/matilda/frames/matilda-topdown-idle-0.png" alt="" width={64} height={64} unoptimized />;
  return <SpritePortrait speaker={speaker} />;
}
