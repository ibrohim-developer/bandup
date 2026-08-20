/**
 * Admin email notifications.
 *
 * Thin wrapper around Strapi's email plugin used by content-type lifecycles
 * that need to alert the team when users submit something (feedback, issue
 * reports, ...).
 *
 * Delivery is best-effort: a failing mail server must never roll back the
 * record the user just created, so every error is logged and swallowed.
 * Recipients come from `ADMIN_NOTIFICATION_EMAILS` (comma-separated); when it
 * is unset nothing is sent and a single debug line is logged.
 */

type NotificationRow = {
  label: string;
  value: string | number | null | undefined;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getRecipients = (): string[] =>
  (process.env.ADMIN_NOTIFICATION_EMAILS || '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);

/** Render rows as a plain-text body: "Label: value" lines, blanks dropped. */
const toText = (rows: NotificationRow[]): string =>
  rows
    .filter((row) => row.value !== null && row.value !== undefined && row.value !== '')
    .map((row) => `${row.label}: ${row.value}`)
    .join('\n');

/** Render the same rows as a simple two-column HTML table. */
const toHtml = (title: string, rows: NotificationRow[]): string => {
  const cells = rows
    .filter((row) => row.value !== null && row.value !== undefined && row.value !== '')
    .map(
      (row) =>
        `<tr>` +
        `<td style="padding:6px 12px 6px 0;vertical-align:top;color:#666;white-space:nowrap;">${escapeHtml(row.label)}</td>` +
        `<td style="padding:6px 0;vertical-align:top;white-space:pre-wrap;">${escapeHtml(String(row.value))}</td>` +
        `</tr>`,
    )
    .join('');

  return (
    `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:14px;color:#111;">` +
    `<h2 style="font-size:16px;margin:0 0 12px;">${escapeHtml(title)}</h2>` +
    `<table style="border-collapse:collapse;">${cells}</table>` +
    `</div>`
  );
};

export async function sendAdminNotification({
  subject,
  title,
  rows,
}: {
  subject: string;
  title: string;
  rows: NotificationRow[];
}): Promise<void> {
  const recipients = getRecipients();

  if (recipients.length === 0) {
    strapi.log.debug(`[admin-notification] ADMIN_NOTIFICATION_EMAILS is not set — skipping "${subject}"`);
    return;
  }

  try {
    await strapi.plugin('email').service('email').send({
      to: recipients,
      subject,
      text: toText(rows),
      html: toHtml(title, rows),
    });
  } catch (err) {
    strapi.log.error(`[admin-notification] Failed to send "${subject}": ${(err as Error).message}`);
  }
}
