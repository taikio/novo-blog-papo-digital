export default (overrides = {}) => {
  const defaultMeta = {
    pageTitle: 'Blog Papo Digital',
    description: 'O Papo Digital é um blog que fala sobre mundo tech, programação e carreira',
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
    twitterDescription: 'O Papo Digital é um blog que fala sobre mundo tech, programação e carreira',
    twitterSocialBanner: 'https://www.papodigital.net.br/banner_social_media.png'
  }

  const generatedMeta = {...defaultMeta, ...overrides}

  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { hid: 'description', name: 'description', content: generatedMeta.description },
    { hid: 'robots', name: 'robots', content: 'index,follow'},

    // General social media meta tags (Open Graph)
    { hid: 'og:site_name', property: 'og:site_name', content: generatedMeta.siteName },
    { hid: 'og:type', property: 'og:type', content: generatedMeta.contentType },
    {
      hid: 'og:url',
      property: 'og:url',
      content: generatedMeta.url,
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: generatedMeta.pageTitle,
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: generatedMeta.description,
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: generatedMeta.socialBanner,
    },
    {
      hid: 'og:image:width',
      property: 'og:image:width',
      content: generatedMeta.bannerWidth
    },
    {
      hid: 'og:image:height',
      property: 'og:image:height',
      content: generatedMeta.bannerHeight
    },

    // Twitter card meta tags
    {
      hid: 'twitter:site',
      name: 'twitter:site',
      content: generatedMeta.twitterSiteName
    },
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: generatedMeta.twitterCardType
    },
    {
      hid: 'twitter:url',
      name: 'twitter:url',
      content: generatedMeta.twitterUrl,
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: generatedMeta.twitterTitle,
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: generatedMeta.twitterDescription,
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: generatedMeta.twitterSocialBanner,
    }
  ]
}
