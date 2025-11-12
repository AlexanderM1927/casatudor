// src/api/invoice/content-types/invoice/lifecycles.js
const { MailManager } = require('../../../../utils/MailManager');

module.exports = {
  async afterUpdate(event) {
    const { result, params } = event;
    
    // Verificar si el paymentStatus cambió a 'approved'
    if (result.paymentStatus === 'approved') {
      console.log('Invoice approved, sending email to user:', result.id);
      
      try {
        // Buscar la orden relacionada con esta factura
        const orders = await strapi.entityService.findMany('api::order.order', {
          filters: {
            invoice: result.id
          },
          populate: {
            users_permissions_user: true,
            invoice: {
              populate: {
                products: {
                  populate: ['product']
                }
              }
            }
          }
        });

        const order = orders[0];
        
        if (!order) {
          console.log('No order found for invoice:', result.id);
          return;
        }

        if (!order.email) {
          console.log('No email found for order:', order.id);
          return;
        }

        const user = order.users_permissions_user;

        const mailer = new MailManager({ templatesDir: 'emails/templates' });
        await mailer.send({
          to: order.email,
          subject: `Tu pedido #${order.id} ha sido confirmado`,
          template: 'order',
          params: {
            order: order,
            invoice: order.invoice,
            user: { name: user?.firstName || order.email },
          }
        });
        
        console.log('Email sent successfully to:', user.email);
      } catch (error) {
        console.error('Error sending email for approved invoice:', error);
      }
    }
  },
};
