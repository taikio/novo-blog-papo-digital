<template>
  <article>
    <div class="progress-container">
      <div id="progress-bar" class="progress-bar" />
    </div>

    <div class="article__cover" :style="{ backgroundImage: `url(${coverImage})` }" />

    <div class="article__body">
      <div class="article__ads">
        <!-- <adsbygoogle ad-slot="" /> -->
      </div>

      <div class="article__content">
        <h1 class="article__title">{{ article.title }}</h1>
        <p class="article__publish">Data de Publicação: {{ formatDate(article.publishDate) }}</p>
        <!-- exemplo de table of contents -->
        <!-- <nav>
          <ul>
            <li v-for="link of article.toc" :key="link.id">
              <NuxtLink :to="`#${link.id}`">{{ link.text }}</NuxtLink>
            </li>
          </ul>
        </nav> -->

        <nuxt-content :document="article" />

        <prev-next :prev="prev" :next="next" />

        <div class="article__comments">
          <Disqus />
        </div>
      </div>

      <div class="article__ads">
      </div>
    </div>
  </article>
</template>

<script>
import PrevNext from '@/components/PrevNext.vue'
import generateMeta from '@/utils/generateMeta'

export default {
  components: { PrevNext },
  async asyncData({ $content, params }) {
    const article = await $content('articles', params.slug).fetch()
    const disqusConfig = {
      url: `https://www.papodigital.net.br/blog/${params.slug}`,
      identifier: `papodigital-${article.slug}`,
      title: article.title,
      slug: params.slug
    }

    const [prev, next] = await $content('articles')
      .only(['title', 'slug'])
      .sortBy('publishDate', 'asc')
      .surround(params.slug)
      .fetch()

    return {
      article,
      prev,
      next,
      disqusConfig
    }
  },
  head() {
    const basicMetaTags = generateMeta({
      pageTitle: this.pageTitle,
      description: this.articleDescription,
      contentType: 'article',
      url: this.articleUrl,
      socialBanner: this.coverImage,
      twitterUrl: this.articleUrl,
      twitterTitle: this.pageTitle,
      twitterDescription: this.articleDescription,
      twitterSocialBanner: this.coverImage
    })

    const articleMetaTags = [
      {
        property: "article:published_time",
        content: this.articlePublishDate,
      },
      {
        property: "article:tag",
        content: this.articleTag,
      },
      { name: "twitter:label1", content: "Escrito Por" },
      { name: "twitter:data1", content: "Welker Arantes" },
      { name: "twitter:label2", content: "Tag" },
      {
        name: "twitter:data2",
        content: this.articleTag,
      }
    ]

    const metaTagsList = [...basicMetaTags, ...articleMetaTags]

    return {
      title: this.pageTitle,
      meta: metaTagsList,
      link: [
        {
          hid: "canonical",
          rel: "canonical",
          href: this.articleUrl,
        },
      ]
    }
  },
  computed: {
    articleTitle() {
      return this.article.title
    },
    articleDescription() {
      return this.article.description
    },
    articlePublishDate() {
      return this.article.publishDate
    },
    articleTag() {
      return this.article.tag
    },
    articleUrl() {
      return `https://www.papodigital.net.br/blog/${this.$route.params.slug}`
    },
    pageTitle() {
      return `Papo Digital | ${this.article.title}`
    },
    coverImage() {
      return `/${this.article.img}`
    }
  },
  mounted() {
    window.onscroll = () => {
      this.updateProgressBar()
    }
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }

      if (date) {
        return new Date(date).toLocaleDateString('pt', options)
      }
      return new Date().toLocaleDateString('pt', options)
    },
    updateProgressBar() {
      const element = window.document
      const progressBarEl = document.querySelector('#progress-bar')

      if (!progressBarEl) { return }

      const winScroll = element.body.scrollTop || element.documentElement.scrollTop
      const height = element.documentElement.scrollHeight - element.documentElement.clientHeight
      const scrolled = (winScroll / height) * 100

      progressBarEl.style.width = `${scrolled}%`
    }
  }
}
</script>

<style>
article {
  display: flex;
  flex-direction: column;
  margin-top: 52px;
  height: 100%;
  width: 100%;
}

.progress-container {
  position: fixed;
  top: 52px;
  width: 100%;
  z-index: 200;
}

.progress-bar {
  background: #52BA9B;
  height: 6px;
  width: 0%;
}

.article__cover {
  width: 100%;
  height: 453px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;
}

.article__body {
  width: 100%;
  display: flex;
}

.article__ads {
  width: 12.3%;
}

.article__content {
  width: 75%;
  padding: 18px 8px 6px 8px;
  display: flex;
  flex-direction: column;
  align-self: center;
}
.article__title {
  margin: 0;
  padding: 0;
  font-size: 1.5rem;
}
.article__publish {
  padding: 0;
  margin: 16px 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.60);
}

.article__comments {
  width: 100%;
  margin-top: 16px;
}

.nuxt-content h1 {
  font-weight: bold;
  font-size: 1.4rem;
}
.nuxt-content h2 {
  font-weight: bold;
  font-size: 1.3rem;
}
.nuxt-content h3 {
  font-weight: bold;
  font-size: 1.2rem;
}
.nuxt-content p {
  font-size: 1.1rem;
  color: rgba(0, 0, 0, 0.75);
  margin-bottom: 20px;
  line-height: 1.4rem;
}
.nuxt-content p code {
  font-weight: 600;
  font-style: italic;
}
pre[class*="language-"] {
  border-radius: 4px;
}
.nuxt-content-highlight {
  position: relative;
}
.nuxt-content-highlight .filename {
  position: absolute;
  right: 10px;
  top: 6px;
  font-size: 1rem;
  color: #fff;
  z-index: 2;
}

/* @media screen and (min-width: 1441px) and (max-width: 1930px) {

}

@media screen and (min-width: 1025px) and (max-width: 1440px) {

}

@media screen and (min-width: 769px) and (max-width: 1024px) {

} */

@media screen and (min-width: 426px) and (max-width: 768px) {
  .article__cover {
    height: 280px;
  }
  .article__content {
    width: 90%;
    padding: 18px 0 4px 0;
    margin-left: 5px;
    margin-right: 5px;
  }
  /* .article__title {
    margin: 0;
    padding: 0;
    font-size: 18px;
  }
  .nuxt-content h2 {
    font-weight: bold;
    font-size: 18px;
  }
  .nuxt-content h3 {
    font-weight: bold;
    font-size: 16px;
  } */
  .nuxt-content p {
    /* font-size: 14px; */
    margin-bottom: 15px;
  }
  /* .nuxt-content p code {
    font-weight: 600;
    font-style: italic;
    font-size: 12px;
  } */
}

@media screen and (max-width: 425px) {
  .article__cover {
    height: 280px;
  }
  .article__content {
    width: 90%;
    padding: 18px 0 4px 0;
    margin-left: 5px;
    margin-right: 5px;
  }
  /* .article__title {
    margin: 0;
    padding: 0;
    font-size: 16px;
  }
  .nuxt-content h2 {
    font-weight: bold;
    font-size: 16px;
  }
  .nuxt-content h3 {
    font-weight: bold;
    font-size: 15px;
  } */
  .nuxt-content p {
    /* font-size: 13px; */
    margin-bottom: 15px;
  }
  /* .nuxt-content p code {
    font-weight: 600;
    font-style: italic;
    font-size: 12px;
  } */
}
</style>
