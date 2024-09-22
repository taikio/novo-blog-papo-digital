<script setup lang="ts">
const route = useRoute()
const isABlogRoute = computed(
  () => route.path === '/' || route.path.startsWith('/blog/')
)
</script>

<template>
  <div
    class="fixed top-0 z-10 flex h-14 w-full items-center justify-between bg-white px-12 shadow-md"
  >
    <NuxtLink to="/">
      <img src="/logo.png" alt="Logo Papo Digital" class="w-32" />
    </NuxtLink>

    <!-- ===== Links container ===== -->
    <div class="flex gap-4">
      <NuxtLink
        to="/"
        class="text-md hidden cursor-pointer transition-all duration-150 hover:text-primary-500 md:inline-block"
        :class="{
          'text-primary-500': isABlogRoute,
          'text-black-400': !isABlogRoute,
        }"
      >
        Blog
      </NuxtLink>

      <NuxtLink
        to="/gerador-cpf"
        class="text-md hidden cursor-pointer text-black-400 transition-all duration-150 hover:text-primary-500 md:inline-block"
      >
        Gerador de CPF
      </NuxtLink>

      <NuxtLink
        to="/gerador-cnpj"
        class="text-md hidden cursor-pointer text-black-400 transition-all duration-150 hover:text-primary-500 md:inline-block"
      >
        Gerador de CNPJ
      </NuxtLink>

      <NuxtLink
        to="/gerador-qr-code"
        class="text-md hidden cursor-pointer text-black-400 transition-all duration-150 hover:text-primary-500 md:inline-block"
      >
        Gerador de QR Code
      </NuxtLink>

      <a
        title="Acessar canal no Youtube"
        href="https://www.youtube.com/channel/UCOkZkn7IzpbHkLxFsy4LyCg"
        target="_blank"
        class="ml-4"
      >
        <Icon
          name="entypo-social:youtube"
          size="1.5em"
          class="text-red-600 transition-all duration-150 hover:text-red-500"
        />
      </a>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.router-link-active {
  @apply text-primary-500;
}
</style>
