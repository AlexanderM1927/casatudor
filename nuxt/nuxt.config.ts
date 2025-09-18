// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      strapiAssets: process.env.STRAPI_ASSETS,
      apiBase: process.env.API_BASE,
      storeName: process.env.STORE_NAME,
      header: process.env.HEADER,
      description: process.env.DESCRIPTION
    }
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'es' // Add your language code here (e.g., 'en', 'es', 'fr')
      }
    }
  },
  devtools: { enabled: true },
  css: [
    '@/styles/main.scss',
    "~/node_modules/bootstrap/dist/css/bootstrap.min.css"
  ],
  modules: [
    '@nuxt/test-utils/module',
    '@pinia/nuxt',
    '@nuxt/image',
    'nuxt-icon'
  ],
  ssr: true,
  nitro: {
    prerender: {
      routes: ['/'] // Pre-render critical pages
    }
  },
  $development: {
    vite: {
      server: {
        watch: {
          usePolling: true,
          interval: 1000, // set preference
        },
      },
    },
  },
})
