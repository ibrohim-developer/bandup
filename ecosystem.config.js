module.exports = {
  apps: [
    {
      name: 'bandup-frontend',
      cwd: '/var/www/bandup/frontend',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'bandup-backend',
      cwd: '/var/www/bandup/backend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
