import type { Core } from '@strapi/strapi';
import crypto from 'crypto';

const PLACEHOLDER_EMAIL_DOMAIN = 'telegram.bandup.uz';
const MAX_VERIFY_PER_IP_PER_15MIN = 10;

const ipAttempts = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 15 * 60 * 1000;
  const entry = ipAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    ipAttempts.set(ip, { count: 1, resetAt: now + window });
    return true;
  }
  if (entry.count >= MAX_VERIFY_PER_IP_PER_15MIN) return false;
  entry.count += 1;
  return true;
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async verifyCode(ctx) {
    const { code } = ctx.request.body || {};
    const ip = ctx.request.ip || 'unknown';

    if (!rateLimit(ip)) {
      return ctx.tooManyRequests('Too many attempts. Try again later.');
    }

    if (!code || typeof code !== 'string' || !/^\d{6}$/.test(code)) {
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
      return ctx.badRequest('Invalid or expired code');
    }

    if (new Date(record.expires_at).getTime() < Date.now()) {
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
      });

      userId = created.id;
    }

    const jwt = strapi.plugin('users-permissions').service('jwt').issue({ id: userId });
    const user = await strapi.query('plugin::users-permissions.user').findOne({
      where: { id: userId },
      populate: ['role'],
    });

    return ctx.send({ jwt, user });
  },
});
