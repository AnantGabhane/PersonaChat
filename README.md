# HPersona

Chat with AI-powered personas of popular Indian tech educators. Learn coding through fun, Hinglish conversations with **Hitesh Choudhary** and **Piyush Garg**.

## Live Demo

https://ai-persona.anantgabhane.com/

## What You Can Do

- **Chat with Hitesh Choudhary** — casual, chai-powered explanations of JavaScript, Python, web development, and DSA
- **Chat with Piyush Garg** — direct, practical answers on Docker, React, Node.js, and system design
- **Switch between personas** — each has its own accent color, conversation style, and message history
- **Toggle Hinglish** — chat in Hinglish (default) or switch to pure English
- **Adjust AI settings** — control temperature (creativity) and learning tone (Casual/Academic)
- **Dark mode** — warm dark theme for comfortable night-time learning
- **Markdown responses** — code blocks, headers, lists, and bold text render properly in chat

## UI Screenshots
Light Mode:
<img width="1733" height="1000" alt="image" src="https://github.com/user-attachments/assets/5ba6bff7-234f-4932-9e0e-ceccbf202eac" />

Dark Mode
<img width="1733" height="1000" alt="image" src="https://github.com/user-attachments/assets/1317df3d-8a0d-438a-b293-db1d267aaded" />


## Setup

### Prerequisites

- Node.js 18+
- An [OpenAI API key](https://platform.openai.com/api-keys)
- A [Clerk](https://clerk.com/) account (for authentication)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
# OpenAI (required for chat)
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-4.1-mini

# Clerk (required for authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-key
CLERK_SECRET_KEY=sk_test_your-clerk-key
```

You can copy from `.env.example` and fill in your keys.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Create your first account

Click **Create Account** in the sidebar to sign up. You get 3 free prompts before login is required.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run test suite (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## How It Works

### Chat Flow

1. Select a persona from the sidebar (Hitesh or Piyush)
2. Type a question in the textarea or click a suggestion chip
3. The app sends your message to `/api/chat` with persona and settings
4. The API calls OpenAI with the persona's system prompt + your message
5. Response renders with markdown formatting (code blocks, headers, lists)

### Authentication

- **Free tier:** 3 prompts without login
- **After 3 prompts:** textarea is disabled, sign-in banner appears
- **Signed in:** unlimited prompts, username shown in sidebar
- Auth handled by Clerk with middleware protection

### Persona Prompts

Each persona has a distinct system prompt that shapes the AI's responses:

- **Hitesh:** Hinglish, casual, "chai and code" style, YouTube-explainer vibe
- **Piyush:** Professional Hinglish, direct, implementation-focused

### Model Fallback

The API tries models in order: configured model → `gpt-4.1-mini` → `gpt-4.1`. If one fails with a model-not-found error, it falls back to the next.

## Project Structure

```
app/
├── api/
│   └── chat/route.ts        # OpenAI chat endpoint
├── components/
│   ├── App.tsx              # Main app layout (sidebar + chat)
│   ├── ChatDemo.tsx         # (legacy, kept for reference)
│   ├── Features.tsx         # (legacy)
│   ├── Footer.tsx           # (legacy)
│   └── HeroSection.tsx      # (legacy)
├── test/
│   ├── App.test.tsx         # Component tests
│   └── setup.ts             # Test mocks (Clerk, Next.js)
├── globals.css              # Tailwind + dark mode styles
├── layout.tsx               # Root layout with ClerkProvider
└── page.tsx                 # Entry point → App component
middleware.ts                # Clerk auth middleware
tailwind.config.js           # Design tokens + color system
vitest.config.ts             # Test configuration
DESIGN.md                    # Design system documentation
```

## Design System

HPersona uses a warm, Material 3-inspired color system:

- **Primary:** `#E8742A` (orange — energy, warmth)
- **Surface:** `#FFF8F6` (cream) / `#110E0D` (dark mode)
- **Font:** Plus Jakarta Sans (display + body)
- **Layout:** 280px sidebar + centered chat area

See `DESIGN.md` for the full design system specification.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties |
| Auth | Clerk |
| AI | OpenAI API |
| Testing | Vitest + Testing Library |
| Deployment | Vercel |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key |
| `OPENAI_MODEL` | No | Model to use (defaults to `gpt-4.1-mini`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Run tests (`npm test`) and lint (`npm run lint`)
5. Commit your changes
6. Push to the branch and open a Pull Request

## License

MIT

## Author

Created by [Anant Gabhane](https://www.linkedin.com/in/anantgabhane/)

- [GitHub](https://github.com/AnantGabhane)
- [Twitter](https://x.com/AnantGabhane)

## Acknowledgments

- [Hitesh Choudhary](https://www.youtube.com/@HiteshCodeLab) — for the inspiration and teaching style
- [Piyush Garg](https://www.youtube.com/@piyushgargtech) — for the inspiration and teaching style
- [OpenAI](https://openai.com/) — for the GPT API
- [Clerk](https://clerk.com/) — for authentication
