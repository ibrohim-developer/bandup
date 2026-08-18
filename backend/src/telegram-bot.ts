import type { Core } from '@strapi/strapi';
import crypto from 'crypto';

const TELEGRAM_API = 'https://api.telegram.org';
const POLL_TIMEOUT_SEC = 30;
const CODE_TTL_MS = 60 * 1000;

// --- Premium purchase ("/buy") config -------------------------------------
const PREMIUM_DURATION_DAYS = Number(process.env.PREMIUM_DURATION_DAYS || 30);
const PREMIUM_PRICE = process.env.PREMIUM_PRICE || '';
const PREMIUM_CURRENCY = process.env.PREMIUM_CURRENCY || 'USD';
const PAYMENT_CARD_NUMBER = process.env.PAYMENT_CARD_NUMBER || '';

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

  const priceLine = PREMIUM_PRICE
    ? `💎 *BandUp Premium* — ${PREMIUM_PRICE} ${PREMIUM_CURRENCY} for ${PREMIUM_DURATION_DAYS} days`
    : `💎 *BandUp Premium* — ${PREMIUM_DURATION_DAYS} days`;
  await tg(token, 'sendMessage', {
    chat_id: msg.chat.id,
    text: [
      priceLine,
      '',
      '⚡ Unlimited Energy — unlimited AI Writing & Speaking evaluations',
      '🎯 All full mock tests unlocked',
      ...(PAYMENT_CARD_NUMBER ? ['', `💳 Transfer to: \`${PAYMENT_CARD_NUMBER}\``] : []),
      '',
      '📸 After paying, send the *payment receipt* (photo or PDF) here in this chat. We will verify it and activate your Premium.',
    ].join('\n'),
    parse_mode: 'Markdown',
  });
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

  const payment = await strapi.entityService.create('api::payment.payment', {
    data: {
      user: account.id,
      telegram_id: user.id,
      status: 'pending',
      currency: PREMIUM_CURRENCY,
      receipt_file_id: fileId,
      publishedAt: new Date(),
    },
  });

  const documentId = (payment as { documentId: string }).documentId;
  const buyerName = account.full_name || user.first_name || account.username || 'User';
  const caption = [
    `🧾 *Payment receipt* from ${buyerName}`,
    `tg: @${user.username || '—'} (id ${user.id})`,
    '',
    'Review the receipt and Approve or Reject.',
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

  await tg(token, 'sendMessage', {
    chat_id: msg.chat.id,
    text: '✅ Receipt received! We are verifying your payment and will activate Premium shortly.',
  });
}

async function activatePremium(
  strapi: Core.Strapi,
  userId: number
): Promise<Date> {
  const user = await strapi.query('plugin::users-permissions.user').findOne({
    where: { id: userId },
  });
  const now = Date.now();
  const current = user?.mock_test_expires_at ? new Date(user.mock_test_expires_at).getTime() : 0;
  // Stack onto remaining time if the subscription is still active.
  const base = Math.max(now, current);
  const expiry = new Date(base + PREMIUM_DURATION_DAYS * 24 * 60 * 60 * 1000);
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

  // Only admins may approve/reject.
  if (!adminChatIds().includes(String(cb.from.id))) {
    await ack('Not authorized.');
    return;
  }

  const data = cb.data || '';
  const [action, documentId] = data.split(':');
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
      }).catch(() => {});
    }
  };

  if (action === 'approve') {
    const userId = payment.user?.id;
    if (!userId) {
      await ack('Payment has no linked user.');
      return;
    }
    const expiry = await activatePremium(strapi, userId);
    await strapi.db.query('api::payment.payment').update({
      where: { documentId },
      data: { status: 'approved', reviewed_at: new Date(), premium_expires_set_to: expiry },
    });
    await editAdminMessage(`✅ Approved by ${cb.from.first_name || cb.from.id}`);
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
  await editAdminMessage(`❌ Rejected by ${cb.from.first_name || cb.from.id}`);
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

  const msg = update.message;
  if (!msg) return;

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
    await handleStart(strapi, token, msg);
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
          allowed_updates: ['message', 'callback_query'],
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
