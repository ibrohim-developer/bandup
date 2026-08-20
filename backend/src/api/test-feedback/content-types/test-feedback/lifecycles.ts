import { sendAdminNotification } from '../../../../utils/admin-notification';

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://bandup.uz';

/** Look up the submitter so the email carries a name instead of a bare id. */
async function findUser(userId?: string | null) {
  if (!userId) return null;
  try {
    return await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: userId },
      select: ['id', 'username', 'email'],
    });
  } catch {
    return null;
  }
}

export default {
  async afterCreate(event: any) {
    const { result } = event;

    // Relations aren't on `result`, so re-read the row to pick up the attempt.
    let feedback = result;
    try {
      feedback =
        (await strapi.db.query('api::test-feedback.test-feedback').findOne({
          where: { id: result.id },
          populate: { test_attempt: true },
        })) || result;
    } catch (err) {
      strapi.log.error(`[test-feedback lifecycle] Failed to load feedback: ${(err as Error).message}`);
    }

    const user = await findUser(feedback.user_id);
    const attempt = feedback.test_attempt;

    // Fire-and-forget: the submitter shouldn't wait on the SMTP round-trip,
    // and a mail failure must not roll back their feedback.
    void sendAdminNotification({
      subject: 'New test feedback on BandUp',
      title: 'New test feedback',
      rows: [
        { label: 'Message', value: feedback.message },
        { label: 'User', value: user ? `${user.username} (${user.email})` : feedback.user_id },
        { label: 'Module', value: attempt?.module_type },
        { label: 'Band score', value: attempt?.band_score },
        {
          label: 'Attempt',
          value: attempt?.result_url || (attempt ? `${FRONTEND_URL}/dashboard/results/${attempt.documentId}` : null),
        },
        { label: 'Submitted at', value: feedback.createdAt },
      ],
    });
  },
};
