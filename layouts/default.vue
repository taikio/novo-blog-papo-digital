<template>
  <div class="default-template">
    <header>
      <top-bar />
    </header>

    <Nuxt />

    <footer class="page-footer">
      <p><strong>© Blog Papo Digital.</strong> Feito com ❤️ para toda a comunidade Tech</p>
    </footer>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue'

export default {
  components: { TopBar }
}
</script>

<style>
.default-template {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background: #fafafa;
  position: relative;
}

.page-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
}

/* @media screen and (min-width: 1441px) and (max-width: 1930px) {

}

@media screen and (min-width: 1025px) and (max-width: 1440px) {

}

@media screen and (min-width: 769px) and (max-width: 1024px) {

} */

@media screen and (min-width: 426px) and (max-width: 768px) {
  .page-footer {
    font-size: 10px;
  }
}

@media screen and (max-width: 425px) {
  .page-footer {
    font-size: 9px;
  }
}
</style>
