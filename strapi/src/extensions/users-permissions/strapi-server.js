const { MailManager } = require('../../utils/MailManager');
const utils = require('@strapi/utils');
const crypto = require('crypto');
const { ApplicationError, ValidationError } = utils.errors;

const getService = (name) => {
  return strapi.plugin('users-permissions').service(name);
};

const sanitizeUser = (user) => {
  const { password, resetPasswordToken, confirmationToken, ...safeUser } = user;
  return safeUser;
};

module.exports = (plugin) => {
  // In Strapi v5, controllers can be factory functions — wrap them properly
  const originalAuthController = plugin.controllers.auth;

  plugin.controllers.auth = ({ strapi: strapiInstance }) => {
    // Get the base controller (handle both factory function and plain object)
    const base = typeof originalAuthController === 'function'
      ? originalAuthController({ strapi: strapiInstance })
      : originalAuthController;

    return {
      ...base,

      // Override register endpoint to allow custom fields
      register: async (ctx) => {
        const { username, email, password, firstName, lastName, identify, phone } = ctx.request.body;

        if (!email) throw new ValidationError('Email es requerido');
        if (!username) throw new ValidationError('Username es requerido');
        if (!password) throw new ValidationError('Contraseña es requerida');

        const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });
        const settings = await pluginStore.get({ key: 'advanced' });

        if (settings.unique_email) {
          const existing = await strapi.db.query('plugin::users-permissions.user').findOne({
            where: { email: email.toLowerCase() }
          });
          if (existing) throw new ApplicationError('Email ya está en uso');
        }

        const role = await strapi.db.query('plugin::users-permissions.role').findOne({
          where: { type: settings.default_role }
        });

        const user = await getService('user').add({
          username,
          email: email.toLowerCase(),
          password,
          firstName,
          lastName,
          identify,
          phone,
          provider: 'local',
          role: role ? role.id : null,
          confirmed: !settings.email_confirmation,
        });

        const sanitizedUser = await sanitizeUser(user);

        if (settings.email_confirmation) {
          await getService('user').sendConfirmationEmail(sanitizedUser);
          return ctx.send({ user: sanitizedUser });
        }

        ctx.send({
          jwt: getService('jwt').issue({ id: user.id }),
          user: sanitizedUser,
        });
      },

      // Override forgot password endpoint
      forgotPassword: async (ctx) => {
    const { email } = ctx.request.body;

    if (!email) {
      throw new ValidationError('Email es requerido');
    }

    const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });
    const advancedSettings = await pluginStore.get({ key: 'advanced' });

    // Find the user by email
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({ 
      where: { email: email.toLowerCase() } 
    });

    if (!user || user.blocked) {
      // Return success even if user doesn't exist (security best practice)
      return ctx.send({ ok: true });
    }

    // Generate reset password token
    const resetPasswordToken = crypto.randomBytes(32).toString('hex');
    
    // Save the token in the user
    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: { resetPasswordToken },
    });

    // Build reset password URL
    const resetPasswordUrl = `${advancedSettings.email_reset_password || process.env.PUBLIC_URL}/reset-password?code=${resetPasswordToken}`;

    try {
      // Send email using MailManager
      const mailer = new MailManager({ templatesDir: 'emails/templates' });
      
      await mailer.send({
        to: user.email,
        subject: 'Recuperación de contraseña',
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
      },

      // Override reset password endpoint
      resetPassword: async (ctx) => {
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

    const user = await strapi.db.query('plugin::users-permissions.user').findOne({ 
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
    const sanitizedUser = await sanitizeUser(user);

    ctx.send({
      jwt: getService('jwt').issue({ id: user.id }),
      user: sanitizedUser,
    });
      },
    };
  };

  return plugin;
};
