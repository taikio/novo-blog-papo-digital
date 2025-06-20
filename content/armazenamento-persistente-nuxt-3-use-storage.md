---
title: Armazenamento persistente no Nuxt 3 com useStorage
lowercaseTitle: armazenamento persistente no nuxt 3 com usestorage
description: Neste post, vamos explorar a fundo como funciona o composable `useStorage` e como você pode utilizá-lo em diferentes situações, desde caches rápidos até armazenamento persistente em Redis, S3 ou até no seu próprio sistema de arquivos.
cover: cover-armazenamento-persistente-use-storage.png
coverAlt: Armazenamento persistente no Nuxt 3 com useStorage
publishDate: 2025-06-20T12:30:00.003Z
tag: NuxtJS
---

Se você já desenvolveu alguma aplicação full-stack com Nuxt 3, já deve ter percebido a importância de lidar com armazenamento de dados, especialmente no contexto de APIs e funções server-side. É aí que entra o composable `useStorage`, uma solução elegante e poderosa que o Nuxt oferece nativamente para gerenciar armazenamento chave-valor (KV).

Neste post, vamos explorar a fundo como funciona o composable `useStorage` e como você pode utilizá-lo em diferentes situações, desde caches rápidos até armazenamento persistente em Redis, S3 ou até no seu próprio sistema de arquivos.

# O que é o useStorage do Nuxt 3?

O `useStorage` é uma API que faz parte do Nuxt 3 e utiliza o pacote [unstorage](https://github.com/unjs/unstorage) para abstrair diferentes tipos de armazenamento em uma camada simples e flexível.

Diferente do `useStorage` do VueUse, que atua apenas no lado cliente (localStorage/sessionStorage), o composable do Nuxt opera no contexto do servidor, permitindo a persistência e compartilhamento de dados entre requisições.

# Como o useStorage funciona internamente?

Por trás do composable, o Nuxt utiliza o Nitro para gerenciar o armazenamento, oferecendo diversas opções:

- **Memória (`memory:`)**: Perfeito para dados voláteis e caches rápidos.
- **Sistema de Arquivos (`file:`)**: Utilizado principalmente em ambiente de desenvolvimento para facilitar debugging.
- **Drivers externos**: Redis, S3, Cloudflare KV, e outros serviços configuráveis através do `defineNitroConfig`.

Por padrão, `useStorage()` sem parâmetros utiliza a memória, ideal para ambientes efêmeros como funções serverless. Contudo, você pode especificar um “mountpoint” para persistir dados, como por exemplo `useStorage('data')`, que cria uma pasta `.data/kv` no build final.

# Configurando o Armazenamento no Nuxt 3

Vamos ver um exemplo prático de configuração utilizando Redis como armazenamento persistente:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    storage: {
      sessions: { driver: 'redis', url: 'redis://localhost:6379' },
    },
  },
})
```

Com essa configuração, sempre que você utilizar `useStorage('sessions')`, o Nuxt utilizará Redis automaticamente.

# Aplicações práticas do useStorage

# 1. Cache de respostas HTTP

É possível combinar `useStorage` com o `defineCachedEventHandler` para armazenar temporariamente as respostas e acelerar as APIs:

```typescript
// server/api/cache-demo.ts
export default defineCachedEventHandler(
  async () => {
    const data = await $fetch('https://api.thirdparty.com/data')
    return data
  },
  { maxAge: 300 },
) // 5 minutos
```

# 2. Fluxos de Autenticação OAuth

Muito útil para armazenar estados temporários ou tokens entre etapas de autenticação:

```typescript
// server/api/oauth.ts
export default defineEventHandler(async (event) => {
  const { code, state } = await readBody(event)
  const storage = useStorage('sessions')

  if (code) {
    const verifier = await storage.getItem<string>(`verifier:${state}`)
    // Troque o código por um token...
    return { success: true }
  } else {
    const codeVerifier = generateRandomString()
    await storage.setItem(`verifier:${state}`, codeVerifier)
    return { state, url: getAuthUrl(state, codeVerifier) }
  }
})
```

# 3. Upload de Arquivos

Crie buckets personalizados para armazenar blobs de arquivos ou metadados usando drivers como R2 ou S3:

```typescript
const uploads = useStorage('uploads')
await uploads.setItem('file-id', fileData)
```

# 4. Sessões Customizadas

Controle sessões mais detalhadamente do que usando apenas cookies:

```typescript
const sessions = useStorage('sessions')
await sessions.setItem(sessionId, sessionData)
```

# 5. Estado compartilhado em funções serverless

Permite armazenar pequenas quantidades de dados compartilhados entre chamadas serverless sem necessidade de montar um banco de dados completo.

# Armazenamento em Memória vs. Persistente

- **Memória:** Ideal para caches e dados temporários. Volátil, especialmente útil em ambientes serverless.
- **Persistente:** Armazena dados de forma durável, podendo ser feito através do sistema de arquivos, Redis, ou serviços de cloud storage.

# Conclusão

O `useStorage` no Nuxt 3 oferece flexibilidade, facilidade e performance, permitindo desde o armazenamento transitório até soluções robustas com persistência externa. Isso elimina a complexidade de gerenciar múltiplos bancos de dados e simplifica o seu código significativamente.

Agora que você entende o poder dessa API, já pode começar a implementá-la em seus projetos Nuxt 3 e explorar todas as vantagens do armazenamento chave-valor do Nitro.

Espero que este post tenha sido útil. Até a próxima! 😉
