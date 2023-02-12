---
title: Novidades do ECMAScript 2021 (ES2021)
lowercaseTitle: novidades do ecmascript 2021 (ES2021)
description: A décima segunda edição do Javascript (ES2021), se tornou standard. Conheça as novas funcionalidades que foram adicionadas nesta versão.
cover: cover_post_es2021.png
coverAlt: Novidades ES2021
publishDate: 2021-09-28T19:30:00.003Z
tag: Javascript
---

A décima segunda edição do Javascript (ES2021), se tornou standard. Conheça as novas funcionalidades que foram adicionadas nesta versão.

# Introdução

Desde 2015, todo ano é lançada uma nova versão do ECMAScript com adição de novas funcionalidades. Estas funcionalidades são baseadas em propostas de implementação existentes no projeto do comité TC39 da ECMA International. O projeto é open source e está hospedado no GitHub. Caso tenha interesse pode acessá-lo por [este link](https://github.com/tc39/proposals)

Neste post vou te apresentar as novas funcionalidades do ECMAScript 2021

# Numeric Separator

Agora é possível separar as casas decimais com um `_` afim de melhorar a legibilidade de números muito grandes. Por exemplo:

```javascript
let oldNumber = 10000 // padrão utilizado atualmente
let newNumber = 10_000 // padrão utilizando numeric separator
```

É importante ressaltar que o valor real da variável não é modificado, então se eu fizer um `console.log()` pra imprimir o valor de newNumber o valor impresso ainda será `10000`

# String.prototype.replaceAll()

Atualmente já existe o método `replace()` para fazer substituições no texto, porém para remover todas as ocorrências é preciso utilizar uma expressão regular, algo como `replace(/regexPattern/g, '')`. Com o método `replaceAll()` podemos remover todas as ocorrências da seguinte forma:

```javascript
let text = 'olá mundo, bem vindo ao meu mundo'

console.log(text.replaceAll('mundo', 'batata')) // olá batata, bem vindo ao meu batata
```

# Promise.any e AggregateArror

O `Promise.any` recebe uma lista de promises e espera que pelo menos uma seja resolvida. Caso todas as promises sejam rejeitadas, é retornado um erro do tipo `AggregateError` contendo uma lista de erros e uma mensagem. Exemplo:

```javascript
Promise.any([
    fetch('http://api.servidorprincipal.com/v1/arquivos/arquivo.txt').then(() => { ... }),
    fetch('http://api.servidorsecundario.com/v1/arquivos/arquivo.txt').then(() => { ... })
]).then((arquivo) => { ... })
  .catch((aggError) => { ... })
```

# Logical Assignment Operators

Esta funcionalidade nos permite atribuir valor à uma variável de forma condicional. Já existem formas de fazer isso atualmente, porém a ideia é ter uma sintaxe mais enxuta. Por exemplo, atualmente fazemos da seguinte forma:

```javascript
if (!user.id) user.id = 1
```

Ou ainda podemos fazer algo como:

```javascript
user.id = user.id || 1
```

Agora com a chegada do Logical Assignment podemos fazer assim:

```javascript
user.id ||= 1
```

# WeakRefs e FinalizationRegistry

Estas são funcionalidades avançadas, e a própria documentação recomenda que evitemos ao máximo utilizá-las. Sendo assim, não vou me aprofundar muito nestes assuntos.

# WeakRefs

Este recurso permite criar uma "referência fraca" a um objeto na memória, permitindo que o Garbage Collector remova-o da memória quando achar necessário. Caso queira saber mais sobre o assunto, pode acessar a documentação por [este link](https://github.com/tc39/proposal-weakrefs/blob/master/README.md)

# FinalizationRegistry

Este recurso pode ou não ser utilizado em conjunto com as WeakRefs e serve para prover uma forma de executar uma função de callback assim que um determinado objeto for coletado pelo Garbage Collector. Para saber mais sobre o assunto acesse a documentação por [este link](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry)

E assim chegamos ao fim deste post, espero que você tenha gostado ;)
