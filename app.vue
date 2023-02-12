<script setup lang="ts">
import NavBar from '@/components/nav-bar.vue'

const nuxtApp = useNuxtApp()

nuxtApp.hook('page:finish', () => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="h-screen w-full bg-ice">
    <nav-bar />
    <!-- ===== Pages container ===== -->
    <div class="mt-14 h-full w-full">
      <NuxtPage />
    </div>
  </div>
</template>
