// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-09-19',
  runtimeConfig: {
    jwtCookie: process.env.NUXT_JWT_COOKIE || 'auth_token',
    public: {
      strapiAssets: process.env.STRAPI_ASSETS,
      apiBase: process.env.API_BASE,
      storeName: process.env.STORE_NAME,
      header: process.env.HEADER,
      description: process.env.DESCRIPTION
    }
  },
  app: {
    buildAssetsDir: '/_nuxt/',
    pageTransition: false,
    layoutTransition: false,
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'es' // Add your language code here (e.g., 'en', 'es', 'fr')
      },
      meta: [
        // Open Graph meta tags for social media previews
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: process.env.STORE_NAME },
        { property: 'og:description', content: process.env.DESCRIPTION },
        { property: 'og:image', content: '/img/logo.webp' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/png' },
        // Twitter Card meta tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: process.env.STORE_NAME },
        { name: 'twitter:description', content: process.env.DESCRIPTION },
        { name: 'twitter:image', content: '/img/logo.webp' },
        // WhatsApp specific
        { property: 'og:site_name', content: process.env.STORE_NAME },
        // Permitir que Googlebot renderice JavaScript
        { name: 'googlebot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' }
      ],
      script: [
        {
          src: 'https://checkout.wompi.co/widget.js'
        }
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Marcellus:wght@400&display=swap'
        }
      ]
    }
  },
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  css: [
    '@/styles/main.scss',
    "~/node_modules/bootstrap/dist/css/bootstrap.min.css"
  ],
  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    'nuxt-icon'
  ],
  icon: {
    size: '24px', // default <Icon> size applied
    class: 'icon', // default <Icon> class applied
    aliases: {
      'nuxt': 'logos:nuxt-icon'
    }
  },
  image: {
    formats: ['webp', 'avif', 'jpeg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
    presets: {
      hero: {
        modifiers: {
          format: 'webp',
          quality: 90,
          sizes: '100vw'
        }
      }
    }
  },
  ssr: false, // Disable SSR to avoid hydration issues
  experimental: {
    appManifest: false // Deshabilitar manifest para evitar error 499
  },
  nitro: {
    preset: 'node-server',
    serveStatic: true,
    compressPublicAssets: {
      brotli: true,
      gzip: true
    },
    prerender: {
      routes: [
        '/',
        '/items',
        '/posts',
        '/pages',
        '/promotions'
      ],
      crawlLinks: true,
      ignore: [
        '/login',
        '/register',
        '/checkout/**',
        '/orders/**',
        '/api/**',
        '/_nuxt/**'
      ]
    },
    routeRules: {
      // Permitir acceso a recursos _nuxt para bots
      '/_nuxt/**': { 
        headers: { 
          'cache-control': 'public, max-age=31536000, immutable',
          'x-robots-tag': 'noindex'
        }
      },
      // Manejar metadata de builds - servir desde middleware
      '/_nuxt/builds/**': { 
        headers: { 
          'cache-control': 'no-cache, no-store, must-revalidate',
          'content-type': 'application/json'
        }
      },
      // Bloquear APIs de autenticación para bots
      '/api/auth/**': { 
        headers: { 'x-robots-tag': 'noindex, nofollow' }
      },
      '/api/user/**': { 
        headers: { 'x-robots-tag': 'noindex, nofollow' }
      },
      '/api/cart/**': { 
        headers: { 'x-robots-tag': 'noindex, nofollow' }
      },
      '/api/orders/**': { 
        headers: { 'x-robots-tag': 'noindex, nofollow' }
      },
      // Pre-renderizar y cachear páginas públicas
      '/': { prerender: true },
      '/items/**': { swr: 3600 },
      '/posts/**': { swr: 3600 },
      '/pages/**': { swr: 3600 },
      '/promotions/**': { swr: 3600 },
      // Bloquear páginas privadas
      '/login': { robots: false },
      '/register': { robots: false },
      '/checkout/**': { robots: false },
      '/orders/**': { robots: false }
    }
  },
  generate: {
    fallback: '404.html'
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/styles/_colors.scss" as *;
            @use "@/styles/_breakpoints.scss" as *;
          `
        }
      }
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