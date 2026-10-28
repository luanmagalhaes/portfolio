import { Atkinson_Hyperlegible, Jersey_10, Silkscreen } from "next/font/google";

const display = Jersey_10({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--jr-font-display", display: "swap" });
const hud = Silkscreen({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--jr-font-hud", display: "swap" });
const body = Atkinson_Hyperlegible({ subsets: ["latin", "latin-ext"], weight: ["400", "700"], variable: "--jr-font-body", display: "swap" });

export const journeyFontClasses = `${display.variable} ${hud.variable} ${body.variable}`;
