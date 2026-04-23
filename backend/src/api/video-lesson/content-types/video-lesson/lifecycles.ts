const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export default {
  async afterCreate({ result }: { result: { documentId: string } }) {
    // Fire-and-forget: generate quiz after video is saved to Strapi
    fetch(`${FRONTEND_URL}/api/videos/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId: result.documentId }),
    }).catch((err: Error) => {
      console.error('[video-lesson lifecycle] Failed to trigger quiz generation:', err.message);
    });
  },
};
