'use strict';

module.exports = {
  // Exportar invoices con sus relaciones
  async exportInvoices(ctx) {
    try {
      const { start, limit } = ctx.query;
      
      // Obtener todas las invoices con sus relaciones
      const invoices = await strapi.entityService.findMany('api::invoice.invoice', {
        start: start || 0,
        limit: limit || 100,
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

  // Exportar usuarios registrados
  async exportUsers(ctx) {
    try {
      const { start, limit } = ctx.query;
      
      // Obtener todos los usuarios con sus relaciones
      const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
        start: start || 0,
        limit: limit || 1000,
        populate: {
          role: true
        }
      });

      // Buscar las órdenes de cada usuario
      const usersWithOrders = await Promise.all(
        users.map(async (user) => {
          const orders = await strapi.entityService.findMany('api::order.order', {
            filters: {
              users_permissions_user: {
                id: user.id
              }
            },
            populate: {
              invoice: true
            }
          });

          return {
            id: user.id,
            username: user.username,
            email: user.email,
            provider: user.provider,
            confirmed: user.confirmed,
            blocked: user.blocked,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            role: user.role ? {
              id: user.role.id,
              name: user.role.name,
              type: user.role.type
            } : null,
            ordersCount: orders.length,
            totalSpent: orders.reduce((sum, order) => {
              return sum + (order.invoice?.total || 0);
            }, 0),
            orders: orders.map(order => ({
              id: order.id,
              email: order.email,
              phone: order.phone,
              city: order.city,
              createdAt: order.createdAt,
              invoiceTotal: order.invoice?.total || 0,
              paymentStatus: order.invoice?.paymentStatus || 'N/A'
            }))
          };
        })
      );

      ctx.body = {
        data: usersWithOrders,
        meta: {
          total: usersWithOrders.length,
          exportedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async exportInvoicesCsv(ctx) {
    try {
      const invoices = await strapi.entityService.findMany('api::invoice.invoice', {
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
      let csv = 'ID Invoice,Total,Total Pagado,Estado de Pago,Fecha Creación,Productos,Email Cliente,Teléfono,Identificación,Ciudad,Dirección,Agencia Envío,Guía Envío\n';
      
      invoicesWithOrders.forEach(({ invoice, order }) => {
        const productsInfo = invoice.products?.map(p => 
          `${p.product?.name || 'N/A'} (x${p.quantity})`
        ).join('; ') || 'Sin productos';
        
        const email = order?.email || 'N/A';
        const phone = order?.phone || 'N/A';
        const identify = order?.identify || 'N/A';
        const city = order?.city || 'N/A';
        const address = order?.address1 || 'N/A';
        const agency = order?.shipmentAgency || 'N/A';
        const guide = order?.shipmentGuide || 'N/A';
        
        csv += `${invoice.id},${invoice.total},${invoice.totalPaid},${invoice.paymentStatus},${invoice.createdAt},"${productsInfo}","${email}","${phone}","${identify}","${city}","${address}","${agency}","${guide}"\n`;
      });

      ctx.set('Content-Type', 'text/csv');
      ctx.set('Content-Disposition', `attachment; filename=invoices_orders_${Date.now()}.csv`);
      ctx.body = csv;
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Exportar usuarios en formato CSV
  async exportUsersCsv(ctx) {
    try {
      const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
        populate: {
          role: true
        }
      });

      // Buscar las órdenes de cada usuario
      const usersWithOrders = await Promise.all(
        users.map(async (user) => {
          const orders = await strapi.entityService.findMany('api::order.order', {
            filters: {
              users_permissions_user: {
                id: user.id
              }
            },
            populate: {
              invoice: true
            }
          });

          const totalSpent = orders.reduce((sum, order) => {
            return sum + (order.invoice?.total || 0);
          }, 0);

          return { user, ordersCount: orders.length, totalSpent };
        })
      );

      // Crear CSV con información de usuarios
      let csv = 'ID,Username,Email,Proveedor,Confirmado,Bloqueado,Rol,Fecha Registro,Órdenes Totales,Gasto Total\n';
      
      usersWithOrders.forEach(({ user, ordersCount, totalSpent }) => {
        const id = user.id;
        const username = user.username || 'N/A';
        const email = user.email || 'N/A';
        const provider = user.provider || 'local';
        const confirmed = user.confirmed ? 'Sí' : 'No';
        const blocked = user.blocked ? 'Sí' : 'No';
        const role = user.role?.name || 'N/A';
        const createdAt = user.createdAt || 'N/A';
        
        csv += `${id},"${username}","${email}","${provider}","${confirmed}","${blocked}","${role}","${createdAt}",${ordersCount},${totalSpent}\n`;
      });

      ctx.set('Content-Type', 'text/csv');
      ctx.set('Content-Disposition', `attachment; filename=users_${Date.now()}.csv`);
      ctx.body = csv;
    } catch (error) {
      ctx.throw(500, error);
    }
  }
};
