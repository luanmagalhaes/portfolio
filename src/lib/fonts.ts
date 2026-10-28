import { Inter, Pixelify_Sans } from "next/font/google";

export const pixelFont = Pixelify_Sans({ subsets: ["latin", "latin-ext"], variable: "--font-pixelify", display: "swap" });

export const bodyFont = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
