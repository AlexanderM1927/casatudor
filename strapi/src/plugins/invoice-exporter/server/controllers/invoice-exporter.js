'use strict';

module.exports = {
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

      // Formatear los datos para exportación
      const formattedData = invoices.map(invoice => {
        return {
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
          })) || []
        };
      });

      ctx.body = {
        data: formattedData,
        meta: {
          total: formattedData.length,
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

      // Crear CSV
      let csv = 'ID,Total,Total Pagado,Estado de Pago,Fecha Creación,Productos\n';
      
      invoices.forEach(invoice => {
        const productsInfo = invoice.products?.map(p => 
          `${p.product?.name || 'N/A'} (x${p.quantity})`
        ).join('; ') || 'Sin productos';
        
        csv += `${invoice.id},${invoice.total},${invoice.totalPaid},${invoice.paymentStatus},${invoice.createdAt},"${productsInfo}"\n`;
      });

      ctx.set('Content-Type', 'text/csv');
      ctx.set('Content-Disposition', `attachment; filename=invoices_${Date.now()}.csv`);
      ctx.body = csv;
    } catch (error) {
      ctx.throw(500, error);
    }
  }
};
