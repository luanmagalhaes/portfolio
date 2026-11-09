import type { Locale } from "@/domain/locale";
import type { LineKey, Speaker } from "@/components/overworld/art/scenes";
import type { DistrictId } from "@/components/overworld/model/map";

export interface PlaceCopy {
  title: string;
  tag: string;
  sub: string;
  npc: string;
}

export interface OverworldCopy {
  stageLabel: string;
  stageRole: string;
  skipToQuickView: string;
  noscript: string;
  quickView: string;
  quickViewNoGame: string;
  resume: string;
  downloadResume: string;
  backToVersions: string;
  languageToggle: string;
  map: string;
  quests: string;
  items: string;
  soundOn: string;
  soundOff: string;
  explored: string;
  localTime: (firstName: string) => string;
  walk: string;
  talk: string;
  titleKicker: string;
  start: string;
  titleHintKeys: string;
  titleHintTouch: string;
  continue: string;
  letsGo: string;
  skip: string;
  close: string;
  daysToBuild: (days: number) => string;
  builtSolo: string;
  playLive: string;
  playLiveLabel: (name: string) => string;
  openTab: string;
  sourceCode: string;
  sourceCodeLabel: (name: string) => string;
  privateRepo: string;
  backToDemo: string;
  pauseDemo: string;
  playDemo: string;
  demoLoop: string;
  liveApp: string;
  liveTitle: (name: string) => string;
  prevMachine: string;
  nextMachine: string;
  noDemo: string;
  reducedNote: string;
  demoLabel: (name: string) => string;
  problem: string;
  move: string;
  result: string;
  nextBoss: string;
  appears: (boss: string) => string;
  moveOf: (index: number, total: number) => string;
  bossDown: string;
  bosses: string;
  bossesBeaten: (count: number, total: number) => string;
  bossCount: (count: number) => string;
  pathIntro: string;
  defeated: string;
  hp: string;
  questLog: string;
  experience: string;
  path: string;
  clientProjects: string;
  sideQuests: string;
  goThere: string;
  inventory: string;
  keyItems: string;
  locked: string;
  privateBuild: string;
  privateBuilds: string;
  privateGreeting: string;
  languages: string;
  education: string;
  characterSheet: string;
  fastTravel: string;
  go: string;
  visited: string;
  contactTitle: string;
  email: string;
  linkedin: string;
  github: string;
  resumePdf: string;
  appsCount: (count: number) => string;
  exitArcade: string;
  toastExplored: (place: string, count: number, total: number) => string;
  allExplored: string;
  appStack: string;
  places: Record<DistrictId, PlaceCopy>;
  houseTitle: (firstName: string) => string;
  greetings: {
    house: (firstName: string) => string;
    arcade: (count: number) => string;
    harbor: string;
    fort: (count: number) => string;
    lighthouse: string;
    school: string;
    hospital: string;
    bridge: string;
    post: (firstName: string) => string;
  };
  intro: string[];
  introTouch: string[];
  lines: Record<LineKey, (firstName: string) => string>;
  speakers: Record<Speaker, string>;
  auctionFallback: string;
}

const en: OverworldCopy = {
  stageRole: "game",
  stageLabel: "Porto Magalhães, a pixel town. Arrow keys or WASD to walk, Enter to talk. Use the place buttons to travel.",
  skipToQuickView: "Skip the game: open the quick view",
  noscript: "This town needs JavaScript. Everything is also on the quick view page.",
  quickView: "Quick view",
  quickViewNoGame: "Quick view, no game",
  resume: "Résumé",
  downloadResume: "Download résumé",
  backToVersions: "Versions",
  languageToggle: "EN PT, ver em português",
  map: "Map",
  quests: "Quests",
  items: "Items",
  soundOn: "Sound on",
  soundOff: "Sound off",
  explored: "Explored",
  localTime: (firstName) => `${firstName}'s time`,
  walk: "walk",
  talk: "talk or enter",
  titleKicker: "Porto Magalhães",
  start: "Start exploring",
  titleHintKeys: "Arrows or WASD to walk, Enter to talk, or click any place.",
  titleHintTouch: "Tap any place to travel there.",
  continue: "Continue",
  letsGo: "Let's go",
  skip: "Skip",
  close: "Close",
  daysToBuild: (days) => (days === 1 ? "day to build" : "days to build"),
  builtSolo: "Built solo, from first commit to production",
  playLive: "Play live",
  playLiveLabel: (name) => `Play ${name} live`,
  openTab: "Open in a new tab",
  sourceCode: "Code on GitHub",
  sourceCodeLabel: (name) => `Source code of ${name} on GitHub, opens in a new tab`,
  privateRepo: "Private repository",
  backToDemo: "Back to the demo",
  pauseDemo: "Pause demo",
  playDemo: "Play demo",
  demoLoop: "Demo loop",
  liveApp: "Live app",
  liveTitle: (name) => `${name}, live app`,
  prevMachine: "Previous machine",
  nextMachine: "Next machine",
  noDemo: "No video for this one. The live app is one click away.",
  reducedNote: "Motion is reduced, so the demo starts paused.",
  demoLabel: (name) => `Demo of ${name}`,
  problem: "Problem",
  move: "Move",
  result: "Result",
  nextBoss: "Next boss",
  appears: (boss) => `${boss} appears!`,
  moveOf: (index, total) => `Move ${index} of ${total}`,
  bossDown: "Boss defeated!",
  bosses: "Bosses",
  bossesBeaten: (count, total) => `Bosses beaten: ${count} of ${total}`,
  bossCount: (count) => (count === 1 ? "1 boss" : `${count} bosses`),
  pathIntro: "From hospitals and classrooms to code.",
  defeated: "Defeated",
  hp: "HP",
  questLog: "Quest log",
  experience: "Experience",
  path: "The unusual path",
  clientProjects: "Client projects",
  sideQuests: "Side quests",
  goThere: "Go there",
  inventory: "Inventory",
  keyItems: "Key items",
  locked: "Locked",
  privateBuild: "Private build",
  privateBuilds: "Private builds",
  privateGreeting: "Private builds. Only friends get in, but here is what each one does.",
  languages: "Languages",
  education: "Education",
  characterSheet: "Character sheet",
  fastTravel: "Fast travel",
  go: "Go",
  visited: "Visited",
  contactTitle: "Send a letter",
  email: "Email",
  linkedin: "LinkedIn",
  github: "GitHub",
  resumePdf: "Résumé (PDF)",
  appsCount: (count) => (count === 1 ? "1 app" : `${count} apps`),
  exitArcade: "Exit to town",
  toastExplored: (place, count, total) => `Explored: ${place} (${count} of ${total})`,
  allExplored: "Woof! You explored the whole town.",
  appStack: "Every app",
  places: {
    house: { title: "Home", tag: "About", sub: "Who he is", npc: "Matilda" },
    arcade: { title: "Arcade Hall", tag: "Apps", sub: "Public apps with demos you can play live", npc: "Attendant" },
    auction: { title: "Auction house", tag: "Current job", sub: "Where he works now", npc: "Auctioneer" },
    harbor: { title: "Harbor", tag: "Abroad", sub: "Remote jobs across the sea", npc: "Harbor master" },
    fort: { title: "Fort arena", tag: "Boss fights", sub: "Client projects as boss fights", npc: "Fort guard" },
    lighthouse: { title: "Lighthouse", tag: "Applied AI", sub: "Agents, MCP servers and Claude Code", npc: "Lighthouse keeper" },
    school: { title: "School", tag: "Studies", sub: "Teaching, degrees and languages", npc: "Teacher" },
    hospital: { title: "Hospital", tag: "Healthcare", sub: "The years before code", npc: "Nurse" },
    bridge: { title: "The bridge", tag: "The switch", sub: "From healthcare to software", npc: "Signpost" },
    post: { title: "Post office", tag: "Contact", sub: "Email, LinkedIn, GitHub and résumé", npc: "Postal clerk" },
  },
  houseTitle: (firstName) => `${firstName}'s house`,
  greetings: {
    house: (firstName) => `Woof! This is where ${firstName} lives. Inside: who he is, on one page.`,
    arcade: (count) => `Welcome to the Arcade Hall. ${count} machines, ${count} apps. Walk up to one to watch its demo and play it live.`,
    harbor: "Ships from this pier sail to remote jobs across the sea.",
    fort: (count) => `${count} bosses from client projects. Pick one and watch the fight.`,
    lighthouse: "The light here runs on agents now.",
    school: "Classrooms, degrees and languages live here.",
    hospital: "Before code, there was healthcare.",
    bridge: "The bridge between two careers.",
    post: (firstName) => `Letters for ${firstName}? Pick how you want to reach him.`,
  },
  intro: ["Woof! Matilda will follow you around. Every building in town is a chapter of the story.", "Walk with the arrow keys or WASD, or click a place to travel. The quick view shows everything as a plain page."],
  introTouch: ["Woof! Matilda will follow you around. Every building in town is a chapter of the story.", "Tap a place to travel there. The quick view shows everything as a plain page."],
  lines: {
    kid: () => "Have you been to the Arcade Hall? It is the purple building up the street.",
    keeper: () => "The fort holds the bosses. The lighthouse keeps the AI work.",
    nurse: (firstName) => `${firstName}'s story starts at this hospital. The school is just across the street.`,
    welcome: (firstName) => `Porto Magalhães. Every building is a chapter of ${firstName}'s story.`,
    attendant: () => "The roped corner keeps the private builds. Look, but no playing.",
    board: () => "High score board. Every machine here went from first commit to production.",
  },
  speakers: { matilda: "Matilda", sign: "Signpost", attendant: "Attendant", kid: "Kid", keeper: "Lighthouse keeper", nurse: "Nurse", harbor: "Harbor master", teacher: "Teacher", clerk: "Postal clerk", auctioneer: "Auctioneer", guard: "Fort guard" },
  auctionFallback: "Office",
};

const pt: OverworldCopy = {
  stageRole: "jogo",
  stageLabel: "Porto Magalhães, uma cidade em pixels. Setas ou WASD para andar, Enter para falar. Use os botões dos lugares para viajar.",
  skipToQuickView: "Pular o jogo: abrir a visão rápida",
  noscript: "Esta cidade precisa de JavaScript. Tudo também está na página de visão rápida.",
  quickView: "Visão rápida",
  quickViewNoGame: "Visão rápida, sem jogo",
  resume: "Currículo",
  downloadResume: "Baixar currículo",
  backToVersions: "Versões",
  languageToggle: "EN PT, view in English",
  map: "Mapa",
  quests: "Missões",
  items: "Itens",
  soundOn: "Som ligado",
  soundOff: "Som desligado",
  explored: "Explorado",
  localTime: (firstName) => `Hora do ${firstName}`,
  walk: "andar",
  talk: "falar ou entrar",
  titleKicker: "Porto Magalhães",
  start: "Começar a explorar",
  titleHintKeys: "Setas ou WASD para andar, Enter para falar, ou clique em qualquer lugar.",
  titleHintTouch: "Toque em qualquer lugar para ir até lá.",
  continue: "Continuar",
  letsGo: "Vamos lá",
  skip: "Pular",
  close: "Fechar",
  daysToBuild: (days) => (days === 1 ? "dia para construir" : "dias para construir"),
  builtSolo: "Feito sozinho, do primeiro commit à produção",
  playLive: "Jogar ao vivo",
  playLiveLabel: (name) => `Jogar ${name} ao vivo`,
  openTab: "Abrir em nova aba",
  sourceCode: "Código no GitHub",
  sourceCodeLabel: (name) => `Código de ${name} no GitHub, abre em outra aba`,
  privateRepo: "Repositório privado",
  backToDemo: "Voltar para a demo",
  pauseDemo: "Pausar demo",
  playDemo: "Tocar demo",
  demoLoop: "Demo em loop",
  liveApp: "App ao vivo",
  liveTitle: (name) => `${name}, app ao vivo`,
  prevMachine: "Máquina anterior",
  nextMachine: "Próxima máquina",
  noDemo: "Este não tem vídeo. O app ao vivo está a um clique.",
  reducedNote: "Movimento reduzido: a demo começa pausada.",
  demoLabel: (name) => `Demonstração de ${name}`,
  problem: "Problema",
  move: "Jogada",
  result: "Resultado",
  nextBoss: "Próximo chefão",
  appears: (boss) => `${boss} apareceu!`,
  moveOf: (index, total) => `Jogada ${index} de ${total}`,
  bossDown: "Chefão derrotado!",
  bosses: "Chefões",
  bossesBeaten: (count, total) => `Chefões vencidos: ${count} de ${total}`,
  bossCount: (count) => (count === 1 ? "1 chefão" : `${count} chefões`),
  pathIntro: "Do hospital e da sala de aula ao código.",
  defeated: "Derrotado",
  hp: "HP",
  questLog: "Diário de missões",
  experience: "Experiência",
  path: "O caminho diferente",
  clientProjects: "Projetos para clientes",
  sideQuests: "Missões paralelas",
  goThere: "Ir até lá",
  inventory: "Inventário",
  keyItems: "Itens-chave",
  locked: "Trancados",
  privateBuild: "Uso privado",
  privateBuilds: "Apps privados",
  privateGreeting: "Apps privados. Só os amigos entram, mas aqui está o que cada um faz.",
  languages: "Idiomas",
  education: "Formação",
  characterSheet: "Ficha do personagem",
  fastTravel: "Viagem rápida",
  go: "Ir",
  visited: "Visitado",
  contactTitle: "Mande uma carta",
  email: "E-mail",
  linkedin: "LinkedIn",
  github: "GitHub",
  resumePdf: "Currículo (PDF)",
  appsCount: (count) => (count === 1 ? "1 app" : `${count} apps`),
  exitArcade: "Sair para a cidade",
  toastExplored: (place, count, total) => `Explorado: ${place} (${count} de ${total})`,
  allExplored: "Au! Você explorou a cidade inteira.",
  appStack: "Todos os apps",
  places: {
    house: { title: "Casa", tag: "Sobre", sub: "Quem ele é", npc: "Matilda" },
    arcade: { title: "Fliperama", tag: "Apps", sub: "Apps públicos com demos para jogar ao vivo", npc: "Atendente" },
    auction: { title: "Casa de leilões", tag: "Emprego atual", sub: "Onde ele trabalha agora", npc: "Leiloeiro" },
    harbor: { title: "Porto", tag: "Exterior", sub: "Trabalhos remotos do outro lado do mar", npc: "Mestre do porto" },
    fort: { title: "Arena do forte", tag: "Chefões", sub: "Projetos para clientes como chefões", npc: "Guarda do forte" },
    lighthouse: { title: "Farol", tag: "IA aplicada", sub: "Agentes, servidores MCP e Claude Code", npc: "Faroleiro" },
    school: { title: "Escola", tag: "Estudos", sub: "Ensino, formação e idiomas", npc: "Professora" },
    hospital: { title: "Hospital", tag: "Saúde", sub: "Os anos antes do código", npc: "Enfermeira" },
    bridge: { title: "A ponte", tag: "A virada", sub: "Da saúde para o software", npc: "Placa" },
    post: { title: "Correio", tag: "Contato", sub: "E-mail, LinkedIn, GitHub e currículo", npc: "Carteiro" },
  },
  houseTitle: (firstName) => `Casa do ${firstName}`,
  greetings: {
    house: (firstName) => `Au! Aqui mora o ${firstName}. Lá dentro: quem ele é, numa página só.`,
    arcade: (count) => `Bem-vindo ao fliperama. ${count} máquinas, ${count} apps. Chegue perto de uma para ver a demo e jogar ao vivo.`,
    harbor: "Os navios deste píer levam a trabalhos remotos do outro lado do mar.",
    fort: (count) => `${count} chefões de projetos para clientes. Escolha um e veja a luta.`,
    lighthouse: "A luz daqui agora funciona com agentes.",
    school: "Aqui ficam as salas de aula, os diplomas e os idiomas.",
    hospital: "Antes do código, veio a saúde.",
    bridge: "A ponte entre duas carreiras.",
    post: (firstName) => `Carta para o ${firstName}? Escolha como falar com ele.`,
  },
  intro: ["Au! A Matilda vai seguir você. Cada prédio da cidade é um capítulo da história.", "Ande com as setas ou WASD, ou clique num lugar para ir até lá. A visão rápida mostra tudo numa página simples."],
  introTouch: ["Au! A Matilda vai seguir você. Cada prédio da cidade é um capítulo da história.", "Toque num lugar para ir até lá. A visão rápida mostra tudo numa página simples."],
  lines: {
    kid: () => "Já foi no fliperama? É o prédio roxo, logo ali em cima.",
    keeper: () => "O forte guarda os chefões. O farol guarda o trabalho com IA.",
    nurse: (firstName) => `A história do ${firstName} começa neste hospital. A escola fica do outro lado da rua.`,
    welcome: (firstName) => `Porto Magalhães. Cada prédio é um capítulo da história do ${firstName}.`,
    attendant: () => "O canto isolado guarda os apps privados. Pode olhar, mas não pode jogar.",
    board: () => "Quadro de recordes. Cada máquina daqui saiu do primeiro commit e foi para o ar.",
  },
  speakers: { matilda: "Matilda", sign: "Placa", attendant: "Atendente", kid: "Criança", keeper: "Faroleiro", nurse: "Enfermeira", harbor: "Mestre do porto", teacher: "Professora", clerk: "Carteiro", auctioneer: "Leiloeiro", guard: "Guarda do forte" },
  auctionFallback: "Escritório",
};

const copies: Record<Locale, OverworldCopy> = { en, pt };

export function overworldCopy(locale: Locale): OverworldCopy {
  return copies[locale];
}
