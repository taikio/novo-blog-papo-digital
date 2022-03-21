---
title: Como Customizar a Barra de Rolagem do Navegador com CSS
description: Ao construir a identidade visual do seu site ou aplicação web pode ser interessante personalizar também a barra de rolagem para garantir que não haverá inconsistências visuais. Neste tutorial você aprenderá a customizar a aparência da barra de rolagem utilizando apenas 3 propriedades CSS.
img: cover-customizando-barra-de-rolagem.png
alt: Personalizar Barra de Rolagem
publishDate: 2022-03-21T19:30:00.003Z
tag: CSS
---

Ao construir a identidade visual do seu site ou aplicação web pode ser interessante personalizar também a barra de rolagem para garantir que não haverá inconsistências visuais. Neste tutorial você aprenderá a customizar a aparência da barra de rolagem utilizando apenas 3 propriedades CSS.

# Estrutura básica do HTML

Vamos criar um arquivo HTML contendo uma div de container e adicionar um texto dentro dela

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Customizando a Barra de Rolagem</title>

    <!-- Link do arquivo de CSS -->
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div class="text-container">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus
      veniam magnam, perspiciatis reprehenderit maiores quae ut, rerum similique
      voluptate velit tenetur eaque ratione tempora explicabo nam laboriosam
      quia omnis. Facere?
    </div>
  </body>
</html>
```

Agora vamos criar uma estilização básica para zerar as margens e definir um tamanho para o container do texto. Para isso crie um arquivo chamado `style.css` e adicione o código abaixo:

```css
/* Resetando as margens */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Definindo tamanho do container do texto */
.text-container {
  max-width: 350px;
  height: 12vh;
  font-size: 1rem;
  overflow-y: auto;
}
```

# Customizando a barra de rolagem

Para customizar a barra de rolagem utilizaremos as seguintes propriedades:

- **-webkit-scrollbar**: Utilizaremos esta propriedade para definir a largura da barra de rolagem.
- **-webkit-scrollbar-track**: Esta propriedade serve para customizar o background da barra de rolagem.
- **-webkit-scrollbar-thumb**: Esta propriedade serve para customizar a barrinha da barra de rolagem.

```css
html ::-webkit-scrollbar {
  width: 10px;
}

html ::-webkit-scrollbar-thumb {
  border-radius: 50px;
  background: #6e6ea9;
}

html ::-webkit-scrollbar-track {
  background: #ededed;
}
```

**Obs.: Vale lembrar que estas propriedades CSS só funcionam em navegadores que utilizam o webkit, como Chrome, Opera, Brave, Edge, etc.**

Para que as customizações funcionem no firefox é preciso utilizar as propriedades `scrollbar-color` e `scrollbar-width`, porém estas propriedades não são compatíveis com todas as versões do navegador. Para mais informações acesse o link da [documentação oficial do firefox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scrollbars)
