---
title: DayJS - Uma biblioteca poderosa para trabalhar com datas e horas em Javascript
lowercaseTitle: dayjs - uma biblioteca poderosa para trabalhar com datas e horas em Javascript
description: Trabalhar com datas em Javascript pode ser uma tarefa complicada, especialmente quando se trata de lidar com fusos horários diferentes. É aí que a biblioteca DayJS entra em ação, ela é bem leve e fornece uma API simples e consistente para lidar com datas e horas.
cover: cover_post_dayjs.png
coverAlt: Dayjs - Uma biblioteca poderosa para trabalhar com datas e horas em javascript
publishDate: 2023-07-18T19:30:00.003Z
tag: Javascript
---

# Introdução

Trabalhar com datas em Javascript pode ser uma tarefa complicada, especialmente quando se trata de lidar com fusos horários diferentes. É aí que a biblioteca DayJS entra em ação, ela é bem leve e fornece uma API simples e consistente para lidar com datas e horas.

# Por que usar DayJS?

A biblioteca DayJS oferece uma série de vantagens em relação a outras bibliotecas para manipulação de datas, como:

- **É leve e rápida** - DayJS é uma biblioteca muito leve, possuindo apenas 2 KB de tamanho;
- **É fácil de usar** - A API é muito simples e fácil de entender, mesmo para desenvolvedores iniciantes;
- **É atualizada regularmente** - A biblioteca é atualizada regularmente com novas funcionalidades e correções de bugs;
- **Utiliza o conceito de imutabilidade** - Isso significa que todos os métodos que executam alguma alteração na data inicial, na verdade retornam um novo objeto.
- **É compatível com fusos horários diferentes** - A biblioteca DayJS consegue lidar com datas e horas em qualquer fuso horário.

# Padrão de datas UTC

O padrão de datas UTC é um padrão internacional para representar datas e horas. UTC significa Coordinated Universal Time, que é uma referência de tempo atômica usada como base para o fuso horário mundial. É recomendado utilizar o padrão UTC no desenvolvimento de software, pois assim é possível garantir que as datas e horas serão interpretadas corretamente independentemente do fuso horário do servidor onde será publicada a aplicação.

# Habilitando suporte ao padrão UTC na biblioteca DayJS

A biblioteca DayJS trabalha com o conceito de plugins, separando as funcionalidades avançadas em plugins isolados. Sendo assim, para habilitar o suporte ao padrão UTC é necessário importar este plugin e utilizar o método `extend()`:

```javascript
import dayjs from 'dayjs'
import utc from 'dayjs/plugins/utc'

dayjs.extend(utc)
```

Agora para criar uma data basta utilizar a sintaxe `dayjs.utc()` ao invés de utilizar apenas `dayjs()`.

# Como somar ou subtrair dias com DayJS

Para somar ou subtrair dias de uma determinada data com DayJS é muito simples, basta utilizar os métodos `add` ou `subtract`:

```javascript
const now = dayjs.utc()
const tomorrow = now.add(1, 'day')
const yesterday = now.subtract(1, 'day')
```

Também é possível somar e subtrair meses, anos e até horas utilizando estes mesmos métodos

# Como setar datas específicas com DayJS

Além dos métodos de somar e subtrair, também é possível definir um dia específico. Isso pode ser feito tanto através do método `date` quanto através do método `set`, que funciona como um setter global:

```javascript
const now = dayjs.utc()

const firstDayOfMonth = now.date(1)

const lastDay = now.daysInMonth()
const lastDayOfMonth = now.set('date', lastDay)
```

# Como setar horas especificas com DayJS

Você pode utilizar os métodos `hour`, `minute` e `second` para definir valores específicos:

```javascript
const now = dayjs.utc()

now.hour(12)
now.minute(45)
now.second(59)
```

Estes métodos também funcionam como getters quando não recebem nenhum argumento.

# Como validar se uma data é maior ou menor que a data atual com DayJS

Além de fornecer métodos para alterar datas e horas, a biblioteca DayJS também facilita a validação entre datas. Através dos métodos `isBefore` e `isAfter` é possível validar por exemplo se uma determinada data é maior ou menor que a data atual:

```javascript
const now = dayjs.utc()
const tomorrow = now.add(1, 'day')
const yesterday = now.subtract(1, 'day')

tomorrow.isAfter(now) // true
yesterday.isBefore(now) // true
now.isAfter(tomorrow) // false
```

# Como formatar datas com DayJS

É possível formatar datas através do método `format`, informando o padrão de formatação desejado:

```javascript
const now = dayjs.utc()
now.format('DD/MM/YYYY') // 18/07/2023
now.format('DD/MM/YYYY HH:mm:ss') // 18/07/2023 19:30:35
```

# Conclusão

A biblioteca DayJS embora seja bem leve, possui funcionalidades poderosas para trabalhar com datas e fornece uma API bem fácil de usar. Ela com certeza proporciona um grande ganho de produtividade!
