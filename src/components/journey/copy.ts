import type { Locale } from "@/domain/locale";
import type { WorldId } from "@/components/journey/model/level";

export interface WorldCopy {
  name: string;
  sub: string;
}

export interface JourneyCopy {
  pageTitle: string;
  skip: string;
  versions: string;
  versionsLabel: string;
  map: string;
  apps: string;
  soundOn: string;
  soundOff: string;
  resume: string;
  quickView: string;
  backToGame: string;
  otherLanguage: string;
  otherLanguageLabel: string;
  mainNav: string;
  journeyNav: string;
  journeyTitle: string;
  prevStop: string;
  nextStop: string;
  world: string;
  worlds: Record<WorldId, WorldCopy>;
  statSkills: string;
  statApps: string;
  statBosses: string;
  statFlags: string;
  progress: string;
  titleKicker: string;
  tagline: string;
  start: string;
  pressStart: string;
  hintKeys: string;
  hintTouch: string;
  publicApps: string;
  checkpoint: string;
  loot: string;
  bonus: string;
  enter: string;
  dayToBuild: string;
  daysToBuild: string;
  dayShort: string;
  daysShort: string;
  playLive: string;
  openTab: string;
  code: string;
  privateRepo: string;
  pauseVideo: string;
  playVideo: string;
  backToVideo: string;
  loadingLive: string;
  liveApp: string;
  demoLoop: string;
  posterOnly: string;
  wheelNote: string;
  close: string;
  boss: string;
  problem: string;
  move: string;
  result: string;
  cleared: string;
  hp: string;
  openBoss: string;
  bossRushTitle: string;
  bossRushLead: string;
  mapTitle: string;
  mapLead: string;
  here: string;
  allStages: string;
  appsTitle: string;
  appsLead: string;
  soloNote: string;
  stack: string;
  secretTitle: string;
  secretLead: string;
  privateBuild: string;
  goalKicker: string;
  goalTitle: string;
  goalLead: string;
  continueText: string;
  email: string;
  skills: string;
  noscript: string;
  reached: string;
  collected: string;
}

const en: JourneyCopy = {
  pageTitle: "Journey",
  skip: "Skip the game: quick view",
  versions: "Versions",
  versionsLabel: "Back to the versions",
  map: "Map",
  apps: "Apps",
  soundOn: "Sound on",
  soundOff: "Sound off",
  resume: "Résumé",
  quickView: "Quick view",
  backToGame: "Back to the game",
  otherLanguage: "PT",
  otherLanguageLabel: "PT, ver em português",
  mainNav: "Main",
  journeyNav: "Journey stops",
  journeyTitle: "Luan Magalhães, career journey",
  prevStop: "Previous stop",
  nextStop: "Next stop",
  world: "World",
  worlds: {
    chalk: { name: "Chalk and Snow", sub: "Teaching and the Canada scholarship" },
    ward: { name: "The Ward", sub: "Healthcare" },
    commits: { name: "First Commits", sub: "Learning to code and the first jobs" },
    overseas: { name: "Overseas", sub: "Remote for Germany and Denmark" },
    market: { name: "The Auction House", sub: "The credit marketplace" },
    lab: { name: "The Lab", sub: "AI and client work" },
  },
  statSkills: "skills",
  statApps: "apps",
  statBosses: "bosses",
  statFlags: "flags",
  progress: "Progress",
  titleKicker: "A career in six worlds",
  tagline: "From the ICU to the IDE.",
  start: "Start the journey",
  pressStart: "Press start",
  hintKeys: "Scroll, swipe or use the arrow keys",
  hintTouch: "Swipe up to travel",
  publicApps: "public apps",
  checkpoint: "Checkpoint",
  loot: "Loot",
  bonus: "Bonus stage",
  enter: "Enter",
  dayToBuild: "day to build",
  daysToBuild: "days to build",
  dayShort: "day",
  daysShort: "days",
  playLive: "Play live",
  openTab: "Open in a new tab",
  code: "Code on GitHub",
  privateRepo: "Private repo, no code link",
  pauseVideo: "Pause video",
  playVideo: "Play video",
  backToVideo: "Back to the video",
  loadingLive: "Loading the live app",
  liveApp: "Live app",
  demoLoop: "Demo loop",
  posterOnly: "Poster only: reduced motion is on",
  wheelNote: "A letter wheel stands in for this app's screens.",
  close: "Close",
  boss: "Boss",
  problem: "Problem",
  move: "Moves",
  result: "Result",
  cleared: "Cleared",
  hp: "HP",
  openBoss: "Open the fight card",
  bossRushTitle: "Boss rush",
  bossRushLead: "The hardest problems from client projects. Client names stay confidential.",
  mapTitle: "World map",
  mapLead: "Jump to any world, checkpoint, boss or bonus stage.",
  here: "You are here",
  allStages: "All bonus stages",
  appsTitle: "Bonus stages",
  appsLead: "Party games and tools for game nights with friends, each built solo from first commit to production.",
  soloNote: "Every app:",
  stack: "Stack",
  secretTitle: "Secret room: private builds",
  secretLead: "Apps for my own routine. No public link and no screenshots.",
  privateBuild: "Private build",
  goalKicker: "Goal",
  goalTitle: "Thanks for playing",
  goalLead: "Want to talk about a role? Pick a way to reach me.",
  continueText: "Continue? Every world is one click away on the map.",
  email: "Email",
  skills: "Skills",
  noscript: "This version needs JavaScript. Everything is also on one page:",
  reached: "Checkpoint",
  collected: "Got",
};

const pt: JourneyCopy = {
  pageTitle: "Jornada",
  skip: "Pular o jogo: visão rápida",
  versions: "Versões",
  versionsLabel: "Voltar para as versões",
  map: "Mapa",
  apps: "Apps",
  soundOn: "Som ligado",
  soundOff: "Som desligado",
  resume: "Currículo",
  quickView: "Visão rápida",
  backToGame: "Voltar ao jogo",
  otherLanguage: "EN",
  otherLanguageLabel: "EN, view in English",
  mainNav: "Principal",
  journeyNav: "Paradas da jornada",
  journeyTitle: "Luan Magalhães, jornada da carreira",
  prevStop: "Parada anterior",
  nextStop: "Próxima parada",
  world: "Mundo",
  worlds: {
    chalk: { name: "Giz e Neve", sub: "Aulas de inglês e a bolsa no Canadá" },
    ward: { name: "A Ala", sub: "Saúde" },
    commits: { name: "Primeiros Commits", sub: "Aprendendo a programar e os primeiros empregos" },
    overseas: { name: "Além-mar", sub: "Remoto para Alemanha e Dinamarca" },
    market: { name: "A Casa de Leilões", sub: "O marketplace de crédito" },
    lab: { name: "O Laboratório", sub: "IA e projetos para clientes" },
  },
  statSkills: "skills",
  statApps: "apps",
  statBosses: "chefões",
  statFlags: "bandeiras",
  progress: "Progresso",
  titleKicker: "Uma carreira em seis mundos",
  tagline: "Da UTI à IDE.",
  start: "Começar a jornada",
  pressStart: "Aperte start",
  hintKeys: "Role, deslize ou use as setas",
  hintTouch: "Deslize para viajar",
  publicApps: "apps públicos",
  checkpoint: "Checkpoint",
  loot: "Item",
  bonus: "Fase bônus",
  enter: "Entrar",
  dayToBuild: "dia para fazer",
  daysToBuild: "dias para fazer",
  dayShort: "dia",
  daysShort: "dias",
  playLive: "Jogar ao vivo",
  openTab: "Abrir em nova aba",
  code: "Código no GitHub",
  privateRepo: "Repositório privado, sem link",
  pauseVideo: "Pausar vídeo",
  playVideo: "Tocar vídeo",
  backToVideo: "Voltar ao vídeo",
  loadingLive: "Carregando o app ao vivo",
  liveApp: "App ao vivo",
  demoLoop: "Demo em loop",
  posterOnly: "Só o pôster: movimento reduzido ativado",
  wheelNote: "Uma roda de letras representa as telas deste app.",
  close: "Fechar",
  boss: "Chefão",
  problem: "Problema",
  move: "Jogadas",
  result: "Resultado",
  cleared: "Vencido",
  hp: "HP",
  openBoss: "Abrir a ficha da luta",
  bossRushTitle: "Sequência de chefões",
  bossRushLead: "Os problemas mais difíceis de projetos para clientes. O nome dos clientes fica em sigilo.",
  mapTitle: "Mapa do mundo",
  mapLead: "Pule para qualquer mundo, checkpoint, chefão ou fase bônus.",
  here: "Você está aqui",
  allStages: "Todas as fases bônus",
  appsTitle: "Fases bônus",
  appsLead: "Party games e ferramentas para as noites de jogos com os amigos, cada um feito sozinho do primeiro commit até o ar.",
  soloNote: "Todos os apps:",
  stack: "Stack",
  secretTitle: "Sala secreta: apps privados",
  secretLead: "Apps para a minha rotina. Sem link público e sem prints.",
  privateBuild: "Uso privado",
  goalKicker: "Chegada",
  goalTitle: "Obrigado por jogar",
  goalLead: "Quer conversar sobre uma vaga? Escolha como falar comigo.",
  continueText: "Continuar? Todo mundo está a um clique no mapa.",
  email: "E-mail",
  skills: "Skills",
  noscript: "Esta versão precisa de JavaScript. Tudo também está numa página só:",
  reached: "Checkpoint",
  collected: "Pegou",
};

const copies: Record<Locale, JourneyCopy> = { en, pt };

export function journeyCopyFor(locale: Locale): JourneyCopy {
  return copies[locale];
}

export function daysLabel(copy: JourneyCopy, days: number): string {
  return days === 1 ? copy.dayToBuild : copy.daysToBuild;
}

export function shortDaysLabel(copy: JourneyCopy, days: number): string {
  return `${days} ${days === 1 ? copy.dayShort : copy.daysShort}`;
}
