---
title: Simule o consumo de APIs em minutos e ganhe mais produtividade com MSWjs
lowercaseTitle: simule o consumo de apis em minutos e ganhe mais produtividade com mswjs
description: Mocks são uma ferramenta poderosa no desenvolvimento de software, permitindo simular comportamentos de APIs durante o desenvolvimento ou testes. O **MSWjs** (Mock Service Worker) é uma das melhores bibliotecas para criar mocks, pois funciona interceptando requisições HTTP e retornando os dados que você definir, sem que as requisições cheguem ao servidor.
cover: cover-post-mocks-com-msw.png
coverAlt: Simule o consumo de APIs em minutos e ganhe mais produtividade com MSWjs
publishDate: 2025-01-15T19:30:00.003Z
tag: Produtividade
---

# Introdução

Mocks são uma ferramenta poderosa no desenvolvimento de software, permitindo simular comportamentos de APIs durante o desenvolvimento ou testes. O **MSWjs** (Mock Service Worker) é uma das melhores bibliotecas para criar mocks, pois funciona interceptando requisições HTTP e retornando os dados que você definir, sem que as requisições cheguem ao servidor. Neste tutorial, vamos configurar o MSWjs em um projeto Vue.js criado com Vite. A biblioteca também pode ser usada em React ou Angular, com ajustes mínimos.

# 1. Instalando o MSWjs

Para começar, instale o MSWjs como dependência de desenvolvimento no seu projeto:

```bash
npm install msw@latest --save-dev
```

Em seguida, inicialize o MSWjs para gerar o arquivo do Service Worker:

```bash
npx msw init <PUBLIC_DIR> --save
```

**Nota:** Substitua `<PUBLIC_DIR>` pelo diretório público do seu projeto, geralmente chamado de `public`.

# 2. Configurando o MSWjs

**Criando a Pasta de Mocks**

Crie uma pasta chamada `mocks` na raiz do seu projeto. Dentro dela, crie o arquivo `browser.js` para centralizar a configuração dos handlers e inicializar o Service Worker:

```javascript
// src/mocks/browser.js
import { delay, http } from 'msw'
import { setupWorker } from 'msw/browser'

const globalHandlers = [
  http.all('*', async () => {
    await delay(1000) // Adiciona um delay padrão às requisições.
  }),
]

const finalHandlers = [...globalHandlers]

export const worker = setupWorker(...finalHandlers)
```

Este código define um handler global que aplica um atraso padrão de 1 segundo a todas as requisições.

**Inicializando o Service Worker**

No arquivo de inicialização do Vue.js (`main.js`), importe o arquivo `browser.js` e configure o Service Worker:

```javascript
// src/main.js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

async function enableMocking() {
  if (import.meta.env.VITE_USER_NODE_ENV !== 'development') {
    return // Evita iniciar o Service Worker fora do ambiente de desenvolvimento.
  }

  const { worker } = await import('./mocks/browser')
  return worker.start()
}

enableMocking().then(() => {
  createApp(App).mount('#app')
})
```

# 3. Criando Handlers Específicos

Agora, vamos interceptar requisições de um serviço específico. Considere o seguinte exemplo de um serviço de perfil:

```javascript
// src/services/profileServices.js
export const profileService = {
  async fetchProfile(id) {
    try {
      const result = await fetch(`http://minhaapi.com/user/profile/${id}`)
      return await result.json()
    } catch (error) {
      console.error('Erro na requisição:', error)
      throw error
    }
  },
}
```

**Criando Mocks para o Serviço**

Na pasta `mocks`, crie uma subpasta `profile` e adicione o arquivo `profileMocks.js`:

```javascript
// src/mocks/profile/profileMocks.js
export const profileMocks = {
  success: {
    status: 200,
    data: {
      id: 1,
      name: 'Welker Ferreira',
      email: 'welker@testmail.com',
      age: 30,
      active: true,
    },
  },
  error: {
    status: 504,
    data: null,
  },
}
```

**Criando os Handlers**

Adicione o arquivo `profileHandlers.js` para definir os handlers:

```javascript
// src/mocks/profile/profileHandlers.js
import { http, HttpResponse } from 'msw'
import { profileMocks } from './profileMocks'

export const profileHandlers = [
  http.get('http://minhaapi.com/user/profile/:id', ({ params }) => {
    return HttpResponse.json(profileMocks.success)
  }),
]
```

Atualize o arquivo `browser.js` para incluir os novos handlers:

```javascript
// src/mocks/browser.js
import { delay, http } from 'msw'
import { setupWorker } from 'msw/browser'
import { profileHandlers } from './profile/profileHandlers'

const globalHandlers = [
  http.all('*', async () => {
    await delay(1000)
  }),
]

const finalHandlers = [...globalHandlers, ...profileHandlers]

export const worker = setupWorker(...finalHandlers)
```

# 4. Testando os Mocks

Com a configuração concluída, inicie sua aplicação no modo de desenvolvimento e veja o MSWjs interceptar as requisições e retornar os dados mockados. Isso permite que você desenvolva ou teste funcionalidades sem depender de um servidor real.

# Conclusão

O MSWjs é uma ferramenta incrivelmente versátil para interceptar e mockar requisições HTTP, ajudando no desenvolvimento e na realização de testes sem depender de APIs reais. Com ele, você pode simular cenários complexos e controlar o comportamento das respostas. Experimente integrá-lo ao seu fluxo de trabalho e aproveite os benefícios de um desenvolvimento mais eficiente!

Você pode acessar a documentação oficial do MSWjs [clicando aqui](https://mswjs.io/docs)
Se preferir, também pode clonar o projeto deste tutorial no meu [Github](https://github.com/taikio/vue-mocks-msw)

Gostou do tutorial? Compartilhe com outros desenvolvedores e continue acompanhando o **Papo Digital**!
