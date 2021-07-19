<template>
  <div class="container flex justify-between">
    <NuxtLink
      v-if="prev"
      :to="{ name: 'blog-slug', params: { slug: prev.slug } }"
      class="link"
    >
      <i class="bi-arrow-left"></i> {{ prev.title }}
    </NuxtLink>
    <span v-else>&nbsp;</span>
    <NuxtLink
      v-if="next"
      :to="{ name: 'blog-slug', params: { slug: next.slug } }"
      class="link"
    >
      {{ next.title }} <i class="bi-arrow-right"></i>
    </NuxtLink>
    <span v-else>&nbsp;</span>
  </div>
</template>

<script>
export default {
  name: 'PrevNext',
  props: {
    prev: {
      type: Object,
      default: () => null
    },
    next: {
      type: Object,
      default: () => null
    }
  }
}
</script>

<style scoped>
.flex {
  display: flex;
  width: 100%;
}

.justify-between {
  justify-content: space-between;
}

.container {
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 0;
  margin: 2px 0;
}

.link {
  font-size: 18px;
  text-decoration: none;
  outline: none;
  color: #3B97D3;
  transition: 0.3s ease-in-out;
}
.link:hover {
  color: #52BA9B;
  font-weight: 500;
}

/* @media screen and (min-width: 1441px) and (max-width: 1930px) {

}

@media screen and (min-width: 1025px) and (max-width: 1440px) {

}

@media screen and (min-width: 769px) and (max-width: 1024px) {

} */

@media screen and (min-width: 426px) and (max-width: 768px) {
  .link {
    font-size: 15px;
  }
}

@media screen and (max-width: 425px) {
  .link {
    font-size: 13px;
  }
}
</style>
