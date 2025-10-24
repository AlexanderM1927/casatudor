module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST'),
        port: env('SMTP_PORT'),
        secure: false, // true para 465, false para 587
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('SMTP_EMAIL_FOR_DEFAULT'),
        defaultReplyTo: env('SMTP_EMAIL_FOR_REPLY_TO'),
      },
    },
  },
  'invoice-exporter': {
    enabled: true,
    resolve: './src/plugins/invoice-exporter',
  },
});
