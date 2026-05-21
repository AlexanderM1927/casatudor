import React from 'react';
import { Box, Button, Typography } from '@strapi/design-system';
import { Download } from '@strapi/icons';

const HomePage = () => {
  const [loading, setLoading] = React.useState(false);
  const [loadingType, setLoadingType] = React.useState(null);

  const showNotification = (message, type = 'success') => {
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

  const ExportSection = ({ title, dataType }) =>
    React.createElement(
      Box,
      { paddingBottom: 6 },
      React.createElement(
        Box,
        { paddingBottom: 3 },
        React.createElement(Typography, { variant: 'beta' }, title)
      ),
      React.createElement(
        Box,
        { display: 'flex', gap: 4 },
        React.createElement(
          Box,
          { flex: 1, padding: 4, background: 'neutral0', hasRadius: true },
          React.createElement(
            Box,
            { paddingBottom: 3 },
            React.createElement(Typography, { variant: 'delta' }, 'CSV')
          ),
          React.createElement(
            Button,
            {
              startIcon: React.createElement(Download, null),
              onClick: () => handleExportCsv(dataType),
              loading: loading && loadingType === dataType,
              fullWidth: true
            },
            'Descargar CSV'
          )
        ),
        React.createElement(
          Box,
          { flex: 1, padding: 4, background: 'neutral0', hasRadius: true },
          React.createElement(
            Box,
            { paddingBottom: 3 },
            React.createElement(Typography, { variant: 'delta' }, 'JSON')
          ),
          React.createElement(
            Button,
            {
              startIcon: React.createElement(Download, null),
              onClick: () => handleExportJson(dataType),
              loading: loading && loadingType === dataType,
              fullWidth: true,
              variant: 'secondary'
            },
            'Descargar JSON'
          )
        )
      )
    );

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
          'Esta herramienta permite exportar diferentes tipos de datos del sistema en formatos JSON o CSV.'
        )
      )
    ),
    React.createElement(ExportSection, { title: '📄 Facturas (Invoices)', dataType: 'invoices' }),
    React.createElement(ExportSection, { title: '👥 Usuarios Registrados', dataType: 'users' })
  );
};

export default HomePage;
