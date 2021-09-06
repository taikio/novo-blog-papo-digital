<template>
  <div class="page">
    <div class="page__banner" />

    <div class="page__tags">
      <span class="tag" :class="{'tag--active': !activeTag}" @click="fetchAllArticles()">
        #Todos
      </span>

      <span
        v-for="tag in tagsList"
        :key="tag"
        class="tag"
        :class="{'tag--active': activeTag === tag}"
        @click="fetchArticlesByTag(tag)"
      >
        {{ `#${tag}` }}
      </span>
    </div>

    <div class="page__content">
      <NuxtLink v-for="article of articles" :key="article.slug" class="card" :to="`/blog/${article.slug}`">
        <div class="card__image" :style="{ backgroundImage: getCardImage(article) }" />

        <div class="card__body">
          <h2>{{ article.title }}</h2>
          <p>{{ getCardDescription(article) }}</p>
        </div>

        <div class="card__footer">
          <span class="card__publish-date">{{ formatDate(article.publishDate) }}</span>

          <span class="card__tag">
            {{ article.tag }}
          </span>
        </div>
      </NuxtLink>
    </div>

    <div class="page__text">
      <p>
        Olá caro leitor, seja muito bem vindo ao blog Papo Digital.
        <br/>

        Aqui você vai encontrar vários posts sobre carreira em TI, mundo tech
        e principalmente tutoriais de programação sobre o ecosistema Vuejs.
        <br/>

        Se você quer aprender mais sobre Unit Tests no front-end este é o lugar certo.
        Também terá vários tutoriais sobre criação de componentes reutilizáveis e
        dicas de produtividade para te ajudar a entregar mais resultado com menos
        esforço. Então já salva aí nos seus favoritos porque toda semana sai conteúdo
        novo.
        <br/>

        Se você gosta do nosso conteúdo e quer ajudar o projeto a crescer, considere doar
        alguns BATs, ou se ver algum anúncio que te interesse pode clicar sem medo.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const articles = await $content('articles')
      .only(['title', 'description', 'img', 'slug', 'publishDate', 'tag'])
      .sortBy('publishDate', 'desc')
      .fetch()

    const tempTags = articles.map(a => a.tag).sort()
    const tagsList = Array.from(new Set(tempTags))
    const activeTag = ''

    return {
      articles,
      tagsList,
      activeTag
    }
  },
  methods: {
    getCardImage(article) {
      const imagePath = article.img
      return `url(${imagePath})`
    },
    getCardDescription(article) {
      if (article.description.length > 290) {
        return `${article.description.substring(0, 290)}...`
      }
      return article.description
    },
    goToArticle(article) {
      const articleUrl = `/blog/${article.slug}`
      this.$router.push(articleUrl)
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }

      if (date) {
        return new Date(date).toLocaleDateString('pt', options)
      }
      return new Date().toLocaleDateString('pt', options)
    },
    async fetchArticlesByTag(searchTag) {
      this.articles = await this.$content('articles')
      .only(['title', 'description', 'img', 'slug', 'publishDate', 'tag'])
      .where({ tag: searchTag })
      .sortBy('publishDate', 'desc')
      .fetch()

      this.activeTag = searchTag
    },
    async fetchAllArticles() {
      this.articles = await this.$content('articles')
      .only(['title', 'description', 'img', 'slug', 'publishDate', 'tag'])
      .sortBy('publishDate', 'desc')
      .fetch()

      this.activeTag = ''
    }
  }
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  margin-top: 52px;
}

.page__banner {
  width: 100%;
  height: 44vh;
  background: url('/Banner_home.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.page__tags {
  width: 94%;
  display: flex;
  flex-direction: row;
  padding: 20px 24px 0 24px;
  flex-wrap: wrap;
}

.tag {
  padding: 12px 16px;
  font-size: 1rem;
  border-radius: 6px;
  background: #3B97D3;
  color: #fff;
  transition: 0.3s ease-in-out;
  margin: 8px 8px 8px 0;
}
.tag:hover {
  background: #52BA9B;
  color: #fafafa;
  box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}
.tag--active {
  background: #52BA9B;
  color: #fafafa;
}

.page__content {
  display: flex;
  flex-wrap: wrap;
}

.card {
  position: relative;
  width: 30.6%;
  margin: 24px;
	height: 380px;
  border: 1px solid #ededed;
  border-radius: 6px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.25);
  transition: 0.3s;
  outline: none;
  text-decoration: none;
}
.card:hover {
  border: 1px solid #52BA9B;
  box-shadow: 1px 4px 6px #52BA9B;
  cursor: pointer;
}
.card__image {
  width: 100%;
  height: 45%;
  border-radius: 6px 6px 0 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;
}
.card__body {
  padding: 10px;
}
.card__body h2 {
  color: rgba(0, 0, 0, 0.80);
}
.card__body p {
  color: rgba(0, 0, 0, 0.70);
}
.card__footer {
  position: absolute;
  left: 10px;
  bottom: 10px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.70);
  width: 95%;
  display: flex;
  justify-content: space-between;
}
.card__publish-date {
  margin-top: 4px;
}
.card__tag {
  padding: 4px 10px;
  font-size: 0.7rem;
  border-radius: 6px;
  background: #3B97D3;
  color: #fff;
}

.page__text {
  display: none;
}

@media screen and (min-width: 1441px) and (max-width: 1930px) {
  .tag {
    margin: 6px;
  }
  .card {
    width: 29.9%;
    height: 445px;
  }
  .card__body h2 {
    font-size: 20px;
  }
  .card__body p {
    font-size: 16px;
  }
}

@media screen and (min-width: 1025px) and (max-width: 1440px) {
  .page__banner {
    height: 42vh;
  }
  .tag {
    margin: 6px;
    padding: 12px 16px;
    font-size: 1rem;
  }
  .card {
    width: 29.8%;
  }
  .card__body h2 {
    font-size: 18px;
  }
  .card__body p {
    font-size: 14px;
  }
}

@media screen and (min-width: 769px) and (max-width: 1024px) {
  .page__banner {
    height: 37vh;
  }
  .tag {
    margin: 6px;
    padding: 8px 16px;
    font-size: 1rem;
  }
  .card {
    width: 45%;
  }
  .card__body h2 {
    font-size: 15px;
  }
  .card__body p {
    font-size: 13px;
  }
}

@media screen and (min-width: 426px) and (max-width: 768px) {
  .page__banner {
    height: 37vh;
  }
  .tag {
    margin: 4px;
    padding: 7px 14px;
    font-size: 1rem;
  }
  .card {
    width: 43.4%;
  }
  .card__body h2 {
    font-size: 15px;
  }
  .card__body p {
    font-size: 13px;
  }
}

@media screen and (max-width: 425px) {
  .page__banner {
    height: 30vh;
  }
  .page__tags {
    width: 89%;
  }
  .tag {
    margin: 4px;
    padding: 6px 12px;
    font-size: 1rem;
  }
  .card {
    width: 87.7%;
  }
  .card__body h2 {
    font-size: 16px;
  }
  .card__body p {
    font-size: 13px;
  }
}
</style>
