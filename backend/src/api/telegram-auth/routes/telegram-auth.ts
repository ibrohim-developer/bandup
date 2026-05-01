export default {
  routes: [
    {
      method: 'POST',
      path: '/telegram-auth/verify-code',
      handler: 'telegram-auth.verifyCode',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
