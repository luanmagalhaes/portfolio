# Luan Magalhães · Portfolio

The same portfolio played three ways, plus a plain page for anyone in a hurry.

Live at [luanmagalhaes.vercel.app](https://luanmagalhaes.vercel.app).

| Route | What it is |
| --- | --- |
| `/` | Version picker |
| `/arcade` | A CRT game room where every app is a cartridge you can play live |
| `/overworld` | A top-down seaside town where every building is a chapter |
| `/journey` | A side-scroller through the career, with checkpoints, bosses and bonus stages |
| `/quick` | Everything on one page, no game, server-rendered |

Every route also exists in Brazilian Portuguese under `/pt`.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind 4, Vitest, Playwright and axe-core, deployed on Vercel. All pixel art is original and was drawn for this project.

## Architecture

- **One source of truth.** All portfolio content lives in `src/content` as typed, bilingual data (`Localized<T>`). `resolveLocale` turns it into a plain, single-language `Portfolio` before it reaches any component.
- **Three presentations, one model.** Each version lives in its own folder (`src/components/arcade`, `overworld`, `journey`) and only receives the resolved `Portfolio` through props. Adding an app, a job or a case study means adding data, never editing a component.
- **Small, focused modules.** UI copy is owned by each version (`copy.ts`), routes come from one helper (`src/lib/routes.ts`), and game state and geometry are pure modules covered by unit tests.
- **Progressive by default.** The quick view is fully server-rendered, every game links to it, and there is a `noscript` fallback.

## Quality

- Unit tests for content integrity, routing, assets and the game logic of each version.
- End-to-end tests on desktop, tablet and phone for every route: HTTP status, console errors, horizontal overflow, clipped or broken text, button text that overflows its button from 320 to 414 px, internal links, alt text and WCAG 2.1 AA checks with axe.
- Keyboard navigation with visible focus, `prefers-reduced-motion` support, sound off by default and a custom 404 page.

## Scripts

```bash
pnpm dev        # development server
pnpm build      # production build
pnpm test       # unit tests
pnpm e2e        # end-to-end tests against a production build
pnpm typecheck  # TypeScript
pnpm lint       # ESLint
```
