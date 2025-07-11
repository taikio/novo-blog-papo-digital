---
title: Scroll Infinito Simples e Robusto com Vue 3 e IntersectionObserver
lowercaseTitle: scroll infinito simples e robusto com vue 3 e intersectionObserver
description: Aprenda a criar um scroll infinito moderno e eficiente usando Vue 3 e a API IntersectionObserver. Este tutorial mostra como construir um composable reutilizável e integrá-lo em sua aplicação.
tag: VueJS
cover: cover-post-scroll-infinito.png
coverAlt: Scroll infinito com vue 3 e intersection observer
publishDate: 2025-07-11T10:00:00.000Z
---

O scroll infinito é um recurso muito útil para melhorar a navegação em listas extensas, como posts de blog ou resultados de busca. Porém, implementá-lo da forma tradicional — utilizando cálculos manuais e eventos de scroll — pode gerar bastante dor de cabeça e afetar a performance da aplicação.

Neste tutorial, vamos criar uma solução moderna e elegante com Vue 3 utilizando o `IntersectionObserver`, evitando os principais problemas das abordagens manuais. Você aprenderá a criar um composable reutilizável e como integrá-lo facilmente em seus componentes Vue.

# Por que usar o IntersectionObserver?

O `IntersectionObserver` é uma API nativa dos browsers que permite detectar quando um elemento entra ou sai da viewport. Ele traz diversos benefícios:

- Evita cálculos manuais de altura e rolagem da página
- Melhora a performance ao evitar event listeners de scroll que disparam constantemente
- Permite ajustes finos com `rootMargin` e `threshold`

# Criando o composable useInfiniteScroll

Comece criando um composable genérico em `~/composables/useInfiniteScroll.ts`:

```ts
import { onMounted, onUnmounted, Ref } from 'vue'

interface InfiniteScrollOptions {
  root?: HTMLElement | null
  rootMargin?: string
  threshold?: number | number[]
}

/**
 * Composable para scroll infinito usando IntersectionObserver.
 * @param sentinel Ref do elemento sentinela (último item da lista)
 * @param callback Função que será chamada ao atingir o fim da rolagem
 * @param options Configurações adicionais do Observer
 */
export function useInfiniteScroll(
  sentinel: Ref<HTMLElement | null>,
  callback: () => Promise<void>,
  options: InfiniteScrollOptions = {
    root: null,
    rootMargin: '100px',
    threshold: 0,
  },
) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback()
      }
    }, options)

    if (sentinel.value) {
      observer.observe(sentinel.value)
    }
  })

  onUnmounted(() => {
    if (observer && sentinel.value) {
      observer.unobserve(sentinel.value)
    }
  })
}
```

> Esse composable é bem versátil: você pode reutilizá-lo em qualquer lista ou componente que precise de carregamento contínuo.

# 2. Integrando o composable useInfiniteScroll em um componente Vue

No seu componente, basta importar e utilizar o `useInfiniteScroll` passando a referência para o elemento sentinel que indica o fim da rolagem.

Para que a explicação fique mais "palpável", vamos imaginar que estamos implementando scroll infinito em uma listagem de posts em um projeto que usa o módulo **Content** do Nuxt. Neste caso, ao inicializar o componente carregaremos os últimos 5 posts e a medida que o visitante rolar a página faremos o carregamento gradual dos demais posts:

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import type { PostContent } from '@/models/post-content'

const currentPage = ref(1)
const postsPerPage = ref(5)
const isLoading = ref(false)
const allPostsLoaded = ref(false)

// Dados iniciais
const { data: posts } = await useAsyncData('posts', () =>
  queryContent<PostContent>()
    .only(['title', 'tag', 'cover', 'publishDate', 'description'])
    .sort({ publishDate: -1 })
    .limit(postsPerPage.value)
    .find(),
)

const sentinel = ref<HTMLElement | null>(null)

// Scroll infinito com observer
useInfiniteScroll(
  sentinel,
  async () => {
    if (isLoading.value || allPostsLoaded.value) return

    isLoading.value = true
    const skip = currentPage.value * postsPerPage.value

    const newPosts = await queryContent<PostContent>()
      .only(['title', 'tag', 'cover', 'publishDate', 'description'])
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(postsPerPage.value)
      .find()

    if (newPosts.length) {
      posts.value.push(...newPosts)
      currentPage.value++
    } else {
      allPostsLoaded.value = true
    }

    isLoading.value = false
  },
  {
    root: null,
    rootMargin: '200px',
    threshold: 0,
  },
)
</script>
```

No template basta adicionarmos uma div com o ref _sentinel_ logo após a listagem dos posts para que o `IntersectionObserver` consiga identificar quando o visitante chegar ao final da rolagem:

```vue
<template>
  <section class="posts-container">
    <article
      v-for="post in posts"
      :key="post.title"
      class="post-item"
      @click="openPost(post)"
    >
      <!-- Card do post -->
    </article>
  </section>

  <!-- Elemento observador -->
  <div ref="sentinel" class="h-1"></div>

  <!-- Feedbacks -->
  <div v-if="isLoading" class="py-4 text-center">Carregando mais posts...</div>
  <div v-if="allPostsLoaded && !isLoading" class="py-4 text-center">
    Você chegou ao fim!
  </div>
</template>
```

# Conclusão

Implementar scroll infinito com Vue 3 nunca foi tão simples. Usando o `IntersectionObserver`, você garante um carregamento inteligente, evita códigos complexos de scroll e ainda melhora a experiência do usuário.

Aproveite esse composable em outras partes do seu projeto e ajuste os parâmetros como `rootMargin` para adaptá-lo a diferentes layouts.

Curtiu a dica? Compartilha com a galera que também trabalha com Vue!

Espero que este post tenha sido útil. Até a próxima! 😉
