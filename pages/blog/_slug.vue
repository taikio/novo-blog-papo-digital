<template>
  <article>
    <div class="article__cover" :style="{ backgroundImage: `url(${coverImage})` }" />
    <div class="article__content">
      <h1 class="article__title">{{ article.title }}</h1>
      <p class="article__publish">Data de Publicação: {{ formatDate(article.createdAt) }}</p>
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
    </div>
  </article>
</template>

<script>
import PrevNext from '@/components/PrevNext.vue'

export default {
  components: { PrevNext },
  async asyncData({ $content, params }) {
    const article = await $content('articles', params.slug).fetch()
    const coverImage = require(`~/assets/images/${article.img}`)

    const [prev, next] = await $content('articles')
      .only(['title', 'slug'])
      .sortBy('createdAt', 'asc')
      .surround(params.slug)
      .fetch()

    return {
      article,
      coverImage,
      prev,
      next
    }
  },
  head() {
    return {
      title: `Papo Digital | ${this.article.title}`,
      meta: [
        { hid: 'description', name: 'description', content: this.article.description },

        // General social media meta tags
        {
          hid: "og:title",
          property: "og:title",
          content: this.article.title,
        },
        {
          hid: "og:description",
          property: "og:description",
          content: this.article.description,
        },
        {
          hid: "og:image",
          property: "og:image",
          content: this.coverImage,
        },
        { property: "og:image:width", content: "740" },
        { property: "og:image:height", content: "300" },
        {
          hid: "og:url",
          property: "og:url",
          content: `https://www.papodigital.net.br/${this.$route.params.slug}`
        },

        // Twitter card meta tags
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: this.article.title,
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: this.article.description,
        },
        {
          hid: "twitter:image",
          name: "twitter:image",
          content: this.coverImage,
        },
        {
          hid: "twitter:url",
          name: "twitter:url",
          content: `https://www.papodigital.net.br/${this.$route.params.slug}`
        },

        // Aditional article meta tags
        {
          property: "article:published_time",
          content: this.article.createdAt,
        },
        {
          property: "article:modified_time",
          content: this.article.updatedAt,
        },
        {
          property: "article:tag",
          content: this.article.tags ? this.article.tags.toString() : "",
        },
        { name: "twitter:label1", content: "Escrito Por" },
        { name: "twitter:data1", content: "Welker Arantes" },
        { name: "twitter:label2", content: "Tag" },
        {
          name: "twitter:data2",
          content: this.article.tags ? this.article.tags.toString() : "",
        }
      ],
      link: [
        {
          hid: "canonical",
          rel: "canonical",
          href: `https://www.papodigital.net.br/${this.$route.params.slug}`,
        },
      ],
    }
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }

      if (date) {
        return new Date(date).toLocaleDateString('pt', options)
      }
      return new Date().toLocaleDateString('pt', options)
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

.article__cover {
  width: 100%;
  height: 453px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;
}

.article__content {
  width: 950px;
  padding-top: 18px;
  display: flex;
  flex-direction: column;
  align-self: center;
}
.article__title {
  margin: 0;
  padding: 0;
  font-size: 30px;
}
.article__publish {
  padding: 0;
  margin: 16px 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.60);
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
  .article__title {
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
  }
  .nuxt-content p {
    font-size: 14px;
    margin-bottom: 15px;
  }
  .nuxt-content p code {
    font-weight: 600;
    font-style: italic;
    font-size: 12px;
  }
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
  .article__title {
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
  }
  .nuxt-content p {
    font-size: 13px;
    margin-bottom: 15px;
  }
  .nuxt-content p code {
    font-weight: 600;
    font-style: italic;
    font-size: 12px;
  }
}
</style>
