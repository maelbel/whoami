// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/mdc',
    '@vercel/analytics',
    '@vercel/speed-insights',
    '@nuxt/fonts',
    'nuxt-og-image'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://www.maelbelliard.fr'
  },

  runtimeConfig: {
    githubToken: '',
    redisUrl: process.env.REDIS_URL || ''
  },

  routeRules: {
    '/': { prerender: true },
    '/changelog': { isr: 3600 }
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    preset: 'vercel'
  },

  vite: {
    server: {
      allowedHosts: [
        'whoami.maelbelliard.fr'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  fonts: {
    families: [
      { name: 'JetBrains Mono', weights: [400, 700], global: true }
    ]
  }
})
