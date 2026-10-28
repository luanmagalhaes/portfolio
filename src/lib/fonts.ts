import { Inter, Jersey_10 } from "next/font/google";

export const pixelFont = Jersey_10({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--font-jersey", display: "swap" });

export const bodyFont = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
