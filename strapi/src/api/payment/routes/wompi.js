module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/wompi/init',
      handler: 'wompi.init',
      config: { auth: false }, // o true si autenticas desde tu frontend
    },
    {
      method: 'POST',
      path: '/wompi/webhook',
      handler: 'wompi.webhook',
      config: { auth: false }, // Webhooks don't use authentication
    },
  ],
};