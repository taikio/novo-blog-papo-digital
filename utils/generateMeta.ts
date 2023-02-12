import { metaTags } from './types'

export default (overrides?: metaTags) => {
  const defaultMeta: metaTags = {
    pageTitle: 'Blog Papo Digital',
    description:
      'Bem vindo(a) ao Blog Papo Digital! Aqui você terá acesso a informações e tutoriais sobre tecnologia, programação e boas dicas sobre Carreira Tech',
    siteName: 'Blog Papo Digital',
    contentType: 'website',
    url: 'https://www.papodigital.net.br',
    socialBanner: 'https://www.papodigital.net.br/banner_social_media.png',
    bannerWidth: '740',
    bannerHeight: '300',
    twitterSiteName: '@papodigital',
    twitterCardType: 'summary_large_image',
    twitterUrl: 'https://www.papodigital.net.br',
    twitterTitle: 'Blog Papo Digital',
    twitterDescription:
      'Bem vindo(a) ao Blog Papo Digital! Aqui você terá acesso a informações e tutoriais sobre tecnologia, programação e boas dicas sobre Carreira Tech',
    twitterSocialBanner: 'https://www.papodigital.net.br/banner_social_media.png',
  }

  const generatedMeta: metaTags = { ...defaultMeta, ...overrides }

  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: generatedMeta.description },
    { name: 'robots', content: 'index,follow' },

    // General social media meta tags (Open Graph)
    { property: 'og:site_name', content: generatedMeta.siteName },
    { property: 'og:type', content: generatedMeta.contentType },
    { property: 'og:url', content: generatedMeta.url },
    { property: 'og:title', content: generatedMeta.pageTitle },
    { property: 'og:description', content: generatedMeta.description },
    { property: 'og:image', content: generatedMeta.socialBanner },
    { property: 'og:image:width', content: generatedMeta.bannerWidth },
    { property: 'og:image:height', content: generatedMeta.bannerHeight },

    // Twitter card meta tags
    { name: 'twitter:site', content: generatedMeta.twitterSiteName },
    { name: 'twitter:card', content: generatedMeta.twitterCardType },
    { name: 'twitter:url', content: generatedMeta.twitterUrl },
    { name: 'twitter:title', content: generatedMeta.twitterTitle },
    { name: 'twitter:description', content: generatedMeta.twitterDescription },
    { name: 'twitter:image', content: generatedMeta.twitterSocialBanner },
  ]
}
