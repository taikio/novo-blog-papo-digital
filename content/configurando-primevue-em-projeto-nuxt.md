---
title: Tutorial - Configurando PrimeVue em um projeto Nuxt
lowercaseTitle: tutorial - configurando primevue em um projeto nuxt
description: PrimeVue é uma biblioteca open source que fornece vários componentes de UI para VueJS. Neste post será explicado passo a passo como configurá-la em um projeto NuxtJS.
cover: cover_tutorial_primevue_nuxt.png
coverAlt: Tutorial PrimeVue Nuxt
publishDate: 2021-09-29T19:30:00.003Z
tag: NuxtJS
---

PrimeVue é uma biblioteca open source que fornece vários componentes de UI para VueJS. Neste post será explicado passo a passo como configurá-la em um projeto NuxtJS.

# Introdução

A medida que a web e os browsers evoluem a complexidade dos web apps aumentam, visto que os componentes tendem a ser cada vez mais interativos. Sendo assim, surgiram várias bibliotecas de componentes que absorvem esta responsabilidade permitindo que os desenvolvedores mantenham o foco na regra de negócio.

# PrimeVue

A PrimeVue é uma biblioteca open source desenvolvida pela PrimeTek Informatics que fornece vários componentes de UI para VueJS. Também existem variações desta biblioteca para outros frameworks de front-end como React e Angular.

# Instalação

Como o Nuxt é escrito sobre a arquitetura do Vuejs na versão 2 precisamos instalar a versão da PrimeVue correspondente, além disso é necessário instalar a biblioteca `primeicons` para que todos os componentes funcionem corretamente. Para fazer a instalação abra o terminal no diretório do seu projeto e execute o comando abaixo:

```bash
npm install primeicons primevue@^2.6.0 --save
```

# Configuração

dentro do diretório `/plugins` crie o arquivo `primevue-locale-dictionary.js` e também `primevue.js` sendo que o primeiro será utilizado para configurar o idioma dos componentes e o segundo conterá todos os imports e configurações. Vale ressaltar que se você estiver utilizando typescript em seu projeto pode utilizar a extensão `.ts` sem problemas.

```javascript [primevue-locale-dictionary.js]
export const locale = {
  startsWith: 'Começa com',
  contains: 'Contém',
  notContains: 'Não contém',
  endsWith: 'Termina com',
  equals: 'Igual',
  notEquals: 'Diferente de',
  noFilter: 'Sem Filtros',
  lt: 'Menor que',
  lte: 'Menor ou igual a',
  gt: 'Maior que',
  gte: 'Maior ou igual a',
  dateIs: 'Data igual a',
  dateIsNot: 'Data diferente de',
  dateBefore: 'Data anterior a',
  dateAfter: 'Data posterior a',
  clear: 'Limpar',
  apply: 'Aplicar',
  matchAll: 'Corresponde a todos',
  matchAny: 'Corresponde a algum',
  addRule: 'Adicionar regra',
  removeRule: 'Remover regra',
  accept: 'Sim',
  reject: 'Não',
  choose: 'Selecione',
  upload: 'Upload',
  cancel: 'Cancelar',
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
  dayNamesMin: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abriu',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ],
  today: 'Hoje',
  weekHeader: 'Wk',
  firstDayOfWeek: 1,
  dateFormat: 'dd/mm/yyyy',
  weak: 'Fraco',
  medium: 'Médio',
  strong: 'Forte',
  passwordPrompt: 'Informe a Senha',
  emptyFilterMessage: 'Nenhum resultado encontrado',
  emptyMessage: 'Não há informações',
}
```

```javascript [primevue.js]
import Vue from 'vue'
import PrimeVue from 'primevue/config'

import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { locale } from './primevue-locale-dictionary'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

Vue.use(PrimeVue, { locale })

Vue.component('Card', Card)
Vue.component('InputText', InputText)
Vue.component('Button', Button)
```

A documentação do PrimeVue recomenda que os componentes sejam importados a medida que forem utilizados no projeto e registrados globalmente. Além dos componentes é preciso importar também os arquivos de css base e o css do tema que será utilizado.

Agora abra o arquivo `nuxt.config.js` e adicione o arquivo `primevue.js` na lista de plugins:

```javascript [nuxt.config.js]
...
plugins: ['@/plugins/primevue']
...
```

Para evitar que ocorra erros inesperados ao executar os testes unitários abra o arquivo `jest.config.js` e adicione a linha de código abaixo:

```javascript [jest.config.js]
transformIgnorePatterns: ['<rootDir>/node_modules/(?!primevue/.*)']
```

Este ajuste é necessário porque os componentes da biblioteca PrimeVue ficam separados em arquivos `.vue` e o Jest não consegue compilá-los. Então caso você precise escrever testes para um componente seu que utiliza um componente da PrimeVue é preciso informar ao Jest que ele deve ignorar tudo que vier de `/node_modules/primevue`

# disclaimer

A biblioteca PrimeVue também pode ser instalada através de um módulo do nuxt que dispensa configurações adicionais, porém tive alguns problemas na hora de escrever testes unitários utilizando este módulo.

E assim chegamos ao fim deste post, espero que você tenha gostado ;)
