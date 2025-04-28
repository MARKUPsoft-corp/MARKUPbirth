// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
  ],
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css',
    '~/assets/css/main.css',
  ],
  app: {
    head: {
      title: "Anniversaire d'Emmanuel YAKAM TCHAMEGNI",
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: "Venez célébrer l'anniversaire d'Emmanuel YAKAM TCHAMEGNI avec nous !" 
        },
        { property: 'og:title', content: "Anniversaire d'Emmanuel YAKAM TCHAMEGNI" },
        { 
          property: 'og:description', 
          content: "Venez célébrer l'anniversaire d'Emmanuel YAKAM TCHAMEGNI avec nous !" 
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/images/og-image.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { 
          rel: 'stylesheet', 
          href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
        }
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js',
          crossorigin: 'anonymous'
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
      birthdayDate: process.env.BIRTHDAY_DATE || '2023-12-25T00:00:00'
    }
  },
  nitro: {
    compatibilityDate: '2024-04-28'
  }
});
