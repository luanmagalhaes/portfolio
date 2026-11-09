import type { Locale } from "@/domain/locale";
import type { MenuTarget, ScreenId } from "@/components/arcade/navigation";

export interface BiosFacts {
  apps: number;
  privateApps: number;
  cases: number;
  player: string;
}

export interface ArcadeCopy {
  skipToQuickView: string;
  noscript: string;
  siteNav: string;
  versions: string;
  quickView: string;
  resume: string;
  languageLabel: string;
  soundOn: string;
  soundOff: string;
  power: string;
  reset: string;
  eject: string;
  clockLabel: string;
  hintMove: string;
  hintSelect: string;
  hintBack: string;
  hintQuick: string;
  hintNote: string;
  titleKicker: string;
  tagline: string;
  pressStart: string;
  titleQuick: string;
  titleFoot: string;
  sceneLabel: string;
  booting: string;
  bootSkip: string;
  bios: (facts: BiosFacts) => [string, string][];
  back: string;
  menuTitle: string;
  menu: Record<MenuTarget, [string, string]>;
  played: string;
  cleared: string;
  player: string;
  classLabel: string;
  originLabel: string;
  originValue: string;
  baseLabel: string;
  portraitAlt: string;
  companionAlt: string;
  cartridgesTitle: string;
  cartridgesIntro: string;
  privateTitle: string;
  privateBuild: string;
  privateNote: string;
  backToShelf: string;
  days: (days: number) => string;
  builtIn: (days: number) => string;
  daysShort: (days: number) => string;
  shelfIdle: string;
  shelfCount: (publicCount: number, privateCount: number) => string;
  manual: string;
  companion: string;
  demo: string;
  playDemo: string;
  pauseDemo: string;
  resumeDemo: string;
  demoLabel: (name: string) => string;
  emblemLabel: (name: string) => string;
  playLive: string;
  code: string;
  privateRepo: string;
  previous: string;
  next: string;
  cartCount: (position: number, total: number) => string;
  liveHint: string;
  liveHintPhone: string;
  builtWith: string;
  live: string;
  openTab: string;
  stop: string;
  tuning: string;
  liveFrameLabel: (name: string) => string;
  scoresTitle: string;
  softwareStage: string;
  originStage: string;
  continueYes: string;
  switchNote: string;
  stackLabel: string;
  characterTitle: string;
  slotEngineer: string;
  slotOrigin: string;
  slotCompanion: string;
  tabsLabel: string;
  tabProfile: string;
  tabSkills: string;
  tabMoves: string;
  statApps: string;
  statPrivate: string;
  statCases: string;
  statDays: string;
  statsNote: string;
  languagesLabel: string;
  educationLabel: string;
  originIntro: string;
  companionText: string;
  bossesTitle: string;
  bossesIntro: string;
  notFought: string;
  clearedLabel: string;
  round: string;
  roundsLabel: string;
  problem: string;
  move: string;
  result: string;
  nextRound: string;
  previousRound: string;
  nextBoss: string;
  defeated: string;
  bossHp: string;
  continueTitle: string;
  continueLead: string;
  continueEnd: string;
  continueNote: (location: string) => string;
  downloadResume: string;
  padUp: string;
  padDown: string;
  padLeft: string;
  padRight: string;
  padA: string;
  padB: string;
  padStart: string;
  padSelect: string;
  padLabel: string;
  screenNames: Record<ScreenId, string>;
}

const en: ArcadeCopy = {
  skipToQuickView: "Skip the game: quick view",
  noscript: "This version needs JavaScript. Open the quick view to read everything as a plain page.",
  siteNav: "Site",
  versions: "Versions",
  quickView: "Quick view",
  resume: "Résumé",
  languageLabel: "Language",
  soundOn: "Sound on",
  soundOff: "Sound off",
  power: "Power",
  reset: "Reset",
  eject: "Eject",
  clockLabel: "Local time in Brazil, UTC-3",
  hintMove: "Move",
  hintSelect: "Select",
  hintBack: "Back",
  hintQuick: "Quick view",
  hintNote: "Sound off by default · motion follows your system setting",
  titleKicker: "Player 1",
  tagline: "From ICU speech-language pathologist to senior software engineer.",
  pressStart: "Press start",
  titleQuick: "In a hurry? Open the quick view",
  titleFoot: "Original pixel art · 2026",
  sceneLabel: "Pixel art of Luan standing next to his dog Matilda",
  booting: "Starting up",
  bootSkip: "Press any key to skip",
  bios: (facts) => [
    ["LM-16 BIOS  REV 2026", ""],
    ["CARTRIDGE SLOT ..........", "OK"],
    ["PUBLIC CARTRIDGES .......", String(facts.apps)],
    ["PRIVATE CARTRIDGES ......", `${facts.privateApps} LOCKED`],
    ["CLIENT BOSSES ...........", String(facts.cases)],
    ["PLAYER 1 ................", facts.player.toUpperCase()],
    ["SAVE DATA ...............", "2 CAREERS"],
    ["", ""],
    ["LOADING STAGE 2 ...", ""],
  ],
  back: "Back",
  menuTitle: "Main menu",
  menu: {
    cartridges: ["Cartridges", "Apps I built solo"],
    scores: ["High scores", "Experience"],
    character: ["Character select", "About and skills"],
    bosses: ["Boss rush", "Client cases"],
    continue: ["Continue?", "Contact and résumé"],
  },
  played: "Cartridges played",
  cleared: "Bosses cleared",
  player: "Player 1",
  classLabel: "Class",
  originLabel: "Origin",
  originValue: "ICU speech-language pathologist and English teacher",
  baseLabel: "Base",
  portraitAlt: "Pixel portrait of Luan",
  companionAlt: "Pixel art of Matilda, a white and brown dog",
  cartridgesTitle: "Cartridges",
  cartridgesIntro: "Party games and tools for my friends' game nights, all in Portuguese. Built solo with Claude Code, from first commit to production.",
  privateTitle: "Private builds",
  privateBuild: "Private build",
  privateNote: "No public link and no screenshots of real data.",
  backToShelf: "Back to the shelf",
  days: (days) => (days === 1 ? "1 day" : `${days} days`),
  builtIn: (days) => (days === 1 ? "Built in 1 day" : `Built in ${days} days`),
  daysShort: (days) => `${days}D`,
  shelfIdle: "Pick a cartridge. Hover to read, click to play.",
  shelfCount: (publicCount, privateCount) => `${publicCount} public · ${privateCount} private`,
  manual: "Manual",
  companion: "Companion",
  demo: "Demo",
  playDemo: "Play demo",
  pauseDemo: "Pause demo",
  resumeDemo: "Play demo",
  demoLabel: (name) => `${name} demo video: a short silent loop through the app's tutorial.`,
  emblemLabel: (name) => `${name} emblem`,
  playLive: "Play live",
  code: "Code",
  privateRepo: "Private repo",
  previous: "Previous cartridge",
  next: "Next cartridge",
  cartCount: (position, total) => `Cartridge ${position} of ${total}`,
  liveHint: "Opens the real app in a phone-sized window.",
  liveHintPhone: "Opens the real app in a new tab.",
  builtWith: "Built solo with Claude Code",
  live: "Live",
  openTab: "Open in a new tab",
  stop: "Stop",
  tuning: "Tuning in",
  liveFrameLabel: (name) => `${name}, live app`,
  scoresTitle: "High scores",
  softwareStage: "Stage 2 · Software",
  originStage: "Origin and milestones",
  continueYes: "Continue? Yes",
  switchNote: "2021: new career, same player.",
  stackLabel: "Stack",
  characterTitle: "Character select",
  slotEngineer: "Engineer · 2021 to now",
  slotOrigin: "Origin · before 2021",
  slotCompanion: "Companion",
  tabsLabel: "Character details",
  tabProfile: "Profile",
  tabSkills: "Skills",
  tabMoves: "Special moves",
  statApps: "public apps, built solo",
  statPrivate: "private builds",
  statCases: "client cases",
  statDays: "build days in total",
  statsNote: "Every number here comes from the content of this portfolio.",
  languagesLabel: "Languages",
  educationLabel: "Education",
  originIntro: "Same player, first career. A palette swap of the same sprite.",
  companionText: "Matilda, my dog and co-pilot. She even has her own private build on the shelf.",
  bossesTitle: "Boss rush",
  bossesIntro: "Contract work. Client names stay confidential.",
  notFought: "Not fought yet",
  clearedLabel: "Cleared",
  round: "Round",
  roundsLabel: "Rounds",
  problem: "The problem",
  move: "The move",
  result: "The result",
  nextRound: "Next round",
  previousRound: "Previous round",
  nextBoss: "Next boss",
  defeated: "Defeated",
  bossHp: "Boss HP",
  continueTitle: "Continue?",
  continueLead: "Pick a way to reach me.",
  continueEnd: "No rush. These links stay here.",
  continueNote: (location) => `${location}. English C2.`,
  downloadResume: "Download résumé (PDF)",
  padUp: "Up",
  padDown: "Down",
  padLeft: "Left",
  padRight: "Right",
  padA: "OK",
  padB: "Back",
  padStart: "Menu",
  padSelect: "Quick view",
  padLabel: "Handheld controls",
  screenNames: {
    title: "Title screen",
    boot: "Starting up",
    menu: "Main menu",
    cartridges: "Cartridges",
    cart: "Cartridge inserted",
    locked: "Private build",
    scores: "High scores",
    character: "Character select",
    bosses: "Boss rush",
    boss: "Boss fight",
    continue: "Continue",
  },
};

const pt: ArcadeCopy = {
  skipToQuickView: "Pular o jogo: visão rápida",
  noscript: "Esta versão precisa de JavaScript. Abra a visão rápida para ler tudo como uma página simples.",
  siteNav: "Site",
  versions: "Versões",
  quickView: "Visão rápida",
  resume: "Currículo",
  languageLabel: "Idioma",
  soundOn: "Som ligado",
  soundOff: "Som desligado",
  power: "Liga/desliga",
  reset: "Reset",
  eject: "Ejetar",
  clockLabel: "Hora local no Brasil, UTC-3",
  hintMove: "Mover",
  hintSelect: "Escolher",
  hintBack: "Voltar",
  hintQuick: "Visão rápida",
  hintNote: "Som desligado por padrão · movimento segue a configuração do sistema",
  titleKicker: "Jogador 1",
  tagline: "De fonoaudiólogo de UTI a engenheiro de software sênior.",
  pressStart: "Aperte start",
  titleQuick: "Com pressa? Abra a visão rápida",
  titleFoot: "Pixel art original · 2026",
  sceneLabel: "Pixel art do Luan em pé ao lado da cachorra Matilda",
  booting: "Iniciando",
  bootSkip: "Aperte qualquer tecla para pular",
  bios: (facts) => [
    ["LM-16 BIOS  REV 2026", ""],
    ["ENTRADA DE CARTUCHO .....", "OK"],
    ["CARTUCHOS PÚBLICOS ......", String(facts.apps)],
    ["CARTUCHOS PRIVADOS ......", `${facts.privateApps} TRANCADOS`],
    ["CHEFÕES DE CLIENTES .....", String(facts.cases)],
    ["JOGADOR 1 ...............", facts.player.toUpperCase()],
    ["JOGO SALVO ..............", "2 CARREIRAS"],
    ["", ""],
    ["CARREGANDO FASE 2 ...", ""],
  ],
  back: "Voltar",
  menuTitle: "Menu principal",
  menu: {
    cartridges: ["Cartuchos", "Apps que fiz sozinho"],
    scores: ["Recordes", "Experiência"],
    character: ["Escolha o personagem", "Sobre e habilidades"],
    bosses: ["Chefões", "Casos de clientes"],
    continue: ["Continuar?", "Contato e currículo"],
  },
  played: "Cartuchos jogados",
  cleared: "Chefões vencidos",
  player: "Jogador 1",
  classLabel: "Classe",
  originLabel: "Origem",
  originValue: "Fonoaudiólogo de UTI e professor de inglês",
  baseLabel: "Base",
  portraitAlt: "Retrato em pixel art do Luan",
  companionAlt: "Pixel art da Matilda, uma cachorra branca e marrom",
  cartridgesTitle: "Cartuchos",
  cartridgesIntro: "Jogos de festa e ferramentas para as noites de jogos com os amigos, todos em português. Feitos sozinho com Claude Code, do primeiro commit à produção.",
  privateTitle: "Projetos privados",
  privateBuild: "Projeto privado",
  privateNote: "Sem link público e sem capturas de dados reais.",
  backToShelf: "Voltar para a estante",
  days: (days) => (days === 1 ? "1 dia" : `${days} dias`),
  builtIn: (days) => (days === 1 ? "Feito em 1 dia" : `Feito em ${days} dias`),
  daysShort: (days) => `${days}D`,
  shelfIdle: "Escolha um cartucho. Passe o mouse para ler, clique para jogar.",
  shelfCount: (publicCount, privateCount) => `${publicCount} públicos · ${privateCount} privados`,
  manual: "Manual",
  companion: "Companheira",
  demo: "Demo",
  playDemo: "Ver demo",
  pauseDemo: "Pausar demo",
  resumeDemo: "Tocar demo",
  demoLabel: (name) => `Vídeo de demonstração de ${name}: um loop curto e sem som pelo tutorial do app.`,
  emblemLabel: (name) => `Emblema de ${name}`,
  playLive: "Jogar ao vivo",
  code: "Código",
  privateRepo: "Repo privado",
  previous: "Cartucho anterior",
  next: "Próximo cartucho",
  cartCount: (position, total) => `Cartucho ${position} de ${total}`,
  liveHint: "Abre o app de verdade numa janela do tamanho de um celular.",
  liveHintPhone: "Abre o app de verdade em uma nova aba.",
  builtWith: "Feito sozinho com Claude Code",
  live: "Ao vivo",
  openTab: "Abrir em nova aba",
  stop: "Parar",
  tuning: "Sintonizando",
  liveFrameLabel: (name) => `${name}, app ao vivo`,
  scoresTitle: "Recordes",
  softwareStage: "Fase 2 · Software",
  originStage: "Origem e conquistas",
  continueYes: "Continuar? Sim",
  switchNote: "2021: nova carreira, mesmo jogador.",
  stackLabel: "Stack",
  characterTitle: "Escolha o personagem",
  slotEngineer: "Engenheiro · 2021 até hoje",
  slotOrigin: "Origem · antes de 2021",
  slotCompanion: "Companheira",
  tabsLabel: "Detalhes do personagem",
  tabProfile: "Perfil",
  tabSkills: "Habilidades",
  tabMoves: "Golpes especiais",
  statApps: "apps públicos, feitos sozinho",
  statPrivate: "projetos privados",
  statCases: "casos de clientes",
  statDays: "dias de desenvolvimento no total",
  statsNote: "Todo número aqui vem do conteúdo deste portfólio.",
  languagesLabel: "Idiomas",
  educationLabel: "Formação",
  originIntro: "Mesmo jogador, primeira carreira. Uma troca de paleta do mesmo sprite.",
  companionText: "Matilda, minha cachorra e copiloto. Ela tem até um projeto privado só dela na estante.",
  bossesTitle: "Chefões",
  bossesIntro: "Trabalhos sob contrato. O nome dos clientes é confidencial.",
  notFought: "Ainda não enfrentado",
  clearedLabel: "Vencido",
  round: "Rodada",
  roundsLabel: "Rodadas",
  problem: "O problema",
  move: "A jogada",
  result: "O resultado",
  nextRound: "Próxima rodada",
  previousRound: "Rodada anterior",
  nextBoss: "Próximo chefão",
  defeated: "Derrotado",
  bossHp: "Vida do chefão",
  continueTitle: "Continuar?",
  continueLead: "Escolha como falar comigo.",
  continueEnd: "Sem pressa. Os links ficam aqui.",
  continueNote: (location) => `${location}. Inglês C2.`,
  downloadResume: "Baixar currículo (PDF)",
  padUp: "Cima",
  padDown: "Baixo",
  padLeft: "Esquerda",
  padRight: "Direita",
  padA: "OK",
  padB: "Voltar",
  padStart: "Menu",
  padSelect: "Visão rápida",
  padLabel: "Controles do portátil",
  screenNames: {
    title: "Tela de título",
    boot: "Iniciando",
    menu: "Menu principal",
    cartridges: "Cartuchos",
    cart: "Cartucho encaixado",
    locked: "Projeto privado",
    scores: "Recordes",
    character: "Escolha o personagem",
    bosses: "Chefões",
    boss: "Luta contra o chefão",
    continue: "Continuar",
  },
};

export const arcadeCopy: Record<Locale, ArcadeCopy> = { en, pt };
