---
title: Gerenciamento de Estado no Nuxt 3 com Pinia
lowercaseTitle: gerenciamento de estado no nuxt 3 com pinia
description: Se você está desenvolvendo uma aplicação com Nuxt 3, o gerenciamento de estado é uma parte crucial para manter a consistência dos dados. Neste post, vou te mostrar como configurar o Pinia no Nuxt 3 e gerenciar o estado de forma eficiente.
cover: cover_post_gerenciamento_estado_nuxt.png
coverAlt: Gerenciamento de Estado no Nuxt 3 com Pinia
publishDate: 2024-08-23T14:30:00.003Z
tag: NuxtJS
---

Se você está desenvolvendo uma aplicação com Nuxt 3, o gerenciamento de estado é uma parte crucial para manter a consistência dos dados. O Pinia é a solução ideal para isso, especialmente quando integrado corretamente ao Nuxt 3. Neste post, vou te mostrar como configurar o Pinia no Nuxt 3 e gerenciar o estado de forma eficiente.

# Configurando o Pinia no Nuxt 3

Primeiramente você precisa instalar o módulo Nuxt Pinia, pois é este módulo que garante que a integração entre o Pinia e o Nuxt funcionará corretamente:

```bash
npx nuxi@latest module add pinia
```

Em seguida verifique se o módulo foi adicionado corretamente no arquivo `nuxt.config.ts`, ele deve estar assim:

```javascript
export default defineNuxtConfig({
  // ... other options
  modules: [
    // ...
    '@pinia/nuxt',
  ],
})
```

Dependendo da versão do Nuxt que você estiver usando pode ser que ao tentar instalar este módulo ocorra o erro _ERESOLVE unable to resolve dependency tree error_. Para corrigi-lo é preciso fazer o seguinte ajuste no arquivo `package.json`:

```json
"overrides": {
  "vue": "latest"
}
```

O módulo Nuxt Pinia já importa automaticamente todas as stores que estejam dentro da pasta `stores`, porém por padrão isso só se aplica para os arquivos que estejam na raiz da pasta stores. É possível mudar este comportamento ajustando a configuração do módulo dentro do arquivo `nuxt.config.ts`:

```javascript
export default defineNuxtConfig({
  // ... other options
  modules: ['@pinia/nuxt'],
  pinia: {
    storesDirs: ['./stores/**'],
  },
})
```

# Criando uma Store

Agora para garantir que esteja tudo funcionando, crie uma store bem simples como esta:

```javascript
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++
    },
  },
})
```

Repare que no código acima o composable `defineStore` não precisou ser importado, isso acontece porque o próprio módulo faz o import automático de algumas coisas, como por exemplo: defineStore(), storeToRefs(), acceptHMRUpdate().

# Acessando a Store

Para usar a store em um componente é muito simples, basta fazer o seguinte:

```vue
<template>
  <div>
    <h1>{{ count }}</h1>
    <button @click="increment">Incrementar</button>
  </div>
</template>

<script setup>
const store = useCounterStore()
const { count, increment } = store
</script>
```

# Tópico Bônus: Persistindo os dados da store no localStorage

É possível salvar os dados das suas stores no `localStorage` ou em `cookies` para evitar que os dados sejam perdidos quando o usuário atualizar a página. Para fazer isso é preciso instalar um módulo adicional que estenderá as funcionalidades do módulo Nuxt Pinia:

```bash
npm i -D @pinia-plugin-persistedstate/nuxt
```

Agora adicione o módulo no arquivo `nuxt.config.ts`:

```javascript
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
})
```

Após esta configuração você pode voltar na `useCounterStore` e adicionar a propriedade `persist` para indicar que os dados desta store devem ser persistidos:

```javascript
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++
    },
  },
  persist: true,
})
```

Por padrão os dados das stores são armazenados no localStorage, mas é possível definir outro tipo de armazenamento, como cookies ou sessionStorage:

```javascript
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++
    },
  },
  persist: {
    storage: persistedState.cookiesWithOptions({
      sameSite: 'strict',
    }),
  },
})
```

E aí está! Agora você tem uma configuração básica de gerenciamento de estado com Pinia no Nuxt 3, e persistindo o estado das stores no localStorage.

Espero que tenha gostado! 😉
