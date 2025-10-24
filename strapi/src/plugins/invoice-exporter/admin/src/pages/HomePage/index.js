const React = require('react');
const { Box, Button, Typography, Grid, GridItem } = require('@strapi/design-system');
const { Download } = require('@strapi/icons');

const HomePage = () => {
  const [loading, setLoading] = React.useState(false);

  const showNotification = (message, type = 'success') => {
    // Usar el sistema de notificaciones nativo del navegador como fallback
    if (type === 'success') {
      alert(message);
    } else {
      alert('Error: ' + message);
    }
  };

  const handleExportJson = async () => {
    setLoading(true);
    try {
      const response = await fetch('/invoice-exporter/export');
      const data = await response.json();
      
      // Crear y descargar archivo JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoices_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showNotification('Invoices exportadas exitosamente');
    } catch (error) {
      showNotification('Error al exportar invoices', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = async () => {
    setLoading(true);
    try {
      const response = await fetch('/invoice-exporter/export/csv');
      const blob = await response.blob();
      
      // Descargar archivo CSV
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoices_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showNotification('Invoices exportadas exitosamente en CSV');
    } catch (error) {
      showNotification('Error al exportar invoices en CSV', 'error');
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    Box,
    { padding: 8 },
    React.createElement(
      Box,
      { paddingBottom: 4 },
      React.createElement(Typography, { variant: 'alpha' }, 'Exportador de Invoices y Órdenes')
    ),
    React.createElement(
      Box,
      { paddingBottom: 4 },
      React.createElement(
        Box,
        { padding: 4, background: 'neutral100', hasRadius: true },
        React.createElement(
          Typography,
          null,
          'Esta herramienta permite exportar todas las facturas (invoices) con sus productos y órdenes relacionadas. Incluye información completa de envío, datos del cliente y productos. Puedes exportar en formato JSON (con toda la información detallada) o CSV (formato simplificado para Excel).'
        )
      )
    ),
    React.createElement(
      Grid,
      { gap: 4 },
      React.createElement(
        GridItem,
        { col: 6 },
        React.createElement(
          Box,
          { padding: 4, background: 'neutral0', shadow: 'filterShadow', hasRadius: true },
          React.createElement(
            Box,
            { paddingBottom: 3 },
            React.createElement(Typography, { variant: 'beta' }, 'Exportar como JSON'),
            React.createElement(
              Box,
              { paddingTop: 2 },
              React.createElement(
                Typography,
                { variant: 'omega', textColor: 'neutral600' },
                'Exporta todas las invoices con información completa: productos, categorías, imágenes, datos del cliente, dirección de envío y estado de la orden.'
              )
            )
          ),
          React.createElement(
            Button,
            {
              startIcon: React.createElement(Download, null),
              onClick: handleExportJson,
              loading: loading,
              fullWidth: true
            },
            'Descargar JSON'
          )
        )
      ),
      React.createElement(
        GridItem,
        { col: 6 },
        React.createElement(
          Box,
          { padding: 4, background: 'neutral0', shadow: 'filterShadow', hasRadius: true },
          React.createElement(
            Box,
            { paddingBottom: 3 },
            React.createElement(Typography, { variant: 'beta' }, 'Exportar como CSV'),
            React.createElement(
              Box,
              { paddingTop: 2 },
              React.createElement(
                Typography,
                { variant: 'omega', textColor: 'neutral600' },
                'Exporta las invoices y órdenes en formato CSV para usar en Excel. Incluye productos, datos del cliente y información de envío.'
              )
            )
          ),
          React.createElement(
            Button,
            {
              startIcon: React.createElement(Download, null),
              onClick: handleExportCsv,
              loading: loading,
              fullWidth: true,
              variant: 'secondary'
            },
            'Descargar CSV'
          )
        )
      )
    )
  );
};

module.exports = HomePage;
