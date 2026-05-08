export default {
  async afterUpdate(event: any) {
    const { result } = event;

    // Only clean up when evaluation has completed and audio file is still stored
    if (!result.transcript || !result.audio_url) return;

    try {
      const file = await strapi.db.query("plugin::upload.file").findOne({
        where: { url: result.audio_url },
      });

      if (file) {
        await strapi.plugin("upload").service("upload").remove(file);
      }

      // Clear the URL so this hook doesn't try to delete again on future updates
      await strapi.db
        .query("api::speaking-submission.speaking-submission")
        .update({ where: { id: result.id }, data: { audio_url: null } });
    } catch (err) {
      strapi.log.error("[speaking-submission] Failed to delete audio file:", err);
    }
  },
};
