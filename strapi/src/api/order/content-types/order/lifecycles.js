// src/api/order/content-types/order/lifecycles.js
const { MailManager } = require('../../../../utils/MailManager');

module.exports = {
  async afterUpdate(event) {
    const { result, params } = event;
    
    // Check if shipmentAgency or shipmentGuide was updated and has a value
    const shipmentUpdated = result.shipmentAgency || result.shipmentGuide;
    
    if (shipmentUpdated) {
      console.log('Order shipment info updated, sending dispatch email to user:', result.id);
      
      try {
        // Find the complete order with user and invoice information
        const order = await strapi.entityService.findOne('api::order.order', result.id, {
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

        if (!order) {
          console.log('Order not found:', result.id);
          return;
        }

        const user = order.users_permissions_user;
        
        // Use order email as fallback if no user email
        const recipientEmail = user?.email || order.email;
        
        if (!recipientEmail) {
          console.log('No email found for order:', order.id);
          return;
        }

        // Prepare shipment information
        const shipmentInfo = {
          agency: order.shipmentAgency || 'No especificado',
          guide: order.shipmentGuide || 'No especificado'
        };

        const mailer = new MailManager({ templatesDir: 'emails/templates' });
        await mailer.send({
          to: recipientEmail,
          subject: `Tu pedido #${order.id} ha sido despachado`,
          template: 'shipment', // We'll create this template
          params: {
            order: order,
            invoice: order.invoice,
            user: { name: user?.firstName || 'Cliente' },
            shipment: shipmentInfo,
            dispatchMessage: `La orden ha sido despachada con la siguiente guía: ${shipmentInfo.guide}`
          }
        });
        
        console.log('Dispatch email sent successfully to:', recipientEmail);
      } catch (error) {
        console.error('Error sending dispatch email for order:', error);
      }
    }
  },
};