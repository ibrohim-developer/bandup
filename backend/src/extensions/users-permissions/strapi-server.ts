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

    if (googleProvider) {
      googleProvider.authCallback = async ({ accessToken, purest }) => {
        try {
          const google = purest({ provider: 'google' });
          const { body } = await google
            .get('https://www.googleapis.com/oauth2/v2/userinfo')
            .auth(accessToken)
            .request();

          return {
            username: body.email ? body.email.split('@')[0] : body.id,
            email: body.email,
            full_name: body.name || '',
            avatar_url: body.picture || '',
          };
        } catch (error) {
          strapi.log.warn('Google userinfo failed, falling back to tokeninfo:', error);
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
      const user = await originalConnect(provider, query);

      // If user exists but is missing full_name or avatar_url, update from the profile
      if (user && provider === 'google' && (!user.full_name || !user.avatar_url)) {
        try {
          const accessToken = query.access_token || query.code || query.oauth_token;
          const profile = await providersRegistry.run({
            provider,
            query,
            accessToken,
            providers: await strapi
              .store({ type: 'plugin', name: 'users-permissions', key: 'grant' })
              .get(),
          });

          const updateData: Record<string, string> = {};
          if (!user.full_name && profile.full_name) {
            updateData.full_name = profile.full_name;
          }
          if (!user.avatar_url && profile.avatar_url) {
            updateData.avatar_url = profile.avatar_url;
          }

          if (Object.keys(updateData).length > 0) {
            await strapi.db
              .query('plugin::users-permissions.user')
              .update({ where: { id: user.id }, data: updateData });

            Object.assign(user, updateData);
          }
        } catch (error) {
          strapi.log.warn('Failed to update Google user profile data:', error);
        }
      }

      return user;
    };

    strapi.log.info('✅ Google OAuth extended with full_name & avatar_url sync');
  };

  return plugin;
};
