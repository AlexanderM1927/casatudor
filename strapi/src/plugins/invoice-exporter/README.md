# Invoice Exporter Plugin

Plugin de Strapi para exportar facturas (invoices) con sus productos relacionados.

## Características

- 📊 Exportación en formato JSON con información completa
- 📄 Exportación en formato CSV para análisis en Excel
- 🔗 Incluye todas las relaciones de productos
- 👥 Accesible para todos los administradores

## Instalación

El plugin ya está instalado y configurado en tu proyecto de Strapi.

## Uso

1. Inicia sesión en el panel de administración de Strapi
2. En el menú lateral, busca "Invoice Exporter" 📊
3. Haz clic en el plugin para acceder a la interfaz de exportación
4. Selecciona el formato que desees:
   - **JSON**: Incluye toda la información detallada (productos, categorías, imágenes, variantes)
   - **CSV**: Formato simplificado para hojas de cálculo

## Datos exportados

### Formato JSON
Cada invoice incluye:
- ID de la factura
- Total y total pagado
- Estado del pago
- Fechas de creación y publicación
- Lista de productos con:
  - Cantidad
  - Variantes seleccionadas
  - Información del producto (nombre, precio, descripción)
  - Categoría
  - Imágenes

### Formato CSV
Cada fila incluye:
- ID de la factura
- Total
- Total pagado
- Estado de pago
- Fecha de creación
- Lista simplificada de productos

## API Endpoints

El plugin expone dos endpoints:

### Exportar JSON
```
GET /invoice-exporter/export
```
Query params opcionales:
- `start`: Número de registro inicial (default: 0)
- `limit`: Cantidad de registros (default: 100)

### Exportar CSV
```
GET /invoice-exporter/export/csv
```

## Permisos

El plugin está configurado para ser accesible por todos los usuarios administradores de la tienda.

## Estructura del plugin

```
invoice-exporter/
├── admin/
│   └── src/
│       ├── pages/
│       │   └── HomePage/
│       │       └── index.js
│       ├── index.js
│       └── pluginId.js
├── server/
│   ├── controllers/
│   │   ├── invoice-exporter.js
│   │   └── index.js
│   ├── routes/
│   │   └── index.js
│   ├── permissions/
│   │   ├── actions.js
│   │   └── index.js
│   └── index.js
├── package.json
└── index.js
```

## Desarrollo

Para modificar el plugin:

1. Edita los archivos en `src/plugins/invoice-exporter`
2. Reinicia Strapi para aplicar los cambios en el servidor
3. Para cambios en el admin, ejecuta `npm run build` en la carpeta de Strapi

## Soporte

Para problemas o mejoras, contacta al equipo de desarrollo.
