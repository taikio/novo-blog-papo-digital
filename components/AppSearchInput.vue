<template>
  <div class="search-input">
    <input
      v-model="searchQuery"
      type="text"
      autocomplete="off"
      placeholder="Pesquisar..."
      @input="applySearch()"
    />

    <div class="search-input__icon">
      <i class="bi-search"></i>
    </div>

    <div v-if="searchQuery.length > 0" class="search-input__close">
      <span class="bi-x-circle" @click="clearSearch()" />
    </div>

    <div v-if="articles.length > 0" class="sear-input__results">
      <ul>
        <li v-for="article of articles" :key="article.slug">
          <a @click="goToArticle(article)">
            {{ article.title }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import DebounceFactory from '@/utils/debounce'
import { Capitalize } from '@/utils/functions'

export default {
  data() {
    return {
      searchQuery: '',
      articles: []
    }
  },
  methods: {
    clearSearch() {
      this.searchQuery = ''
      this.articles = []
    },
    applySearch() {
      if (this.searchQuery.length <= 0) {
        this.articles = []
        return
      }
      const fetchSearchDebounced = DebounceFactory(this.fetchSearch, 400)
      fetchSearchDebounced()
    },
    async fetchSearch() {
      if (this.searchQuery.length <= 0) return

      const capitalizedQuery = Capitalize(this.searchQuery)

      this.articles = await this.$content('articles')
        .limit(6)
        .where({ title: { $contains : capitalizedQuery } })
        .sortBy('createdAt', 'desc')
        .fetch()
    },
    goToArticle(article) {
      if (!article || !article.slug) return

      const articleUrl = `/blog/${article.slug}`
      this.$nuxt.$router.push(articleUrl)
      this.clearSearch()
    }
  }
}
</script>

<style scoped>
.search-input {
  width: 100%;
  position: relative;
  display: flex;
  font-family: 'Inter', sans-serif;
}
.search-input input {
  width: 100%;
  padding: 10px 12px 10px 28px;
  border-radius: 6px;
  background: #F5F5F5;
  border: 1px solid #ededed;
  color: rgba(0, 0, 0, 0.5);
  outline: none;
  transition: 0.3s;
}
.search-input input:hover {
  border: 1px solid rgba(0, 0, 0, 0.5);
}
.search-input input:focus {
  border: 1px solid #3b97d3;
  box-shadow: 0 0 4px #3b97d3;
}

.search-input__icon {
  position: absolute;
  left: 6px;
  top: 8px;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.5);
}

.search-input__close {
  position: absolute;
  right: 6px;
  top: 8px;
  font-size: 18px;
  color: red;
}
.search-input__close span {
  cursor: pointer;
}

.sear-input__results {
  position: absolute;
  left: 0;
  top: 42px;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 6px 0;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #ededed;
  box-shadow: 0 2px 6px #ededed;
  z-index: 105;
}
.sear-input__results ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.sear-input__results ul li {
  padding: 6px 12px;
}
.sear-input__results ul li a {
  font-size: 16px;
  padding: 6px 12px;
  text-decoration: none;
  outline: none;
  color: #3B97D3;
  transition: 0.3s;
}
.sear-input__results ul li a:hover {
  color: #52BA9B;
  font-weight: 500;
  /* text-decoration: underline; */
  cursor: pointer;
}

/* @media screen and (min-width: 1441px) and (max-width: 1930px) {

}

@media screen and (min-width: 1025px) and (max-width: 1440px) {

}

@media screen and (min-width: 769px) and (max-width: 1024px) {

} */

@media screen and (min-width: 426px) and (max-width: 768px) {
  .search-input__icon {
    left: 6px;
    top: 8px;
    font-size: 15px;
  }

  .search-input__close {
    right: 6px;
    top: 8px;
    font-size: 15px;
  }

  .sear-input__results ul li a {
    font-size: 15px;
    padding: 2px 4px;
  }
}

@media screen and (max-width: 425px) {
  .search-input__icon {
    left: 6px;
    top: 8px;
    font-size: 15px;
  }

  .search-input__close {
    right: 6px;
    top: 8px;
    font-size: 15px;
  }

  .sear-input__results ul li a {
    font-size: 13px;
    padding: 2px 4px;
  }
}
</style>
