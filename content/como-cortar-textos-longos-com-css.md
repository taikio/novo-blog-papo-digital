---
title: Como Cortar Textos Longos e Adicionar 3 Pontinhos com CSS
lowercaseTitle: como cortar textos longos e adicionar 3 pontinhos com css
description: Neste post eu vou te mostrar uma forma bem simples de quebrar textos muito longos e adicionar 3 pontinhos usando apenas CSS
cover: cover-cortar-texto-com-css.png
coverAlt: Cortar textos com css
publishDate: 2021-08-29T19:30:00.003Z
tag: CSS
---

Neste post eu vou te mostrar uma forma bem simples de quebrar textos muito longos e adicionar 3 pontinhos usando apenas CSS

# Introdução

Se você é um desenvolvedor front-end provavelmente já se deparou com alguma situação em que precisava evitar que um texto muito longo quebrasse o seu layout e apesar de parecer algo simples, pode acabar te rendendo uma bela dor de cabeça. Mas neste post eu vou te mostrar como resolver este problema bem rapidinho.

# Criando o projeto

Como se trata de um projeto bem simples basta criar um arquivo HTML e um arquivo CSS. a estrutura do HTML deve ficar assim:

```html [index.html]
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./index.css" />
    <title>Document</title>
  </head>
  <body>
    <main>
      <div class="card">
        <div class="card__title">
          <h3>Título longo demais para ser exibido dentro do card</h3>
        </div>
      </div>
    </main>
  </body>
</html>
```

E o arquivo CSS deve ficar assim:

```css [index.css]
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none;
  font-size: 16px;
}

main {
  width: 100%;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card {
  width: 300px;
  border: 1px solid #ededed;
  border-radius: 6px;
  box-shadow: 1px 2px 4px #9e9e9e;
  padding: 12px;
}

.card__title {
  width: 100%;
}

.card__title h3 {
  margin: 0;
  font-size: 1.8rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

# Explicando o código

O primeiro seletor serve apenas para "resetar" as estilização que o browser aplica por padrão.
O seletor `main` está servindo como container global da página, coloquei `display:flex` e `align-items:center` para centralizar tudo que for adicionado dentro dele.

Na classe `.card` é que começa a solução para cortar o texto, aqui eu determino a largura do componente que é de `300px` e adiciono estilizações de borda e sombreamento para criar um efeito de relevo. A classe `.card__title` não está fazendo muita coisa, porém ela existe para facilitar estilizações no container do texto. Se eu quiser futuramente adicionar uma borda abaixo do texto para separá-lo de outros elementos por exemplo seria mais fácil adicionar esta estilização na classe `.card__title` ao invés de adicionar diretamente no `h3`.
E finalmente no seletor `.card__title h3` eu usei `overflow: hidden` para esconder tudo que passar da largura de `300px`, `white-space: nowrap` para garantir que todo o texto seja exibido em uma única linha e `text-overflow: ellipsis` para adicionar automaticamente os 3 pontinhos no final do texto sempre que ele ultrapassar a largura do componente.

Se tudo ocorreu bem você deve estar vendo uma página semelhante à da imagem abaixo:

:image-box{image="cortar-textos-com-css.png"}

Então é isso, espero que tenha gostado deste post ;)
