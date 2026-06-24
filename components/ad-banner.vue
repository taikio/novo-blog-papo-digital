<script lang="ts" setup>
declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

const props = defineProps<{
  adSlot: string
  adLayoutKey?: string
}>()

const isInFeed = computed(() => !!props.adLayoutKey)

onMounted(() => {
  ;(window.adsbygoogle = window.adsbygoogle || []).push({})
})
</script>

<template>
  <ins
    class="adsbygoogle"
    style="display: block"
    data-ad-client="ca-pub-4727865344641486"
    :data-ad-slot="adSlot"
    :data-ad-format="isInFeed ? 'fluid' : 'auto'"
    :data-ad-layout-key="adLayoutKey"
    :data-full-width-responsive="isInFeed ? undefined : 'true'"
  />
</template>
