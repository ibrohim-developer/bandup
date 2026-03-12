export default (plugin) => {
  // Override the Google provider to return full_name and avatar_url from Google's userinfo.
  // Also update existing users who are missing these fields on subsequent logins.

  const originalBootstrap = plugin.bootstrap;

  plugin.bootstrap = async (params) => {
    if (originalBootstrap) {
      await originalBootstrap(params);
    }

    const { strapi } = params;

    // 1. Override the Google authCallback to return full_name + avatar_url
    const providersRegistry = strapi
      .plugin('users-permissions')
      .service('providers-registry');

    const googleProvider = providersRegistry.get('google');

    // Store the last fetched Google profile so we can reuse it for existing user updates
    // without making a second API call (the access token may be single-use).
    let lastGoogleProfile: Record<string, string> | null = null;

    if (googleProvider) {
      googleProvider.authCallback = async ({ accessToken, purest }) => {
        try {
          const google = purest({ provider: 'google' });
          const { body } = await google
            .get('https://www.googleapis.com/oauth2/v2/userinfo')
            .auth(accessToken)
            .request();

          strapi.log.info(`Google userinfo response: ${JSON.stringify({ name: body.name, email: body.email, picture: body.picture ? '(present)' : '(missing)' })}`);

          lastGoogleProfile = {
            username: body.email ? body.email.split('@')[0] : body.id,
            email: body.email,
            full_name: body.name || body.given_name || '',
            avatar_url: body.picture || '',
          };

          return { ...lastGoogleProfile };
        } catch (error) {
          strapi.log.warn('Google userinfo failed, falling back to tokeninfo:', error);
          lastGoogleProfile = null;

          const google = purest({ provider: 'google' });
          const { body } = await google
            .query('oauth')
            .get('tokeninfo')
            .qs({ accessToken })
            .request();

          return {
            username: body.email.split('@')[0],
            email: body.email,
          };
        }
      };
    }

    // 2. Override the providers connect service to update existing users' missing profile data
    const providersService = strapi
      .plugin('users-permissions')
      .service('providers');

    const originalConnect = providersService.connect.bind(providersService);

    providersService.connect = async (provider, query) => {
      // Reset the cached profile before each connect call
      lastGoogleProfile = null;

      const user = await originalConnect(provider, query);

      // For existing Google users missing profile data, use the cached profile
      // from the authCallback that was already called inside originalConnect
      if (user && provider === 'google' && lastGoogleProfile) {
        const updateData: Record<string, string> = {};

        if (!user.full_name && lastGoogleProfile.full_name) {
          updateData.full_name = lastGoogleProfile.full_name;
        }
        if (!user.avatar_url && lastGoogleProfile.avatar_url) {
          updateData.avatar_url = lastGoogleProfile.avatar_url;
        }

        if (Object.keys(updateData).length > 0) {
          strapi.log.info(`Updating Google user ${user.id} with: ${JSON.stringify(updateData)}`);

          await strapi.db
            .query('plugin::users-permissions.user')
            .update({ where: { id: user.id }, data: updateData });

          Object.assign(user, updateData);
        }
      }

      return user;
    };

    strapi.log.info('✅ Google OAuth extended with full_name & avatar_url sync');
  };

  return plugin;
};
