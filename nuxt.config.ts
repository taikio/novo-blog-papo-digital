import generateMeta from './utils/generateMeta'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon', '@nuxt/content'],
  nitro: {
    prerender: {
      routes: ['/sitemap.xml'],
    },
  },
  content: {
    highlight: {
      theme: 'dracula',
    },
  },
  app: {
    head: {
      title: 'Blog Papo Digital',
      meta: generateMeta(),
      link: [{ rel: 'canonical', href: 'https://www.papodigital.net.br' }],
    },
  },
})
