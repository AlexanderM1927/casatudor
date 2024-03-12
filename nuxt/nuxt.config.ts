// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      strapiAssets: 'http://192.168.0.4:1337',
      apiBase: 'http://192.168.0.4:1337/api'
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
  plugins: [
    { src: "~/plugins/localbase", mode: "client" }
  ],
  ssr: false
})
