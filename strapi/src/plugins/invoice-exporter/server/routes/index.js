'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/export',
    handler: 'invoice-exporter.exportInvoices',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/export/csv',
    handler: 'invoice-exporter.exportInvoicesCsv',
    config: {
      policies: [],
      auth: false,
    },
  },
];
