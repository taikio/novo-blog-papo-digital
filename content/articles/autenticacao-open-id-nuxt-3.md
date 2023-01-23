---
title: Implementando autenticação OpenID Connect (OIDC) com Nuxt 3
description: Neste post eu vou te mostrar como implementar um fluxo de autenticação OIDC no front-end com Nuxt 3
img: cover_post_autenticacao_nuxt_oidc.png
alt: autenticação Open ID com Nuxt 3
publishDate: 2023-01-22T19:30:00.003Z
tag: NuxtJS
---

# Introdução

Recentemente comecei a migrar uma aplicação do Nuxt 2 para o Nuxt 3, porém quando me deparei com a parte de autenticação acabei ficando um pouco perdido já que ainda não existe um módulo oficial para Nuxt 3. Além disso, ao pesquisar sobre este assunto não consegui encontrar muita coisa. Sendo assim, agora que já consegui superar este desafio resolvi escrever um post explicando o passo a passo que segui para implementar o fluxo de autenticação. Este tutorial inclui:

- A classe de serviço responsável por fazer a autenticação do usuário;
- A Store responsável por armazenar os dados do usuário logado em memória;
- A classe de serviço responsável por se comunicar com o back-end da aplicação;
- O middleware responsável por gerenciar o acesso às rotas da aplicação.

Aqui estou implementando um fluxo de autenticação que utiliza o servidor de autenticação como ferramenta de Single Sign On, então o usuário será redirecionado para uma página global de autenticação e após autenticado será redirecionado de volta para a aplicação.

# Requisitos

Para criar um projeto Nuxt 3 é preciso ter instalado uma versão mais recente do NodeJS, de preferência da versão 16 em diante.
Além disso eu recomendo que se você for utilizar o VS Code como editor de código instale a extensão [Vue Language Features](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

# Criando o Projeto Nuxt 3

O Nuxt 3 vem acompanhado de um CLI chamado Nuxi e é através dele que criaremos o projeto com o comando:

```bash
npx nuxi init nuxt-3-oidc
```

Em seguida acesse a pasta do projeto e instale as dependências com o comando:

```bash
npm install
```

Para habilitar o roteamento no nuxt 3 é preciso criar um diretório chamado `pages` com pelo menos um arquivo `index.vue` dentro. Sendo assim, vamos criar a página inicial da aplicação:

```vue
// /pages/index.vue
<template>
  <div>
    <h3>Você está logado</h3>
    <NuxtLink to="logout">Sair</NuxtLink>
  </div>
</template>
```

Além de criar as páginas, no `App.vue` precisamos utilizar o componente `NuxtPage` desta forma:

```vue
// App.vue
<template>
  <div>
    <NuxtPage />
  </div>
</template>
```

Agora que já temos a base da aplicação funcionando, vamos implementar a classe de autenticação

# Implementando AuthService

Para nos ajudar com o fluxo de autenticação vamos utilizar a biblioteca `oidc-client-ts`, para instalá-la execute o seguinte comando:

```bash
npm install oidc-client-ts
```

Crie um diretório chamado `services` e dentro dele crie o arquivo `environment.ts` que armazenará as configurações de autenticação:

```typescript
// /services/environment.ts
export const environment = {
  production: false,
  authorityUrl: 'https://auth.papo-digital.net.br',
  clientId: 'papo-digital-app',
  clientSecret: 'blog-client',
  clientScope: 'openid profile posts',
  applicationUrl: 'https://api.papo-digital.net.br',
}
```

Vale ressaltar que esta não é a forma mais segura de se definir as configurações de autenticação. Aqui estou deixando em um arquivo dentro a aplicação apenas para deixar o exemplo mais simples, em uma aplicação real o ideal é utilizar variáveis de ambiente.

Agora vamos implementar o `AuthService`:

```typescript
// /services/auth-service.ts
import { User, UserManager, WebStorageStateStore } from 'oidc-client-ts'
import { environment } from './environment'

export default class AuthService {
  userManager: UserManager

  constructor() {
    const settings = {
      authority: environment.authorityUrl,
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      redirect_uri: `${window.location.origin}/auth`,
      silent_redirect_uri: `${window.location.origin}/silent-refresh`,
      post_logout_redirect_uri: `${window.location.origin}`,
      response_type: 'code',
      scope: environment.clientScope,
      userStore: new WebStorageStateStore(),
      loadUserInfo: true,
    }
    this.userManager = new UserManager(settings)
  }

  public signInRedirect() {
    return this.userManager.signinRedirect()
  }

  public signInCallback() {
    return this.userManager.signinCallback()
  }

  public renewToken(): Promise<void> {
    return this.userManager.signinSilentCallback()
  }

  public logout(): Promise<void> {
    return this.userManager.signoutRedirect()
  }

  public getUser(): Promise<User | null> {
    return this.userManager.getUser()
  }
}
```

No construtor montamos o objeto de configuração que é utilizado na inicialização da classe `UserManager`, da biblioteca `oidc-client-ts`. Explicando melhor os métodos:

- **signInRedirect:** Este método redireciona o usuário para a página de login do servidor de autenticação

- **signInCallback:** Este método será utilizado no arquivo `auth.vue` que criaremos mais tarde. Ele é responsável por receber os tokens e os dados do usuário após a autenticação

- **renewToken:** Este método será utilizado no arquivo `silent-refresh.vue` que criaremos mais tarde. Ele é responsável por obter um novo `access_token` quando o token do usuário expirar.

- **logout:** Este método sinaliza ao servidor de autenticação que o usuário está encerrando sua sessão e redireciona o usuário para a página de login

- **getUser:** Este método permite acessar os dados do usuário logado que ficam armazenados no storage da biblioteca `oidc-client-ts`

# Criando páginas complementares do fluxo de autenticação

Antes de criarmos as páginas complementares, Vamos criar um composable chamado `useServices` que facilitará o acesso à camada de serviço:

```typescript
// /composables/useServices.ts
import AuthService from '@/services/auth-service'

export const useServices = () => {
  return {
    $auth: new AuthService(),
  }
}
```

Agora que já implementamos o AuthService e o useServices, precisamos criar as páginas complementares do fluxo de autenticação que utilizarão os métodos implementados. Vamos começar criando a página `auth.vue` que receberá e armazenará os dados do usuário após sua autenticação:

```vue
// /pages/auth.vue
<template>
  <h3>Carregando...</h3>
</template>

<script lang="ts" setup>
import { useServices } from '@/composables/useServices'

const services = useServices()
const router = useRouter()

const authenticateOidc = async () => {
  try {
    await services.$auth.signInCallback()
    router.push('/')
  } catch (error) {
    console.log(error)
  }
}

await authenticateOidc()
</script>
```

Em seguida vamos criar a página `logout.vue`:

```vue
// /pages/logout.vue
<template>
  <h3>Deslogando...</h3>
</template>

<script lang="ts" setup>
import { useServices } from '@/composables/useServices'
import { useAuth } from '@/stores/auth'

const services = useServices()
const authStore = useAuth()

const logOutOidc = async () => {
  try {
    authStore.clearUserSession()
    await services.$auth.logout()
  } catch (error) {
    console.log(error)
  }
}

await logOutOidc()
</script>
```

Na primeira linha do método `logOutOidc` estamos chamando um método da store que ainda não existe, ele será implementado no próximo tópico.

Por último criaremos a página `silent-refresh.vue`:

```vue
// /pages/silent-refresh.vue
<template>
  <h3>Carregando...</h3>
</template>

<script lang="ts" setup>
import { useServices } from '@/composables/useServices'

const services = useServices()
const router = useRouter()

const silentRefreshOidc = async () => {
  try {
    await services.$auth.renewToken()
    router.push('/')
  } catch (error) {
    console.log(error)
  }
}

await silentRefreshOidc()
</script>
```

# Instalando e configurando o Pinia no Nuxt 3

agora que já temos o service de autenticação e as páginas complementares vamos configurar a store, que nos dará acesso imediato aos dados do usuário logado. Neste caso estamos dando preferência para o **Pinia** ao invés do **Vuex** porque a própria documentação do Nuxt recomenda que utilizemos o Pinia. Faça a instalação executando o comando:

```bash
npm install pinia @pinia/nuxt
```

Caso ocorra algum erro na instalação você pode adicionar as dependências manualmente, para isso basta abrir o arquivo `package.json` e na sessão `dependencies` adicione estas linhas:

```json
"dependencies": {
  "@pinia/nuxt": "^0.4.6",
  "pinia": "2.0.28"
}
```

Após adicionar as dependências execute o comando `npm install` e aguarde até que a instalação seja concluída.

Agora vamos criar a `authStore` que nos permitirá transformar os dados do localStorage em dados reativos:

```typescript
// /stores/auth/index.ts
import { acceptHMRUpdate, defineStore } from 'pinia'
import { User } from 'oidc-client-ts'

export const useAuth = defineStore('auth', () => {
  const authUser = ref<User | null>(null)

  const access_token = computed(() => authUser.value?.access_token ?? '')

  const isLoggedIn = computed(() => !!authUser.value)

  const setUpUserCredentials = (user: User) => {
    authUser.value = user
  }

  const clearUserSession = () => {
    authUser.value = null
  }

  return {
    access_token,
    isLoggedIn,
    tenantId,
    setUpUserCredentials,
    clearUserSession,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
```

Aqui vai uma dica valiosa, o método `acceptHMRUpdate` habilita o suporte ao Hot Module Replacement no pinia permitindo que as alterações feitas no código da Store sejam aplicadas automaticamente sem ter que reiniciar a aplicação.

# Configurando controle de acesso às páginas

A última parte do fluxo de autenticação consiste em verificar se o usuário está logado antes de permitir que ele acesse uma determinada página. Para fazermos esta verificação vamos criar um middleware que sempre será executado antes de renderizar as páginas da aplicação. No Nuxt 3 existem 3 formas de criar um middleware, sendo elas:

- Inline: É uma função definida diretamente na página em que o middleware é utilizado
- Nomeado: É um arquivo com extensão **.ts** ou **.js** criado na pasta **middleware** e precisa ser invocado dentro da página que será utilizado
- Global: É um arquivo criado na pasta `middleware` semelhante ao middleware nomeado, porém este possui o sufixo `.global`. Ex: `user.global.ts`

Aqui utilizaremos o middleware global, pois todas as páginas exigem que o usuário esteja autenticado.

```typescript
// /middleware/auth.global.ts
import { User } from 'oidc-client-ts'
import { useAuth } from '@/stores/auth'
import { useSettings } from '@/stores/settings'

const authFlowRoutes = ['/auth', '/silent-refresh', '/logout']

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuth()
  const services = useServices()
  const user = (await services.$auth.getUser()) as User

  if (!user && !authFlowRoutes.includes(to.path)) {
    services.$auth.signInRedirect()
  } else {
    authStore.setUpUserCredentials(user)
  }
})
```

Basicamente o que está acontecendo neste middleware é:

1 - Se o usuário não estiver autenticado e não está acessando alguma página complementar do fluxo de autenticação redirecionamos ele para a página de login (Single Sign On)

2 - Se o usuário estiver logado passamos os dados dele para a store e deixamos ele acessar a página solicitada

# Implementando ApplicationService

Para finalizar este tutorial vamos implementar a classe de serviço responsável por se comunicar com o back-end

```typescript
// /services/application-service.ts
import { environment } from './environment'

export default class ApplicationService {
  constructor(private readonly acessToken: string) {}

  getDefaultHeader() {
    return { Authorization: `Bearer ${this.acessToken}` }
  }

  async getPosts() {
    const headers = this.getDefaultHeader()

    const result = await $fetch(`${environment.applicationUrl}/v1/Posts/List`, {
      method: 'get',
      headers,
      query: { page: 1, size: 10 },
    })

    return result
  }
}
```

Aqui nós recebemos no construtor da classe o access_token do usuário que armazenamos na store e o método `getDefaultHeader` monta o cabeçalho de autenticação que será enviado nas requests. Você deve ter notado que não estamos utilizando o famigerado Axios para fazer as requests, mas calma que existe um motivo. Os desenvolvedores do Nuxt recomendam que utilizemos a `Fetch API` ao invés do axios em conjunto com o Nuxt 3, inclusive eles disponibilizam um método global chamado `$fetch` que tem uma sintaxe bem semelhante a Fetch API com a diferença que este método funciona bem no Browser, no Nodejs e também em Web Workers, em outras palavras ele tem um bom suporte à Server Side Rendering.

Agora para conseguir utilizar o ApplicationService em nossas páginas precisamos fazer um pequeno ajuste no composable useServices

```typescript
// /composables/useServices.ts
...
import { useAuth } from "@/stores/auth";
import ApplicationService from "@/services/application-service";

export const useServices = () => {
  const authStore = useAuth();

  return {
    ...
    $application: new ApplicationService(
      authStore.access_token
    )
  };
};
```

Como os composables são executados dentro do contexto do Vue assim como nossas páginas e componentes, conseguimos ter acesso ao access_token armazenado na store e assim repassá-lo para a classe de serviço que se comunica com o back-end. Além disso o nosso middleware se encarrega de sempre salvar na store o token mais atualizado possível, então quando o authService executar o método de silent-refresh o novo token já será salvo na store antes que o usuário acesse a página solicitada e é por isso que acessamos a camada de serviço através deste composable ao invés de instanciar as classes diretamente. Agora podemos acessar os métodos da classe ApplicationService assim:

```typescript
const services = useServices()
const posts = await services.$application.getPosts()
```

E assim chegamos ao fim deste tutorial, espero que tenha gostado ;)
