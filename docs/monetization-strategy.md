# BandUp Monetization Strategy

Status: proposal · Owner: product · Last updated: 2026-07-09

## 1. Where we are

BandUp is currently 100% free: unlimited reading/listening tests, AI-scored
writing and speaking, full mock exams, video lessons, and flashcards. Costs
scale with usage because writing/speaking evaluations call Gemini per
submission (tracked in the `ai-usage-log` content type via
`frontend/src/lib/ai-usage.ts`).

### Unit economics (from current Gemini pricing in `ai-usage.ts`)

| Action | Model | Approx. tokens | Cost per use |
|---|---|---|---|
| Writing task evaluation | gemini-2.5-pro | ~3k in / ~1.5k out | ~$0.02 |
| Full writing test (Task 1 + 2) | gemini-2.5-pro | — | ~$0.04 |
| Full speaking test (~12 min audio @ 32 tok/s) | gemini-2.5-pro | ~25k in / ~2k out | ~$0.05–0.08 |
| Reading / listening test | none (auto-scored) | 0 | ~$0 |

A power user doing one AI-scored writing + speaking session daily costs
**$2–4/month** in API spend alone. Reading and listening are effectively free
to serve. This asymmetry is the core of the strategy: **keep auto-scored
content free forever, monetize AI evaluation and B2B.**

## 2. Market context

- Uzbekistan is one of the fastest-growing IELTS markets; the official exam
  costs ~$250, so candidates are highly motivated to arrive prepared.
- Willingness to pay for prep is real but price-sensitive: local courses run
  500k–2M UZS/month. A digital product should sit far below that.
- Stripe is unavailable in Uzbekistan. Local rails: **Payme, Click, Uzum**,
  plus **Telegram Stars** (Telegram is the dominant app locally and we
  already have Telegram auth scaffolding: `telegram-auth`,
  `telegram-auth-code`).
- Learning centers (our `for-business` audience) buy in bulk and are less
  price-sensitive than individual students.

## 3. Revenue streams (priority order)

### 3.1 B2C Freemium subscription — "BandUp Plus"

Free tier (acquisition engine — never degrade it):
- Unlimited reading & listening tests (zero marginal cost)
- **8 Energy per rolling week** for AI evaluations (writing costs 2,
  speaking costs 4 — i.e. 2 writings + 1 speaking, or any mix)
- Band score + brief feedback only
- Flashcards and free video lessons

BandUp Plus — **49,000 UZS/month (~$4)** or **399,000 UZS/year** (~2 months
free):
- Unlimited AI writing & speaking evaluations (fair-use cap ~150/mo)
- Full mock tests with complete AI scoring
- Detailed criterion-by-criterion feedback (TA/CC/LR/GRA breakdown),
  model answers, and rewrite suggestions
- Full evaluation history + progress analytics
- Premium video lessons

Why these numbers: at $4/month with worst-case $2–4 API cost from a power
user we still break even, and typical users (2–3 sessions/week) yield
**70–85% gross margin**. Price anchors under one hour of a private tutor.

Optional add-on: **Exam Sprint pass** — one-time 99,000 UZS for 30 days of
Plus. Matches how students actually buy (4–6 weeks before their exam date),
no subscription-fatigue objection, no recurring billing complexity for
Payme/Click.

### 3.2 B2B licensing to learning centers (highest revenue per deal)

The `for-business` page, `business-inquiry` content type, and
`PartnerPricing` component (currently commented out in
`frontend/src/app/for-business/page.tsx`) already exist. Put real prices in:

| Plan | Size | Price per student/month |
|---|---|---|
| Growth | 50–500 students | 20,000 UZS (~$1.60) |
| Professional | 500–2,000 | 15,000 UZS + branding/API |
| Enterprise | 2,000+ | custom, white-label |

A single mid-size center (300 students) = **6M UZS/month (~$480)** — likely
more than hundreds of individual subscribers early on. Sales motion: the
existing application form → demo → invoice (B2B in UZ commonly pays by bank
transfer, so no payment-gateway work is needed to start earning).

What B2B needs that B2C doesn't: teacher dashboard (class lists, student
progress, attempt history), bulk account creation, and later custom mock
exam assignment. All buildable on existing `test-attempt` /
`ai-usage-log` data.

### 3.3 Pay-per-use credits (bridge for non-subscribers)

Sell AI evaluation credits: e.g. **10 writing evals for 25,000 UZS**.
Captures users who won't subscribe but will pay before their exam. Same
quota mechanism as freemium — credits are just quota top-ups.

### 3.4 Later / opportunistic

- **Telegram bot + Stars payments**: daily practice bot as a funnel;
  Stars for in-chat purchases where cards are a friction point.
- **Affiliate referrals**: IELTS registration partners, study-abroad
  agencies pay per qualified lead. Zero product work.
- **Sponsored placements** for universities/agencies on results pages
  ("Your band 7.0 qualifies for…"). Only after traffic is meaningful.
- **Ads: avoid.** They undermine the trust that drives B2B deals and yield
  little at UZ CPMs.

## 4. Implementation roadmap

### Phase 1 — Quotas & entitlements (prerequisite for everything)

> **Shipped 2026-07-16** as a single "Energy" currency (`frontend/src/lib/quota.ts`):
> writing eval = 2 energy, speaking = 4, free grant = 8 per rolling 7 days,
> Premium fair-use = 400 per rolling 30 days. Entitlement = the existing
> `mock_test_expires_at` user field (Telegram-bot payments) instead of a new
> `subscription` content type. Usage counted per evaluated `test-attempt`
> (not per `ai-usage-log` row — one speaking test fires ~9 Gemini calls).
> Enforced with HTTP 402 in the writing/speaking/free-write evaluate routes;
> indicator + upgrade dialog on writing/speaking pages. §3.3 credits become
> purchasable energy top-ups when payments land.

1. New Strapi content type `subscription` (user, plan, status, expires_at,
   source) + `credit-balance` (or fields on subscription).
2. Quota check in the writing/speaking `evaluate` route handlers before
   calling Gemini: count this user's successful `ai-usage-log` rows in the
   current window vs. their plan limit. The logging table already exists —
   enforcement is a query away.
3. Paywall UI: quota indicator on writing/speaking pages, upgrade dialog
   when the limit is hit (soft sell: show what Plus feedback looks like).

### Phase 2 — Payments
1. Integrate **Payme** and **Click** merchant APIs (both are HTTP callback
   protocols; no SDK dependency needed). Add `payment` content type for
   transaction records + webhook route handlers under `app/api/payments/`.
2. Launch with **Exam Sprint (one-time)** first — one-off invoicing is far
   simpler than recurring billing on local rails. Add monthly auto-renew
   later (or renew-by-reminder, which is standard practice in UZ).

### Phase 3 — B2B enablement
1. Re-enable `<PartnerPricing />` with real prices.
2. Organization model: `organization` content type, user→org relation,
   bulk import script (there's already a `frontend/scripts/` seeding
   pattern to follow).
3. Teacher dashboard: reuse existing results/history components filtered
   by organization.

### Phase 4 — Growth loops
Referral codes (give a week of Plus, get a week), Telegram bot funnel,
credit packs.

## 5. Targets & guardrails

- **North-star**: gross margin on AI evaluation ≥ 70% (watch
  `ai-usage-log.cost_usd` vs. subscription revenue weekly).
- Free→paid conversion target: 2–4% of weekly-active users after paywall
  ships (typical for edtech freemium).
- Break-even sanity check: ~250 Plus subscribers or ~2 mid-size B2B centers
  cover $1k/month of infrastructure + API spend.
- Cost control levers already in the code: route cheap evaluations
  (free-tier users, quiz module) to `gemini-2.5-flash` (~6× cheaper than
  pro) and reserve `gemini-2.5-pro` for paid detailed feedback.

## 6. What we explicitly protect

Free reading/listening stays unlimited. It costs us nothing, it's the SEO
and word-of-mouth engine, and "free IELTS mocks" is the brand promise that
fills the top of the funnel for both Plus and B2B.
