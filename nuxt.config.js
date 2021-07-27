export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Papo Digital - Blog',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Aqui você encontra artigos sobre mundo tech, programação e carreira' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'robots', content: 'index, follow' },

      // General social media meta tags
      { property: "og:site_name", content: "Papo Digital" },
      { hid: "og:type", property: "og:type", content: "website" },
      {
        hid: "og:url",
        property: "og:url",
        content: "https://www.papodigital.net.br",
      },
      {
        hid: "og:title",
        property: "og:title",
        content: "Papo Digital - Blog",
      },
      {
        hid: "og:description",
        property: "og:description",
        content: "Aqui você encontra artigos sobre mundo tech, programação e carreira",
      },
      {
        hid: "og:image",
        property: "og:image",
        content: "/banner_social_media.png",
      },
      { property: "og:image:width", content: "740" },
      { property: "og:image:height", content: "300" },

      // Twitter card meta tags
      { name: "twitter:site", content: "@papodigital" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        hid: "twitter:url",
        name: "twitter:url",
        content: "https://www.papodigital.net.br",
      },
      {
        hid: "twitter:title",
        name: "twitter:title",
        content: "Papo Digital - Blog",
      },
      {
        hid: "twitter:description",
        name: "twitter:description",
        content: "Aqui você encontra artigos sobre mundo tech, programação e carreira",
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: "/banner_social_media.png",
      },
    ],
    link: [
      // https://moz.com/learn/seo/canonicalization
      { hid: "canonical", rel: "canonical", href: "https://www.papodigital.net.br" },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@5.9.55/css/materialdesignicons.min.css' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter&family=Roboto&display=swap' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/styles/global.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-material-oceanic.css'
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
