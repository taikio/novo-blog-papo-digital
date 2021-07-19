---
title: Criando Documentos PDF com ReactJS
description: Em aplicações empresariais é muito comum a necessidade de criar documentos em PDF, seja para exibir dados de um relatório ou mesmo para exportar informações exibidas em tela. Neste artigo irei mostrar como criar documentos PDF utilizando React e a biblioteca PdfMake.
img: cover-post-pdf.png
alt: Documentos PDF com ReactJS
---

Em aplicações empresariais é muito comum a necessidade de criar documentos em PDF, seja para exibir dados de um relatório ou mesmo para exportar informações exibidas em tela. Neste artigo irei mostrar como criar documentos PDF utilizando React e a biblioteca PdfMake.

# Iniciando o projeto

Inicie um novo projeto react utilizando o comando:

```bash
yarn create react-app app-react-pdf
```

Por fim adicione a biblioteca PdfMake ao projeto com o comando:

```bash
yarn add pdfmake
```

Como o foco principal deste artigo é a criação de documentos em PDF vou criar uma tela inicial bem simples, apenas com um botão para gerar o relatório.

O arquivo `app.js` ficou assim:

```javascript[app.js]
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Criando documentos PDF com ReactJS
        </p>
      </header>
      <section className="App-body">
        <button className="btn">
          Visualizar documento
        </button>
      </section>
    </div>
  );
}

export default App;
```

Segue abaixo as regras de estilização definidas no arquivo `app.css`:

```css[app.css]
.App {
  text-align: center;
}
.App-logo {
  height: 40vmin;
  pointer-events: none;
}
.App-header {
  background-color: #282c34;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}
.App-body {
  height: 15vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn {
  padding: 10px 16px;
  font-size: 14px;
  background-color: transparent;
  border: 1px solid #61dafb;
  border-radius: 6px;
  color: #61dafb;
  font-weight: bold;
  transition: ease-in 0.3s;
}
.btn:hover {
  background-color: #61dafb;
  color: #fff;
  cursor: pointer;
}
```

Agora que já temos a base da nossa aplicação, podemos iniciar a criação do relatório. Primeiramente vamos criar um arquivo que servirá como fonte de dados.

Na pasta `src` crie um arquivo chamado `data.js` e cole o conteúdo abaixo dentro do arquivo:

```javascript[data.js]
export const data = [
  {
    nome: "Mousepad",
    qtdEstoque: 4,
    qtdVendido: 10,
  },
  {
    nome: "Teclado",
    qtdEstoque: 8,
    qtdVendido: 12,
  },
  {
    nome: "Monitor",
    qtdEstoque: 2,
    qtdVendido: 14,
  },
  {
    nome: "Mouse",
    qtdEstoque: 15,
    qtdVendido: 32,
  }
];
```

No início do arquivo `App.js` importe a biblioteca PdfMake, o arquivo `data.js` que acabamos de criar e também
o arquivo `Impressão.js` que será criado posteriormente contendo o layout do relatório

```javascript[App.js]
import React from 'react';
import logo from './logo.svg';
import './App.css';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { data } from './data';
import { Impressao } from './impressao';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
```

Ainda no arquivo `App.js` crie a função que irá abrir o documento PDF em uma nova guia

```javascript
const visualizarImpressao = () => {
  const classeImpressao = new Impressao(data)
  const documento = classeImpressao.PreparaDocumento()
  pdfMake.createPdf(documento).open({}, window.open('', '_blank'))
}
```

Agora chame a função no evento de clique do botão

```javascript
<button className="btn" onClick={visualizarImpressao}>
  Visualizar documento
</button>
```

# Implementando o documento PDF

O PdfMake utiliza a sintaxe de object literals para construir o layout dos documentos, e sua estrutura é dividida em 4 partes, sendo elas `header`, `content`, `footer` e `styles`.
Além disso possui um conjunto de elementos como Tabelas, parágrafos e listas, sendo que é possível estilizá-los passando as propriedades inline ou definindo-as dentro da propriedade styles.

Segue abaixo o código da classe de impressão:

```javascript[Impressao.js]
export class Impressao {

  constructor(dadosParaImpressao) {
    this.dadosParaImpressao = dadosParaImpressao;
  }

  async PreparaDocumento() {
    const corpoDocumento = this.CriaCorpoDocumento();
    const documento = this.GerarDocumento(corpoDocumento);
    return documento;
  }

  CriaCorpoDocumento() {
    const header = [
      { text: 'Nome Produto', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      { text: 'Qtd. Estoque', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      { text: 'Qtd. Vendido', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
    ];
    const body = this.dadosParaImpressao.map((prod) => {
      return [
        { text: prod.nome, fontSize: 8 },
        { text: prod.qtdEstoque, fontSize: 8 },
        { text: prod.qtdVendido, fontSize: 8 },
      ];
    });

    const lineHeader = [
      {
        text:
          '__________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
        alignment: 'center',
        fontSize: 5,
        colSpan: 3,
      },
      {},
      {},
    ];

    let content = [header, lineHeader];
    content = [...content, ...body];
    return content;
  }

  GerarDocumento(corpoDocumento) {
    const documento = {
      pageSize: 'A4',
      pageMargins: [14, 53, 14, 48],
      header: function () {
        return {
            margin: [14, 12, 14, 0],
            layout: 'noBorders',
            table: {
              widths: ['*'],
              body: [
                [
                  { text: 'RELATÓRIO DE VENDAS', style: 'reportName' }
                ]
              ],
            },
          };
      },
    content: [
      {
            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: [ '*', 55, 55 ],

              body: corpoDocumento
            }
          },
    ],
    footer(currentPage, pageCount) {
          return {
            layout: 'noBorders',
            margin: [14, 0, 14, 22],
            table: {
              widths: ['auto'],
              body: [
                [
                  {
                    text:
                      '_________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
                    alignment: 'center',
                    fontSize: 5,
                  },
                ],
                [
                  [
                    {
                      text: `Página ${currentPage.toString()} de ${pageCount}`,
                      fontSize: 7,
                      alignment: 'right',
                      /* horizontal, vertical */
                      margin: [3, 0],
                    },
                    {
                      text: '© Lojinha de TI',
                      fontSize: 7,
                      alignment: 'center',
                    },
                  ],
                ],
              ],
            },
          };
        },
    styles: {
      reportName: {
        fontSize: 9,
        bold: true,
        alignment: 'center',
        margin: [0, 4, 0, 0],
      }
    },

  };
    return documento;
  }
}
```

O método PreparaDocumento chama o CriaCorpoDocumento que irá iterar os dados do arquivo `data.js` e devolverá o conteúdo da seção content do documento.

No método GerarDocumento é definido o layout do relatório. Na primeira linha é definido o tamanho da página na propriedade `pageSaze`. Em seguida definimos as configurações de margem do documento. A propriedade `pageMargins` é muito importante, pois é ela que determina o tamanho disponível para o header e o footer, já que a altura do header vai de 0 até a quantidade de margem do topo e com o footer é a mesma coisa.

A propriedade `content` contém uma tabela e seu conteúdo sãos os dados gerados pelo método CriaCorpoDocumento. Na propriedade `footer` foi declarada uma função que recebe a página atual e a quantidade de páginas. A função do footer retorna uma tabela em que a primeira linha contém um text com vários `_` para criar uma linha bem sutil, e na segunda linha foram utilizados os parâmetros recebidos pela função para exibir um contador de páginas.

Se você chegou até aqui, então seu relatório em PDF deve ter ficado igual ao da imagem abaixo:

<image-box image-name="criando-documentos-pdf-react-1.jpg"></image-box>

E assim concluímos este tutorial, espero que tenham gostado e até o próximo post.
