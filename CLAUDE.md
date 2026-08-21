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
| Auth | Strapi users-permissions (JWT in `strapi_jwt` cookie) |
| Database | Strapi 5 (SQLite via better-sqlite3) |
| AI evaluation | Google Gemini (`@google/generative-ai`) + OpenAI for writing/speaking scoring |
| Package manager | pnpm (root, frontend, backend) |
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
pnpm test             # Vitest unit tests (single run)
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
│   │   │   │   ├── auth/telegram/  # Telegram auth endpoints (disabled)
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
│   │   │   ├── auth/               # Login components
│   │   │   └── layout/             # Header, footer, sidebar, dashboard-main
│   │   ├── hooks/                   # Custom hooks (use-reading-test, use-listening-test, etc.)
│   │   ├── lib/
│   │   │   ├── strapi/             # Strapi API helpers (api.ts, client.ts, server.ts)
│   │   │   ├── constants/          # Test config, reading instructions
│   │   │   ├── evaluate-essay.ts   # AI writing evaluation
│   │   │   ├── evaluate-speaking.ts # AI speaking evaluation
│   │   │   ├── gemini.ts           # Gemini client
│   │   │   └── openai.ts           # OpenAI client
│   │   ├── stores/test-store.ts    # Zustand test state (answers, timer, navigation)
│   │   └── actions/auth.ts         # Server actions for auth
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

## Database Schema (Strapi)
Key content types: `test`, `listening-section`, `reading-passage`, `writing-task`, `speaking-topic`, `question`, `question-group`, `test-attempt`, `user-answer`, `writing-submission`, `speaking-submission`, `test-progress`, `full-mock-test-attempt`, `telegram-auth`, `telegram-auth-code`, `feature-notification`, `payment`, `practice-prompt`, `practice-session`, `ai-usage-log`, `flashcard`, `video-lesson`, `business-inquiry`, `issue-report`, `test-feedback`

Question types: `tfng`, `mcq_single`, `mcq_multiple`, `gap_fill`, `matching_headings`, `matching_info`, `summary_completion`, `short_answer`

Module types: `listening`, `reading`, `writing`, `speaking`, `full`

Test attempt statuses: `in_progress`, `completed`, `evaluating`, `failed`, `abandoned`

### REST permissions
`backend/src/index.ts` bootstrap is the source of truth. The browser never talks to
Strapi directly — every data path goes through a Next.js route handler using the
admin token — so Public/Authenticated roles get almost nothing, and the
`publicRevokeUids` / `authenticatedRevokeUids` lists actively *delete* grants on
every restart to converge prod. Any new user-scoped or paid content type must be
added to those lists.

## Conventions
- Path alias: `@/` maps to `frontend/src/`
- UI components use shadcn/ui (new-york style) with Radix primitives
- API routes use Strapi REST helpers from `lib/strapi/api.ts` (find, findOne, create, update)
- Auth: JWT stored in `strapi_jwt` cookie; Strapi users-permissions for user management
- Test state persisted in sessionStorage via Zustand (`ielts-test-storage` key)
- Fonts: Geist Sans + Geist Mono
- Domain: bandup.uz

## Environment Variables
- `NEXT_PUBLIC_STRAPI_URL` — Strapi URL (default: http://localhost:1337)
- `STRAPI_API_TOKEN` — Server-side Strapi API token
- OpenAI + Gemini API keys for AI evaluation
- `GOOGLE_CLOUD_PROJECT` / `GOOGLE_CLOUD_LOCATION` — Vertex AI (writing/speaking eval, speaking practice)
- `NEXT_PUBLIC_TELEGRAM_BOT_NAME` — bot the "Buy in Telegram" button deep-links to

Backend-only, for the Telegram bot (`backend/.env`):
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_ENABLED`
- `TELEGRAM_ADMIN_CHAT_ID` / `TELEGRAM_ADMIN_IDS` (comma-separated) — who receives
  receipts and may Approve/Reject. **With none set the payment flow dead-ends.**
- `PAYMENT_CARD_NUMBER`, `PREMIUM_CARD_CURRENCY` (default UZS), and per-plan local
  prices `PREMIUM_CARD_PRICE_1M` / `_3M` / `_12M`. `PREMIUM_DURATION_DAYS` (default
  30) is now only a fallback for payment rows created before plans were tracked.

## Monetization

### Premium
One entitlement, tracked by `mock_test_expires_at` on the user — Premium while that
timestamp is in the future (`lib/premium.ts`). Unlocks unlimited AI evaluations
(fair-use capped), more practice time, and all full mock tests. The upsell dialog
(`components/premium-upgrade-dialog.tsx`) sells 1/3/12-month plans; they are the
same entitlement with the expiry pushed further out.

### Energy (AI evaluation currency)
`lib/energy.ts` (client-safe costs) + `lib/quota.ts` (server enforcement).
Writing costs 2, speaking 4; free users get 12 per rolling 7 days, Premium 400 per
rolling 30 days. The billable unit is an *evaluation session* — a `test-attempt`
whose `evaluation_started_at` is set — not raw `ai-usage-log` rows (one speaking
test fires ~9 Gemini calls). Attempts in status `evaluating` or `completed` count;
`failed` ones do not, so a broken evaluation is free. Routes gate **before**
claiming the lock and return HTTP 402 + `code: "quota_exceeded"`; the UI renders
`QuotaPaywallCard`. `EnergyBadge` (sidebar/mobile) and `EnergyGatedStart` (test
cards) are UX guards only — the submit + evaluate routes are the real enforcement (5 of them: writing/speaking `submit` and `evaluate`, plus `writing/free-write`).

### Telegram payment bot
`backend/src/telegram-bot.ts` long-polls `getUpdates` (login codes + payments).
`/buy` shows the three plans from `PREMIUM_PLANS` (mirrors `PLANS` in
`premium-upgrade-dialog.tsx` — keep in sync), then offers two rails. Either way a
`payment` row is opened **before** paying, recording `plan_id`, `plan_days`,
`method`, and `amount`, so activation grants what was actually bought rather than
a global default.

- **Card** — shows the local price + card number; the buyer sends a receipt
  photo/PDF, which attaches to that pending row and is forwarded to the admin
  chats with inline Approve/Reject. A receipt with no pending row is refused
  (the plan would be unknowable). Approve/Reject is restricted to
  `adminChatIds()` and guarded on `status === "pending"`.
- **Telegram Stars** — `sendInvoice` in `XTR` (empty `provider_token`), priced at
  parity with the USD sticker price (250/600/1950 ⭐). Telegram verifies the
  charge, so Premium activates with no admin review. This requires
  `pre_checkout_query` in the poll loop's `allowed_updates` — an explicit list
  filters out everything unnamed, and an unanswered pre-checkout is cancelled.
  `successful_payment` is guarded on `status === "pending"` against redelivery.

`activatePremium` stacks the plan's days onto any remaining time.
`api::payment` is REST-revoked for both roles — bot-only.

## Feature flags
`lib/feature-flags.ts`. Default OFF, so merging to main never launches anything by
itself — the env has to opt in. `NEXT_PUBLIC_PRACTICE_ENABLED=true` turns on
speaking practice; while off the sidebar entry and the Premium practice-time
benefit are hidden, both pages `notFound()`, and all five `/api/practice/*` route
handlers return 404 (they spend Vertex quota and are reachable by URL, so hiding
the links is not enough). Turn it on only once
`scripts/seed-practice-prompts.ts` has been run against that environment.

## Speaking Practice (turn-based)
`/dashboard/practice` is a turn-based voice conversation: the browser records one OGG-Opus utterance at a time (VAD hook `hooks/use-utterance-recorder.ts`) → POST `/api/practice/turn` → `lib/practice-conversation.ts` runs **two** Vertex Flash calls — (1) TRANSCRIBE, which sees only the audio with no question or history so it cannot invent an answer, then (2) CONVERSE, text-only, producing the reply plus grammar corrections — and `lib/tts.ts` voices the reply. The route streams NDJSON events (`transcript` → `reply` → `audio` → `done`) so text lands on screen while voice synthesis (the slow tail) is still running. Corrections render in a side panel, anchored to the transcript by verbatim substring match (`lib/highlight-corrections.ts`); any correction the model can't quote verbatim is dropped server-side. Quota bills `practice-session.spoken_seconds` measured server-side from the received audio (`lib/ogg-duration.ts`), never client-supplied — free 600s/day, premium 3600s/day on a rolling 24h window (`lib/practice-quota.ts`). Opening questions are pre-voiced once by `scripts/seed-practice-prompts.ts` and stored on the prompt (`opening_audio`); filler clips in `public/practice-fillers/` cover the thinking gap.
