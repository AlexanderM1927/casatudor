'use strict';

module.exports = [
  // Rutas para exportar invoices
  {
    method: 'GET',
    path: '/export/invoices',
    handler: 'data-exporter.exportInvoices',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/export/invoices/csv',
    handler: 'data-exporter.exportInvoicesCsv',
    config: {
      policies: [],
      auth: false,
    },
  },
  // Rutas para exportar usuarios
  {
    method: 'GET',
    path: '/export/users',
    handler: 'data-exporter.exportUsers',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/export/users/csv',
    handler: 'data-exporter.exportUsersCsv',
    config: {
      policies: [],
      auth: false,
    },
  },
];
