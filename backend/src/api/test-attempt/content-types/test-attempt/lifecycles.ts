const FRONTEND_URL = process.env.FRONTEND_URL || 'https://bandup.uz';

export default {
  async afterCreate(event) {
    const { result } = event;
    if (result?.documentId && !result.result_url) {
      await strapi.documents('api::test-attempt.test-attempt').update({
        documentId: result.documentId,
        data: { result_url: `${FRONTEND_URL}/dashboard/results/${result.documentId}` },
      });
    }
  },
};
