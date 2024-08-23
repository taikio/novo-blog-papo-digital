---
title: Descobrindo as Dimensões de um Elemento HTML com JavaScript
lowercaseTitle: descobrindo as dimensões de um elemento html com javascript
description: Quando desenvolvemos páginas web, é comum precisar de informações sobre o tamanho de elementos HTML para ajustar a posição dos elementos de forma dinâmica. Neste post eu vou te mostrar algumas maneiras de pegar as dimensões de um elemento através do javascript.
cover: cover_post_descobrindo_dimensoes_elemento_com_javascript.png
coverAlt: Descobrindo as Dimensões de um Elemento HTML com JavaScript
publishDate: 2024-08-17T14:30:00.003Z
tag: Javascript
---

Quando desenvolvemos páginas web, é comum precisar de informações sobre o tamanho de elementos HTML para ajustar a sua posição e estilo. Existem vários métodos de obter as dimensões de um elemento HTML no JavaScript, cada um com seu próprio funcionamento e uso específico. Neste post vamos explorar alguns destes métodos e como utilizá-los.

# offsetWidth e offsetHeight

`offsetWidth` e `offsetHeight` retornam a largura e altura total do elemento, incluindo padding, borda e barras de rolagem, mas excluindo margens.

Exemplo de código:

```javascript
const div = document.getElementById('minhaDiv')
const larguraTotal = div.offsetWidth
const alturaTotal = div.offsetHeight
```

# getBoundingClientRect

`getBoundingClientRect` retorna um objeto com as dimensões do elemento, considerando transformações CSS como rotação e escala. Vale ressaltar que neste caso os valores de altura e largura são retornados em decimal.

Exemplo de código:

```javascript
const div = document.getElementById('minhaDiv')
const dimensoes = div.getBoundingClientRect()
const largura = dimensoes.width
const altura = dimensoes.height
```

# clientWidth e clientHeight

`clientWidth` e `clientHeight` retornam a largura e altura do elemento, incluindo o padding, mas excluindo a margem e barras de rolagem.

Exemplo de código:

```javascript
const div = document.getElementById('minhaDiv')
const larguraVisivel = div.clientWidth
const alturaVisivel = div.clientHeight
```

# getComputedStyle

`getComputedStyle` retorna um objeto com todos os estilos computados do elemento, permitindo acessar propriedades como margens, bordas e paddings. Os valores retornados neste método são exatamente os mesmos exibidos na aba `computed` do devtools quando inspecionamos um elemento no navegador.

Exemplo de código:

```javascript
const div = document.getElementById('minhaDiv')
const estilosComputados = window.getComputedStyle(div)
const margemEsquerda = estilosComputados.marginLeft
```

Esses métodos são úteis em diferentes cenários. Por exemplo, ao criar um layout responsivo, você pode usar clientWidth e clientHeight para ajustar o tamanho de elementos de acordo com a tela do usuário. Já o getComputedStyle() é útil para acessar estilos computados e personalizar elementos de forma dinâmica.

Compreender e utilizar esses métodos adequadamente é essencial para garantir um design web consistente e adaptável a diferentes dispositivos e tamanhos de tela.

E assim chegamos ao fim deste post, espero que você tenha gostado ;)
