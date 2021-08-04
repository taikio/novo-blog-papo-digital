---
title: Construindo componentes altamente reutilizáveis com Vue Slots
description: Como a própria documentação do Vuejs já diz, Slot é um recurso que nos permite inserir elementos dentro de um componente. Desta forma é possível criar um componente mais genérico e reutilizá-lo várias vezes dentro da aplicação mudando seu conteúdo interno.
img: cover-vue-slots.png
alt: vuejs slots
---

Como a própria documentação do Vuejs já diz, Slot é um recurso que nos permite inserir elementos dentro de um componente. Desta forma é possível criar um componente mais genérico e reutilizá-lo várias vezes dentro da aplicação mudando seu conteúdo interno.

# Introdução

O Vuejs é um framework muito robusto que oferece vários recursos interessantes, conhecer estes recursos é essencial para que possamos construir aplicações com mais velocidade e manter um bom padrão de código. Neste post vou falar um pouco sobre o recurso de Slots e mostrar alguns exemplos de quando podemos usá-lo.

# Quando devo utilizar Slots

Os Slots geralmente são utilizados quando estamos construindo algum componente que precisa exibir um conteúdo dinâmico, como por exemplo: Modais, Data Tables e Cards. Porém é possível ir além destes casos e criar algo como layouts para serem utilizados nas páginas da aplicação.

Imagine que você esteja trabalhando em um projeto com outros desenvolvedores, o que é o cenário mais comum. Uma vez que foi definida a identidade visual da aplicação não faz sentido toda vez que for criar uma nova tela repedir o mesmo código para aplicar o "layout base" da página para só então começar a pensar na regra de negócio da tela em questão. Isso toma muito tempo de desenvolvimento, além de deixar o código poluído dificultando a manutenção. O ideal seria criar um componente que aplique a identidade visual e injetar o conteúdo da tela através de slots.

# Tipos de Slot

Antes de partirmos para o código é preciso entender os tipos de slot, então abaixo explicarei melhor sobre eles.

## Default Slot

Por padrão se criarmos um slot sem atribuir um nome ele será interpretado pelo Vue como o slot padrão. Esta é a forma mais simples de se usar slots e lembra bastante a sintaxe do React. Por exemplo, imagine que você está criando um componente de modal e deseja utilizá-lo desta forma:

```html
<my-modal v-if="isVisible">
  <div class="modal-content">
    <p>Este é o conteúdo do modal</p>
  </div>
</my-modal>
```

Para que o conteúdo declarado entre as tags do componente seja injetado dentro dele é preciso usar o slot padrão da seguinte forma:

```html
<template>
  <div class="modal">
    <div class="modal__content">
      <slot />
    </div>
  </div>
</template>
```

Onde a tag `<slot />` seria substituída pelo conteúdo.

## Named Slot

Os named slots funcionam de forma bem parecida, porém eles nos permitem utilizar mais de um slot por componente. Continuando com o exemplo acima, imagine que agora você quer criar uma sessão separada para o título e outra para os botões de ação. A implementação do componente ficaria assim:

```html
<template>
  <div class="modal">
    <div class="modal__title">
      <slot name="title" />
    </div>

    <div class="modal__content">
      <slot />
    </div>

    <div class="modal__footer">
      <slot name="actions" />
    </div>
  </div>
</template>
```

E para utilizar os novos slots você teria que fazer da seguinte forma:

```html
<my-modal v-if="isVisible">
  <template #title>
    <h3>Título do Modal</h3>
  </template>

  <template #default>
    <p>Este é o conteúdo do modal</p>
  </template>

  <template #actions>
    <button type="button" class="btn" @click="cancelar()">Cancelar</button>

    <button type="button" class="btn" @click="salvar()">Confirmar</button>
  </template>
</my-modal>
```

# Exemplo prático

Agora finalmente vamos para a parte interessante. Vou te mostrar como criar um layout base para as páginas da sua aplicação usando slots, então abra seu terminal e seu editor de códigos favorito.

Primeiramente crie um novo projeto Vue com o comando:

```bash
vue create nome-do-projeto
```

Selecione a primeira opção `Default ([Vue 2], babel, eslint)` e aguarde até que a instalação das dependências seja concluída.

Agora que o projeto está criado vamos começar a construir nosso componente de layout.
Crie o arquivo `BaseLayout.vue` dentro de `src/components` e cole o seguinte código dentro dele:

```vue
<template></template>

<script>
export default {}
</script>

<style></style>
```

A estrutura html do componente ficará da seguinte forma:

```html [src/components/BaseLayout.vue]
<template>
  <div class="base-layout">
    <div class="base-layout__title">
      <slot name="title" />
    </div>

    <div class="base-layout__breadcrumb">
      <slot name="breadcrumb" />
    </div>

    <div class="base-layout__content">
      <slot />
    </div>
  </div>
</template>
```

Agora vamos adicionar um pouco de css para definir o layout do componente:

```css
<style>
.base-layout {
  width: 97.9%;
  height: 96.6vh;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background: #fafafa;
}

.base-layout__title {
  width: 100%;
  padding: 16px 0;
}
.base-layout__title h1, .base-layout__title h2, .base-layout__title h3 {
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.75);
}
.base-layout__title h1 {
  font-size: 2rem;
}
.base-layout__title h2 {
  font-size: 1.8rem;
}
.base-layout__title h3 {
  font-size: 1.6rem;
}

.base-layout__breadcrumb {
  width: 100%;
  padding: 16px 0;
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
}

.base-layout__content {
  height: 82%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #ededed;
  border-radius: 6px;
  margin-top: 20px;
  padding: 16px;
}
</style>
```

Por fim, abra o arquivo `App.vue`, apague todo o conteúdo e substitua pelo código abaixo:

```vue [src/App.vue]
<template>
  <base-layout>
    <template #title>
      <h3>Título da Página</h3>
    </template>

    <template #breadcrumb> Home / Página Customizada </template>

    <template #default>
      <p>Este é o conteúdo da página</p>
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from './components/BaseLayout.vue'

export default {
  name: 'App',
  components: {
    BaseLayout,
  },
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
```

E este é o resultado final:

<image-box image-name="componentes-com-vue-slot.png"></image-box>

# Dica Bonus

É possível renderizar as sessões do layout apenas se o slot for utilizado, evitando assim que as sessões sejam renderizadas sem nenhum conteúdo. para fazer isso basta adicionar a seguinte verificação:

```html
<div v-if="$slots.breadcrumb" class="base-layout__breadcrumb">
  <slot name="breadcrumb" />
</div>
```
