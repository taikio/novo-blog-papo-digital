// /composables/useInfiniteScroll.ts
import { onMounted, onUnmounted, type Ref } from 'vue'

interface InfiniteScrollOptions {
  root?: HTMLElement | null
  rootMargin?: string
  threshold?: number | number[]
}

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
      const entry = entries[0]
      if (entry.isIntersecting) {
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
