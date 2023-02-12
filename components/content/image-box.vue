<script setup lang="ts">
const props = defineProps({
  image: {
    type: String,
    required: true,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
})

const imagePath = computed(() => (props.image ? `/post-gallery/${props.image}` : ''))
</script>

<template>
  <figure v-if="imagePath" class="w-full rounded-sm border border-slate-100">
    <img :src="imagePath" :alt="alt" class="w-full rounded-sm" />
  </figure>
</template>
