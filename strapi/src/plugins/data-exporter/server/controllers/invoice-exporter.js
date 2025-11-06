'use strict';

module.exports = {
  // Exportar invoices con sus relaciones
  async exportInvoices(ctx) {
    try {
      const { start, limit, startDate, endDate } = ctx.query;
      
      // Construir filtros de fecha
      const filters = {};
      if (startDate || endDate) {
        filters.createdAt = {};
        if (startDate) {
          filters.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          // Agregar 23:59:59 al endDate para incluir todo el día
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          filters.createdAt.$lte = end;
        }
      }
      
      // Obtener todas las invoices con sus relaciones
      const invoices = await strapi.entityService.findMany('api::invoice.invoice', {
        start: start || 0,
        limit: limit || 100,
        filters,
        populate: {
          products: {
            populate: {
              product: {
                populate: ['images', 'category']
              }
            }
          }
        }
      });

      // Para cada invoice, buscar su orden relacionada
      const invoicesWithOrders = await Promise.all(
        invoices.map(async (invoice) => {
          // Buscar la orden que tiene esta invoice
          const orders = await strapi.entityService.findMany('api::order.order', {
            filters: {
              invoice: {
                id: invoice.id
              }
            },
            populate: {
              users_permissions_user: {
                fields: ['id', 'username', 'email']
              }
            }
          });

          // Formatear los datos de la invoice
          const formattedInvoice = {
            id: invoice.id,
            total: invoice.total,
            totalPaid: invoice.totalPaid,
            paymentStatus: invoice.paymentStatus,
            publishedAt: invoice.publishedAt,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
            products: invoice.products?.map(productItem => ({
              quantity: productItem.quantity,
              selectedVariants: productItem.selectedVariants,
              product: productItem.product ? {
                id: productItem.product.id,
                name: productItem.product.name,
                price: productItem.product.price,
                description: productItem.product.description,
                category: productItem.product.category?.name || null,
                images: productItem.product.images?.map(img => img.url) || []
              } : null
            })) || [],
            // Agregar la orden relacionada
            order: orders[0] ? {
              id: orders[0].id,
              email: orders[0].email,
              phone: orders[0].phone,
              identify: orders[0].identify,
              country: orders[0].country,
              department: orders[0].department,
              city: orders[0].city,
              address1: orders[0].address1,
              addressDetails: orders[0].addressDetails,
              shipmentAgency: orders[0].shipmentAgency,
              shipmentGuide: orders[0].shipmentGuide,
              createdAt: orders[0].createdAt,
              updatedAt: orders[0].updatedAt,
              user: orders[0].users_permissions_user ? {
                id: orders[0].users_permissions_user.id,
                username: orders[0].users_permissions_user.username,
                email: orders[0].users_permissions_user.email
              } : null
            } : null
          };

          return formattedInvoice;
        })
      );

      ctx.body = {
        data: invoicesWithOrders,
        meta: {
          total: invoicesWithOrders.length,
          exportedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async exportInvoicesCsv(ctx) {
    try {
      const { startDate, endDate } = ctx.query;
      
      // Construir filtros de fecha
      const filters = {};
      if (startDate || endDate) {
        filters.createdAt = {};
        if (startDate) {
          filters.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          // Agregar 23:59:59 al endDate para incluir todo el día
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          filters.createdAt.$lte = end;
        }
      }
      
      const invoices = await strapi.entityService.findMany('api::invoice.invoice', {
        filters,
        populate: {
          products: {
            populate: {
              product: true
            }
          }
        }
      });

      // Para cada invoice, buscar su orden relacionada
      const invoicesWithOrders = await Promise.all(
        invoices.map(async (invoice) => {
          const orders = await strapi.entityService.findMany('api::order.order', {
            filters: {
              invoice: {
                id: invoice.id
              }
            }
          });
          return { invoice, order: orders[0] || null };
        })
      );

      // Crear CSV con información de invoices y órdenes
      let csv = 'ID Invoice,Total,Total Pagado,Estado de Pago,Fecha Creación,Productos,Email Cliente,Teléfono,Identificación,Ciudad,Dirección,Agencia Envío,Guía Envío,Detalles de Dirección\n';
      
      invoicesWithOrders.forEach(({ invoice, order }) => {
        const productsInfo = invoice.products?.map(p => 
          `${p.product?.id} -  ${p.product?.name || 'N/A'} (x${p.quantity})`
        ).join('; ') || 'Sin productos';
        
        const email = order?.email || 'N/A';
        const phone = order?.phone || 'N/A';
        const identify = order?.identify || 'N/A';
        const city = order?.city || 'N/A';
        const address = order?.address1 || 'N/A';
        const agency = order?.shipmentAgency || 'N/A';
        const guide = order?.shipmentGuide || 'N/A';
        const addressDetails = order?.addressDetails || 'N/A';

        csv += `${invoice.id},${invoice.total},${invoice.totalPaid},${invoice.paymentStatus},${invoice.createdAt},"${productsInfo}","${email}","${phone}","${identify}","${city}","${address}","${agency}","${guide}","${addressDetails}"\n`;
      });

      ctx.set('Content-Type', 'text/csv');
      ctx.set('Content-Disposition', `attachment; filename=invoices_orders_${Date.now()}.csv`);
      ctx.body = csv;
    } catch (error) {
      ctx.throw(500, error);
    }
  }
};
