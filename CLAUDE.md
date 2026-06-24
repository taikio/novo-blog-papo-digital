# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # development server at http://localhost:3000
npm run build      # production build (SSR)
npm run generate   # static site generation
npm run preview    # preview production build
```

No test runner is configured. There are no lint scripts defined in package.json; the project uses `.eslintrc.js` and `.prettierrc` but they must be invoked directly (`npx eslint .` / `npx prettier --check .`).

## Architecture

**Nuxt 3 blog** (`papodigital.net.br`) — primarily a content-driven blog with a few interactive utility pages.

### Content layer (`@nuxt/content`)

Blog posts live in `content/` as Markdown files. Each file requires these frontmatter fields:

```yaml
title: string
lowercaseTitle: string   # used for client-side search matching
description: string
cover: string            # filename in public/post-cover/
coverAlt: string
publishDate: ISO date string
tag: string              # category tag (single tag per post)
```

The `PostContent` type in `models/post-content.ts` extends `MarkdownParsedContent` with these fields. Blog posts are queried via `queryContent<PostContent>()` — always sorted by `publishDate: -1`.

Post images go to `public/post-cover/` (cover images) and `public/post-gallery/` (inline images).

### Pages

- `pages/index.vue` — home listing with infinite scroll, tag filtering, and Google AdSense block
- `pages/blog/[slug].vue` — individual post via `<ContentDoc>` + `<ContentRenderer>` with full SEO meta
- `pages/gerador-*.vue` — utility tool pages (CPF, CNPJ, QR code, fake person data)

### SEO

`utils/generateMeta.ts` returns the full Open Graph + Twitter Card meta array. Pass `overrides` to customize per-page. Used in `nuxt.config.ts` (global head) and `pages/index.vue` (`useHead`). Individual blog posts set their own meta inline inside `<ContentDoc>` slot.

### Sitemap

`server/routes/sitemap.xml.ts` — generates the sitemap at build time via Nuxt Content's `serverQueryContent`. Pre-rendered by the nitro config in `nuxt.config.ts`.

### Custom Tailwind colors

The project uses a custom palette — use these tokens rather than generic Tailwind colors:

- `primary-{100–500}` — cyan/teal (`rgba(57, 188, 209, …)`)
- `dark-purple-{100–500}` — indigo (`rgba(54, 57, 115, …)`)
- `midnight-{100–500}` — deep purple (`rgba(57, 52, 89, …)`)
- `secondary-{100–500}` — steel blue
- `black-{400,500}` — semi-transparent blacks
- `gray-{100–500}` — custom gray scale

`@tailwindcss/typography` is included; blog post prose uses `prose` + overrides in `tailwind.config.js` (removes `code::before`/`code::after` quotes).

### Client-only plugins

- `plugins/qrcode.client.ts` — registers `qr-code-styling` for the QR code generator page
- `plugins/vue-toastification.client.ts` — toast notifications

### Composables

- `useInfiniteScroll(sentinel, callback)` — wraps `IntersectionObserver` for the home page post feed
- `useDebounce` — used by the search bar
- `useBrazilianStates` / `useCnpjAlfa` — helpers for the utility tool pages

### Google AdSense

AdSense is loaded globally in `nuxt.config.ts` `app.head.script` and ad slots are placed inline in template sections of some pages. The AdSense publisher ID is `ca-pub-4727865344641486`.
