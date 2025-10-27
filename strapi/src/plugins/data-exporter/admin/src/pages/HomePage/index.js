const React = require('react');
const { Box, Button, Typography, Grid, GridItem } = require('@strapi/design-system');
const { Download } = require('@strapi/icons');

const HomePage = () => {
  const [loading, setLoading] = React.useState(false);
  const [loadingType, setLoadingType] = React.useState(null);

  const showNotification = (message, type = 'success') => {
    // Usar el sistema de notificaciones nativo del navegador como fallback
    if (type === 'success') {
      alert(message);
    } else {
      alert('Error: ' + message);
    }
  };

  const handleExportJson = async (dataType) => {
    setLoading(true);
    setLoadingType(dataType);
    try {
      const response = await fetch(`/data-exporter/export/${dataType}`);
      const data = await response.json();
      
      // Crear y descargar archivo JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataType}_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showNotification(`${dataType === 'invoices' ? 'Facturas' : 'Usuarios'} exportados exitosamente`);
    } catch (error) {
      showNotification(`Error al exportar ${dataType === 'invoices' ? 'facturas' : 'usuarios'}`, 'error');
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handleExportCsv = async (dataType) => {
    setLoading(true);
    setLoadingType(dataType);
    try {
      const response = await fetch(`/data-exporter/export/${dataType}/csv`);
      const blob = await response.blob();
      
      // Descargar archivo CSV
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataType}_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showNotification(`${dataType === 'invoices' ? 'Facturas' : 'Usuarios'} exportados exitosamente en CSV`);
    } catch (error) {
      showNotification(`Error al exportar ${dataType === 'invoices' ? 'facturas' : 'usuarios'} en CSV`, 'error');
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  return React.createElement(
    Box,
    { padding: 8 },
    React.createElement(
      Box,
      { paddingBottom: 4 },
      React.createElement(Typography, { variant: 'alpha' }, 'Exportador de Datos del Sistema')
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
          'Esta herramienta permite exportar diferentes tipos de datos del sistema en formatos JSON o CSV. Selecciona el tipo de dato que deseas exportar a continuación.'
        )
      )
    ),
    
    // Sección de Invoices
    React.createElement(
      Box,
      { paddingBottom: 6 },
      React.createElement(
        Box,
        { paddingBottom: 3 },
        React.createElement(Typography, { variant: 'beta' }, '📄 Facturas (Invoices)')
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
              React.createElement(Typography, { variant: 'delta' }, 'JSON'),
              React.createElement(
                Box,
                { paddingTop: 2 },
                React.createElement(
                  Typography,
                  { variant: 'omega', textColor: 'neutral600' },
                  'Exporta facturas con información completa: productos, categorías, imágenes, datos del cliente y estado de la orden.'
                )
              )
            ),
            React.createElement(
              Button,
              {
                startIcon: React.createElement(Download, null),
                onClick: () => handleExportJson('invoices'),
                loading: loading && loadingType === 'invoices',
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
              React.createElement(Typography, { variant: 'delta' }, 'CSV'),
              React.createElement(
                Box,
                { paddingTop: 2 },
                React.createElement(
                  Typography,
                  { variant: 'omega', textColor: 'neutral600' },
                  'Exporta facturas en formato CSV para Excel. Incluye productos, datos del cliente y información de envío.'
                )
              )
            ),
            React.createElement(
              Button,
              {
                startIcon: React.createElement(Download, null),
                onClick: () => handleExportCsv('invoices'),
                loading: loading && loadingType === 'invoices',
                fullWidth: true,
                variant: 'secondary'
              },
              'Descargar CSV'
            )
          )
        )
      )
    ),

    // Sección de Usuarios
    React.createElement(
      Box,
      null,
      React.createElement(
        Box,
        { paddingBottom: 3 },
        React.createElement(Typography, { variant: 'beta' }, '👥 Usuarios Registrados')
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
              React.createElement(Typography, { variant: 'delta' }, 'JSON'),
              React.createElement(
                Box,
                { paddingTop: 2 },
                React.createElement(
                  Typography,
                  { variant: 'omega', textColor: 'neutral600' },
                  'Exporta usuarios con información completa: datos de perfil, rol, historial de órdenes y gasto total.'
                )
              )
            ),
            React.createElement(
              Button,
              {
                startIcon: React.createElement(Download, null),
                onClick: () => handleExportJson('users'),
                loading: loading && loadingType === 'users',
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
              React.createElement(Typography, { variant: 'delta' }, 'CSV'),
              React.createElement(
                Box,
                { paddingTop: 2 },
                React.createElement(
                  Typography,
                  { variant: 'omega', textColor: 'neutral600' },
                  'Exporta usuarios en formato CSV para Excel. Incluye datos básicos, rol, órdenes totales y gasto acumulado.'
                )
              )
            ),
            React.createElement(
              Button,
              {
                startIcon: React.createElement(Download, null),
                onClick: () => handleExportCsv('users'),
                loading: loading && loadingType === 'users',
                fullWidth: true,
                variant: 'secondary'
              },
              'Descargar CSV'
            )
          )
        )
      )
    )
  );
};

module.exports = HomePage;
