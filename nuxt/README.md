# Frontend Nuxt

Aplicacion web de Casa Tudor construida con Nuxt 3, Vue 3, Pinia, Tailwind, Bootstrap y Vitest.

## Responsabilidades

- Catalogo, paginas, subpaginas, posts y promociones.
- Carrito, favoritos, checkout y ordenes del usuario.
- Autenticacion desde rutas server-side hacia Strapi.
- Generacion de `robots.txt`, `sitemap.xml` y metadatos SEO.
- Integracion con servicios HTTP ubicados en `services/`.

## Variables de entorno

Crear `nuxt/.env` a partir de `nuxt/.env.example`.

Variables principales:

- `STRAPI_ASSETS`: URL base para archivos servidos por Strapi.
- `API_BASE`: URL base de la API de Strapi.
- `STORE_NAME`: nombre publico de la tienda.
- `HEADER`: texto de encabezado/configuracion de contenido.
- `DESCRIPTION`: descripcion publica para SEO/contenido.

## Desarrollo

Levantar el entorno completo desde la raiz del proyecto:

```bash
docker compose up -d --build
```

La aplicacion queda disponible en:

```text
http://localhost:9094
```

## Comandos

Ejecutar siempre dentro del contenedor `frontend`:

```bash
docker compose exec frontend npm run dev
docker compose exec frontend npm run build
docker compose exec frontend npm run generate
docker compose exec frontend npm run preview
docker compose exec frontend npm run test
```

Para instalar dependencias:

```bash
docker compose exec frontend npm install nombre-del-paquete
```

## Estructura relevante

- `pages/`: rutas de Nuxt.
- `components/`: componentes reutilizables.
- `server/api/`: endpoints server-side de Nuxt.
- `server/routes/`: rutas especiales como sitemap y robots.
- `services/`: clientes para consumir la API.
- `stores/`: stores Pinia.
- `composables/`: logica reutilizable de Vue/Nuxt.
- `types/`: tipos TypeScript compartidos.
- `tests/`: pruebas con Vitest.

## Pruebas

```bash
docker compose exec frontend npm run test
```

La configuracion esta en `vitest.config.ts`.
