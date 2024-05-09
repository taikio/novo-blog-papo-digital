<script setup lang="ts">
import { ref } from 'vue'
import type { PostContent } from '@/models/post-content'
const isSuggestionsVisible = ref(false)
const outsideClickListener = ref<EventListener | null>(null)
const searchQuery = ref('')
const searchResult = ref<PostContent[]>([])
const router = useRouter()

const openSuggestions = () => {
  isSuggestionsVisible.value = true
}

const onOverlayEnter = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event: any) => {
      const elementId = event.target.id
      console.log('element', event.target)
      if (elementId !== 'search-bar-input') {
        isSuggestionsVisible.value = false
      }
    }
    document.addEventListener('click', outsideClickListener.value)
  }
}

const onOverlayLeave = () => {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener.value)
    outsideClickListener.value = null
  }
}

const applySearch = async () => {
  if (searchQuery.value.length <= 0) {
    searchResult.value = []
    return
  }
  const lowercaseSearch = searchQuery.value.toLocaleLowerCase()

  searchResult.value = await queryContent<PostContent>()
    .where({ lowercaseTitle: { $contains: lowercaseSearch } })
    .limit(6)
    .sort({ publishDate: -1 })
    .find()
}

const applySearchDebouced = useDebounce(applySearch, 400)

const openPost = (post: PostContent) => {
  const slug = post._path as string
  router.push(`/blog${slug}`)
}

onBeforeUnmount(() => {
  onOverlayLeave()
})
</script>

<template>
  <div class="relative w-full">
    <span class="absolute left-3 top-[0.60rem] md:top-[0.82rem]">
      <Icon
        name="feather:search"
        class="duration-50 text-lg text-black-400 transition-all md:text-2xl"
        :class="{ 'text-primary-500': isSuggestionsVisible }"
      />
    </span>
    <input
      id="search-bar-input"
      type="text"
      v-model="searchQuery"
      placeholder="Pesquisar..."
      autocomplete="off"
      class="b-gray-500 duration-50 w-full rounded-xl border py-2 pl-9 pr-2 text-sm shadow-lg transition-all focus:outline-none focus:ring focus:ring-primary-500 md:py-3 md:pl-12 md:pr-4 md:text-xl"
      @focus="openSuggestions"
      @input="applySearchDebouced"
    />

    <Transition
      name="suggestions__overlay"
      @enter="onOverlayEnter"
      @leave="onOverlayLeave"
    >
      <div
        v-if="isSuggestionsVisible"
        class="b-gray-500 duration-50 absolute left-0 top-9 z-10 mt-2 h-40 max-h-96 w-full divide-y divide-solid overflow-auto rounded-xl border bg-white p-3 shadow-lg transition-all md:top-14 md:p-4"
      >
        <div
          v-for="post in searchResult"
          :key="post._path"
          class="cursor-pointer p-2 text-sm hover:text-primary-500 md:p-3 md:text-xl"
          @click="openPost(post)"
        >
          {{ post.title }}
        </div>
      </div>
    </Transition>
  </div>
</template>
~/models/post-content
