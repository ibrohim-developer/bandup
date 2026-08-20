import type { Core } from '@strapi/strapi';

type Env = Core.Config.Shared.ConfigParams['env'];

/**
 * Durable uploads.
 *
 * By default Strapi stores uploads on local disk (backend/public/uploads).
 * That's fine on the persistent-disk Droplet deploy, but is lost on any
 * ephemeral host (e.g. DO App Platform) and can't be shared across instances.
 *
 * Set `UPLOAD_PROVIDER=s3` (and install `@strapi/provider-upload-aws-s3`) to
 * store uploads in S3-compatible object storage such as DigitalOcean Spaces.
 * Required env: SPACES_ENDPOINT, SPACES_REGION, SPACES_BUCKET,
 * SPACES_ACCESS_KEY, SPACES_SECRET_KEY, and SPACES_CDN_URL (public base URL).
 *
 * Safe fallback: if the flag is unset, or the provider package isn't installed,
 * we use the default local provider — so this never breaks dev or the current
 * deploy.
 */
const uploadConfig = (env: Env): Core.Config.Plugin => {
  const useS3 = env('UPLOAD_PROVIDER') === 's3';

  let s3Available = false;
  if (useS3) {
    try {
      // Only reference the provider if it's actually installed, so an enabled
      // flag without the package falls back to local instead of crashing boot.
      require.resolve('@strapi/provider-upload-aws-s3');
      s3Available = true;
    } catch {
      // eslint-disable-next-line no-console
      console.warn(
        '[upload] UPLOAD_PROVIDER=s3 but @strapi/provider-upload-aws-s3 is not installed — using local disk.',
      );
    }
  }

  if (!useS3 || !s3Available) return {};

  return {
    upload: {
      config: {
        provider: 'aws-s3',
        providerOptions: {
          baseUrl: env('SPACES_CDN_URL'),
          s3Options: {
            endpoint: env('SPACES_ENDPOINT'),
            region: env('SPACES_REGION'),
            credentials: {
              accessKeyId: env('SPACES_ACCESS_KEY'),
              secretAccessKey: env('SPACES_SECRET_KEY'),
            },
            params: {
              Bucket: env('SPACES_BUCKET'),
            },
          },
        },
        actionOptions: { upload: {}, uploadStream: {}, delete: {} },
      },
    },
  };
};

/**
 * Outgoing email (admin notifications for feedback + issue reports).
 *
 * Strapi's default email provider is `sendmail`, which needs a local MTA and
 * silently goes nowhere on most hosts. Set `SMTP_HOST` (and install
 * `@strapi/provider-email-nodemailer`) to send through a real SMTP relay.
 * Required env: SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD,
 * EMAIL_DEFAULT_FROM; optional: SMTP_SECURE, EMAIL_DEFAULT_REPLY_TO.
 *
 * Same safe fallback as uploads: no SMTP_HOST, or no provider package, and we
 * leave the default provider in place instead of crashing boot.
 */
const emailConfig = (env: Env): Core.Config.Plugin => {
  const smtpHost = env('SMTP_HOST');
  if (!smtpHost) return {};

  try {
    require.resolve('@strapi/provider-email-nodemailer');
  } catch {
    // eslint-disable-next-line no-console
    console.warn(
      '[email] SMTP_HOST is set but @strapi/provider-email-nodemailer is not installed — using the default provider.',
    );
    return {};
  }

  const port = env.int('SMTP_PORT', 587);

  return {
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: smtpHost,
          port,
          // Implicit TLS on 465; STARTTLS on 587/25.
          secure: env.bool('SMTP_SECURE', port === 465),
          auth: {
            user: env('SMTP_USERNAME'),
            pass: env('SMTP_PASSWORD'),
          },
        },
        settings: {
          defaultFrom: env('EMAIL_DEFAULT_FROM', 'no-reply@bandup.uz'),
          defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO', env('EMAIL_DEFAULT_FROM', 'no-reply@bandup.uz')),
        },
      },
    },
  };
};

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  ...uploadConfig(env),
  ...emailConfig(env),
});

export default config;
