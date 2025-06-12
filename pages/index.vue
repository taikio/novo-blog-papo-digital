<script lang="ts" setup>
import generateMeta from '@/utils/generateMeta'
import SearchBar from '@/components/search-bar.vue'
import { formatDate } from '@/utils/datetime'
import type { PostContent } from '@/models/post-content'

const router = useRouter()
const activeTag = ref('Todos')
const tagsList = ref([''])

// Add these new reactive variables
const currentPage = ref(1)
const postsPerPage = ref(5)
const isLoading = ref(false)
const allPostsLoaded = ref(false)
// End of new variables

useHead({
  title: 'Blog Papo Digital',
  meta: generateMeta(),
})

const { data: posts } = await useAsyncData('posts', () => {
  return queryContent<PostContent>()
    .only(['_path', 'title', 'tag', 'cover', 'publishDate', 'description'])
    .sort({ publishDate: -1 })
    .limit(5) // Added limit here
    .find()
})

const handleScroll = () => {
  // Check if posts ref and its value exist
  if (!posts.value) return;

  const offset = 100; // Trigger load more when 100px from the bottom
  const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight - offset;

  if (bottomOfWindow && !isLoading.value && !allPostsLoaded.value) {
    loadMorePosts();
  }
};

onMounted(() => {
  const postsTags = posts.value?.map((post) => post.tag).sort() ?? []
  postsTags.unshift('Todos')
  tagsList.value = Array.from(new Set(postsTags))

  window.addEventListener('scroll', handleScroll); // Added event listener
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const formatPublishDate = (publishDate: Date) => {
  return formatDate(publishDate)
}

const loadMorePosts = async () => {
  if (isLoading.value || allPostsLoaded.value) return;

  isLoading.value = true;

  // We want to load the page *after* the current one.
  // So, if currentPage.value is 1, we are fetching posts for page 2.
  // The items to skip are those from page 1.
  // Skip = currentPage.value * postsPerPage.value
  const postsToSkip = currentPage.value * postsPerPage.value;

  let query = queryContent<PostContent>()
    .only(['_path', 'title', 'tag', 'cover', 'publishDate', 'description'])
    .sort({ publishDate: -1 })
    .skip(postsToSkip)
    .limit(postsPerPage.value);

  if (activeTag.value !== 'Todos' && activeTag.value) {
    query = query.where({ tag: { $eq: activeTag.value } });
  }

  try {
    const newPosts = await query.find();

    if (newPosts && newPosts.length > 0) {
      if (posts.value) {
        posts.value.push(...newPosts);
        currentPage.value++; // Increment current page *after* successful fetch
      } else {
        // This case should ideally not be hit if initial posts are loaded correctly
        posts.value = newPosts;
        currentPage.value++; // Still increment as we've loaded a page
      }
    } else {
      allPostsLoaded.value = true; // No more posts found
    }
  } catch (error) {
    console.error("Error fetching more posts:", error);
    // Potentially set an error ref here to display to the user
  } finally {
    isLoading.value = false;
  }
};

const openPost = (postPath: string) => {
  router.push(`/blog${postPath}`)
}

const getTagClasses = (tag: string) => {
  if (tag === activeTag.value) {
    return 'bg-primary-500 text-white'
  }
  return 'text-primary-500'
}

const toggleActiveTag = async (tag: string) => {
  activeTag.value = tag;
  currentPage.value = 1; // Reset to page 1
  allPostsLoaded.value = false; // Reset all posts loaded flag
  isLoading.value = true; // Indicate loading

  let query = queryContent<PostContent>()
    .only(['_path', 'title', 'tag', 'cover', 'publishDate', 'description'])
    .sort({ publishDate: -1 })
    .limit(postsPerPage.value); // Load only the first page

  if (tag !== 'Todos') {
    query = query.where({ tag: { $eq: tag } });
  }

  try {
    const newPosts = await query.find();
    posts.value = newPosts; // Replace current posts

    // If the number of posts fetched is less than postsPerPage,
    // it means all posts for this tag have been loaded.
    if (newPosts.length < postsPerPage.value) {
      allPostsLoaded.value = true;
    }
  } catch (error) {
    console.error("Error toggling active tag:", error);
    posts.value = []; // Clear posts on error or handle appropriately
  } finally {
    isLoading.value = false; // Reset loading state
  }
};
</script>

<template>
  <div>
    <header class="z-20 flex w-full flex-col-reverse px-8 pt-2 md:flex-row">
      <div class="mt-4 md:mt-40">
        <h2 class="text-2xl text-dark-purple-500 md:text-4xl">
          Um Blog voltado para a comunidade dev
        </h2>

        <p class="text-md my-3 text-black-400 md:my-8 md:text-lg">
          Bem vindo(a) ao Blog Papo Digital! <br />
          Aqui você terá acesso a informações e tutoriais sobre tecnologia,
          programação e boas dicas sobre Carreira Tech
        </p>
      </div>

      <img
        src="/undraw_In_the_office.png"
        alt=""
        class="mx-auto w-10/12 md:w-5/12"
      />
    </header>

    <!-- ===== search bar container ===== -->
    <section
      class="flex w-full flex-col items-center px-8 py-4 md:px-40 md:py-2"
    >
      <search-bar />

      <!-- ===== tags container ===== -->
      <div class="w-full py-1">
        <button
          type="button"
          v-for="tag in tagsList"
          :key="tag"
          class="mx-2 my-2 inline-block rounded-xl border border-primary-500 px-2 py-1 text-xs transition-all duration-200 hover:bg-primary-500 hover:text-white hover:shadow-lg md:px-3 md:text-sm"
          :class="getTagClasses(tag)"
          @click="toggleActiveTag(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </section>

    <!-- ===== posts list ===== -->
    <section class="flex w-full flex-col gap-6 px-8 pb-2 pt-6">
      <article
        v-for="post in posts"
        :key="post._path"
        class="group flex h-96 w-full flex-col gap-1 rounded-xl border border-gray-100 transition-all duration-150 hover:cursor-pointer hover:shadow-xl md:h-80 md:flex-row md:gap-4"
        @click="openPost(post._path)"
      >
        <div
          :style="{ backgroundImage: `url(/post-cover/${post.cover})` }"
          class="h-44 w-full rounded-tl-xl rounded-tr-xl bg-cover bg-top bg-no-repeat md:h-auto md:w-4/12 md:rounded-xl"
        ></div>

        <div class="relative flex w-full flex-col px-2 py-2 md:w-8/12 md:px-0">
          <span class="mb-1 text-xs text-midnight-500 md:text-lg">{{
            post.tag
          }}</span>
          <h3
            class="text-sm font-semibold group-hover:text-primary-500 md:text-3xl"
          >
            {{ post.title }}
          </h3>

          <p
            class="my-4 h-24 overflow-y-hidden text-ellipsis text-xs text-black-400 md:h-36 md:text-lg"
          >
            {{ post.description }}
          </p>
          <span
            class="absolute bottom-3 left-2 text-xs text-black-400 md:left-0 md:text-lg"
            >{{ formatPublishDate(post.publishDate) }}</span
          >
        </div>
      </article>
    </section>

    <!-- ===== Loading Indicator ===== -->
    <div v-if="isLoading" class="flex justify-center py-4">
      <p class="text-lg text-gray-500">Carregando mais posts...</p>
    </div>

    <!-- Optional: "No more posts" message -->
    <div v-if="allPostsLoaded && !isLoading" class="flex justify-center py-4">
      <p class="text-lg text-gray-500">Você chegou ao fim!</p>
    </div>
  </div>
</template>
~/models/post-content
