import { sendAdminNotification } from '../../../../utils/admin-notification';

const STRAPI_URL = process.env.PUBLIC_URL || process.env.STRAPI_URL || '';

const TYPE_LABELS: Record<string, string> = {
  ui_bug: 'UI bug',
  audio_issue: 'Audio issue',
  question_error: 'Question error',
  content_mistake: 'Content mistake',
  other: 'Other',
};

/** Screenshots are stored as relative upload URLs; make them clickable. */
function absoluteUrl(url?: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return STRAPI_URL ? `${STRAPI_URL}${url}` : url;
}

export default {
  async afterCreate(event: any) {
    const { result } = event;

    // `result` has no relations, so re-read the row for the reporter + image.
    let report = result;
    try {
      report =
        (await strapi.db.query('api::issue-report.issue-report').findOne({
          where: { id: result.id },
          populate: { user: true, image: true },
        })) || result;
    } catch (err) {
      strapi.log.error(`[issue-report lifecycle] Failed to load report: ${(err as Error).message}`);
    }

    const user = report.user;

    // Fire-and-forget: the reporter shouldn't wait on the SMTP round-trip,
    // and a mail failure must not roll back their report.
    void sendAdminNotification({
      subject: `New issue report on BandUp: ${TYPE_LABELS[report.type] || report.type}`,
      title: 'New issue report',
      rows: [
        { label: 'Type', value: TYPE_LABELS[report.type] || report.type },
        { label: 'Description', value: report.description },
        { label: 'Module', value: report.module },
        { label: 'Page', value: report.page_url },
        { label: 'Status', value: report.status },
        { label: 'Screenshot', value: absoluteUrl(report.image?.url) },
        { label: 'User', value: user ? `${user.username} (${user.email})` : null },
        { label: 'Submitted at', value: report.createdAt },
      ],
    });
  },
};
