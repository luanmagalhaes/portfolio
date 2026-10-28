import type { ProfileContent } from "@/domain/portfolio";

export const profile: ProfileContent = {
  name: "Luan Magalhães",
  title: {
    en: "Senior Software Engineer\u00a0· Full Stack and AI",
    pt: "Engenheiro de software sênior\u00a0· Full stack e IA",
  },
  location: {
    en: "Brazil, remote (UTC-3)",
    pt: "Brasil, remoto (UTC-3)",
  },
  email: "magalhaaes@gmail.com",
  linkedin: "https://www.linkedin.com/in/luan-magalhaes-dev/",
  github: "https://github.com/luanmagalhaes",
  summary: {
    en: "Senior software engineer working full stack since 2021, on products for European companies (Denmark and Germany) and for a credit marketplace in Brazil. I learned to build software before AI coding tools became common, writing everything by hand: architecture, tests, code review and debugging concurrency bugs. Today I use AI to speed up development, with Claude Code and parallel agents, and inside the product, with LLM-based conversation analysis, tool-using agents and MCP servers. I work close to clients, from gathering requirements to a working prototype in production within a few days. Proficient English (C2): I taught English for five years and studied at the University of Manitoba, Canada, on a selective scholarship program. Technologist degree in Internet Systems Development (Unicesumar, 2025), MSc from the Federal University of Bahia and former speech-language pathologist.",
    pt: "Engenheiro de software sênior com atuação full stack desde 2021, em produtos de empresas europeias (Dinamarca e Alemanha) e em um marketplace de crédito no Brasil. Aprendi a programar antes da popularização da IA para código e construí minha base escrevendo tudo à mão: arquitetura, testes, code review e investigação de bugs de concorrência. Hoje uso IA para acelerar o desenvolvimento, com Claude Code e agentes em paralelo, e dentro do produto, com análise de conversas por LLM, agentes com tool use e servidores MCP. Trabalho próximo do cliente, do levantamento de requisitos ao protótipo em produção em poucos dias. Inglês proficiente (C2): fui professor por cinco anos e estudei na University of Manitoba, no Canadá, com bolsa de um programa seletivo. Tecnólogo em Sistemas para Internet (Unicesumar, 2025), mestre pela UFBA e ex-fonoaudiólogo.",
  },
  resume: {
    en: "/resume/luan-magalhaes-resume.pdf",
    pt: "/resume/luan-magalhaes-curriculo.pdf",
  },
  stats: [
    { id: "class", label: { en: "Class", pt: "Classe" }, value: { en: "Full stack and AI, front-end focus", pt: "Full stack e IA, foco em front-end" } },
    { id: "since", label: { en: "Coding professionally since", pt: "Programando profissionalmente desde" }, value: { en: "2021", pt: "2021" } },
    { id: "base", label: { en: "Base", pt: "Base" }, value: { en: "Brazil, remote (UTC-3)", pt: "Brasil, remoto (UTC-3)" } },
    { id: "languages", label: { en: "Languages", pt: "Idiomas" }, value: { en: "Portuguese, English (C2), Italian", pt: "Português, inglês (C2), italiano" } },
    { id: "degrees", label: { en: "Degrees", pt: "Formação" }, value: { en: "Internet Systems Development (2025), MSc (2022)", pt: "Sistemas para Internet (2025), mestrado (2022)" } },
  ],
};
