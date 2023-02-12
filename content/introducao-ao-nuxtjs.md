---
title: Introdução ao NuxtJS - Conheça este incrível Framework
lowercaseTitle: introdução ao nuxtjs - conheça este incrível framework
description: Se você gosta de utilizar Vuejs em seus projetos e ainda fica gastando tempo e esforço configurando a base do projeto, como roteamento e vuex store está na hora de conhecer o Nuxtjs. Este framework te entrega roteamento, vuex store, SSR, hot reloading e ainda conta com uma série de módulos que podem aumentar ainda mais o leque de recursos disponíveis.
cover: cover-introducao-nuxt.png
coverAlt: introdução nuxtjs
publishDate: 2021-07-25T19:30:00.003Z
tag: NuxtJS
---

Se você gosta de utilizar Vuejs em seus projetos e ainda fica gastando tempo e esforço configurando a base do projeto, como roteamento e vuex store está na hora de conhecer o Nuxtjs. Este framework te entrega roteamento, vuex store, SSR, hot reloading e ainda conta com uma série de módulos que podem aumentar ainda mais o leque de recursos disponíveis.

# O que é NuxtJS

Antes de falarmos mais sobre os recursos que o nuxt oferece é necessário entender o que ele é. Se trata de um framework construído sobre o ecossistema do Vuejs com o intuito de agilizar o desenvolvimento de aplicações front-end. O nuxt segue a filosofia de convenção ao invés de configuração. Sendo assim você não vai encontrar muitas configurações manuais para serem feitas, ao invés disso a documentação te orienta a seguir a estrutura de diretórios que é gerada automaticamente ao criar um novo projeto. O único arquivo de configuração que vem por padrão é o `nuxt.config.js`, neste arquivo é possível fazer configurações de build, incluir novos módulos ao projeto e até mesmo definir meta tags de SEO.

# Criando um novo projeto

Para criar um projeto nuxt é preciso ter instalado o Nodejs na versão 12 ou superior. Caso você já tenha o Nodejs instalado basta abrir seu terminal e digitar o seguinte comando:

```bash
npx create-nuxt-app nome-do-projeto
```

O CLI do nuxt te fará algumas perguntas como: Linguagem padrão a ser utilizada (Javascript ou Typescript), quais ferramentas de linting devem ser adicionadas, qual framework de UI você pretende utilizar. Para navegar entre as opções utilize as arrow keys, para marcar uma opção utilize a barra de espaço, e para prosseguir para a próxima etapa utilize Enter.

Depois de finalizar a seleção das opções o CLI irá criar a base do projeto e instalar as dependências.

# Entendendo a estrutura de diretórios

A seguir falarei um pouco sobre a estrutura de diretórios gerada pelo nuxt explicando suas respectivas responsabilidades:

# Assets

O diretório `Assets` é onde colocamos arquivos de imagem, fontes, ícones e arquivos de `CSS` globais da aplicação

# Components

Como o próprio nome já diz, aqui é onde devem ficar os componentes da aplicação. O nuxt consegue fazer o import destes componentes automaticamente, para isso basta adicionar a propriedade `components: true` no arquivo `nuxt.config.js`

# Layouts

O nuxt nos permite criar um ou mais layouts base para as páginas, sendo que se criarmos um arquivo `default.vue` todas as páginas utilizarão este layout como base. Para alterar o layout de uma página basta declarar a propriedade `layout` apontando para o nome do layout a ser utilizado. EX:

```javascript
export default {
  ...
  layout: 'custom-layout'
}
```

A utilização de layouts nos ajuda a inserir um componente em todas as páginas da aplicação, como menus e topbars.

Também é possível criar um arquivo `error.vue` para ser exibido sempre que ocorrer um erro na aplicação, seja um erro de comunicação com a API ou talvez o usuário tentou acessar uma página que não existe.

Vale lembar que este diretório não é criado automaticamente pelo CLI

# Pages

Aqui é onde a mágica do roteamento acontece. Todos os arquivos `.vue` são reconhecidos como uma rota, sendo assim, se criarmos um arquivo `blog.vue` teremos uma rota `/blog` disponível na aplicação. Além disso podemos utilizar rotas dinâmicas, por exemplo, supondo que queremos acessar uma página para exibir detalhes de um cadastro basta criar um arquivo `_postId.vue`. Desta forma na página blog é só fazer o redirect desta forma:

```javascript
this.$router.push(`/blog/${postId}`)
```

Vale ressaltar que o nuxt nos permite interagir com as rotas através dos objetos `$router` e `$route`, sendo que o primeiro contém funções de redirecionamento e o segundo nos permite acessar parâmetros e queries da url.

# Static

O diretório static também serve para armazenar imagens assim como o `assets`. A diferença é que este diretório não sofre nenhuma alteração no processo de build. Além disso este diretório é mapeado automaticamente para a raiz do servidor, e para acessar os arquivos é necessário utilizar `/` como caminho relativo. Por exemplo, `static/logo.png` pode ser acessado pelo caminho `http://localhost:3000/logo.png`

# Store

O nuxt já tem o vuex instalado por padrão e para configurarmos uma store é muito simples, basta criar um arquivo com extensão `.js` ou `.ts`, ou se preferir crie um subdiretório com o nome do módulo, por exemplo: `store/posts/index.js`

# Plugins

É possível instalar bibliotecas que não expõem um módulo do nuxt através da estratégia de plugins. Por exemplo, imagine que você precisa instalar uma biblioteca de UI que não tenha integração nativa com o nuxt. Neste caso é preciso criar um arquivo `.js` ou `.ts` no diretório de plugins e fazer a configuração recomendada pela documentação da biblioteca:

```typescript [plugins/primevue.ts]
import Vue from 'vue'
import PrimeVue from 'primevue/config'
import Calendar from 'primevue/calendar'

import 'primeicons/primeicons.css'
import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/saga-blue/theme.css'

Vue.use(PrimeVue, { ripple: true })

Vue.component('Calendar', Calendar)
```

# Test

Os testes de unidade podem ser armazenados tanto neste diretório quanto em um subdiretório com o nome `__tests__` junto do componente a que pertence.

# Conclusão

O nuxt é um framework muito robusto e com certeza agiliza bastante o desenvolvimento de aplicações front-end. Neste post eu falei um pouco sobre os principais recursos que ele oferece, mas se você quiser se aprofundar ainda mais sobre o nuxt pode acessar a [documentação oficinal](https://nuxtjs.org/)
