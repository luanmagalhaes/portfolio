import type { JobContent, MilestoneContent } from "@/domain/portfolio";

export const jobs: JobContent[] = [
  {
    id: "antecipa-facil",
    company: "Antecipa Fácil",
    role: { en: "Full-stack software engineer", pt: "Engenheiro de software full-stack" },
    period: { en: "Dec 2022 to present", pt: "dez 2022 a atual" },
    place: { en: "Brazil, remote", pt: "Brasil, remoto" },
    about: {
      en: "Credit marketplace where companies sell their receivables through a reverse auction among funders.",
      pt: "Marketplace de crédito em que empresas antecipam recebíveis por leilão reverso entre financiadores.",
    },
    highlights: {
      en: [
        "Built the customer app from scratch, where I am the largest contributor, and the core back-office modules.",
        "Built LLM analysis for the chat between companies and funders (summary, sentiment, suggested replies and compliance alerts), with fallback from Azure OpenAI to Claude when the content filter blocks a request.",
        "Split the chat out of the Django monolith into a microservice with service-to-service auth, Celery and Azure APIM routing.",
        "Delivered the new onboarding end to end from the Lovable prototypes: around 40 screens, Google and Microsoft sign-in, document OCR, backend endpoints, tests and PostHog events, all behind feature flags.",
        "Redesigned the v2 front-end architecture with Clean Architecture and DDD. The migration doubled the company's revenue.",
        "Introduced Husky, ESLint, Storybook, Vitest and Playwright to the front-ends and wrote around 130 test files.",
      ],
      pt: [
        "Criei do zero o app do cliente, do qual sou o maior contribuidor, e os módulos centrais do backoffice.",
        "Construí a análise por LLM do chat entre empresas e financiadores (resumo, sentimento, respostas sugeridas e alertas de compliance), com fallback do Azure OpenAI para o Claude quando há recusa por filtro de conteúdo.",
        "Levei o chat do monólito Django para um microserviço com autenticação entre serviços, Celery e roteamento pelo Azure APIM.",
        "Fiz o novo onboarding de ponta a ponta a partir dos protótipos no Lovable: cerca de 40 telas, login com Google e Microsoft, OCR de documentos, endpoints no backend, testes e eventos PostHog, tudo atrás de feature flag.",
        "Na v2 da plataforma, redesenhei a arquitetura do front com Clean Architecture e DDD. A migração dobrou a receita da empresa.",
        "Levei Husky, ESLint, Storybook, Vitest e Playwright para os fronts e escrevi cerca de 130 arquivos de teste.",
      ],
    },
    stack: ["Next.js", "React", "TypeScript", "Python", "Django", "PostgreSQL", "Celery", "Azure", "OpenAI", "Anthropic", "PostHog"],
    emblem: "career-credit",
  },
  {
    id: "miinto",
    company: "Miinto",
    role: { en: "Frontend Engineer", pt: "Frontend Engineer" },
    period: { en: "Feb 2025 to Aug 2026", pt: "fev 2025 a ago 2026" },
    place: { en: "Denmark, remote", pt: "Dinamarca, remoto" },
    about: {
      en: "Fashion marketplace connecting independent boutiques and brands with customers across Europe.",
      pt: "Marketplace de moda que conecta boutiques independentes e marcas a clientes em vários países da Europa.",
    },
    highlights: {
      en: [
        "Maintained and extended the React design system (Stitches, Radix, Storybook, Jest) used by the store's micro-frontends.",
        "Redesigned the product listing page (filters, in-filter search, price filter, sorting and mobile version) and the account area (sign-up, login and profile), integrated with server-rendered Go micro-frontends.",
        "Handled technical SEO on the Go-rendered pages, with indexing rules for pagination and filter combinations, and the legal content across 12 sales channels.",
        "In the Module Federation back office, delivered the order email history end to end, with preview and resend.",
      ],
      pt: [
        "Mantive e ampliei o design system em React (Stitches, Radix, Storybook, Jest) usado pelos micro-frontends da loja.",
        "Redesenhei a listagem de produtos (filtros, busca no filtro, filtro de preço, ordenação e versão mobile) e a área logada (cadastro, login e perfil), integradas aos micro-frontends em Go com SSR.",
        "Cuidei do SEO técnico das páginas renderizadas em Go, com regras de indexação por paginação e por combinação de filtros, e do conteúdo legal em 12 canais de venda.",
        "No backoffice com Module Federation, entreguei o histórico de e-mails do pedido de ponta a ponta, com preview e reenvio.",
      ],
    },
    stack: ["React", "TypeScript", "Go", "Stitches", "Radix", "Storybook", "Module Federation", "Jest"],
    emblem: "career-fashion",
  },
  {
    id: "the-vintage-bar",
    company: "The Vintage Bar",
    role: { en: "Frontend Engineer", pt: "Frontend Engineer" },
    period: { en: "Aug 2024 to Feb 2025", pt: "ago 2024 a fev 2025" },
    place: { en: "Denmark, remote", pt: "Dinamarca, remoto" },
    about: {
      en: "Luxury fashion marketplace, now part of Miinto.",
      pt: "Marketplace de moda de luxo, hoje parte da Miinto.",
    },
    highlights: {
      en: ["Built dynamic filters, inventory management and backend integrations with Angular, TypeScript, PHP and Shopify."],
      pt: ["Desenvolvi filtros dinâmicos, gestão de estoque e integrações com o backend em Angular, TypeScript, PHP e Shopify."],
    },
    stack: ["Angular", "TypeScript", "PHP", "Shopify"],
    emblem: "career-fashion",
  },
  {
    id: "engel-voelkers",
    company: "Engel & Völkers",
    role: { en: "Front-end developer", pt: "Desenvolvedor front-end" },
    period: { en: "2022", pt: "2022" },
    place: { en: "Berlin, remote", pt: "Berlim, remoto" },
    about: {
      en: "Real estate company based in Germany.",
      pt: "Empresa do mercado imobiliário com sede na Alemanha.",
    },
    highlights: {
      en: ["Built the Smart Money homepage in React, GraphQL, DatoCMS and Auth0, then migrated it to Next.js."],
      pt: ["Fiz a home do Smart Money em React, GraphQL, DatoCMS e Auth0, depois migrada para Next.js."],
    },
    stack: ["React", "Next.js", "GraphQL", "DatoCMS", "Auth0"],
    emblem: "career-real-estate",
  },
  {
    id: "taghos",
    company: "Taghos Tecnologia",
    role: { en: "Front-end developer", pt: "Desenvolvedor front-end" },
    period: { en: "2021", pt: "2021" },
    place: { en: "Brazil", pt: "Brasil" },
    about: {
      en: "Brazilian technology company.",
      pt: "Empresa brasileira de tecnologia.",
    },
    highlights: {
      en: ["Built the subscription checkout for the Paulistão Play streaming service in React, TypeScript, Formik and Cypress."],
      pt: ["Fiz a tela de assinatura do Paulistão Play com React, TypeScript, Formik e Cypress."],
    },
    stack: ["React", "TypeScript", "Formik", "Cypress"],
    emblem: "career-streaming",
  },
];

export const milestones: MilestoneContent[] = [
  {
    id: "teaching",
    title: { en: "English teacher", pt: "Professor de inglês" },
    period: { en: "2011 to 2016", pt: "2011 a 2016" },
    summary: {
      en: "Taught English at CCAA for five years.",
      pt: "Dei aula de inglês no CCAA por cinco anos.",
    },
    emblem: "career-teaching",
  },
  {
    id: "canada",
    title: { en: "University of Manitoba, Canada", pt: "University of Manitoba, Canadá" },
    period: { en: "2014 to 2015", pt: "2014 e 2015" },
    summary: {
      en: "Health Sciences exchange on a selective scholarship program, with an intensive English course.",
      pt: "Intercâmbio em Ciências da Saúde com bolsa de um programa seletivo e curso intensivo de inglês.",
    },
    emblem: "career-canada",
  },
  {
    id: "healthcare",
    title: { en: "Speech-language pathologist", pt: "Fonoaudiólogo" },
    period: { en: "Until 2021", pt: "Até 2021" },
    summary: {
      en: "Worked in neonatal, pediatric and adult ICUs. In 2020, as product owner, I led a patient follow-up PWA in React and Firebase.",
      pt: "Trabalhei em UTI neonatal, pediátrica e adulta. Em 2020, como product owner, liderei um PWA de acompanhamento de pacientes em React e Firebase.",
    },
    emblem: "career-icu",
  },
  {
    id: "masters",
    title: { en: "MSc, Federal University of Bahia", pt: "Mestrado, UFBA" },
    period: { en: "2022", pt: "2022" },
    summary: {
      en: "Master's in Interactive Processes of Organs and Systems.",
      pt: "Mestrado em Processos Interativos dos Órgãos e Sistemas.",
    },
    emblem: "career-masters",
  },
  {
    id: "internet-systems",
    title: { en: "Internet Systems Development degree", pt: "Tecnólogo em Sistemas para Internet" },
    period: { en: "2025", pt: "2025" },
    summary: {
      en: "Technologist degree from Unicesumar, earned while already working as a developer.",
      pt: "Graduação tecnológica pela Unicesumar, concluída já trabalhando como desenvolvedor.",
    },
    emblem: "career-internet-systems",
  },
];
