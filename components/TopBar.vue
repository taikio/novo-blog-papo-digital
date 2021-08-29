<template>
  <nav class="top-bar">
    <NuxtLink to="/" class="top-bar__logo">
      <img :src="require('~/assets/images/papo-digital-logo-offside-small.png')" alt="Papo Digital">
    </NuxtLink>

    <div class="top-bar__search">
      <app-sarch-input />
    </div>

    <div class="top-bar__links">
      <ul>
        <li>
          <a href="https://www.youtube.com/channel/UCOkZkn7IzpbHkLxFsy4LyCg" target="_blank" title="Ir para Linkedin">
            <em class="bi-youtube"></em> <span>Visitar Canal</span>
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import AppSarchInput from './AppSearchInput.vue'

export default {
  components: { AppSarchInput }
}
</script>

<style scoped>
.top-bar {
  width: 100%;
  padding: 4px 0;
  background: #fff;
  box-shadow: 0 3px 6px #ededed;
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}

.top-bar__logo {
  width: 25%;
  min-width: 250px;
  padding-left: 24px;
}
.top-bar__logo img {
  max-width: 95px;
}

.top-bar__search {
  width: 50%;
  padding: 2px 24px 0 24px;
}

.top-bar__links {
  width: 25%;
  min-width: 250px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 24px;
}
.top-bar__links ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.top-bar__links ul li {
  padding: 0 12px;
  display: inline-block;
}
.top-bar__links ul li a {
  display: flex;
  text-decoration: none;
  outline: none;
  color: #3B97D3;
  transition: 0.3s ease-in-out;
}
.top-bar__links ul li a:hover {
  color: #52BA9B;
  font-weight: 500;
}
.top-bar__links ul li a em {
  font-size: 25px;
}
.top-bar__links ul li a span {
  font-size: 16px;
  margin-top: 4px;
  margin-left: 10px;
}

/* @media screen and (min-width: 1441px) and (max-width: 1930px) {

}

@media screen and (min-width: 1025px) and (max-width: 1440px) {

}

@media screen and (min-width: 769px) and (max-width: 1024px) {

} */

@media screen and (min-width: 426px) and (max-width: 768px) {
  .top-bar__logo {
    width: 25%;
    min-width: 125px;
  }

  .top-bar__search {
    width: 50%;
    padding: 2px 12px 0 12px;
  }

  .top-bar__links {
    width: 25%;
    min-width: 125px;
  }
}

@media screen and (max-width: 425px) {
  .top-bar__logo {
    width: 25%;
    min-width: 115px;
  }

  .top-bar__search {
    width: 62%;
    padding: 2px 12px 0 12px;
  }

  .top-bar__links {
    display: none;
  }
}
</style>
