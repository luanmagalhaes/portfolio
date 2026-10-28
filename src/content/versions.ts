import type { VersionContent } from "@/domain/site";

export const versions: VersionContent[] = [
  {
    id: "arcade",
    name: { en: "Arcade", pt: "Fliperama" },
    tagline: {
      en: "A CRT game room where every app is a cartridge you can play live.",
      pt: "Uma sala de fliperama em que cada app é um cartucho que dá para jogar ao vivo.",
    },
    preview: "/previews/arcade.jpg",
  },
  {
    id: "overworld",
    name: { en: "Overworld", pt: "A cidade" },
    tagline: {
      en: "Walk with me and Matilda through a seaside town where every building tells part of the story.",
      pt: "Ande comigo e com a Matilda por uma cidade à beira-mar em que cada prédio conta uma parte da história.",
    },
    preview: "/previews/overworld.jpg",
  },
  {
    id: "journey",
    name: { en: "Journey", pt: "Jornada" },
    tagline: {
      en: "My career as a side-scroller, with checkpoints, bosses and bonus stages.",
      pt: "A minha carreira como jogo de plataforma, com checkpoints, chefões e fases bônus.",
    },
    preview: "/previews/journey.jpg",
  },
];
