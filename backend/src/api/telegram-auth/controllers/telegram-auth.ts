import type { Core } from '@strapi/strapi';
import crypto from 'crypto';

const PLACEHOLDER_EMAIL_DOMAIN = 'telegram.bandup.uz';
const MAX_FAILED_VERIFY_PER_IP = 8;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const MAX_TRACKED_IPS = 10000;

// Failed-attempt tracking per IP. Only *failed* attempts count, so a legitimate
// user who mistypes once isn't penalised, while a brute-forcer is throttled
// quickly. NOTE: this is in-memory and per-instance — it resets on restart and
// is not shared across instances. It's a speed-bump that, combined with
// crypto-random, single-use, 60-second codes, makes guessing impractical; a
// multi-instance deployment should move this to shared storage (e.g. Redis).
const ipFailures = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const entry = ipFailures.get(ip);
  return (
    !!entry && entry.resetAt >= Date.now() && entry.count >= MAX_FAILED_VERIFY_PER_IP
  );
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  // Bound memory: prune expired entries if the map grows large.
  if (ipFailures.size > MAX_TRACKED_IPS) {
    for (const [key, entry] of ipFailures) {
      if (entry.resetAt < now) ipFailures.delete(key);
    }
  }
  const entry = ipFailures.get(ip);
  if (!entry || entry.resetAt < now) {
    ipFailures.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async verifyCode(ctx) {
    const { code } = ctx.request.body || {};
    const ip = ctx.request.ip || 'unknown';

    if (isRateLimited(ip)) {
      return ctx.tooManyRequests('Too many attempts. Try again later.');
    }

    if (!code || typeof code !== 'string' || !/^\d{6}$/.test(code)) {
      recordFailedAttempt(ip);
      return ctx.badRequest('Invalid code format');
    }

    const records = await strapi.entityService.findMany(
      'api::telegram-auth-code.telegram-auth-code',
      {
        filters: {
          code,
          used: false,
        },
        sort: { createdAt: 'desc' },
        limit: 1,
      }
    );

    const record = Array.isArray(records) ? records[0] : null;
    if (!record) {
      recordFailedAttempt(ip);
      return ctx.badRequest('Invalid or expired code');
    }

    if (new Date(record.expires_at).getTime() < Date.now()) {
      recordFailedAttempt(ip);
      return ctx.badRequest('Code has expired. Open the bot and tap Start again.');
    }

    await strapi.entityService.update(
      'api::telegram-auth-code.telegram-auth-code',
      record.id,
      { data: { used: true } }
    );

    const telegramId = String(record.telegram_id);
    const fullName = [record.first_name, record.last_name].filter(Boolean).join(' ').trim() || record.username || 'Telegram User';
    const placeholderEmail = `tg_${telegramId}@${PLACEHOLDER_EMAIL_DOMAIN}`;

    const existing = await strapi.query('plugin::users-permissions.user').findOne({
      where: { telegram_id: telegramId },
    });

    let userId: number;

    if (existing) {
      await strapi.query('plugin::users-permissions.user').update({
        where: { id: existing.id },
        data: {
          full_name: existing.full_name || fullName,
          avatar_url: existing.avatar_url || record.photo_url || null,
        },
      });
      userId = existing.id;
    } else {
      if (!record.phone) {
        return ctx.badRequest('Phone number required. Open the bot and tap Start to share your phone.');
      }

      const authenticatedRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'authenticated' } });

      const randomPassword = crypto.randomBytes(32).toString('hex');

      const created = await strapi.plugin('users-permissions').service('user').add({
        username: `tg_${telegramId}_${Date.now()}`,
        email: placeholderEmail,
        password: randomPassword,
        provider: 'telegram',
        confirmed: true,
        blocked: false,
        role: authenticatedRole?.id,
        telegram_id: telegramId,
        full_name: fullName,
        avatar_url: record.photo_url || null,
        phone: record.phone,
      });

      userId = created.id;
    }

    const jwt = strapi.plugin('users-permissions').service('jwt').issue({ id: userId });
    const user = await strapi.query('plugin::users-permissions.user').findOne({
      where: { id: userId },
      populate: ['role'],
    });

    const isNewUser = !user.pixel_signup_fired;
    if (isNewUser) {
      await strapi.query('plugin::users-permissions.user').update({
        where: { id: userId },
        data: { pixel_signup_fired: true },
      });
    }

    return ctx.send({ jwt, user, isNewUser });
  },
});
