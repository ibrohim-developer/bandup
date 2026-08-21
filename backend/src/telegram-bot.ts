import type { Core } from '@strapi/strapi';
import crypto from 'crypto';
import { PLACEHOLDER_EMAIL_DOMAIN, identityLabel, realEmail } from './telegram-account';

const TELEGRAM_API = 'https://api.telegram.org';
const POLL_TIMEOUT_SEC = 30;
const CODE_TTL_MS = 60 * 1000;

// --- Premium purchase ("/buy") config -------------------------------------
const PAYMENT_CARD_NUMBER = process.env.PAYMENT_CARD_NUMBER || '';
/** Currency of the local card transfer (the Stars rail always bills in XTR). */
const CARD_CURRENCY = process.env.PREMIUM_CARD_CURRENCY || process.env.PREMIUM_CURRENCY || 'UZS';

/**
 * Fallback for a legacy single-plan install: `activatePremium` always prefers
 * the duration recorded on the payment row, so this is only used if a payment
 * predates plan tracking.
 */
const PREMIUM_DURATION_DAYS = Number(process.env.PREMIUM_DURATION_DAYS || 30);

/**
 * The plans sold by the bot. These mirror `PLANS` in the web upsell dialog
 * (frontend/src/components/premium-upgrade-dialog.tsx) — keep the two in sync.
 *
 * `stars` is priced at parity with `usd` (~$0.02 per Star, Telegram's in-app
 * rate) so an international buyer pays the same advertised price. Telegram and
 * the app stores keep roughly a third of that, which is the cost of a rail that
 * needs no card sharing and verifies itself.
 *
 * The local card price is per-plan and set in env, because it is quoted in a
 * different currency (UZS) than the site's USD sticker price.
 */
interface PremiumPlan {
  id: string;
  label: string;
  days: number;
  usd: number;
  stars: number;
}

const PREMIUM_PLANS: PremiumPlan[] = [
  { id: '1m', label: '1 month', days: 30, usd: 5, stars: 250 },
  { id: '3m', label: '3 months', days: 90, usd: 12, stars: 600 },
  { id: '12m', label: '12 months', days: 365, usd: 39, stars: 1950 },
];

function findPlan(id: string): PremiumPlan | undefined {
  return PREMIUM_PLANS.find((p) => p.id === id);
}

/** Local-card price for a plan, e.g. PREMIUM_CARD_PRICE_3M=155000. */
function cardPrice(plan: PremiumPlan): number | null {
  const raw = process.env[`PREMIUM_CARD_PRICE_${plan.id.toUpperCase()}`];
  const n = Number(raw);
  return raw && Number.isFinite(n) && n > 0 ? n : null;
}

/** What the buyer is told to transfer — falls back to USD if no local price. */
function cardPriceLabel(plan: PremiumPlan): string {
  const local = cardPrice(plan);
  return local === null ? `${plan.usd} USD` : `${local.toLocaleString('en-US')} ${CARD_CURRENCY}`;
}

/**
 * Escape the legacy-Markdown control characters.
 *
 * Telegram rejects the WHOLE message with 400 "can't parse entities" if these
 * are unbalanced, and a name or @username is user-controlled: an underscore in
 * `@some_user` opens an italic span that never closes. That 400 lands in a
 * .catch() and the admin simply never receives the receipt, so anything
 * interpolated into a Markdown message has to go through here.
 */
function escapeMd(value: string): string {
  return value.replace(/[_*`[\]]/g, '\\$&');
}

function adminChatIds(): string[] {
  const ids = new Set<string>();
  if (process.env.TELEGRAM_ADMIN_CHAT_ID) ids.add(process.env.TELEGRAM_ADMIN_CHAT_ID.trim());
  for (const id of (process.env.TELEGRAM_ADMIN_IDS || '').split(',')) {
    const t = id.trim();
    if (t) ids.add(t);
  }
  return [...ids];
}

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
}

interface TelegramContact {
  phone_number: string;
  user_id?: number;
  first_name?: string;
  last_name?: string;
}

interface TelegramPhotoSize {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
}

interface TelegramDocument {
  file_id: string;
  file_unique_id: string;
  mime_type?: string;
  file_name?: string;
}

interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: { id: number };
  text?: string;
  caption?: string;
  contact?: TelegramContact;
  photo?: TelegramPhotoSize[];
  document?: TelegramDocument;
  successful_payment?: TelegramSuccessfulPayment;
}

/** Delivered inside a message once Telegram has charged the buyer's Stars. */
interface TelegramSuccessfulPayment {
  currency: string;
  total_amount: number;
  invoice_payload: string;
  telegram_payment_charge_id: string;
  provider_payment_charge_id?: string;
}

/**
 * Telegram sends this before charging and cancels the payment unless the bot
 * answers within a few seconds, so it must never be blocked on slow work.
 */
interface TelegramPreCheckoutQuery {
  id: string;
  from: TelegramUser;
  currency: string;
  total_amount: number;
  invoice_payload: string;
}

interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
  pre_checkout_query?: TelegramPreCheckoutQuery;
}

function generateCode(): string {
  // Cryptographically secure 6-digit code (100000–999999). Math.random is
  // predictable and must never be used to mint authentication secrets.
  return String(crypto.randomInt(100000, 1000000));
}

async function tg<T = unknown>(
  token: string,
  method: string,
  body?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${TELEGRAM_API}/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = (await res.json()) as { ok: boolean; result?: T; description?: string };
  if (!json.ok) {
    throw new Error(`Telegram ${method} failed: ${json.description}`);
  }
  return json.result as T;
}

async function generateUniqueCode(strapi: Core.Strapi): Promise<string> {
  // The `code` column is `unique` in the schema, so any existing row blocks
  // reuse — even already-used ones. Delete stale rows opportunistically and
  // pick a code that doesn't currently exist.
  await strapi.db.query('api::telegram-auth-code.telegram-auth-code').deleteMany({
    where: {
      $or: [
        { used: true },
        { expires_at: { $lt: new Date().toISOString() } },
      ],
    },
  });

  for (let i = 0; i < 16; i += 1) {
    const code = generateCode();
    const existing = await strapi.entityService.findMany(
      'api::telegram-auth-code.telegram-auth-code',
      { filters: { code }, limit: 1 }
    );
    if (!Array.isArray(existing) || existing.length === 0) return code;
  }
  throw new Error('Could not generate unique code');
}

async function sendLoginCode(
  strapi: Core.Strapi,
  token: string,
  msg: TelegramMessage,
  user: TelegramUser,
  phone: string | null
) {
  const code = await generateUniqueCode(strapi);
  const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString();

  await strapi.entityService.create('api::telegram-auth-code.telegram-auth-code', {
    data: {
      code,
      telegram_id: user.id,
      first_name: user.first_name || null,
      last_name: user.last_name || null,
      username: user.username || null,
      phone: phone || null,
      used: false,
      expires_at: expiresAt,
      publishedAt: new Date(),
    },
  });

  const text = [
    `✅ Verification code: \`${code}\``,
    `⌛ Expires in 1 minute.`,
  ].join('\n');

  await tg(token, 'sendMessage', {
    chat_id: msg.chat.id,
    text,
    parse_mode: 'Markdown',
    reply_markup: { remove_keyboard: true },
  });
}

async function handleStart(strapi: Core.Strapi, token: string, msg: TelegramMessage) {
  const user = msg.from;
  if (!user) return;

  const existing = await strapi.query('plugin::users-permissions.user').findOne({
    where: { telegram_id: String(user.id) },
  });

  if (existing) {
    await sendLoginCode(strapi, token, msg, user, null);
    return;
  }

  await tg(token, 'sendMessage', {
    chat_id: msg.chat.id,
    text: [
      `Hi ${user.first_name || 'there'}!`,
      '',
      'To create your BandUp account, please share your phone number by tapping the button below.',
    ].join('\n'),
    reply_markup: {
      keyboard: [[{ text: '📱 Share my phone number', request_contact: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
}

async function handleContact(strapi: Core.Strapi, token: string, msg: TelegramMessage) {
  const user = msg.from;
  const contact = msg.contact;
  if (!user || !contact) return;

  if (contact.user_id !== user.id) {
    await tg(token, 'sendMessage', {
      chat_id: msg.chat.id,
      text: 'Please share your own phone number, not someone else\'s. Tap /start to try again.',
      reply_markup: { remove_keyboard: true },
    });
    return;
  }

  const phone = contact.phone_number.startsWith('+')
    ? contact.phone_number
    : `+${contact.phone_number}`;

  await sendLoginCode(strapi, token, msg, user, phone);
}

// --- Premium purchase flow -------------------------------------------------

/**
 * Buyers who tapped "another account" and owe us an email address.
 *
 * In-memory on purpose: a ten-minute step inside one conversation, not state
 * worth a table. A restart just means the buyer taps /buy again.
 */
const awaitingEmail = new Map<number, number>();
const EMAIL_PROMPT_TTL_MS = 10 * 60 * 1000;

function expectEmailFrom(telegramId: number): void {
  if (awaitingEmail.size > 1000) {
    const now = Date.now();
    for (const [id, expiresAt] of awaitingEmail) {
      if (expiresAt < now) awaitingEmail.delete(id);
    }
  }
  awaitingEmail.set(telegramId, Date.now() + EMAIL_PROMPT_TTL_MS);
}

function isAwaitingEmail(telegramId: number): boolean {
  const expiresAt = awaitingEmail.get(telegramId);
  if (expiresAt === undefined) return false;
  if (expiresAt < Date.now()) {
    awaitingEmail.delete(telegramId);
    return false;
  }
  return true;
}

type BuyerAccount = { id: number; email?: string | null; phone?: string | null };

/** Short label for the account a purchase will be credited to. */
function accountLabel(account: BuyerAccount): string {
  return realEmail(account) || account.phone?.trim() || `account #${account.id}`;
}

/**
 * Second step of /buy: the target account is settled, now pick a plan. Its id
 * rides along in the button data so the rest of the flow — and the payment row
 * it opens — credits the account the buyer actually chose.
 */
async function showPlans(token: string, chatId: number, account: BuyerAccount) {
  await tg(token, 'sendMessage', {
    chat_id: chatId,
    text: [
      '💎 *BandUp Premium*',
      `Activating on: ${escapeMd(accountLabel(account))}`,
      '',
      '⚡ Unlimited Energy — unlimited AI Writing & Speaking evaluations',
      '🎯 All full mock tests unlocked',
      '',
      'Choose a plan:',
    ].join('\n'),
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: PREMIUM_PLANS.map((plan) => [
        { text: `${plan.label} — $${plan.usd}`, callback_data: `plan:${plan.id}:${account.id}` },
      ]),
    },
  });
}

/** First step of /buy: the buyer said which account to credit. */
async function handleAccountChoice(
  strapi: Core.Strapi,
  token: string,
  cb: TelegramCallbackQuery,
  choice: string,
  ack: (text?: string) => Promise<unknown>
) {
  if (!cb.message) {
    await ack();
    return;
  }
  const chatId = cb.message.chat.id;

  if (choice === 'email') {
    expectEmailFrom(cb.from.id);
    await tg(token, 'sendMessage', {
      chat_id: chatId,
      text: [
        'Send me the email you sign in with at bandup.uz.',
        '',
        'Premium will be activated on that account. Tap /buy to start over.',
      ].join('\n'),
    });
    await ack();
    return;
  }

  // 'me' resolves from the sender rather than the button payload, so this
  // branch can only ever pick the Telegram-linked account.
  const account = await requireAccount(strapi, token, chatId, cb.from.id);
  if (!account) {
    await ack();
    return;
  }
  awaitingEmail.delete(cb.from.id);
  await showPlans(token, chatId, account);
  await ack();
}

/**
 * The buyer answered the "which account?" prompt with an email address.
 *
 * This only decides who the purchase is *credited* to — it deliberately does
 * not write telegram_id onto the account it finds. Linking on an address
 * anyone can type would hand whoever typed it a Telegram login to that
 * account; crediting it merely lets someone pay for a stranger's Premium.
 */
async function handleEmailReply(strapi: Core.Strapi, token: string, msg: TelegramMessage) {
  const user = msg.from;
  if (!user) return;

  const email = (msg.text || '').trim().toLowerCase();
  const chatId = msg.chat.id;

  // Nobody signs in with the placeholder domain — we mint it ourselves — so
  // treat it as a typo rather than a way to name a Telegram-only account.
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.endsWith(`@${PLACEHOLDER_EMAIL_DOMAIN}`)
  ) {
    expectEmailFrom(user.id);
    await tg(token, 'sendMessage', {
      chat_id: chatId,
      text: 'That does not look like an email address. Send the email you sign in with at bandup.uz, or tap /buy to start over.',
    });
    return;
  }

  const account = await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { email: { $eqi: email } },
  });

  if (!account) {
    expectEmailFrom(user.id);
    await tg(token, 'sendMessage', {
      chat_id: chatId,
      text: 'No BandUp account uses that email. Check the spelling and send it again, or tap /buy to choose a different account.',
    });
    return;
  }

  awaitingEmail.delete(user.id);
  await showPlans(token, chatId, account);
}

async function handleBuy(strapi: Core.Strapi, token: string, msg: TelegramMessage) {
  const user = msg.from;
  if (!user) return;

  const account = await strapi.query('plugin::users-permissions.user').findOne({
    where: { telegram_id: String(user.id) },
  });

  if (!account) {
    await tg(token, 'sendMessage', {
      chat_id: msg.chat.id,
      text: [
        'You need a BandUp account first.',
        '',
        'Tap /start to get a login code, sign in at bandup.uz, then come back and tap /buy.',
      ].join('\n'),
    });
    return;
  }

  awaitingEmail.delete(user.id);

  // The bot only ever sees a Telegram id, never the browser session, so it
  // cannot tell which account the buyer uses on the site. Ask, instead of
  // defaulting to the Telegram-created one — which usually is not it.
  await tg(token, 'sendMessage', {
    chat_id: msg.chat.id,
    text: [
      '💎 *BandUp Premium*',
      '',
      'Which account should Premium be activated on?',
    ].join('\n'),
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: `📱 This one — ${accountLabel(account)}`, callback_data: 'acct:me' }],
        [{ text: '✉️ Another — my bandup.uz email', callback_data: 'acct:email' }],
      ],
    },
  });
}

/** Second step of /buy: the buyer picked a plan, now pick how to pay. */
async function handlePlanChoice(
  token: string,
  cb: TelegramCallbackQuery,
  planId: string,
  accountId: number,
  ack: (text?: string) => Promise<unknown>
) {
  const plan = findPlan(planId);
  if (!plan || !cb.message) {
    await ack('That plan is no longer available.');
    return;
  }

  const buttons: { text: string; callback_data: string }[][] = [];
  if (PAYMENT_CARD_NUMBER) {
    buttons.push([
      {
        text: `💳 Card — ${cardPriceLabel(plan)}`,
        callback_data: `pay_card:${plan.id}:${accountId}`,
      },
    ]);
  }
  buttons.push([
    {
      text: `⭐ Telegram Stars — ${plan.stars}`,
      callback_data: `pay_stars:${plan.id}:${accountId}`,
    },
  ]);

  await tg(token, 'sendMessage', {
    chat_id: cb.message.chat.id,
    text: [
      `💎 *BandUp Premium — ${plan.label}*`,
      '',
      'How would you like to pay?',
      '',
      '⭐ Stars is instant and works anywhere. Card transfer is checked by hand.',
    ].join('\n'),
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: buttons },
  });
  await ack();
}

/**
 * Open a payment row *before* the buyer pays, so the plan they chose is on
 * record. Approval reads the duration from this row — the amount transferred
 * is no longer the only clue about what was bought.
 */
async function createPendingPayment(
  strapi: Core.Strapi,
  accountId: number,
  telegramId: number,
  plan: PremiumPlan,
  method: 'card' | 'stars'
): Promise<string> {
  const local = cardPrice(plan);
  const [amount, currency] =
    method === 'stars'
      ? ([plan.stars, 'XTR'] as const)
      : local === null
        ? ([plan.usd, 'USD'] as const)
        : ([local, CARD_CURRENCY] as const);

  const payment = await strapi.entityService.create('api::payment.payment', {
    data: {
      user: accountId,
      telegram_id: telegramId,
      status: 'pending',
      method,
      plan_id: plan.id,
      plan_days: plan.days,
      amount,
      currency,
      publishedAt: new Date(),
    },
  });
  return (payment as { documentId: string }).documentId;
}

/** Look up the buyer's linked account, or tell them to sign in first. */
async function requireAccount(
  strapi: Core.Strapi,
  token: string,
  chatId: number,
  telegramId: number
) {
  const account = await strapi.query('plugin::users-permissions.user').findOne({
    where: { telegram_id: String(telegramId) },
  });
  if (!account) {
    await tg(token, 'sendMessage', {
      chat_id: chatId,
      text: 'Please sign in at bandup.uz first (tap /start), then try again.',
    }).catch(() => {});
  }
  return account;
}

/**
 * The account a purchase will be credited to, carried through the buttons
 * from the "which account?" step of /buy.
 */
async function resolveTargetAccount(
  strapi: Core.Strapi,
  token: string,
  chatId: number,
  accountId: number
) {
  const account = Number.isInteger(accountId)
    ? await strapi.query('plugin::users-permissions.user').findOne({ where: { id: accountId } })
    : null;
  if (!account) {
    await tg(token, 'sendMessage', {
      chat_id: chatId,
      text: 'That account is no longer available. Tap /buy to start again.',
    }).catch(() => {});
  }
  return account;
}

async function handlePayByCard(
  strapi: Core.Strapi,
  token: string,
  cb: TelegramCallbackQuery,
  planId: string,
  accountId: number,
  ack: (text?: string) => Promise<unknown>
) {
  const plan = findPlan(planId);
  if (!plan || !cb.message) {
    await ack('That plan is no longer available.');
    return;
  }
  if (!PAYMENT_CARD_NUMBER) {
    await ack('Card payment is not configured.');
    return;
  }

  const chatId = cb.message.chat.id;
  const account = await resolveTargetAccount(strapi, token, chatId, accountId);
  if (!account) {
    await ack();
    return;
  }

  await createPendingPayment(strapi, account.id, cb.from.id, plan, 'card');

  await tg(token, 'sendMessage', {
    chat_id: chatId,
    text: [
      `💎 *BandUp Premium — ${plan.label}*`,
      `Activating on: ${escapeMd(accountLabel(account))}`,
      '',
      `💳 Transfer *${cardPriceLabel(plan)}* to: \`${PAYMENT_CARD_NUMBER}\``,
      '',
      '📸 Then send the *payment receipt* (photo or PDF) here in this chat. We will verify it and activate your Premium.',
    ].join('\n'),
    parse_mode: 'Markdown',
  });
  await ack();
}

async function handlePayByStars(
  strapi: Core.Strapi,
  token: string,
  cb: TelegramCallbackQuery,
  planId: string,
  accountId: number,
  ack: (text?: string) => Promise<unknown>
) {
  const plan = findPlan(planId);
  if (!plan || !cb.message) {
    await ack('That plan is no longer available.');
    return;
  }

  const chatId = cb.message.chat.id;
  const account = await resolveTargetAccount(strapi, token, chatId, accountId);
  if (!account) {
    await ack();
    return;
  }

  const documentId = await createPendingPayment(strapi, account.id, cb.from.id, plan, 'stars');

  // Stars invoices take an empty provider_token — the charge is settled by
  // Telegram itself rather than an external payment provider.
  await tg(token, 'sendInvoice', {
    chat_id: chatId,
    title: `BandUp Premium — ${plan.label}`,
    description: `For ${accountLabel(account)} — unlimited AI Writing & Speaking evaluations, and every full mock test.`,
    payload: documentId,
    provider_token: '',
    currency: 'XTR',
    prices: [{ label: `Premium ${plan.label}`, amount: plan.stars }],
  });
  await ack();
}

/**
 * Telegram asks for a go-ahead before taking the buyer's Stars. It cancels the
 * charge if we do not answer quickly, so this only checks that the invoice
 * still maps to an unpaid payment row.
 */
async function handlePreCheckout(
  strapi: Core.Strapi,
  token: string,
  query: TelegramPreCheckoutQuery
) {
  const payment = await strapi.db
    .query('api::payment.payment')
    .findOne({ where: { documentId: query.invoice_payload } })
    .catch(() => null);

  const ok = !!payment && payment.status === 'pending';
  await tg(token, 'answerPreCheckoutQuery', {
    pre_checkout_query_id: query.id,
    ok,
    ...(ok ? {} : { error_message: 'This invoice has expired. Please tap /buy again.' }),
  }).catch((e) => {
    strapi.log.error(`[telegram] answerPreCheckoutQuery failed: ${(e as Error).message}`);
  });
}

/**
 * The Stars charge went through. Unlike a card receipt this is verified by
 * Telegram, so Premium is granted immediately with no admin review.
 */
async function handleSuccessfulPayment(
  strapi: Core.Strapi,
  token: string,
  msg: TelegramMessage
) {
  const paid = msg.successful_payment;
  if (!paid) return;

  const payment = await strapi.db.query('api::payment.payment').findOne({
    where: { documentId: paid.invoice_payload },
    populate: { user: true },
  });

  if (!payment) {
    strapi.log.error(`[telegram] successful_payment for unknown invoice ${paid.invoice_payload}`);
    return;
  }
  // Guard against a redelivered update granting a second entitlement.
  if (payment.status !== 'pending') return;

  const userId = payment.user?.id;
  if (!userId) {
    strapi.log.error(`[telegram] paid invoice ${paid.invoice_payload} has no linked user`);
    return;
  }

  const expiry = await activatePremium(strapi, userId, payment.plan_days);
  await strapi.db.query('api::payment.payment').update({
    where: { documentId: paid.invoice_payload },
    data: {
      status: 'approved',
      transaction_id: paid.telegram_payment_charge_id,
      reviewed_at: new Date(),
      premium_expires_set_to: expiry,
    },
  });

  await tg(token, 'sendMessage', {
    chat_id: msg.chat.id,
    text: [
      '🎉 *Premium activated!*',
      '',
      `Active until ${expiry.toISOString().slice(0, 10)}.`,
      '',
      'Head back to bandup.uz — your Energy is unlimited now.',
    ].join('\n'),
    parse_mode: 'Markdown',
  }).catch(() => {});

  for (const adminId of adminChatIds()) {
    await tg(token, 'sendMessage', {
      chat_id: adminId,
      text: `⭐ Stars payment: ${paid.total_amount} XTR for Premium ${payment.plan_id} from ${identityLabel(payment.user)} (charge ${paid.telegram_payment_charge_id})`,
    }).catch(() => {});
  }
}

async function handleReceipt(strapi: Core.Strapi, token: string, msg: TelegramMessage) {
  const user = msg.from;
  if (!user) return;

  const account = await strapi.query('plugin::users-permissions.user').findOne({
    where: { telegram_id: String(user.id) },
  });

  if (!account) {
    await tg(token, 'sendMessage', {
      chat_id: msg.chat.id,
      text: 'Please sign in at bandup.uz first (tap /start), then send your receipt.',
    });
    return;
  }

  // Largest photo size, or a document (image/PDF).
  const fileId = msg.photo?.length
    ? msg.photo[msg.photo.length - 1].file_id
    : msg.document?.file_id;
  if (!fileId) return;

  const admins = adminChatIds();
  if (admins.length === 0) {
    strapi.log.error('[telegram] receipt received but TELEGRAM_ADMIN_CHAT_ID is not set');
    await tg(token, 'sendMessage', {
      chat_id: msg.chat.id,
      text: 'Payments are not configured yet. Please contact @bandup_admin.',
    });
    return;
  }

  // The row was opened when they picked a plan, so we know what they bought.
  // Without one we cannot tell 1 month from 12 — ask them to start at /buy
  // rather than guess and under-grant. Keyed on the Telegram id rather than
  // the account, because /buy asks who to activate Premium for: the row may
  // be credited to a different account than this chat is signed in as.
  const pending = await strapi.db.query('api::payment.payment').findOne({
    where: {
      telegram_id: user.id,
      method: 'card',
      status: 'pending',
      receipt_file_id: { $null: true },
    },
    orderBy: { createdAt: 'desc' },
    populate: { user: true },
  });

  if (!pending) {
    await tg(token, 'sendMessage', {
      chat_id: msg.chat.id,
      text: 'Please tap /buy and choose a plan first, then send your receipt.',
    });
    return;
  }

  const documentId = pending.documentId as string;
  await strapi.db.query('api::payment.payment').update({
    where: { documentId },
    data: { receipt_file_id: fileId, telegram_id: user.id },
  });

  const plan = findPlan(pending.plan_id || '');
  // Who actually gets the Premium: the account picked at /buy, which is not
  // necessarily the Telegram-created one that sent the receipt.
  const credited = pending.user || account;
  const buyerName = escapeMd(
    account.full_name || user.first_name || account.username || 'User'
  );
  // Telegram sign-ups have no email, so this is often null — say so plainly
  // rather than printing the synthetic tg_<id>@ address as if it were one.
  const buyerEmail = realEmail(credited);
  const expected = plan ? cardPriceLabel(plan) : `${pending.amount ?? '?'} ${pending.currency ?? ''}`;
  const caption = [
    `🧾 *Payment receipt* from ${buyerName}`,
    `activate on: ${buyerEmail ? escapeMd(buyerEmail) : '— no email (Telegram sign-up)'}`,
    `phone: ${credited.phone ? escapeMd(credited.phone) : '—'}`,
    `account: #${credited.id} · sent by @${escapeMd(user.username || '—')} (tg ${user.id})`,
    `Plan: *${plan?.label ?? pending.plan_id ?? 'unknown'}* — expected *${expected}*`,
    '',
    'Check the amount matches, then Approve or Reject.',
  ].join('\n');

  // Send the receipt + summary to each admin; record the first message id so we
  // can edit it after a decision.
  let adminMessageId: number | null = null;
  for (const adminId of admins) {
    const sent = await tg<{ message_id: number }>(token, 'sendPhoto', {
      chat_id: adminId,
      photo: fileId,
      caption,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Approve', callback_data: `approve:${documentId}` },
            { text: '❌ Reject', callback_data: `reject:${documentId}` },
          ],
        ],
      },
    }).catch((e) => {
      strapi.log.error(`[telegram] failed to notify admin ${adminId}: ${(e as Error).message}`);
      return null;
    });
    if (sent && adminMessageId === null) adminMessageId = sent.message_id;
  }

  if (adminMessageId !== null) {
    await strapi.db.query('api::payment.payment').update({
      where: { documentId },
      data: { admin_message_id: adminMessageId },
    });
  }

  if (adminMessageId === null) {
    // Every admin send failed. The buyer has already paid, so tell them the
    // truth and give them a way through rather than claiming success — and
    // shout in the log, because nobody is going to see an Approve button.
    strapi.log.error(
      `[telegram] payment ${documentId}: receipt reached NO admin — nobody can approve it`
    );
    await tg(token, 'sendMessage', {
      chat_id: msg.chat.id,
      text: 'We received your receipt but could not reach our team automatically. Please contact @bandup_admin with a screenshot so we can activate your Premium.',
    }).catch(() => {});
    return;
  }

  await tg(token, 'sendMessage', {
    chat_id: msg.chat.id,
    text: '✅ Receipt received! We are verifying your payment and will activate Premium shortly.',
  });
}

async function activatePremium(
  strapi: Core.Strapi,
  userId: number,
  days?: number | null
): Promise<Date> {
  // The plan recorded on the payment row wins; the env default only covers
  // rows created before plans were tracked.
  const grantDays = days && days > 0 ? days : PREMIUM_DURATION_DAYS;
  const user = await strapi.query('plugin::users-permissions.user').findOne({
    where: { id: userId },
  });
  const now = Date.now();
  const current = user?.mock_test_expires_at ? new Date(user.mock_test_expires_at).getTime() : 0;
  // Stack onto remaining time if the subscription is still active.
  const base = Math.max(now, current);
  const expiry = new Date(base + grantDays * 24 * 60 * 60 * 1000);
  await strapi.query('plugin::users-permissions.user').update({
    where: { id: userId },
    data: { mock_test_expires_at: expiry },
  });
  return expiry;
}

async function handleCallbackQuery(
  strapi: Core.Strapi,
  token: string,
  cb: TelegramCallbackQuery
) {
  const ack = (text?: string) =>
    tg(token, 'answerCallbackQuery', { callback_query_id: cb.id, text }).catch(() => {});

  const data = cb.data || '';
  const [action, arg, accountArg] = data.split(':');
  const documentId = arg;
  const accountId = Number(accountArg);

  // Buyer-facing steps of /buy. These are routed before the admin gate below,
  // which guards approve/reject only.
  if (action === 'acct' && arg) {
    await handleAccountChoice(strapi, token, cb, arg, ack);
    return;
  }
  if (action === 'plan' && arg) {
    await handlePlanChoice(token, cb, arg, accountId, ack);
    return;
  }
  if (action === 'pay_card' && arg) {
    await handlePayByCard(strapi, token, cb, arg, accountId, ack);
    return;
  }
  if (action === 'pay_stars' && arg) {
    await handlePayByStars(strapi, token, cb, arg, accountId, ack);
    return;
  }

  // Only admins may approve/reject.
  if (!adminChatIds().includes(String(cb.from.id))) {
    await ack('Not authorized.');
    return;
  }
  if ((action !== 'approve' && action !== 'reject') || !documentId) {
    await ack();
    return;
  }

  const payment = await strapi.db.query('api::payment.payment').findOne({
    where: { documentId },
    populate: { user: true },
  });
  if (!payment) {
    await ack('Payment not found.');
    return;
  }
  if (payment.status !== 'pending') {
    await ack(`Already ${payment.status}.`);
    return;
  }

  const editAdminMessage = async (suffix: string) => {
    if (cb.message) {
      await tg(token, 'editMessageCaption', {
        chat_id: cb.message.chat.id,
        message_id: cb.message.message_id,
        caption: `${cb.message.caption ?? ''}\n\n${suffix}`,
        parse_mode: 'Markdown',
        // An empty keyboard REMOVES the buttons. Omitting reply_markup leaves
        // them in place, so a decided payment keeps offering Approve/Reject.
        reply_markup: { inline_keyboard: [] },
      }).catch((e) => {
        strapi.log.error(`[telegram] failed to edit admin message: ${(e as Error).message}`);
      });
    }
  };

  if (action === 'approve') {
    const userId = payment.user?.id;
    if (!userId) {
      await ack('Payment has no linked user.');
      return;
    }
    const expiry = await activatePremium(strapi, userId, payment.plan_days);
    await strapi.db.query('api::payment.payment').update({
      where: { documentId },
      data: { status: 'approved', reviewed_at: new Date(), premium_expires_set_to: expiry },
    });
    await editAdminMessage(`✅ Approved by ${escapeMd(String(cb.from.first_name || cb.from.id))}`);
    if (payment.telegram_id) {
      await tg(token, 'sendMessage', {
        chat_id: String(payment.telegram_id),
        text: [
          '🎉 Your payment is confirmed — *BandUp Premium is now active!*',
          `Valid until ${expiry.toISOString().slice(0, 10)}.`,
          '',
          '⚡ Unlimited Energy — evaluate as much Writing & Speaking as you want',
          '🎯 All full mock tests unlocked',
          '',
          'Enjoy!',
        ].join('\n'),
        parse_mode: 'Markdown',
      }).catch(() => {});
    }
    await ack('Approved ✅');
    return;
  }

  // reject
  await strapi.db.query('api::payment.payment').update({
    where: { documentId },
    data: { status: 'rejected', reviewed_at: new Date() },
  });
  await editAdminMessage(`❌ Rejected by ${escapeMd(String(cb.from.first_name || cb.from.id))}`);
  if (payment.telegram_id) {
    await tg(token, 'sendMessage', {
      chat_id: String(payment.telegram_id),
      text: 'We could not verify your payment receipt. Please check it and resend, or contact @bandup_admin.',
    }).catch(() => {});
  }
  await ack('Rejected');
}

async function handleUpdate(strapi: Core.Strapi, token: string, update: TelegramUpdate) {
  if (update.callback_query) {
    await handleCallbackQuery(strapi, token, update.callback_query);
    return;
  }

  // Telegram cancels the Stars charge unless this is answered promptly.
  if (update.pre_checkout_query) {
    await handlePreCheckout(strapi, token, update.pre_checkout_query);
    return;
  }

  const msg = update.message;
  if (!msg) return;

  if (msg.successful_payment) {
    await handleSuccessfulPayment(strapi, token, msg);
    return;
  }

  if (msg.contact) {
    await handleContact(strapi, token, msg);
    return;
  }

  // A photo or an image/PDF document is treated as a payment receipt.
  const isReceiptDoc =
    msg.document && /^(image\/|application\/pdf)/.test(msg.document.mime_type || '');
  if (msg.photo || isReceiptDoc) {
    await handleReceipt(strapi, token, msg);
    return;
  }

  if (!msg.text) return;

  const text = msg.text.trim();
  if (text === '/buy' || text === '/start buy' || text.startsWith('/buy ')) {
    await handleBuy(strapi, token, msg);
  } else if (text === '/start' || text.startsWith('/start ')) {
    if (msg.from) awaitingEmail.delete(msg.from.id);
    await handleStart(strapi, token, msg);
  } else if (msg.from && isAwaitingEmail(msg.from.id)) {
    await handleEmailReply(strapi, token, msg);
  } else {
    await tg(token, 'sendMessage', {
      chat_id: msg.chat.id,
      text: 'Tap /start to get a login code, or /buy to upgrade to Premium.',
    });
  }
}

let stopped = false;

export function startTelegramBot(strapi: Core.Strapi) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const enabled = (process.env.TELEGRAM_BOT_ENABLED || 'true') !== 'false';

  if (!enabled) {
    strapi.log.info('[telegram] bot disabled (TELEGRAM_BOT_ENABLED=false)');
    return;
  }
  if (!token) {
    strapi.log.warn('[telegram] TELEGRAM_BOT_TOKEN is not set, bot will not run');
    return;
  }

  let offset = 0;

  const loop = async () => {
    // Drop any pre-existing webhook so long-polling works
    try {
      await tg(token, 'deleteWebhook', { drop_pending_updates: false });
    } catch (e) {
      strapi.log.warn(`[telegram] deleteWebhook failed: ${(e as Error).message}`);
    }

    strapi.log.info('[telegram] bot polling started');

    while (!stopped) {
      try {
        const updates = await tg<TelegramUpdate[]>(token, 'getUpdates', {
          offset,
          timeout: POLL_TIMEOUT_SEC,
          // pre_checkout_query MUST be listed: an explicit allowed_updates
          // filters out every type not named, and a Stars payment that goes
          // unanswered is cancelled by Telegram.
          allowed_updates: ['message', 'callback_query', 'pre_checkout_query'],
        });
        for (const update of updates) {
          offset = update.update_id + 1;
          handleUpdate(strapi, token, update).catch((e) =>
            strapi.log.error(`[telegram] handleUpdate error: ${(e as Error).message}`)
          );
        }
      } catch (e) {
        const msg = (e as Error).message;
        // Another Strapi instance (e.g. previous dev-reload) is polling — let it.
        if (msg.includes('terminated by other getUpdates')) {
          strapi.log.info('[telegram] superseded by another instance, exiting poll loop');
          return;
        }
        strapi.log.error(`[telegram] poll error: ${msg}`);
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  };

  loop();

  process.once('SIGINT', () => {
    stopped = true;
  });
  process.once('SIGTERM', () => {
    stopped = true;
  });
}
