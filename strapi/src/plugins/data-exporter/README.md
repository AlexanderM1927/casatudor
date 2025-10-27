# Data Exporter Plugin

Plugin de Strapi para exportar diferentes tipos de datos del sistema, incluyendo facturas (invoices) con sus productos relacionados y usuarios registrados con su historial de compras.

## Características

✅ Exportar facturas con productos, categorías e imágenes
✅ Exportar usuarios con historial de órdenes y gasto total
✅ Exportación en formato JSON (completo) o CSV (para Excel)
✅ Incluye relaciones completas entre órdenes y facturas
✅ Información de envío y estado de pagos
✅ Interfaz gráfica fácil de usar en el panel de administración

## Instalación

Este plugin ya está incluido en el proyecto. No requiere instalación adicional.

## Uso

1. Inicia Strapi: `npm run develop`
2. En el menú lateral, busca "Data Exporter" 📊
3. Selecciona el tipo de datos a exportar:
   - **Facturas (Invoices)**: Exporta todas las facturas con sus productos y órdenes relacionadas
   - **Usuarios**: Exporta usuarios registrados con su historial de compras
4. Elige el formato:
   - **JSON**: Información completa y detallada
   - **CSV**: Formato compatible con Excel

## Tipos de Exportación

### Facturas (Invoices)

**Formato JSON incluye:**
- ID de la factura
- Total y total pagado
- Estado de pago
- Fechas de creación y actualización
- Productos con:
  - Cantidad
  - Variantes seleccionadas
  - Información del producto (nombre, precio, descripción, categoría)
  - URLs de imágenes
- Información de la orden:
  - Datos del cliente (email, teléfono, identificación)
  - Dirección de envío
  - Agencia y guía de envío
  - Usuario asociado

**Formato CSV incluye:**
ID, Total, Total Pagado, Estado de Pago, Fecha, Productos, Email, Teléfono, Identificación, Ciudad, Dirección, Agencia, Guía

### Usuarios Registrados

**Formato JSON incluye:**
- ID y datos básicos del usuario (username, email)
- Proveedor de autenticación
- Estado (confirmado, bloqueado)
- Rol asignado
- Fechas de registro
- Cantidad total de órdenes
- Gasto total acumulado
- Lista completa de órdenes con:
  - Datos de envío
  - Total de la factura
  - Estado de pago

**Formato CSV incluye:**
ID, Username, Email, Proveedor, Confirmado, Bloqueado, Rol, Fecha Registro, Órdenes Totales, Gasto Total

## API Endpoints

### Exportar Facturas

**JSON:**
```
GET /data-exporter/export/invoices
```

**CSV:**
```
GET /data-exporter/export/invoices/csv
```

### Exportar Usuarios

**JSON:**
```
GET /data-exporter/export/users
```

**CSV:**
```
GET /data-exporter/export/users/csv
```

### Parámetros de query (solo para JSON)

- `start`: Número de registros a saltar (paginación)
- `limit`: Número máximo de registros a retornar

Ejemplo:
```
GET /data-exporter/export/invoices?start=0&limit=50
GET /data-exporter/export/users?start=0&limit=100
```

## Estructura del Plugin

```
data-exporter/
├── admin/
│   └── src/
│       ├── pages/
│       │   └── HomePage/
│       │       └── index.js
│       ├── index.js
│       └── pluginId.js
├── server/
│   ├── controllers/
│   │   ├── index.js
│   │   └── data-exporter.js
│   ├── routes/
│   │   └── index.js
│   └── index.js
├── package.json
├── strapi-admin.js
├── strapi-server.js
└── README.md
```

## Desarrollo

1. Edita los archivos en `src/plugins/data-exporter`
2. Los cambios se aplicarán automáticamente con hot-reload
3. Para agregar nuevos tipos de exportación:
   - Añade un nuevo método en `server/controllers/data-exporter.js`
   - Agrega las rutas correspondientes en `server/routes/index.js`
   - Actualiza la interfaz en `admin/src/pages/HomePage/index.js`

## Extender Funcionalidad

Para agregar nuevos tipos de datos a exportar:

1. **Crear método en el controlador** (`server/controllers/data-exporter.js`):
```javascript
async exportNewDataType(ctx) {
  try {
    const data = await strapi.entityService.findMany('api::your-content-type.your-content-type', {
      populate: { /* relaciones */ }
    });
    
    ctx.body = {
      data: data,
      meta: {
        total: data.length,
        exportedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    ctx.throw(500, error);
  }
}
```

2. **Agregar rutas** (`server/routes/index.js`):
```javascript
{
  method: 'GET',
  path: '/export/new-data-type',
  handler: 'data-exporter.exportNewDataType',
  config: {
    policies: [],
    auth: false,
  },
}
```

3. **Actualizar la UI** en `admin/src/pages/HomePage/index.js` para agregar botones de exportación.

## Notas

- Los endpoints están configurados sin autenticación (`auth: false`). Considera agregar autenticación en producción.
- Las exportaciones CSV usan codificación UTF-8.
- Los archivos exportados incluyen timestamp en el nombre para evitar sobrescrituras.

## Licencia

Propiedad de Casa Tudor


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
GET /data-exporter/export
```
Query params opcionales:
- `start`: Número de registro inicial (default: 0)
- `limit`: Cantidad de registros (default: 100)

### Exportar CSV
```
GET /data-exporter/export/csv
```

## Permisos

El plugin está configurado para ser accesible por todos los usuarios administradores de la tienda.

## Estructura del plugin

```
data-exporter/
├── admin/
│   └── src/
│       ├── pages/
│       │   └── HomePage/
│       │       └── index.js
│       ├── index.js
│       └── pluginId.js
├── server/
│   ├── controllers/
│   │   ├── data-exporter.js
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

1. Edita los archivos en `src/plugins/data-exporter`
2. Reinicia Strapi para aplicar los cambios en el servidor
3. Para cambios en el admin, ejecuta `npm run build` en la carpeta de Strapi

## Soporte

Para problemas o mejoras, contacta al equipo de desarrollo.
