'use strict';
const crypto = require('crypto');
const invoicePrefix = `_INVOICE` + (process.env.NODE_ENV === 'production' ? 'PROD' : 'LOCAL');
module.exports = {
  async init(ctx) {
    const { cartId, email, phone, shippingAddress } = ctx.request.body || {};

    // Create invoice if cartId is provided
    let invoice = null;
    let calculatedAmountInCents = 0
    const currency = 'COP'
    if (cartId) {
      try {
        // Get cart with products to calculate total
        const cart = await strapi.entityService.findOne('api::cart.cart', cartId, {
          populate: {
            products: {
              populate: ['product']
            },
            users_permissions_user: {
              populate: ['*']
            }
          }
        });

        if (!cart) {
          ctx.throw(404, 'Cart no encontrado');
        }

        let calculatedTotal = 0;
        if (cart.products && cart.products.length > 0) {
          calculatedTotal = cart.products.reduce((total, item) => {
            const productPrice = item.product?.price || 0;
            const quantity = item.quantity || 1;
            return total + (productPrice * quantity);
          }, 0);
        }

        const shipmentCost = 15000; // Fixed shipping cost
        calculatedTotal = calculatedTotal + shipmentCost
        calculatedAmountInCents = Math.round(calculatedTotal * 100)

        invoice = await strapi.entityService.create('api::invoice.invoice', {
          data: {
            products: cart.products,
            total: (calculatedTotal),
            totalPaid: 0,
            paymentStatus: 'pending',
            publishedAt: new Date(),
          }
        });

        const order = await strapi.entityService.create('api::order.order', {
          data: {
            users_permissions_user: cart.users_permissions_user.id,
            invoice: invoice.id,
            email: email,
            phone: phone,
            country: shippingAddress.country,
            city: shippingAddress.city,
            department: shippingAddress.department,
            address1: shippingAddress.address1,
            addressDetails: shippingAddress.addressDetails
          }
        });

      } catch (error) {
        ctx.throw(500, 'Error al crear la factura: ' + error.message);
      }
    }

    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;
    const publicKey = process.env.WOMPI_PUBLIC_KEY;

    const invoiceId = `${invoice?.id}` + invoicePrefix;
    const base = `${invoiceId}${calculatedAmountInCents}${currency}${integritySecret}`;
    const integrity = crypto.createHash('sha256').update(base).digest('hex');

    ctx.body = {
      publicKey,
      currency,
      amountInCents: calculatedAmountInCents,
      reference: invoiceId,
      signature: { integrity },
      redirectUrl: process.env.PAYMENT_REDIRECT_URL,
      env: process.env.WOMPI_ENV
    };
  },

  async webhook(ctx) {
    try {
      const { signature, data, timestamp } = ctx.request.body || {};
      const headerChecksum = (ctx.request.headers['x-event-checksum'] || '').toString();
      
      if (!data || !data.transaction) {
        ctx.throw(400, 'Invalid webhook data');
      }

      const props = signature?.properties || [];
      const valueFromPath = (obj, path) =>
        path.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), obj);

      const concatenatedProps = props.map(p => valueFromPath(data, p)).join('');

      // 2) Agregar timestamp y tu secreto de eventos
      const toHash = `${concatenatedProps}${timestamp}${process.env.WOMPI_EVENTS_SECRET}`;

      const computed = crypto.createHash('sha256').update(toHash).digest('hex').toUpperCase();

      const provided = (signature?.checksum || headerChecksum || '').toUpperCase();
      if (!provided || computed !== provided) {
        ctx.throw(401, 'Invalid Wompi checksum');
      }

      const transaction = data.transaction;
      const reference = transaction.reference;
      const status = transaction.status;
      const amountInCents = transaction.amount_in_cents;

      console.log('Webhook received:', { reference, status, amountInCents });

      // If payment is approved, update the invoice
      if (status === 'APPROVED') {
        // Find invoice by payment reference
        const invoices = await strapi.entityService.findMany('api::invoice.invoice', {
          filters: {
            id: reference.replace(invoicePrefix, '')
          },
          populate: {
            cart: true
          }
        });

        const invoice = invoices[0];

        if (invoice) {
          // Update invoice with payment information
          await strapi.entityService.update('api::invoice.invoice', invoice.id, {
            data: {
              totalPaid: amountInCents / 100,
              paymentStatus: 'approved',
            }
          });

          console.log('Invoice updated with payment:', invoice.id);
        } else {
          console.log('No invoice found for reference:', reference);
        }
      } else if (status === 'DECLINED') {
        // Update invoice status to declined
        const invoices = await strapi.entityService.findMany('api::invoice.invoice', {
          filters: {
            id: reference.replace(invoicePrefix, '')
          }
        });

        const invoice = invoices[0];
        if (invoice) {
          await strapi.entityService.update('api::invoice.invoice', invoice.id, {
            data: {
              paymentStatus: 'declined',
            }
          });
        }
      }

      ctx.body = { received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      ctx.throw(500, 'Error processing webhook: ' + error.message);
    }
  },
};
