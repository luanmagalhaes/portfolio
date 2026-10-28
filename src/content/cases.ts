import type { CaseContent } from "@/domain/portfolio";

export const cases: CaseContent[] = [
  {
    id: "session-thief",
    boss: { en: "The Session Thief", pt: "O Ladrão de Sessão" },
    client: { en: "Multi-tenant e-commerce ERP", pt: "ERP multi-tenant de e-commerce" },
    problem: {
      en: "Users were logged out after a few minutes idle. Several parallel requests renewed the same refresh token at the same time, and the API revoked the session for reuse.",
      pt: "A sessão caía depois de alguns minutos parado. Várias requisições renovavam o mesmo refresh token ao mesmo tempo, e a API derrubava a sessão por reuso.",
    },
    moves: {
      en: ["Traced the logout to parallel requests renewing the same refresh token.", "Replaced them with one shared renewal that every request waits for."],
      pt: ["Rastreei a queda até as requisições paralelas renovando o mesmo refresh token.", "Troquei por uma renovação única, compartilhada entre as requisições."],
    },
    result: { en: "Sessions stopped dropping.", pt: "A sessão parou de cair." },
    stack: ["Next.js", "NestJS", "TypeScript"],
  },
  {
    id: "ghost-conversions",
    boss: { en: "The Ghost Conversions", pt: "As Conversões Fantasmas" },
    client: { en: "Driving school, online course checkout", pt: "Escola de trânsito, checkout do curso online" },
    problem: {
      en: "Sales were not showing up as conversions in Google Ads. The success page was not a real URL and the event depended on the buyer keeping the tab open.",
      pt: "As vendas não apareciam como conversão no Google Ads. A página de sucesso não era uma URL de verdade e o evento dependia da aba aberta.",
    },
    moves: {
      en: ["Moved conversion tracking to the server, fired by the payment webhook.", "Sent it through the GA4 Measurement Protocol, deduplicated per transaction."],
      pt: ["Passei a conversão para o servidor, disparada pelo webhook do pagamento.", "Enviei pelo GA4 Measurement Protocol, com deduplicação por transação."],
    },
    result: { en: "Fixed in one day.", pt: "Corrigido em um dia." },
    stack: ["Next.js", "Asaas", "GA4"],
  },
  {
    id: "many-keys",
    boss: { en: "The 2,569 Keys", pt: "As 2.569 Chaves" },
    client: { en: "Multi-tenant e-commerce ERP", pt: "ERP multi-tenant de e-commerce" },
    problem: {
      en: "The whole app had to work in English and Mandarin.",
      pt: "O app inteiro precisava funcionar em inglês e mandarim.",
    },
    moves: {
      en: [
        "Split the code into areas and ran 17 AI agents in parallel, one per area.",
        "Checked key parity between languages by script.",
        "Picked the language by cookie, so the multi-tenant domains kept working.",
      ],
      pt: [
        "Dividi o código em áreas e coloquei 17 agentes de IA em paralelo, um por área.",
        "Conferi a paridade das chaves entre os idiomas por script.",
        "Escolhi o idioma por cookie, para não quebrar o multi-tenant por domínio.",
      ],
    },
    result: { en: "2,569 keys across 189 files, with a green build.", pt: "2.569 chaves em 189 arquivos, com build verde." },
    stack: ["Next.js", "next-intl", "TypeScript"],
  },
  {
    id: "ten-day-launch",
    boss: { en: "The 10-Day Launch", pt: "O Lançamento em 10 Dias" },
    client: { en: "Driving school, online course checkout", pt: "Escola de trânsito, checkout do curso online" },
    problem: {
      en: "The school wanted to sell a live online course, but the class platform was not ready.",
      pt: "A escola queria vender um curso online ao vivo, mas a plataforma de aulas não estava pronta.",
    },
    moves: {
      en: [
        "Changed the plan with the client during the presentation: sell first and test demand before building the platform.",
        "Built the SSR landing and a step-by-step Asaas checkout (PIX and card) with commission split, order bump and an idempotent webhook.",
      ],
      pt: [
        "Mudamos o plano junto com o cliente na apresentação: vender primeiro e testar a demanda antes de construir a plataforma.",
        "Fiz a landing com SSR e o checkout em etapas no Asaas (PIX e cartão), com split da comissão, order bump e webhook idempotente.",
      ],
    },
    result: { en: "Checkout live in 10 days, from the July 3 presentation to July 13.", pt: "Checkout no ar em 10 dias, da apresentação de 3 de julho ao dia 13." },
    stack: ["Next.js", "Asaas", "Docker", "Coolify"],
  },
  {
    id: "order-inbox",
    boss: { en: "The Order Inbox", pt: "A Caixa de Pedidos" },
    client: { en: "E-commerce brand, B2B orders", pt: "Marca de e-commerce, pedidos B2B" },
    problem: {
      en: "B2B orders arrived by email, with PDF and Excel files, and were handled by hand.",
      pt: "Os pedidos B2B chegavam por e-mail, com PDF e Excel, e eram tratados à mão.",
    },
    moves: {
      en: [
        "Mapped the pain points of the operation.",
        "Turned the manual process into 7 agent tools: read orders from email, extract PDF and Excel, check stock and create a Shopify draft order.",
        "Kept a human review before confirmation and streamed the agent's activity live over SSE.",
      ],
      pt: [
        "Levantei as dores da operação.",
        "Transformei o processo manual em 7 ferramentas do agente: ler pedidos no e-mail, extrair PDF e Excel, conferir estoque e criar rascunho de pedido no Shopify.",
        "Mantive revisão humana antes de confirmar e transmiti a atividade do agente ao vivo por SSE.",
      ],
    },
    result: {
      en: "Prototype delivered in 5 days with the Anthropic SDK, plus a LangGraph version to compare both approaches.",
      pt: "Protótipo entregue em 5 dias com o SDK da Anthropic, mais uma versão em LangGraph para comparar as duas abordagens.",
    },
    stack: ["Anthropic SDK", "LangGraph", "Shopify", "SSE"],
  },
  {
    id: "two-reacts",
    boss: { en: "The Two Reacts", pt: "Os Dois Reacts" },
    client: { en: "Live class platform (SaaS), as lead developer", pt: "Plataforma de aulas ao vivo (SaaS), como dev principal" },
    problem: {
      en: "The ready-made 100ms video room had no translation and did not run on React 19.",
      pt: "A sala de vídeo pronta da 100ms não tinha tradução e não rodava no React 19.",
    },
    moves: {
      en: ["Isolated the room in a Vite sub-app with React 18, served on the same domain.", "Translated the bundle by script, 169 terms, with a warning when the package version changes."],
      pt: ["Isolei a sala num sub-app Vite com React 18, servido no mesmo domínio.", "Traduzi o bundle por script, 169 termos, com aviso quando a versão do pacote muda."],
    },
    result: { en: "The room runs alongside React 19, with a translated interface.", pt: "A sala roda junto com o React 19, com a interface traduzida." },
    stack: ["Vite", "React", "100ms", "Next.js"],
  },
];
