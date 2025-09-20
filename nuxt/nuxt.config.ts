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
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'es' // Add your language code here (e.g., 'en', 'es', 'fr')
      },
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
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },
  devtools: { enabled: true },
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
  nitro: {
    prerender: {
      routes: ['/'] // Pre-render critical pages
    }
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