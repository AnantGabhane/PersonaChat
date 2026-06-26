# AGENTS.md

## Project Overview

Next.js 14 App Router app for chatting with AI personas (Hitesh Choudhary, Piyush Garg) via OpenAI API. Deployed on Vercel.

## Commands

```bash
npm run dev      # Dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint (next lint)
npm start        # Production server
npm test         # Run tests (Vitest)
npm run test:watch  # Tests in watch mode
```

## Architecture

- **Entry**: `app/page.tsx` → `app/components/App.tsx` (client component with sidebar layout)
- **API**: Single route at `app/api/chat/route.ts` — POST with `{ message, persona, settings, enableHinglish }`
- **Auth**: Clerk middleware in `middleware.ts`, `ClerkProvider` in layout
- **Components**: `app/components/App.tsx` (main), legacy components (ChatDemo, Features, Footer, HeroSection)
- **Styling**: Tailwind CSS + CSS custom properties for dark mode
- **Tests**: Vitest + Testing Library in `app/test/`

## Key Details

- **Path alias**: `@/*` maps to project root
- **OpenAI model fallback chain**: `OPENAI_MODEL` env → `gpt-4.1-mini` → `gpt-4.1`
- **Personas**: Defined in `route.ts` as `PERSONA_PROMPTS` (hitesh, piyush, plus english variants)
- **Tones**: default, funny, advice, educational (in `TONE_MODIFIERS`)
- **Auth**: 3 free prompts, then login required. Clerk handles sign-up/sign-in/user display
- **Dark mode**: CSS selectors override Tailwind classes under `html.dark`
- **Hinglish toggle**: Sends `enableHinglish` to API, switches between hinglish/english prompts

## Environment

Required in `.env.local`:
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini  # optional, has fallbacks
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

## Linting

ESLint config in `.eslintrc.cjs`:
- `@typescript-eslint/no-unused-vars`: warn
- `@typescript-eslint/no-explicit-any`: warn
- `react/react-in-jsx-scope`: off
