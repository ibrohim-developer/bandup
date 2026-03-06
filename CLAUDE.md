# BandUp - IELTS Practice Platform

## Project Overview
BandUp (bandup.uz) is a free IELTS mock exam and practice test platform with AI-powered scoring. It covers all four IELTS modules: Listening, Reading, Writing, and Speaking.

## Architecture
Monorepo with two apps managed from root `package.json` using `concurrently`:
- **frontend/** — Next.js 16 (React 19, App Router, Turbopack dev)
- **backend/** — Strapi 5 CMS (SQLite via better-sqlite3)

### Key Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend framework | Next.js 16 (App Router) |
| UI components | shadcn/ui (new-york style) + Radix UI + Tailwind CSS v4 |
| State management | Zustand (persisted to sessionStorage) |
| Data fetching | React Query (@tanstack/react-query) |
| Auth | Supabase Auth + Telegram auth (Mini App, Widget, code-based) |
| Database | Supabase (PostgreSQL) — types in `frontend/src/types/database.ts` |
| CMS | Strapi 5 (content management, API token auth) |
| AI evaluation | Google Gemini (`@google/generative-ai`) + OpenAI for writing/speaking scoring |
| Package manager | pnpm (root), npm (backend) |
| Icons | Lucide React |
| Notifications | Sonner (toast) |

## Commands
```bash
# From root
pnpm dev              # Run both frontend + backend concurrently
pnpm dev:next         # Frontend only
pnpm dev:strapi       # Backend only
pnpm build            # Build frontend

# From frontend/
pnpm dev              # Next.js dev with Turbopack
pnpm build            # Production build
pnpm lint             # ESLint
```

## Project Structure
```
bandup/
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── (auth)/             # Auth pages (sign-in, sign-up, reset-password)
│   │   │   ├── (dashboard)/        # Dashboard layout + pages
│   │   │   │   └── dashboard/
│   │   │   │       ├── listening/   # Listening test pages
│   │   │   │       ├── reading/     # Reading test pages
│   │   │   │       ├── writing/     # Writing test pages
│   │   │   │       ├── speaking/    # Speaking test pages (+ mock exam)
│   │   │   │       ├── results/     # Test results with answer review
│   │   │   │       ├── history/     # Test history
│   │   │   │       └── full-mock-test/
│   │   │   ├── api/                 # Route handlers (REST endpoints)
│   │   │   │   ├── listening/       # start, submit, review
│   │   │   │   ├── reading/        # start, submit, review, tests
│   │   │   │   ├── writing/        # start, submit, evaluate, review
│   │   │   │   ├── speaking/       # start, submit, evaluate, review, upload
│   │   │   │   ├── auth/telegram/  # Telegram auth endpoints
│   │   │   │   └── ...
│   │   │   ├── about/, faq/, for-business/  # Static pages
│   │   │   └── layout.tsx           # Root layout (Geist font, providers)
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui primitives
│   │   │   ├── test/                # Test-taking components
│   │   │   │   ├── common/          # Shared: timer, navigator, split-view, filters
│   │   │   │   ├── questions/       # Question types: MCQ, TFNG, fill-in-blank, matching, etc.
│   │   │   │   ├── listening/       # Audio player, listening test card
│   │   │   │   ├── reading/        # Passage display, notes drawer
│   │   │   │   ├── writing/        # Editor, word counter, feedback
│   │   │   │   └── speaking/       # Voice recorder, topic card
│   │   │   ├── auth/               # Login, Telegram auth
│   │   │   └── layout/             # Header, footer, sidebar, dashboard-main
│   │   ├── hooks/                   # Custom hooks (use-reading-test, use-listening-test, etc.)
│   │   ├── lib/
│   │   │   ├── strapi/             # Strapi API helpers (api.ts, client.ts, server.ts)
│   │   │   ├── supabase/           # Supabase clients (client.ts, server.ts, service.ts)
│   │   │   ├── constants/          # Test config, reading instructions
│   │   │   ├── evaluate-essay.ts   # AI writing evaluation
│   │   │   ├── evaluate-speaking.ts # AI speaking evaluation
│   │   │   ├── gemini.ts           # Gemini client
│   │   │   └── openai.ts           # OpenAI client
│   │   ├── stores/test-store.ts    # Zustand test state (answers, timer, navigation)
│   │   ├── types/database.ts       # Supabase DB types (auto-generated style)
│   │   └── actions/auth.ts         # Server actions for auth
│   ├── supabase/
│   │   ├── migrations/             # SQL migrations (tables, seeds)
│   │   └── seed.sql
│   └── scripts/                    # Import/seed scripts for test data
├── backend/
│   ├── src/api/                    # Strapi content types
│   │   ├── business-inquiry/
│   │   ├── feature-notification/
│   │   ├── full-mock-test-attempt/
│   │   ├── listening-section/
│   │   ├── question/ & question-group/
│   │   ├── reading-passage/
│   │   ├── speaking-topic/ & speaking-submission/
│   │   ├── telegram-auth-code/
│   │   ├── test/ & test-attempt/ & test-progress/
│   │   ├── user-answer/
│   │   └── writing-task/ & writing-submission/
│   └── config/                     # Strapi config (database, server, middlewares, plugins)
└── package.json                    # Root scripts (concurrently)
```

## Database Schema (Supabase)
Key tables: `tests`, `listening_sections`, `reading_passages`, `writing_tasks`, `speaking_topics`, `questions`, `test_attempts`, `user_answers`, `writing_submissions`, `test_progress`, `full_mock_test_attempts`, `profiles`, `telegram_auth_codes`, `feature_notifications`

Question types: `tfng`, `mcq_single`, `mcq_multiple`, `gap_fill`, `matching_headings`, `matching_info`, `summary_completion`, `short_answer`

Module types: `listening`, `reading`, `writing`, `full`

Test attempt statuses: `in_progress`, `completed`, `abandoned`

## Conventions
- Path alias: `@/` maps to `frontend/src/`
- UI components use shadcn/ui (new-york style) with Radix primitives
- API routes use Strapi REST helpers from `lib/strapi/api.ts` (find, findOne, create, update)
- Auth: JWT stored in `strapi_jwt` cookie; Supabase for user management + Postgres
- Test state persisted in sessionStorage via Zustand (`ielts-test-storage` key)
- Fonts: Geist Sans + Geist Mono
- Domain: bandup.uz
- Telegram Mini App support (iframe-friendly headers)

## Environment Variables
- `NEXT_PUBLIC_STRAPI_URL` — Strapi URL (default: http://localhost:1337)
- `STRAPI_API_TOKEN` — Server-side Strapi API token
- Supabase keys in `frontend/.env.local`
- OpenAI + Gemini API keys for AI evaluation
