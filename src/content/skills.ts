import type { EducationContent, LanguageContent, SkillGroupContent } from "@/domain/portfolio";

export const skills: SkillGroupContent[] = [
  {
    id: "engineering",
    name: { en: "Engineering", pt: "Engenharia" },
    items: {
      en: ["Clean Architecture and DDD", "Micro-frontends and microservices", "Code review and mentoring", "Concurrency and idempotency", "Vitest, Jest, Testing Library, supertest, Playwright and Cypress"],
      pt: ["Clean Architecture e DDD", "Micro-frontends e microserviços", "Code review e mentoria", "Concorrência e idempotência", "Vitest, Jest, Testing Library, supertest, Playwright e Cypress"],
    },
  },
  {
    id: "ai",
    name: { en: "AI", pt: "IA" },
    items: {
      en: ["Claude Code (multi-agent workflows, subagents, skills and hooks)", "Anthropic SDK", "OpenAI and Azure OpenAI", "Tool use and agent loops", "MCP servers in Python and TypeScript", "LangChain.js and LangGraph", "Vercel AI SDK", "Whisper", "Structured output with Zod", "Prompt caching"],
      pt: ["Claude Code (workflows com vários agentes, subagentes, skills e hooks)", "Anthropic SDK", "OpenAI e Azure OpenAI", "Tool use e loop de agente", "Servidores MCP em Python e TypeScript", "LangChain.js e LangGraph", "Vercel AI SDK", "Whisper", "Saída estruturada com Zod", "Prompt caching"],
    },
  },
  {
    id: "front-end",
    name: { en: "Front-end", pt: "Front-end" },
    items: {
      en: ["TypeScript", "React 18 and 19", "Next.js 14 to 16", "Tailwind 4", "Radix and shadcn", "Storybook", "next-intl", "Module Federation", "SSR and technical SEO", "Angular"],
      pt: ["TypeScript", "React 18 e 19", "Next.js 14 a 16", "Tailwind 4", "Radix e shadcn", "Storybook", "next-intl", "Module Federation", "SSR e SEO técnico", "Angular"],
    },
  },
  {
    id: "back-end",
    name: { en: "Back-end", pt: "Back-end" },
    items: {
      en: ["Node.js", "NestJS", "Express", "Python", "Django and DRF", "Celery", "Go", "PHP", "REST", "GraphQL", "OpenAPI"],
      pt: ["Node.js", "NestJS", "Express", "Python", "Django e DRF", "Celery", "Go", "PHP", "REST", "GraphQL", "OpenAPI"],
    },
  },
  {
    id: "data-infra",
    name: { en: "Data and infra", pt: "Dados e infra" },
    items: {
      en: ["PostgreSQL", "Prisma", "Supabase (Realtime, RLS)", "Redis", "Docker", "Azure", "Vercel", "GitHub Actions", "AWS"],
      pt: ["PostgreSQL", "Prisma", "Supabase (Realtime, RLS)", "Redis", "Docker", "Azure", "Vercel", "GitHub Actions", "AWS"],
    },
  },
  {
    id: "integrations",
    name: { en: "Integrations", pt: "Integrações" },
    items: {
      en: ["Asaas (PIX, cards and payment split)", "Shopify Admin API", "WhatsApp Cloud API", "Clerk", "100ms", "Server-side GA4", "PostHog", "Better Stack", "Resend"],
      pt: ["Asaas (PIX, cartão e split)", "Shopify Admin API", "WhatsApp Cloud API", "Clerk", "100ms", "GA4 server-side", "PostHog", "Better Stack", "Resend"],
    },
  },
];

export const education: EducationContent[] = [
  {
    id: "technologist",
    title: { en: "Internet Systems Development (technologist degree)", pt: "Tecnologia em Sistemas para Internet" },
    school: { en: "Unicesumar", pt: "Unicesumar" },
    period: { en: "2025", pt: "2025" },
  },
  {
    id: "msc",
    title: { en: "MSc in Interactive Processes of Organs and Systems", pt: "Mestrado em Processos Interativos dos Órgãos e Sistemas" },
    school: { en: "Federal University of Bahia", pt: "UFBA" },
    period: { en: "2022", pt: "2022" },
  },
  {
    id: "manitoba",
    title: { en: "Health Sciences exchange on a selective scholarship, with intensive English", pt: "Intercâmbio em Ciências da Saúde com bolsa de programa seletivo e curso intensivo de inglês" },
    school: { en: "University of Manitoba, Canada", pt: "University of Manitoba, Canadá" },
    period: { en: "2014 to 2015", pt: "2014 e 2015" },
  },
  {
    id: "bsc",
    title: { en: "BSc in Speech-Language Pathology", pt: "Fonoaudiologia" },
    school: { en: "State University of Bahia", pt: "UNEB" },
    period: { en: "2015", pt: "2015" },
  },
];

export const languages: LanguageContent[] = [
  { id: "portuguese", name: { en: "Portuguese", pt: "Português" }, level: { en: "Native", pt: "Nativo" } },
  { id: "english", name: { en: "English", pt: "Inglês" }, level: { en: "Proficient (C2)", pt: "Proficiente (C2)" } },
  { id: "italian", name: { en: "Italian", pt: "Italiano" }, level: { en: "Basic", pt: "Básico" } },
];
