---
title: Deploy de sites Nuxt no Github Pages
lowercaseTitle: deploy de sites nuxt no github pages
description: Se você está pensando em criar um site estático e ainda não sabe qual tecnologia utilizar ou onde publicar, saiba que é possível fazer isso usando Nuxtjs e Github Pages de uma forma muito simples.
cover: cover-deploy-nuxt-github-pages.png
coverAlt: deploy sites nuxtjs github pages
publishDate: 2021-08-19T19:30:00.003Z
tag: NuxtJS
---

Se você está pensando em criar um site estático e ainda não sabe qual tecnologia utilizar ou onde publicar, saiba que é possível fazer isso usando Nuxtjs e Github Pages de uma forma muito simples.

# Introdução

Seja uma landing page, site pessoal ou até mesmo um portfólio, em todos estes casos o que você precisa é de um site estático. Neste post eu vou mostrar como você pode publicar um site criado com Nuxtjs no Github Pages de uma forma bem fácil.

# Criando o Projeto com Nuxt

Caso você ainda não tenha criado o projeto, basta executar o comando abaixo no terminal:

```bash
npx create-nuxt-app nome-do-projeto
```

Assim que o assistente iniciar você pode selecionar as opções conforme desejar. Atente-se apenas à última etapa, que é referente à forma de renderização. Você deve selecionar a opção `Static`.

Depois que o assitente terminar de criar o projeto, abra-o no seu editor de código favorito e faça as configurações de deploy descritas abaixo.

# Configurando o deploy

Primeiramente abra o arquivo `nuxt.config.js` e adicione este trecho de código:

```javascript [nuxt.config.js]
router: { base: '/nome-do-projeto/' },
```

Substitua `/nome-do-projeto/` pelo nome do repositório que você criou no Github. Caso ainda não tenha feito isso, crie um novo repositório e vincule-o ao seu projeto seguindo as instruções que o próprio Github te fornecerá.

Em seguida abra o arquivo `package.json` e adicione na lista de scripts o comando abaixo:

```json [package.json]
"scripts": {
  ...
  "deploy": "push-dir --dir=dist --branch=gh-pages --cleanup"
},
```

Por fim instale o pacote `push-dir` como dependência de desenvolvimento com o comando:

```bash
npm install push-dir --save-dev
```

# Configurando o Github Pages

Acesse o repositório que você criou no Github e crie uma nova branch chamada `gh-pages`. Esta branch será utilizada para armazenar os arquivos compilados do seu site.

Depois de criar a branch acesse a aba `Settings`, clique na opção `Pages` no menu lateral e na sessão `Source` selecione a branch `gh-pages` conforme descrito na imagem abaixo:

:image-box{image="deploy-nuxt-github-pages.png"}

# Executando o deploy

Agora que você já configurou o projeto e o Github Pages, basta rodar estes comandos:

```bash
npm run generate
```

Este comando vai compilar o projeto e jogar os arquivos finais no diretório `/dist`. Caso você queira testar o resultado final antes de publicar o site é só rodar o comando `npm start`.

Agora para publicar o site execute este comando:

```bash
npm run deploy
```

Vale ressaltar que sempre que você fizer alterações no site será necessário executar os comandos `npm run generate` e `npm run deploy` para atualizar a versão publicada.
