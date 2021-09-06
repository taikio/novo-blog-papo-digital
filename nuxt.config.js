import getRoutes from "./utils/getRoutes";
import generateMeta from "./utils/generateMeta";

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Blog Papo Digital',
    htmlAttrs: {
      lang: 'en'
    },
    meta: generateMeta(),
    link: [
      // https://moz.com/learn/seo/canonicalization
      { hid: "canonical", rel: "canonical", href: "https://www.papodigital.net.br" },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter&family=Roboto&display=swap' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/styles/global.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/disqus'
  ],
  /*
   ** Customize the progress-bar color
   */
   loading: {
    color: '#3B97D3',
  },

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
    // https://sitemap.nuxtjs.org/guide/setup
    '@nuxtjs/sitemap',
    // https://www.npmjs.com/package/@nuxtjs/google-adsense
    '@nuxtjs/google-adsense'
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
  sitemap: {
    hostname: 'https://www.papodigital.net.br',
    routes() {
      return getRoutes()
    }
  },
  'google-adsense': {
    id: 'ca-pub-4727865344641486'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
