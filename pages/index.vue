<template>
  <div class="page">
    <div class="page__banner" />

    <div class="page__content">
      <div v-for="article of articles" :key="article.slug" class="card" @click="goToArticle(article)">
        <div class="card__image" :style="{ backgroundImage: getCardImage(article) }" />

        <div class="card__body">
          <h2>{{ article.title }}</h2>
          <p>{{ getCardDescription(article) }}</p>
        </div>

        <div class="card__footer">
          {{ formatDate(article.createdAt) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const articles = await $content('articles')
      .only(['title', 'description', 'img', 'slug'])
      .sortBy('createdAt', 'desc')
      .fetch()

    return {
      articles,
    }
  },
  methods: {
    getCardImage(article) {
      const imagePath = require(`~/assets/images/${article.img}`)
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
  height: 48vh;
  background: url('~assets/images/Banner_home.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.page__content {
  /* display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 12px; */
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
	grid-gap: 10px;
}

.card {
  position: relative;
  width: 413px;
  margin: 24px;
	height: 380px;
  border: 1px solid #ededed;
  border-radius: 6px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.25);
  transition: 0.3s;
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
.card__body p {
  color: rgba(0, 0, 0, 0.70);
}
.card__footer {
  position: absolute;
  left: 10px;
  bottom: 10px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.70);
}

@media screen and (min-width: 1441px) and (max-width: 1930px) {
  .card {
    width: 580px;
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
  .card {
    width: 422px;
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
  .card {
    width: 284px;
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
  .page__content {
    grid-template-columns: 1fr 1fr;
  }
  .card {
    width: 325px;
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
  .page__content {
    grid-template-columns: 1fr;
  }
  .card {
    width: 372px;
  }
  .card__body h2 {
    font-size: 16px;
  }
  .card__body p {
    font-size: 13px;
  }
}
</style>
