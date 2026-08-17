// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/mdc',
    '@vercel/analytics',
    '@vercel/speed-insights'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true },
    '/changelog': { isr: 3600 }
  },

  compatibilityDate: '2026-06-30',

  vite: {
    server: {
      allowedHosts: [
        'whoami.maelbelliard.fr'
      ]
    }
  },

  nitro: {
    preset: 'vercel'
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
