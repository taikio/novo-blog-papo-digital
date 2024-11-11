---
title: Testando aplicações Nuxt 3 com Vitest
lowercaseTitle: testando aplicações nuxt 3 com vitest
description: O Nuxt 3, por ser um framework mais opinativo, traz algumas particularidades em relação à configuração de ferramentas como o Vitest. Neste post, vou te mostrar como configurar e realizar testes em uma aplicação Nuxt 3 usando o Vitest, uma ferramenta de testes rápida e simples baseada no Vite.
cover: cover_post_vitest_nuxt_3.png
coverAlt: Testando aplicações Nuxt 3 com Vitest
publishDate: 2024-11-11T14:30:00.003Z
tag: NuxtJS
---

O Nuxt 3, por ser um framework mais opinativo, traz algumas particularidades em relação à configuração de ferramentas como o Vitest. 
Neste post, vou te mostrar como configurar e realizar testes em uma aplicação Nuxt 3 usando o Vitest, uma ferramenta de testes rápida e simples baseada no Vite.

# Por que usar Vitest no Nuxt 3?

O Vitest é uma excelente opção para testes unitários em projetos Vite-based, como o Nuxt 3.
Ele é rápido, possui uma API similar ao Jest, e se integra facilmente ao ambiente Nuxt.
Embora o Nuxt 3 já tenha o Vite integrado, a configuração do Vitest é um pouco diferente, isso porque o Nuxt possui uma arquitetura diferente de um projeto VueJS puro.

Vamos ao passo a passo da instalação e configuração!

# 1. Instalando o Vitest

Caso você ainda não tenha um projeto Nuxt criado, pode criar um executando o comando abaixo:

```bash
npx nuxi@latest init <nome-do-projeto>
```

Primeiramente é necessário instalar o Vitest e suas dependências. Use o comando abaixo para adicionar o Vitest ao seu projeto Nuxt 3:

```bash
npm install -D vitest @vue/test-utils happy-dom
```

Além disso, será necessário instalar um módulo do Nuxt específico para configurar o ambiente de testes:

```bash
npm install -D @nuxt/test-utils
```

É importante que o ambiente de testes seja configurado através deste módulo para garantir que ao rodar os testes, a instância do NuxtApp seja
inicializada e os plugins e módulos sejam devidamente carregados.

# 2. Configurando o Vitest no Nuxt 3

Após instalar o módulo `@nuxt/test-utils` será necessário registrá-lo na lista de módulos dentro do arquivos `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  // Outras configurações do Nuxt...
  modules: ['@nuxt/test-utils/module']
})
```

Em seguida será necessário criar o arquivo `vitest.config.ts` na raíz do projeto com as seguintes configurações:

```typescript
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
	  environment: 'nuxt'
  }
})
```

# 4. Escrevendo o Primeiro Teste

Agora que a configuração do Vitest está pronta, vamos criar nosso primeiro teste para verificar se está tudo funcionando corretamente.

Crie uma pasta chamada `components` e dentro dela crie o componente `Counter.vue` com o seguinte código:

```vue
<template>
  <div>
    <h1>{{ count }}</h1>
    <button @click="increment">Incrementar</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++
</script>
```

Agora crie um arquivo de testes dentro da pasta `components` chamdado `Counter.test.ts`:

```typescript
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import Counter from '@/components/Counter.vue'

describe('Counter.vue', () => {
  it('incrementa o valor do contador ao clicar no botão', async () => {
    const wrapper = await mountSuspended(Counter)
    expect(wrapper.text()).toContain('0')

    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toContain('1')
  })
})
```

Esse teste verifica se o valor exibido no contador é incrementado corretamente ao clicar no botão.

Repare que em vez de importar o método `mount` de dentro do `vue-test-utils` estamos importando o método `mountSuspended` de dentro do módulo 
`@nuxt/test-utils`. É necessário fazer desta forma para garantir que ao montar um componente, os módulos e plugins sejam devidamente carregados
e suas instâncias sejam providas para o componente montado. Entretanto, saiba que o mountSuspended disponibiliza os mesmos recursos que o mount.

# 5. Rodando os Testes

Para rodar os testes, basta executar o comando:

```bash
npx vitest
```

Você verá a interface do Vitest executando os testes e exibindo os resultados no terminal.

Agora para finalizar vamos criar dois comandos novos na sessão scripts do arquivo `package.json` para facilitar a execução dos testes:

```json
"scripts": {
  // ...outros scripts
  "test:dev": "vitest",
  "test": "vitest run"
}
```

O primeiro comando deve ser usado enquanto você estiver escrevendo seus testes, pois ele fica observando as alterações nos arquivos e rodando
novamente os testes referente aos arquivos alterados. Já o segundo vai rodar os testes uma única vez, então, ele é mais indicado para ser 
acionado por uma Pipeline de CI.

# Conclusão

A configuração do Vitest em uma aplicação Nuxt 3 é bastante simples graças ao módulo `@nuxt/test-utils` que já fornece as configurações necessárias. 
Seguindo este tutorial, você já pode começar a testar seus componentes de forma eficiente e rápida. 
O Vitest oferece uma performance incrível e, por ser semelhante ao Jest, é fácil de usar para quem já tem experiência com testes unitários.

Se quiser se aprofundar mais neste assunto, sugiro que dê uma conferida na [Documentação do Nuxt](https://nuxt.com/docs/getting-started/testing)
e também na [Documentação do Vitest](https://vitest.dev/guide/)

Agora é sua vez de explorar o poder do Vitest nos seus projetos Nuxt 3!

Espero que este post tenha sido útil. Até a próxima ;)
