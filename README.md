# Casa Tudor

Proyecto e-commerce compuesto por un frontend Nuxt 3, un backend Strapi 5 y una base de datos MySQL 8, orquestados con Docker Compose.

## Estructura

- `nuxt/`: aplicacion web Nuxt 3. Incluye paginas publicas, checkout, carrito, autenticacion, servicios hacia Strapi y pruebas con Vitest.
- `strapi/`: CMS/API Strapi 5. Contiene los content-types, controladores, servicios, emails y extensiones de usuarios/permisos.
- `compose.yaml`: servicios locales `frontend`, `backend` y `db`.
- `Jenkinsfile`: pipeline de despliegue/CI.

## Requisitos

- Docker y Docker Compose.
- Archivos de entorno para cada aplicacion:
  - `nuxt/.env`, basado en `nuxt/.env.example`.
  - `strapi/.env`, basado en `strapi/.env.example`.

No es necesario instalar Node en la maquina local para operar el proyecto. Los comandos de Node y npm deben ejecutarse dentro del contenedor correspondiente.

## Puesta en marcha

1. Crear o revisar los archivos `.env`:

```bash
cp nuxt/.env.example nuxt/.env
cp strapi/.env.example strapi/.env
```

2. Levantar los servicios:

```bash
docker compose up -d --build
```

3. Abrir las aplicaciones:

- Frontend: `http://localhost:9094`
- Backend Strapi: `http://localhost:1337`
- MySQL: `localhost:3306`

## Comandos frecuentes

Ejecutar siempre los comandos dentro del contenedor adecuado:

```bash
docker compose exec frontend npm run dev
docker compose exec frontend npm run build
docker compose exec frontend npm run test

docker compose exec backend npm run develop
docker compose exec backend npm run build
docker compose exec backend npm run start
```

Para revisar logs:

```bash
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f db
```

Para detener el entorno:

```bash
docker compose down
```

## Notas de desarrollo

- El frontend monta el codigo local de `nuxt/` dentro de `/usr/src/nuxt-app`.
- El backend monta configuracion, codigo fuente, emails, uploads y `.env` dentro de `/opt/app`.
- La base de datos persiste en el volumen Docker `db_data`.
- Si se agregan dependencias, usar `docker compose exec frontend npm install <paquete>` o `docker compose exec backend npm install <paquete>` segun corresponda.

## Documentacion por aplicacion

- [Frontend Nuxt](nuxt/README.md)
- [Backend Strapi](strapi/README.md)
