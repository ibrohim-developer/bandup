const FRONTEND_URL = process.env.FRONTEND_URL || 'https://bandup.uz';

export default {
  async afterCreate(event) {
    const { result } = event;
    if (result?.documentId && !result.result_url) {
      const path =
        result.module_type === 'speaking'
          ? `/dashboard/speaking/result/${result.documentId}`
          : `/dashboard/results/${result.documentId}`;
      await strapi.documents('api::test-attempt.test-attempt').update({
        documentId: result.documentId,
        data: { result_url: `${FRONTEND_URL}${path}` },
      });
    }
  },
};
