const { MailManager } = require('../../utils/MailManager');
const utils = require('@strapi/utils');
const crypto = require('crypto');
const { sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

const getService = (name) => {
  return strapi.plugin('users-permissions').service(name);
};

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

module.exports = (plugin) => {
  // Override forgot password endpoint
  plugin.controllers.auth.forgotPassword = async (ctx) => {
    const { email } = ctx.request.body;

    if (!email) {
      throw new ValidationError('Email es requerido');
    }

    const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });
    const advancedSettings = await pluginStore.get({ key: 'advanced' });

    // Find the user by email
    const user = await strapi.query('plugin::users-permissions.user').findOne({ 
      where: { email: email.toLowerCase() } 
    });

    if (!user || user.blocked) {
      // Return success even if user doesn't exist (security best practice)
      return ctx.send({ ok: true });
    }

    // Generate reset password token
    const resetPasswordToken = crypto.randomBytes(32).toString('hex');
    
    // Save the token in the user
    await strapi.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: { resetPasswordToken },
    });

    // Build reset password URL
    const resetPasswordUrl = `${advancedSettings.email_reset_password || process.env.FRONTEND_URL}/reset-password?code=${resetPasswordToken}`;

    try {
      // Send email using MailManager
      const mailer = new MailManager({ templatesDir: 'emails/templates' });
      
      await mailer.send({
        to: user.email,
        subject: 'Recuperación de contraseña - Casa Tudor',
        template: 'reset-password',
        params: {
          user: {
            username: user.username || user.email,
            email: user.email
          },
          url: resetPasswordUrl,
        }
      });

      console.log('Reset password email sent successfully to:', user.email);
    } catch (error) {
      console.error('Error sending reset password email:', error);
      throw new ApplicationError('Error al enviar el correo de recuperación');
    }

    ctx.send({ ok: true });
  };

  // Override reset password endpoint
  plugin.controllers.auth.resetPassword = async (ctx) => {
    const { code, password, passwordConfirmation } = ctx.request.body;

    if (!code) {
      throw new ValidationError('Código de recuperación es requerido');
    }

    if (!password) {
      throw new ValidationError('Contraseña es requerida');
    }

    if (!passwordConfirmation) {
      throw new ValidationError('Confirmación de contraseña es requerida');
    }

    if (password !== passwordConfirmation) {
      throw new ValidationError('Las contraseñas no coinciden');
    }

    const user = await strapi.query('plugin::users-permissions.user').findOne({ 
      where: { resetPasswordToken: code } 
    });

    if (!user) {
      throw new ValidationError('Código de recuperación incorrecto o expirado');
    }

    // Update user password and clear reset token
    await getService('user').edit(user.id, { 
      resetPasswordToken: null, 
      password 
    });

    // Return sanitized user with JWT
    const sanitizedUser = await sanitizeUser(user, ctx);

    ctx.send({
      jwt: getService('jwt').issue({ id: user.id }),
      user: sanitizedUser,
    });
  };

  return plugin;
};
