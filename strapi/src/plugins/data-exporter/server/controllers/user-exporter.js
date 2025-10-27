'use strict';

module.exports = {
  // Exportar usuarios registrados
  async exportUsers(ctx) {
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
      
      // Obtener todos los usuarios con sus relaciones
      const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
        start: start || 0,
        limit: limit || 1000,
        filters,
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

  // Exportar usuarios en formato CSV
  async exportUsersCsv(ctx) {
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
      
      const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
        filters,
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
      let csv = 'ID,Username,Email,Bloqueado,Fecha Registro,Órdenes Totales,Gasto Total\n';
      
      usersWithOrders.forEach(({ user, ordersCount, totalSpent }) => {
        const id = user.id;
        const username = user.username || 'N/A';
        const email = user.email || 'N/A';
        const blocked = user.blocked ? 'Sí' : 'No';
        const createdAt = user.createdAt || 'N/A';
        
        csv += `${id},"${username}","${email}","${blocked}","${createdAt}",${ordersCount},${totalSpent}\n`;
      });

      ctx.set('Content-Type', 'text/csv');
      ctx.set('Content-Disposition', `attachment; filename=users_${Date.now()}.csv`);
      ctx.body = csv;
    } catch (error) {
      ctx.throw(500, error);
    }
  }
};
