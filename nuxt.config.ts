// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: {enabled: true},
  css: ['~/assets/css/main.css', '~/assets/css/fonts.css'],

  runtimeConfig: {
    public: {
      mapboxToken: process.env.NUXT_MAPBOX_TOKEN,
      gameUrl: process.env.NUXT_APPROXCITY_LAMBDA_URL
    }
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
 fontawesome: {
    icons: {
      solid: ['spinner', 'globe', 'trophy', 'share-nodes'],
    }
  },
  modules: ['@vesp/nuxt-fontawesome', '@vueuse/nuxt']
})