import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Configure permissions on first run
    const pluginStore = strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    const authenticatedRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'authenticated' } });

    if (!publicRole || !authenticatedRole) return;

    // Define permissions
    const publicPermissions: Record<string, string[]> = {
      'api::test': ['find', 'findOne'],
      'api::reading-passage': ['find', 'findOne'],
      'api::listening-section': ['find', 'findOne'],
      'api::writing-task': ['find', 'findOne'],
      'api::speaking-topic': ['find', 'findOne'],
      'api::question': ['find', 'findOne'],
      'api::business-inquiry': ['create'],
    };

    const authenticatedPermissions: Record<string, string[]> = {
      // Content (read-only)
      'api::test': ['find', 'findOne'],
      'api::reading-passage': ['find', 'findOne'],
      'api::listening-section': ['find', 'findOne'],
      'api::writing-task': ['find', 'findOne'],
      'api::speaking-topic': ['find', 'findOne'],
      'api::question': ['find', 'findOne'],
      'api::business-inquiry': ['create'],
      // User data (CRUD own)
      'api::test-attempt': ['find', 'findOne', 'create', 'update'],
      'api::user-answer': ['find', 'findOne', 'create'],
      'api::writing-submission': ['find', 'findOne', 'create', 'update'],
      'api::speaking-submission': ['find', 'findOne', 'create', 'update'],
      'api::test-progress': ['find', 'findOne', 'create', 'update'],
      'api::full-mock-test-attempt': ['find', 'findOne', 'create', 'update'],
      'api::feature-notification': ['find', 'create'],
      'api::telegram-auth-code': ['find', 'create', 'update'],
    };

    // Apply permissions
    const setPermissions = async (
      roleId: number,
      permissions: Record<string, string[]>
    ) => {
      for (const [uid, actions] of Object.entries(permissions)) {
        for (const action of actions) {
          const existingPermission = await strapi
            .query('plugin::users-permissions.permission')
            .findOne({
              where: {
                role: roleId,
                action: `${uid}.${action}`,
              },
            });

          if (!existingPermission) {
            await strapi
              .query('plugin::users-permissions.permission')
              .create({
                data: {
                  action: `${uid}.${action}`,
                  role: roleId,
                  enabled: true,
                },
              });
          }
        }
      }
    };

    await setPermissions(publicRole.id, publicPermissions);
    await setPermissions(authenticatedRole.id, authenticatedPermissions);

    console.log('✅ Permissions configured');
  },
};
