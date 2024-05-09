import type { MarkdownParsedContent } from '@nuxt/content/dist/runtime/types'

export interface PostContent extends MarkdownParsedContent {
  lowercaseTitle: string // used in search functionality
  cover: string // post cover image
  coverAlt: string // alternative text to cover image
  publishDate: Date
  tag: string
}
