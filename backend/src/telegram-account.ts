/**
 * Shared knowledge about accounts that were created from Telegram.
 *
 * users-permissions requires a unique, non-null `email`, but a Telegram
 * sign-up never gives us one — so the auth controller mints an address from
 * the Telegram id. Minting and detecting that placeholder live together here
 * so they cannot drift apart: anything that shows an account to a human has to
 * know the address is a stand-in, not a way to reach anybody.
 */
export const PLACEHOLDER_EMAIL_DOMAIN = 'telegram.bandup.uz';

export function placeholderEmail(telegramId: string): string {
  return `tg_${telegramId}@${PLACEHOLDER_EMAIL_DOMAIN}`;
}

/** The address a human could actually be reached at, or null for a placeholder. */
export function realEmail(account: { email?: string | null } | null | undefined): string | null {
  const email = account?.email?.trim();
  if (!email || email.toLowerCase().endsWith(`@${PLACEHOLDER_EMAIL_DOMAIN}`)) return null;
  return email;
}

/**
 * One-line "who is this" for an admin, in plain text — Markdown callers must
 * run it through their own escaping. Falls back to the phone, which every
 * Telegram sign-up shares at /start, so the accounts with no email are exactly
 * the ones that always have a number. The account id is always appended: it is
 * how you find the row in the Strapi admin whichever contact we hold.
 */
export function identityLabel(
  account: { id: number; email?: string | null; phone?: string | null } | null | undefined
): string {
  if (!account) return 'unknown account';
  const contact = realEmail(account) || account.phone?.trim() || null;
  return contact ? `${contact} · account #${account.id}` : `account #${account.id}`;
}
