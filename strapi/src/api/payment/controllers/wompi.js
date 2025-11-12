'use strict';
const crypto = require('crypto');
const invoicePrefix = `_INVOICE` + (process.env.NODE_ENV === 'production' ? 'PROD' : 'LOCAL');
module.exports = {
  async init(ctx) {
    const { cartId, email, phone, identify, shippingAddress, user, isGuestOrder } = ctx.request.body || {};

    // Create invoice if cartId is provided
    let invoice = null;
    let calculatedAmountInCents = 0
    const currency = 'COP'
    let cart = null;

    if (cartId) {
      try {
        // Get cart with products to calculate total
        cart = await strapi.entityService.findOne('api::cart.cart', cartId, {
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
      } catch (error) {
        ctx.throw(500, 'Error al obtener el carrito: ' + error.message);
      }
    } else if (isGuestOrder) {
      // For guest orders without a cart ID, we still need cart data from frontend
      // This should be sent in the request body
      ctx.throw(400, 'Se requiere cartId para procesar el pago');
    }

    if (cart) {
      try {

        let calculatedTotal = 0;
        if (cart.products && cart.products.length > 0) {
          calculatedTotal = cart.products.reduce((total, item) => {
            const productPrice = item.product?.price || 0;
            const quantity = item.quantity || 1;
            return total + (productPrice * quantity);
          }, 0);
        }

        //15000
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

        // Determine user ID - from cart, from request, or null for guest orders
        const userId = cart.users_permissions_user?.id || user || null;

        const orderData = {
          invoice: invoice.id,
          email: email,
          phone: phone,
          identify: identify,
          country: shippingAddress.country,
          city: shippingAddress.city,
          department: shippingAddress.department,
          address1: shippingAddress.address1,
          addressDetails: shippingAddress.addressDetails,
          isGuestOrder: isGuestOrder || !userId // Mark as guest order if no user
        };

        // Only add user if exists (for registered users)
        if (userId) {
          orderData.users_permissions_user = userId;
        }

        const order = await strapi.entityService.create('api::order.order', {
          data: orderData
        });

        console.log('Order created:', order.id, 'Guest order:', isGuestOrder);

      } catch (error) {
        ctx.throw(500, 'Error al crear la factura: ' + error.message);
      }
    } else {
      ctx.throw(400, 'No se proporcionó información del carrito');
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
      redirectUrl: isGuestOrder ? process.env.PUBLIC_URL : process.env.PAYMENT_REDIRECT_URL,
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
