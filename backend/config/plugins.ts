import type { Core } from '@strapi/strapi';

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
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
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

  if (useS3 && s3Available) {
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
  }

  return {};
};

export default config;
