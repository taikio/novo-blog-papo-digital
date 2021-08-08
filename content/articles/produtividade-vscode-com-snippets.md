---
title: Aumente sua Produtividade no VSCode com Snippets
description: Se você é um programador "preguiçoso" como eu também já deve estar cansado de ficar sempre digitando a mesma coisa toda vez que for criar uma nova classe ou componente. Neste artigo eu vou mostrar como é possível automatizar esta tarefa utilizando o recurso de Snippets do VSCode.
img: cover-vscode-snippets.png
alt: vscode snippets
publishDate: 2021-07-15T19:30:00.003Z
---

Se você é um programador "preguiçoso" como eu também já deve estar cansado de ficar sempre digitando a mesma coisa
toda vez que for criar uma nova classe ou componente. Neste artigo eu vou mostrar como é possível automatizar esta
tarefa utilizando o recurso de Snippets do VSCode.

# Motivação

No dia-a-dia dos programadores é muito comum termos a necessidade de criar novas classes, componentes ou templates HTML e
isso se repete com maior frequência se estivermos trabalhando em uma nova feature ou um novo projeto. Existem várias
extensões do VSCode que podem nos ajudar fornecendo snippets prontos, porém em alguns casos elas não são suficiente. Por exemplo, a extensão `Vetur` fornece alguns snippets para criar componentes `Vuejs`, porém o projeto que estou trabalhando
atualmente utiliza componentes em formato de classes e neste caso a extensão não atende as minhas necessidades.
Sendo assim, tive que criar meu próprio snippet.

# Criando Snippet Personalizado

Para criar um snippet personalizado clique no ícone de engrenagem na parte inferior esquerda do VSCode, selecione a opção
`User Snippets`, em seguida pesquise pelo nome da linguagem desejada. No meu caso selecionei a opção `Vue.json`

<image-box image-name="produtividade-vscode-snippets-1.png"></image-box>

Também é possível criar snippets de forma global selecionando a opção `New Global Snippets file` ou se preferir pode criar
um arquivo de snippets exclusivo para o projeto em questão selecionando a opção `New Snippets file for nome_projeto`.

Segue abaixo o código do snippet que eu criei para gerar meus componentes Vuejs:

```json
{
  "Vue Class Component": {
    "prefix": "vcc",
    "description": "Vuejs class-style component",
    "body": [
      "<template>",
      "	<h1>$1</h1>",
      "</template>",
      "",
      "<script lang=\"ts\">",
      "import { Vue, Component, Prop } from 'nuxt-property-decorator'",
      "",
      "@Component({})",
      "export default class $2 extends Vue {",
      "",
      "}",
      "</script>",
      "",
      "<style lang=\"scss\" scoped>",
      "",
      "</style>",
      ""
    ]
  }
}
```

# Explicando o Código

Na primeira linha é definido o nome do snippet. Este nome é o que irá aparecer no diálogo de sugestões.
Em seguida temos o `prefix` que é o atalho que ativará o snippet, o `description` como o próprio nome já sugere
é a descrição que ajuda a identificar o que esse snippet faz, por último temos o `body` que armazena o "template de código"
que deve ser aplicado. Repare no `$1` e `$2` dentro do body, isso é utilizado para indicar que o cursor deve ser posicionado
nestes pontos do código afim de permitir que você digite algo e é possível navegar entre estes pontos utilizando `Tab`

# Testando o Snippet

Crie um novo arquivo com a extensão da linguagem escolhida e digite o comando definido na propriedade `prefix` do seu snippet, se tudo correu bem você deve ter um resultado semelhante ao da imagem abaixo:

<image-box image-name="produtividade-vscode-snippets-2.png"></image-box>
