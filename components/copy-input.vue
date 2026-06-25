<script lang="ts" setup>
const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  copy: []
}>()

const handleCopy = () => {
  if (!props.modelValue) return
  navigator.clipboard.writeText(props.modelValue)
  emit('copy')
}
</script>

<template>
  <div class="relative mt-8 w-full">
    <span
      class="duration-50 absolute top-[0.60rem] right-3 text-black-400 transition-all hover:cursor-pointer hover:text-primary-500 md:top-[0.82rem]"
      @click="handleCopy"
    >
      <Icon name="feather:copy" class="text-lg md:text-2xl" />
    </span>
    <input
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      autocomplete="off"
      readonly
      class="b-gray-500 duration-50 w-full rounded-xl border py-2 pr-9 pl-2 text-sm shadow-lg transition-all focus:outline-none focus:ring focus:ring-primary-500 md:py-3 md:pr-12 md:pl-4 md:text-xl"
    />
  </div>
</template>
