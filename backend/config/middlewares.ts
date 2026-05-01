import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: (process.env.CORS_ORIGINS || 'https://bandup.uz')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean),
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  {
    name: 'strapi::session',
    config: {
      proxy: true,
      cookie: {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
      },
    },
  },
  'strapi::favicon',
  'strapi::public',
];

export default config;