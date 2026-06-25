<script lang="ts" setup>
defineProps<{
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    class="rounded-xl border border-primary-500 bg-primary-500 py-2 px-6 text-lg text-white transition-all duration-200 hover:shadow-lg md:px-3 md:text-xl"
  >
    <slot />
  </button>
</template>
