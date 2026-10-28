import type { AiProjectContent, AppContent, AppDemo, MediaSet, PrivateAppContent } from "@/domain/portfolio";

function media(id: string, format: "portrait" | "landscape"): MediaSet {
  return { mp4: `/demos/${id}-${format}.mp4`, webm: `/demos/${id}-${format}.webm`, poster: `/demos/${id}-${format}.jpg` };
}

function demoFor(id: string): AppDemo {
  return { portrait: media(id, "portrait"), landscape: media(id, "landscape") };
}

export const appStack = ["Next.js 16", "React 19", "Tailwind 4", "Supabase", "Vitest", "Vercel"];

export const apps: AppContent[] = [
  {
    id: "vitrola",
    name: "Vitrola",
    pitch: {
      en: "Music game: it plays a 30-second preview from the Deezer API and you place the song on your timeline by release year.",
      pt: "Jogo musical: toca 30 segundos (prévia pela API do Deezer) e você encaixa a música na sua linha do tempo pelo ano.",
    },
    daysToBuild: 9,
    liveUrl: "https://a-vitrola.vercel.app",
    codeUrl: "https://github.com/luanmagalhaes/vitrola",
    emblem: "app-vitrola",
    poster: "/apps/vitrola.png",
    demo: demoFor("vitrola"),
  },
  {
    id: "cantarola",
    name: "Cantarolá",
    pitch: {
      en: "Musical party game in teams, with an online mode that streams live microphone audio.",
      pt: "Party game musical em times, com versão online que transmite o áudio do microfone ao vivo.",
    },
    daysToBuild: 3,
    liveUrl: "https://cantarola.vercel.app",
    codeUrl: "https://github.com/luanmagalhaes/cantarola",
    emblem: "app-cantarola",
    poster: "/apps/cantarola.png",
    demo: demoFor("cantarola"),
  },
  {
    id: "nao-vale",
    name: "Não Vale",
    pitch: {
      en: "Forbidden words game: the other team's judge sees the card on their own phone.",
      pt: "Palavras proibidas, com o juiz do time adversário vendo a carta no próprio celular.",
    },
    daysToBuild: 3,
    liveUrl: "https://nao-vale.vercel.app",
    codeUrl: "https://github.com/luanmagalhaes/nao-vale",
    emblem: "app-nao-vale",
    poster: "/apps/nao-vale.png",
    demo: demoFor("nao-vale"),
  },
  {
    id: "flow",
    name: "FLOW",
    pitch: {
      en: "Everyone writes what they think the table will write. 3 to 12 players, each on their own phone.",
      pt: "Cada um escreve o que acha que a mesa vai escrever. De 3 a 12 jogadores, cada um no seu celular.",
    },
    daysToBuild: 6,
    liveUrl: "https://flow-seven-amber.vercel.app",
    codeUrl: "https://github.com/luanmagalhaes/flow",
    emblem: "app-flow",
    poster: "/apps/flow.png",
    demo: demoFor("flow"),
  },
  {
    id: "de-fininho",
    name: "De Fininho",
    pitch: {
      en: "Each player gets secret phrases to slip into the conversation without anyone noticing.",
      pt: "Cada jogador tem frases secretas para encaixar na conversa sem ninguém perceber.",
    },
    daysToBuild: 2,
    liveUrl: "https://de-fininho.vercel.app",
    codeUrl: "https://github.com/luanmagalhaes/de-fininho",
    emblem: "app-de-fininho",
    poster: "/apps/de-fininho.png",
    demo: demoFor("de-fininho"),
  },
  {
    id: "flip-score",
    name: "Flip Score",
    pitch: {
      en: "Scoreboard for card game nights, with player photos and the race to 200 points.",
      pt: "Placar das noites de cartas, com a foto de quem está jogando e a corrida até 200 pontos.",
    },
    daysToBuild: 5,
    liveUrl: "https://flip-score.vercel.app",
    codeUrl: "https://github.com/luanmagalhaes/flip-score",
    emblem: "app-flip-score",
    poster: "/apps/flip-score.png",
    demo: demoFor("flip-score"),
  },
  {
    id: "la-cuentita",
    name: "La Cuentita",
    pitch: {
      en: "Does the table's bill math on card game night, no calculator needed.",
      pt: "Faz a conta da mesa na noite de cartas, sem calculadora.",
    },
    daysToBuild: 2,
    liveUrl: "https://la-cuentita-green.vercel.app",
    codeUrl: "https://github.com/luanmagalhaes/la-cuentita",
    emblem: "app-la-cuentita",
    poster: "/apps/la-cuentita.png",
    demo: demoFor("la-cuentita"),
  },
  {
    id: "abece",
    name: "ABÊCÊ",
    pitch: {
      en: "Wheel that draws the round's category, with a player scoreboard and categories in Portuguese and English.",
      pt: "Roleta que sorteia a categoria da rodada, com placar dos jogadores e categorias em português e inglês.",
    },
    daysToBuild: 1,
    liveUrl: "https://o-abece.vercel.app",
    codeUrl: null,
    emblem: "app-abece",
    poster: "/apps/abece.png",
    demo: null,
  },
];

export const privateApps: PrivateAppContent[] = [
  {
    id: "reps",
    name: "Reps",
    pitch: {
      en: "Workout tracker with a dashboard for my personal trainer and a rest timer that alerts with the app closed.",
      pt: "Treino com painel para o meu personal e timer de descanso que avisa com o app fechado.",
    },
    emblem: "private-reps",
  },
  {
    id: "matilda",
    name: "Matilda",
    pitch: {
      en: "Baths, vaccines, food and expenses for my dog, with PIN access and per-tab permissions.",
      pt: "Banhos, vacinas, ração e gastos da minha cachorra, com acesso por PIN e permissão por aba.",
    },
    emblem: "private-matilda",
  },
  {
    id: "washing-issues",
    name: "Washing Issues",
    pitch: {
      en: "Prototype for my building's laundry: residents send their list with photos and the staff logs washing and pickup.",
      pt: "Protótipo da lavanderia do prédio: o morador envia o rol com fotos e a equipe registra lavagem e retirada.",
    },
    emblem: "private-washing-issues",
  },
  {
    id: "game-night",
    name: "Game Night",
    pitch: {
      en: "Our game nights, with guests, attendance, games and photos.",
      pt: "As noites de jogos, com convidados, presença, jogos e fotos.",
    },
    emblem: "private-game-night",
  },
  {
    id: "regalo",
    name: "Regalo",
    pitch: {
      en: "Gift list for our group of friends.",
      pt: "Lista de presentes da turma.",
    },
    emblem: "private-regalo",
  },
];

export const aiProjects: AiProjectContent[] = [
  {
    id: "pataka",
    name: { en: "Pataka", pt: "Pataka" },
    status: { en: "In development, with a partner", pt: "Em desenvolvimento, com um sócio" },
    summary: {
      en: "Follow-up for speech therapy patients between sessions, over WhatsApp. Pipeline on the Anthropic SDK with a router (Haiku), a generator (Opus) and a reviewer that rejects or rewrites the answer, Zod-validated output, prompt caching, a deterministic safety filter and audio transcription with Whisper.",
      pt: "Acompanhamento de pacientes de fonoaudiologia entre as sessões, pelo WhatsApp. Pipeline no SDK da Anthropic com roteador (Haiku), gerador (Opus) e revisor que reprova ou reescreve a resposta, saída validada com Zod, prompt caching, filtro de segurança determinístico e transcrição de áudio por Whisper.",
    },
    emblem: "ai-pataka",
  },
  {
    id: "mcp-servers",
    name: { en: "MCP servers", pt: "Servidores MCP" },
    status: null,
    summary: {
      en: "One in Python (FastMCP, stdio and token-authenticated HTTP) to log work hours through Claude, one in Node that syncs a bug board with Notion, and a media brief analyzer with a LangGraph agent using its own MCP server.",
      pt: "Um em Python (FastMCP, stdio e HTTP com token) para registrar horas pelo Claude, outro em Node que sincroniza um board de bugs com o Notion, e um analisador de briefing de mídia com agente LangGraph usando MCP próprio.",
    },
    emblem: "ai-mcp",
  },
  {
    id: "claude-code",
    name: { en: "Custom Claude Code setup", pt: "Claude Code sob medida" },
    status: null,
    summary: {
      en: "A subagent that challenges the proposed solution with evidence from the repository before any code is written, a hook that uses the TypeScript compiler to block forbidden patterns, PR workflow skills and verification workflows with more than 100 subagents.",
      pt: "Subagente que contesta a solução antes de codar com evidência do repositório, hook que usa o compilador TypeScript para barrar padrões proibidos, skills de fluxo de PR e workflows de verificação com mais de 100 subagentes.",
    },
    emblem: "ai-terminal",
  },
];
