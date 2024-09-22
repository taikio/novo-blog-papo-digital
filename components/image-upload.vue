<script setup lang="ts">
const props = defineProps<{
  initialImageUrl?: string
}>()

const emit = defineEmits<{
  (e: 'change-image', imageUrl: string | null): void
}>()

const nuxtApp = useNuxtApp()

const fileinput = ref<HTMLInputElement | null>(null)
const selectedImage = ref<string | null>(props.initialImageUrl || null)

watch(selectedImage, newImageUrl => {
  emit('change-image', newImageUrl)
})

const openFileDialog = () => {
  if (fileinput.value) {
    fileinput.value.click()
  }
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      nuxtApp.$toast.info('Tipo de arquivo não suportado!')
      return
    }
    if (file.size > 6 * 1024 * 1024) {
      nuxtApp.$toast.info('A imagem fornecida tem um tamanho maior que o permitido!')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      selectedImage.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  selectedImage.value = null
}
</script>

<template>
  <div class="image-upload">
    <!-- Caixa de diálogo retangular -->
    <div v-if="!selectedImage" class="upload-box" @click="openFileDialog">
      <div>
        <slot />
      </div>
      <input
        ref="fileinput"
        type="file"
        accept="image/jpeg, image/png, image/svg+xml"
        style="visibility: hidden; position: absolute; left: 0"
        @change="handleImageUpload"
      />
    </div>

    <!-- Círculo com a imagem selecionada -->
    <div v-else class="image-preview">
      <img :src="selectedImage" alt="Imagem selecionada" />
      <button
        type="button"
        class="absolute bottom-1 right-1 rounded border border-error-500 bg-neutral-50 p-size-nano shadow-floating"
        @click="removeImage"
      >
        <Icon name="feather:trash" size="1.3rem" class="text-red-500" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.image-upload {
  width: 100%;
  height: max-content;
  position: relative;
}

.upload-box {
  width: 100%;
  border: 1px solid rgba(196, 202, 207, 0.4);
  border-radius: 6px;
  /* background-color: rgba(57, 188, 209, 0.2); */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  cursor: pointer;
}

.image-preview {
  width: 100%;
  max-width: 24rem;
  max-height: 24rem;
  border: 1px solid rgba(196, 202, 207, 0.4);
  border-radius: 6px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.image-preview img {
  width: 100%;
  max-width: 23rem;
  max-height: 23rem;
  object-fit: fill;
}
</style>
