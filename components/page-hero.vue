<script lang="ts" setup>
defineProps<{
  title: string
  imageSrc: string
  imageAlt: string
}>()
</script>

<template>
  <header class="z-20 flex w-full flex-col-reverse px-8 pt-2 md:flex-row">
    <div class="mt-4 md:mt-40">
      <h2 class="text-2xl text-dark-purple-500 md:text-4xl">
        {{ title }}
      </h2>
      <p class="text-md my-3 text-black-400 md:my-8 md:text-lg">
        <slot />
      </p>
    </div>
    <img
      :src="imageSrc"
      :alt="imageAlt"
      class="mx-auto w-10/12 md:w-5/12"
    />
  </header>
</template>
