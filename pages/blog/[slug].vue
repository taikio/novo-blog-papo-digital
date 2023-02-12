<script lang="ts" setup>
import { formatDate } from '@/utils/datetime'

const route = useRoute()
const postPath = computed(() => route.params.slug as string)

const formatPublishDate = (publishDate: Date) => {
  return formatDate(publishDate)
}
</script>

<template>
  <main>
    <ContentDoc :path="postPath" v-slot="{ doc }">
      <Head>
        <Title>{{ doc.title }}</Title>
        <Meta name="description" :content="doc.description" />
        <!-- General social media meta tags (Open Graph) -->
        <Meta property="og:type" content="article" />
        <Meta property="og:url" :content="`https://www.papodigital.net.br${doc._path}`" />
        <Meta property="og:title" :content="doc.title" />
        <Meta property="og:description" :content="doc.description" />
        <Meta property="og:image" :content="`/post-cover/${doc.cover}`" />
        <Meta property="og:image:width" content="740" />
        <Meta property="og:image:height" content="300" />

        <!-- Twitter card meta tags -->
        <Meta name="twitter:site" content="Papo Digital" />
        <Meta name="twitter:card" content="summary_large_image" />
        <Meta name="twitter:url" :content="`https://www.papodigital.net.br${doc._path}`" />
        <Meta name="twitter:title" :content="doc.title" />
        <Meta name="twitter:description" :content="doc.description" />
        <Meta name="twitter:image" :content="`/post-cover/${doc.cover}`" />
      </Head>

      <img :src="`/post-cover/${doc.cover}`" :alt="doc.coverAlt" class="w-full" />
      <!-- ==== post header container ==== -->
      <div class="mx-auto w-9/12">
        <h1 class="my-4 text-xl font-semibold text-black-500 md:text-3xl">
          {{ doc.title }}
        </h1>

        <p class="text-lg text-black-400">
          Data de Publicação: {{ formatPublishDate(doc.publishDate) }}
        </p>

        <p class="mt-2 mb-4 text-lg text-dark-purple-500">
          {{ doc.tag }}
        </p>
      </div>

      <ContentRenderer
        class="prose mx-auto w-9/12 max-w-none prose-headings:text-black-400 prose-h1:mb-3 prose-h1:text-2xl prose-h1:font-semibold prose-p:my-2 prose-p:text-lg prose-figure:my-5 prose-pre:text-slate-100"
        :value="doc"
      />
    </ContentDoc>
  </main>
</template>
