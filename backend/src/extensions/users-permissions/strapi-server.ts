export default (plugin) => {
  // Override the Google provider to return full_name and avatar_url from Google's userinfo.

  const originalBootstrap = plugin.bootstrap;

  plugin.bootstrap = async (params) => {
    if (originalBootstrap) {
      await originalBootstrap(params);
    }

    const { strapi } = params;

    const providersRegistry = strapi
      .plugin('users-permissions')
      .service('providers-registry');

    const googleProvider = providersRegistry.get('google');

    // Update the stored grant config to include 'profile' scope
    const grantStore = strapi.store({ type: 'plugin', name: 'users-permissions', key: 'grant' });
    const grantConfig = await grantStore.get();
    if (grantConfig?.google) {
      grantConfig.google.scope = ['email', 'profile'];
      await grantStore.set({ value: grantConfig });
      strapi.log.info('Google OAuth scope updated to include profile');
    }

    if (googleProvider) {
      googleProvider.authCallback = async ({ accessToken }) => {
        const res = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (!res.ok) {
          throw new Error(`Google userinfo request failed: ${res.status}`);
        }

        const body = (await res.json()) as { email: string; id: string; name: string; picture: string };

        return {
          username: body.email ? body.email.split('@')[0] : body.id,
          email: body.email,
          full_name: body.name || '',
          avatar_url: body.picture || '',
        };
      };
    }

    strapi.log.info('Google OAuth extended with full_name & avatar_url');
  };

  return plugin;
};