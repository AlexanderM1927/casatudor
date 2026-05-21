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

    console.log('[wompi] body:', JSON.stringify({ cartId, cartIdType: typeof cartId, user, isGuestOrder, email }));

    if (cartId) {
      try {
        // Get cart with products to calculate total
        cart = await strapi.db.query('api::cart.cart').findOne({
          where: isNaN(Number(cartId)) ? { documentId: cartId } : { id: Number(cartId) },
          populate: {
            products: {
              populate: { product: true }
            },
            users_permissions_user: true
          }
        });

        console.log('[wompi] cart result:', cart ? `found id=${cart.id} products=${cart.products?.length}` : 'null');

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

        // Calculate shipping cost based on city
        const cityName = shippingAddress.city?.toLowerCase() || '';
        const shipmentCost = cityName === 'cali' ? 8000 : 15000;
        calculatedTotal = calculatedTotal + shipmentCost
        calculatedAmountInCents = Math.round(calculatedTotal * 100)

        const invoiceProducts = cart.products.map(item => ({
          product: item.product?.documentId,
          quantity: item.quantity,
          selectedVariants: item.selectedVariants,
        }));

        invoice = await strapi.documents('api::invoice.invoice').create({
          data: {
            products: invoiceProducts,
            total: (calculatedTotal),
            totalPaid: 0,
            paymentStatus: 'pending',
          },
          status: 'published',
        });

        console.log('[wompi] invoice created id:', invoice?.id, 'type:', typeof invoice?.id);

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

        console.log('[wompi] orderData:', JSON.stringify(orderData));
        const order = await strapi.db.query('api::order.order').create({
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
    const { signature, data, timestamp } = ctx.request.body || {};
    const headerChecksum = (ctx.request.headers['x-event-checksum'] || '').toString();

    if (!data || !data.transaction) {
      ctx.throw(400, 'Invalid webhook data');
    }

    const props = signature?.properties || [];
    const valueFromPath = (obj, path) =>
      path.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), obj);

    const concatenatedProps = props.map(p => valueFromPath(data, p)).join('');
    const toHash = `${concatenatedProps}${timestamp}${process.env.WOMPI_EVENTS_SECRET}`;

    const computed = crypto.createHash('sha256').update(toHash).digest('hex').toUpperCase();
    const provided = (signature?.checksum || headerChecksum || '').toUpperCase();

    console.log('[wompi webhook] checksum computed:', computed, 'provided:', provided);

    if (!provided || computed !== provided) {
      ctx.throw(401, 'Invalid Wompi checksum');
    }

    const transaction = data.transaction;
    const reference = transaction.reference;
    const status = transaction.status;
    const amountInCents = transaction.amount_in_cents;

    console.log('[wompi webhook] received:', { reference, status, amountInCents, invoicePrefix });

    const invoiceNumericId = parseInt(reference.replace(invoicePrefix, ''), 10);
    console.log('[wompi webhook] invoiceNumericId:', invoiceNumericId);

    if (status === 'APPROVED' || status === 'DECLINED' || status === 'ERROR') {
      try {
        // Find the entry (draft or published) by integer id to get the documentId
        const entries = await strapi.db.query('api::invoice.invoice').findMany({
          where: { id: invoiceNumericId }
        });

        console.log('[wompi webhook] entries found:', entries.length, entries.map(e => ({ id: e.id, documentId: e.documentId, publishedAt: e.publishedAt })));

        const entry = entries[0];

        if (!entry) {
          console.log('[wompi webhook] no invoice found for id:', invoiceNumericId, 'reference:', reference);
          ctx.body = { received: true };
          return;
        }

        // Use documents API to update the published version
        const updateData = status === 'APPROVED'
          ? { totalPaid: amountInCents / 100, paymentStatus: 'approved' }
          : status === 'DECLINED'
            ? { paymentStatus: 'declined' }
            : { paymentStatus: 'error' };

        await strapi.documents('api::invoice.invoice').update({
          documentId: entry.documentId,
          data: updateData,
          status: 'published',
        });

        console.log('[wompi webhook] invoice updated:', entry.documentId, updateData);
      } catch (error) {
        console.error('[wompi webhook] error updating invoice:', error);
        ctx.throw(500, 'Error updating invoice: ' + error.message);
      }
    }

    ctx.body = { received: true };
  },
};
