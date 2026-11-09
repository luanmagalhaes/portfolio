import type { Locale } from "@/domain/locale";

export interface Dictionary {
  skipToContent: string;
  backToVersions: string;
  chooseVersion: string;
  versionsIntro: string;
  play: string;
  quickViewLink: string;
  languageLabel: string;
  player: string;
  sections: string;
  quickView: string;
  quickViewHint: string;
  otherLanguage: string;
  otherLanguageLabel: string;
  about: string;
  apps: string;
  appsIntro: string;
  bosses: string;
  bossesIntro: string;
  career: string;
  path: string;
  pathIntro: string;
  ai: string;
  privateBuilds: string;
  privateBuildsIntro: string;
  privateBuild: string;
  skills: string;
  education: string;
  languages: string;
  contact: string;
  email: string;
  downloadResume: string;
  playLive: string;
  openApp: string;
  sourceCode: string;
  privateCode: string;
  problem: string;
  moves: string;
  result: string;
  appStack: string;
  builtIn: (days: number) => string;
  screenshotOf: (name: string) => string;
  demoOf: (name: string) => string;
  playLiveLabel: (name: string) => string;
  sourceCodeLabel: (name: string) => string;
  footer: string;
}

const en: Dictionary = {
  skipToContent: "Skip to content",
  backToVersions: "Versions",
  chooseVersion: "Choose your version",
  versionsIntro: "The same portfolio as three different games. Pick one, or open the quick view if you are in a hurry.",
  play: "Play",
  quickViewLink: "Quick view, no game",
  languageLabel: "Language",
  player: "Player 1",
  sections: "Sections",
  quickView: "Quick view",
  quickViewHint: "Everything on one page, no game needed.",
  otherLanguage: "Português",
  otherLanguageLabel: "Ver em português",
  about: "About",
  apps: "Apps I built",
  appsIntro: "Party games and tools for my friends' game nights, each built solo from first commit to production.",
  bosses: "Boss fights",
  bossesIntro: "Hard problems from client projects. Client names stay confidential.",
  career: "Experience",
  path: "The unusual path",
  pathIntro: "From hospitals and classrooms to code.",
  ai: "Applied AI",
  privateBuilds: "Private builds",
  privateBuildsIntro: "Apps for my own routine, with no public link.",
  privateBuild: "Private build",
  skills: "Skills",
  education: "Education",
  languages: "Languages",
  contact: "Contact",
  email: "Email",
  downloadResume: "Download résumé (PDF)",
  playLive: "Play live",
  openApp: "Open app",
  sourceCode: "Source code",
  privateCode: "Private repository",
  problem: "Problem",
  moves: "Moves",
  result: "Result",
  appStack: "Every app:",
  builtIn: (days) => (days === 1 ? "Built in 1 day" : `Built in ${days} days`),
  screenshotOf: (name) => `Screenshot of ${name}`,
  demoOf: (name) => `Short demo of ${name}`,
  playLiveLabel: (name) => `Play live: ${name} (opens in a new tab)`,
  sourceCodeLabel: (name) => `Source code: ${name} on GitHub`,
  footer: "Built with Next.js 16, React 19 and original pixel art.",
};

const pt: Dictionary = {
  skipToContent: "Pular para o conteúdo",
  backToVersions: "Versões",
  chooseVersion: "Escolha a sua versão",
  versionsIntro: "O mesmo portfólio em três jogos diferentes. Escolha um, ou abra a visão rápida se estiver com pressa.",
  play: "Jogar",
  quickViewLink: "Visão rápida, sem jogo",
  languageLabel: "Idioma",
  player: "Jogador 1",
  sections: "Seções",
  quickView: "Visão rápida",
  quickViewHint: "Tudo numa página só, sem precisar jogar.",
  otherLanguage: "English",
  otherLanguageLabel: "View in English",
  about: "Sobre",
  apps: "Apps que eu fiz",
  appsIntro: "Party games e ferramentas para as noites de jogos com os amigos, cada um feito sozinho do primeiro commit à produção.",
  bosses: "Chefões",
  bossesIntro: "Problemas difíceis de projetos para clientes. O nome dos clientes fica em sigilo.",
  career: "Experiência",
  path: "O caminho diferente",
  pathIntro: "Do hospital e da sala de aula ao código.",
  ai: "IA aplicada",
  privateBuilds: "Apps privados",
  privateBuildsIntro: "Apps para a minha rotina, sem link público.",
  privateBuild: "Uso privado",
  skills: "Competências",
  education: "Formação",
  languages: "Idiomas",
  contact: "Contato",
  email: "E-mail",
  downloadResume: "Baixar currículo (PDF)",
  playLive: "Jogar ao vivo",
  openApp: "Abrir app",
  sourceCode: "Código",
  privateCode: "Repositório privado",
  problem: "Problema",
  moves: "Jogadas",
  result: "Resultado",
  appStack: "Todos os apps:",
  builtIn: (days) => (days === 1 ? "Feito em 1 dia" : `Feito em ${days} dias`),
  screenshotOf: (name) => `Print de ${name}`,
  demoOf: (name) => `Demonstração curta de ${name}`,
  playLiveLabel: (name) => `Jogar ao vivo: ${name} (abre em outra aba)`,
  sourceCodeLabel: (name) => `Código: ${name} no GitHub`,
  footer: "Feito com Next.js 16, React 19 e pixel art original.",
};

const dictionaries: Record<Locale, Dictionary> = { en, pt };

export function dictionaryFor(locale: Locale): Dictionary {
  return dictionaries[locale];
}
