// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 3000
  },
  server: {
    port: 3000
  },
  runtimeConfig: {
    public: {
      url: 'https://bot.lootpanda.uz/api',
      version: '1.0.0'
    }
  },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt',],
  compatibilityDate: '2025-01-23',
});
