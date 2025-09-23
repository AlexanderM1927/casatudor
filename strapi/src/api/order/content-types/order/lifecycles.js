// src/api/order/content-types/order/lifecycles.js
const { MailManager } = require('../../../../utils/MailManager');

module.exports = {
  async afterCreate(event) {
    const { result } = event;
    console.log('Order created, sending email to user:', result);

    const orderWithRelations = await strapi.entityService.findOne('api::order.order', result.id, {
      populate: {
        users_permissions_user: true,
        invoice: true
      }
    });

    const user = orderWithRelations.users_permissions_user;
    const invoice = orderWithRelations.invoice
    const mailer = new MailManager({ templatesDir: 'emails/templates' });
    await mailer.send({
      to: user.email,
      subject: `Tu pedido #${result.id} fue recibido`,
      template: 'order',
      params: {
        order: orderWithRelations,
        invoice: invoice,
        user: { name: user.firstName },
      }
    });
  },
};
