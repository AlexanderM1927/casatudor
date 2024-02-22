// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      strapiAssets: 'http://localhost:1337',
      apiBase: 'http://localhost:1337/api'
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
    '@pinia/nuxt',
    'nuxt-icon'
  ],
  ssr: false
})
