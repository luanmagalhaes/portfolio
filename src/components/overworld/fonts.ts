import { Atkinson_Hyperlegible, Jersey_15, Silkscreen } from "next/font/google";

export const displayFont = Jersey_15({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--ow-font-display", display: "swap" });

export const labelFont = Silkscreen({ weight: ["400", "700"], subsets: ["latin", "latin-ext"], variable: "--ow-font-label", display: "swap" });

export const readingFont = Atkinson_Hyperlegible({ weight: ["400", "700"], subsets: ["latin", "latin-ext"], variable: "--ow-font-body", display: "swap" });

export const overworldFontClasses = `${displayFont.variable} ${labelFont.variable} ${readingFont.variable}`;
