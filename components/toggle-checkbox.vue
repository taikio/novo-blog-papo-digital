<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean
  label: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <div
    class="flex cursor-pointer items-center gap-4 rounded-md border py-2 px-4 hover:border-primary-500 hover:bg-primary-100"
    :class="{
      'border-primary-500 bg-primary-100 text-primary-500': modelValue,
      'text-black-400': !modelValue,
    }"
    @click="emit('update:modelValue', !modelValue)"
  >
    <Icon
      :name="modelValue ? 'feather:check-square' : 'feather:square'"
      class="text-lg"
    />
    <span class="text-lg md:text-xl">{{ label }}</span>
  </div>
</template>
