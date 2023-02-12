---
title: Introdução ao Tailwind CSS - Do Zero ao Primeiro Projeto
lowercaseTitle: introdução ao tailwind css - do zero ao primeiro projeto
description: O Tailwind CSS vem ganhando bastante popularidade desde seu lançamento em Novembro de 2017. Desde então já foram geradas mais de 190 releases, além disso o projeto já conta com mais de 54 mil estrelas no GitHub. Mas apesar desta popularidade toda ainda existem muitos desenvolvedores que não sabem por onde começar. Se você é um destes desenvolvedores fique tranquilo, pois neste Post você aprenderá tudo que precisa para criar seu primeiro projeto com Tailwind CSS.
cover: cover-introducao-tailwind.png
coverAlt: Personalizar Barra de Rolagem
publishDate: 2022-03-23T11:57:00.003Z
tag: CSS
---

O Tailwind CSS vem ganhando bastante popularidade desde seu lançamento em Novembro de 2017. Desde então já foram geradas mais de 190 releases, além disso o projeto já conta com mais de 54 mil estrelas no GitHub. Mas apesar desta popularidade toda ainda existem muitos desenvolvedores que não sabem por onde começar. Se você é um destes desenvolvedores fique tranquilo, pois neste Post você aprenderá tudo que precisa para criar seu primeiro projeto com Tailwind CSS.

# Introdução

Antes de colocarmos a mão na massa é importante entender o que é o Tailwind e qual é a filosofia por trás do framework, já que ele segue uma ideia bem diferente de outros frameworks CSS como o Bootstrap.

# O que é Tailwind CSS?

O Tailwind é um framework CSS que segue a filosofia Utility First, ou seja, ao invés de ter componentes prontos como o Bootstrap ele te fornece várias classes utilitárias para que você mesmo construa seus componentes.

# Diferenças entre Tailwind vs Bootstrap

Fazendo uma comparação entre as classes destes dois frameworks, é muito fácil perceber a diferença. Enquanto o Bootstrap tem classes como `card`, `navbar` e `button` que fornecem a estilização completa de um componente, o Tailwind tem classes como `flex`, `flex-col`, `my-2`, `mx-2` onde cada classe representa mudanças bem menores na estilização de modo que combinando estas classes é possível construir layouts mais dinâmicos sem ter a necessidade de sobrescrever a estilização padrão do framework. Aliás, a ideia é que você nem precise escrever CSS.

# Tailwind Playground

O Tailwind fornece um ambiente de playground para você se familiarizar com o framework sem ter que lidar com instalação ou configurações adicionais. Para acessar o playground acesse a [página inicial do Tailwind](https://tailwindcss.com/), clique em **Get Started** e em seguida clique no link **Playground** localizado do lado esquerdo da tela.

:image-box{image="print-tailwind-playground.png"}

Ao acessar o playground você perceberá que já existe algo criado, antes de apagar todo o conteúdo e começar a criar seus próprios layouts sinta-se a vontade para dar uma boa olhada nas classes que estão sendo utilizadas. Vale ressaltar que ao passar o cursor do mouse sobre as classes é possível ver as propriedades CSS que elas utilizam.

# Criando um Balão de Notificação no Tailwind Playground

Agora que você já se familiarizou um pouco com o conceito de Utility First, vamos sair da teoria e ver na prática como construir um componente de notificação utilizando as classes do Tailwind. Para isso copie o código abaixo e cole no editor do playground:

```html
<!-- container da página -->
<div class="h-screen w-screen bg-slate-100">
  <!-- balão de notificação -->
  <div class="mx-auto max-w-sm rounded-xl bg-white p-4 shadow-lg">
    <div>
      <h3 class="text-black text-xl font-medium">Notification</h3>
      <p class="text-slate-500">You have a new message!</p>
    </div>
  </div>
</div>
```

Se deu tudo certo você deve estar vendo algo como na imagem abaixo:

:image-box{image="print-tailwind-balao-notificacao.png"}

Na primeira div utilizei as classes `w-screen` e `h-screen` para ocupar toda a largura e altura disponíveis, em seguida utilizei a classe `bg-slate-100` para aplicar uma cor de fundo.

Na segunda div utilizei a classe `p-4` para aplicar um padding tando horizontal quanto vertical, a classe `max-w-sm` serve para limitar a largura do balão de notificação em _24rem_, `mx-auto` aplica uma margem automática na horizontal centralizando o componente, `bg-white` muda a cor de fundo para branco, `rounded-xl` arredonda as bordas do componente e `shadow-lg` aplica um efeito de sombreamento.

No **h3** eu utilizei a classe `text-xl` para aumentar o tamanho do texto, `font-medium` para dar mais destaque ao texto e `text-black` para mudar a cor do texto. No **p** eu utilizei a classe `text-slate-500` para deixar o texto com uma cor mais clara.

# Criando um projeto NuxtJS com Tailwind

Chegou o momento de criarmos um projeto real com Tailwind e fazermos algumas configurações customizadas.

Para criar um novo projeto NuxtJS abra seu terminal e digite o comando `npx create-nuxt-app nome-do-projeto`, assim que o CLI inicializar selecione as opções como na imagem abaixo:

:image-box{image="print-nuxt-tailwind-cli.png"}

Agora para instalar o Tailwind copie o código abaixo e cole no terminal:

```bash
npm install -D tailwindcss postcss@latest autoprefixer@latest @nuxt/postcss8
```

Em seguida execute o comando `npx tailwindcss init` para criar o arquivo `tailwind.config.js`

Abra o arquivo e edite a sessão content:

```javascript [tailwind.config.js]
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Abra o arquivo `nuxt.config.js` para habilitar o plugin postCSS e edite a sessão `buildModules`:

```javascript [nuxt.config.js]
export default {
  buildModules: [
    '@nuxt/postcss8',
    // ...
  ],
}
```

Na sessão `build` adicione as seguintes configurações:

```javascript [nuxt.config.js]
export default {
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },
}
```

Crie um arquivo chamado `main.css` no caminho `/assets/css/` e faça o import das camadas do Tailwind:

```css [assets/css/main.css]
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Por fim altere a sessão css do arquivo `nuxt.config.js`:

```javascript [nuxt.config.js]
export default {
  css: ['@/assets/css/main.css'],
}
```

Com isso finalizamos a instalação do Tailwind no projeto. O próximo passo será customizar as configurações padrões do Tailwind para definirmos uma paleta de cores e a fonte do projeto.

# Customizando o Tema Padrão do Tailwind

Alterando as configurações do arquivo `tailwind.config.js` é possível estender ou sobrescrever as definições padrão do Tailwind como cores, fontes e até mesmo os breakpoints de responsividade.

# Adicionando Cores Personalizadas

Para adicionar novas cores ao Tailwind abra o arquivo `tailwind.config.js` e dentro da sessão extend adicione o código abaixo:

```javascript [tailwind.config.js]
module.exports = {
  ...
  theme: {
    extend: {
      colors: {
        midnight: '#121063',
        metal: '#565584',
        'tahiti': {
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        }
      }
    },
  }
}
```

As cores podem ser configuradas em formato de chave-valor como a cor `midnight`, ou em formato de objeto como a cor `tahiti`. A grande diferença é que o formato de objeto permite que sejam definidos vários tons para uma mesma cor, na prática significa que será possível utilizar a variação `text-tahiti-500` por exemplo.

# Adicionando Uma Nova Fonte

Para adicionar uma nova fonte é preciso fazer o download do arquivo da fonte e colocá-lo na pasta `/assets/fonts`. Em seguida abra o arquivo `/assets/css/main.css` e estenda a configuração de font-family na camada `base` do Tailwind como no exemplo abaixo:

```css [assets/css/main.css]
@layer base {
  @font-face {
    font-family: 'Inter';
    src: url('../fonts/Inter-Regular.ttf') format('ttf');
    font-weight: 400;
    font-display: swap;
  }
}
```

Agora volte ao arquivo `tailwind.config.js` e adicione o código abaixo dentro da sessão extend:

```javascript [tailwind.config.js]
module.exports = {
  ...
  theme: {
    extend: {
      ...
      fontFamily: {
        inter: 'Inter, sans-serif'
      }
    },
  },
  plugins: [],
}
```

Com isso podemos utilizar a classe `font-inter` para aplicar a fonte personalizada.

# Dica Extra: Extensão Oficial para Visual Studio Code

A equipe do Tailwind desenvolveu uma extensão para o Visual Studio Code que habilita o recurso de auto complete das classes, além de exibir as propriedades CSS de cada classe quando passamos o cursor do mouse sobre elas da mesma forma que acontece no Tailwind Playground.

Para instalar a extensão acesse a guia de extensões do Visual Studio Code e pesquise por "Tailwind CSS IntelliSense" e instale a extensão exibida na imagem abaixo:

:image-box{image="print-extensao-tailwind-vscode.png"}

E assim chegamos ao fim deste tutorial, espero que você tenha gostado 😉
