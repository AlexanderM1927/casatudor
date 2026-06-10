# Instrucciones para agentes

Este repositorio usa Docker Compose como entorno de desarrollo. Siempre que un agente necesite ejecutar comandos de `node`, `npm`, `npx` o scripts definidos en `package.json`, debe hacerlo dentro del contenedor correspondiente.

## Regla principal

- Para el frontend Nuxt, usar el servicio `frontend`.
- Para el backend Strapi, usar el servicio `backend`.
- No ejecutar `node`, `npm` ni `npx` directamente en la maquina host desde la raiz, `nuxt/` o `strapi/`.

## Ejemplos permitidos

```bash
docker compose exec frontend npm run dev
docker compose exec frontend npm run build
docker compose exec frontend npm run test
docker compose exec frontend npm install
docker compose exec frontend npx nuxt prepare

docker compose exec backend npm run develop
docker compose exec backend npm run build
docker compose exec backend npm run start
docker compose exec backend npm install
docker compose exec backend npx strapi routes:list
```

## Instalacion de dependencias

Cuando se instale una dependencia, hacerlo en el contenedor de la aplicacion que la necesita:

```bash
docker compose exec frontend npm install nombre-del-paquete
docker compose exec backend npm install nombre-del-paquete
```

Despues de instalar dependencias, revisar que el `package.json` y el `package-lock.json` correctos hayan cambiado.

## Comandos de Docker

Los comandos de Docker Compose si se ejecutan desde el host:

```bash
docker compose up -d --build
docker compose logs -f frontend
docker compose logs -f backend
docker compose down
```

## Antes de modificar

- Leer primero la documentacion raiz y el README de la aplicacion afectada.
- Mantener cambios acotados a `nuxt/` o `strapi/` cuando sea posible.
- No revertir cambios existentes sin confirmacion explicita del usuario.
