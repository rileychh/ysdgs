import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  imports: {
    scan: false,
  },

  css: ['~/assets/css/tailwind.css'],

  typescript: {
    typeCheck: 'build',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    '@nuxt/eslint',
    'shadcn-nuxt',
  ],

  eslint: {
    config: { standalone: false },
  },
})
