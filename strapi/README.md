# Backend Strapi

Aplicacion Strapi 5 que actua como CMS y API para Casa Tudor.

## Responsabilidades

- Administracion de productos, categorias, banners, promociones, posts, paginas y subpaginas.
- Gestion de usuarios y permisos mediante la extension `users-permissions`.
- Carritos, ordenes, facturas y logica de pagos.
- Emails transaccionales ubicados en `emails/templates/`.
- Plugin local `data-exporter` para exportacion de datos.

## Variables de entorno

Crear `strapi/.env` a partir de `strapi/.env.example`.

El servicio `backend` lee este archivo desde `compose.yaml` y lo monta dentro de `/opt/app/.env`.

## Desarrollo

Levantar el entorno completo desde la raiz:

```bash
docker compose up -d --build
```

Strapi queda disponible en:

```text
http://localhost:1337
```

La base de datos MySQL queda disponible para los contenedores como servicio `db` y desde el host en `localhost:3306`.

## Comandos

Ejecutar siempre dentro del contenedor `backend`:

```bash
docker compose exec backend npm run develop
docker compose exec backend npm run build
docker compose exec backend npm run start
docker compose exec backend npm run strapi
```

Para instalar dependencias:

```bash
docker compose exec backend npm install nombre-del-paquete
```

## Estructura relevante

- `src/api/`: APIs, content-types, controladores, rutas y servicios.
- `src/components/`: componentes reutilizables de contenido.
- `src/extensions/users-permissions/`: personalizaciones de usuarios y permisos.
- `src/plugins/data-exporter/`: plugin local de exportacion.
- `config/`: configuracion de Strapi, base de datos, middlewares y plugins.
- `emails/templates/`: plantillas HTML para correos.
- `public/uploads/`: archivos subidos por Strapi.

## Datos y persistencia

- MySQL persiste en el volumen Docker `db_data`.
- Los uploads se montan desde `strapi/public/uploads`.
- La configuracion y el codigo fuente se montan desde el workspace para facilitar desarrollo local.

## Build

Para reconstruir el panel de administracion:

```bash
docker compose exec backend npm run build
```
