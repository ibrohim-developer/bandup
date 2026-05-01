import type { Core } from '@strapi/strapi';

const TELEGRAM_API = 'https://api.telegram.org';
const POLL_TIMEOUT_SEC = 30;
const CODE_TTL_MS = 60 * 1000;

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
}

interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: { id: number };
  text?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
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

async function handleStart(strapi: Core.Strapi, token: string, msg: TelegramMessage) {
  const user = msg.from;
  if (!user) return;

  const code = await generateUniqueCode(strapi);
  const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString();

  await strapi.entityService.create('api::telegram-auth-code.telegram-auth-code', {
    data: {
      code,
      telegram_id: user.id,
      first_name: user.first_name || null,
      last_name: user.last_name || null,
      username: user.username || null,
      used: false,
      expires_at: expiresAt,
      publishedAt: new Date(),
    },
  });

  const text = [
    `Hi ${user.first_name || 'there'}!`,
    '',
    `Your BandUp login code is: \`${code}\` (tap to copy)`,
    '',
    'Enter this code on bandup.uz to sign in. The code expires in 1 minute.',
  ].join('\n');

  await tg(token, 'sendMessage', {
    chat_id: msg.chat.id,
    text,
    parse_mode: 'Markdown',
  });
}

async function handleUpdate(strapi: Core.Strapi, token: string, update: TelegramUpdate) {
  const msg = update.message;
  if (!msg || !msg.text) return;

  const text = msg.text.trim();
  if (text === '/start' || text.startsWith('/start ')) {
    await handleStart(strapi, token, msg);
  } else {
    await tg(token, 'sendMessage', {
      chat_id: msg.chat.id,
      text: 'Tap /start to get a login code for bandup.uz.',
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
          allowed_updates: ['message'],
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
