import { Atkinson_Hyperlegible, Press_Start_2P, Silkscreen, VT323 } from "next/font/google";

const displayFont = Press_Start_2P({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--arcade-display", display: "swap" });

const labelFont = Silkscreen({ weight: ["400", "700"], subsets: ["latin", "latin-ext"], variable: "--arcade-label", display: "swap" });

const terminalFont = VT323({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--arcade-terminal", display: "swap" });

const readingFont = Atkinson_Hyperlegible({ weight: ["400", "700"], subsets: ["latin", "latin-ext"], variable: "--arcade-reading", display: "swap" });

export const arcadeFontClasses = [displayFont.variable, labelFont.variable, terminalFont.variable, readingFont.variable].join(" ");
