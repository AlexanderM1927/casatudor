// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      strapiAssets: process.env.STRAPI_ASSETS,
      apiBase: process.env.API_BASE
    }
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
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
    'nuxt-icon'
  ],
  ssr: false,
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
