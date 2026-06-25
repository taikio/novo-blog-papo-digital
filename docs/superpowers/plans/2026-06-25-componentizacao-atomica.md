# Componentização Atômica Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extrair 4 blocos repetidos em componentes Vue reutilizáveis (`PrimaryButton`, `ToggleCheckbox`, `CopyInput`, `PageHero`) e adotá-los nas páginas existentes sem alterar nenhum comportamento ou visual.

**Architecture:** Cada componente é criado como um arquivo `.vue` independente em `components/`. As páginas são refatoradas para usar os novos componentes, removendo o código duplicado e as funções auxiliares que migraram para os componentes. Nenhum novo estado ou lógica é introduzido.

**Tech Stack:** Nuxt 3, Vue 3 Composition API com `<script setup lang="ts">`, Tailwind CSS, Nuxt Icon (`feather:*`), vue-toastification

## Global Constraints

- Todos os componentes usam `<script setup lang="ts">`
- Paleta customizada: `primary-{100–500}`, `dark-purple-500`, `black-{400,500}` — nunca substituir por cores genéricas do Tailwind
- Ícones via `<Icon name="feather:*" />` (Nuxt Icon — já configurado globalmente, sem necessidade de import)
- Toast via `nuxtApp.$toast` obtido com `useNuxtApp()` — já presente nas páginas
- Não há test runner — verificação é sempre visual via `npm run dev` (porta 3000)
- Nenhum comportamento visual ou funcional deve mudar após cada task
- `gerador-de-pessoas.vue` está **fora do escopo** — não tocar neste arquivo

---

### Task 1: PrimaryButton

**Files:**
- Create: `components/primary-button.vue`
- Modify: `pages/gerador-cpf.vue` (1 botão)
- Modify: `pages/gerador-cnpj.vue` (1 botão)
- Modify: `pages/gerador-qr-code.vue` (4 botões)

**Interfaces:**
- Produces: `<PrimaryButton type?="button|submit|reset">Label</PrimaryButton>`
- `@click` e demais eventos caem via `$attrs` no `<button>` raiz automaticamente (Vue 3 fallthrough attrs)

- [ ] **Step 1: Criar `components/primary-button.vue`**

```vue
<script lang="ts" setup>
defineProps<{
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    class="rounded-xl border border-primary-500 bg-primary-500 py-2 px-6 text-lg text-white transition-all duration-200 hover:shadow-lg md:px-3 md:text-xl"
  >
    <slot />
  </button>
</template>
```

- [ ] **Step 2: Substituir botão em `pages/gerador-cpf.vue`**

Localizar e substituir (bloco do botão "Gerar Novo CPF"):
```html
        <!-- ===== Button generate CPF ===== -->
        <button
          type="button"
          class="rounded-xl border border-primary-500 bg-primary-500 py-2 px-6 text-lg text-white transition-all duration-200 hover:shadow-lg md:px-3 md:text-xl"
          @click="generateNewCpf()"
        >
          Gerar Novo CPF
        </button>
```
Por:
```html
        <!-- ===== Button generate CPF ===== -->
        <PrimaryButton @click="generateNewCpf()">Gerar Novo CPF</PrimaryButton>
```

- [ ] **Step 3: Substituir botão em `pages/gerador-cnpj.vue`**

Localizar e substituir (bloco do botão "Gerar Novo CNPJ"):
```html
        <!-- ===== Button generate CNPJ ===== -->
        <button
          type="button"
          class="rounded-xl border border-primary-500 bg-primary-500 py-2 px-6 text-lg text-white transition-all duration-200 hover:shadow-lg md:px-3 md:text-xl"
          @click="generateNewCnpj()"
        >
          Gerar Novo CNPJ
        </button>
```
Por:
```html
        <!-- ===== Button generate CNPJ ===== -->
        <PrimaryButton @click="generateNewCnpj()">Gerar Novo CNPJ</PrimaryButton>
```

- [ ] **Step 4: Substituir os 4 botões em `pages/gerador-qr-code.vue`**

**Botão "Carregar Imagem"** (dentro do slot do `<image-upload>`):
```html
            <button
              type="button"
              class="rounded-xl border border-primary-500 bg-primary-500 py-2 px-6 text-lg text-white transition-all duration-200 hover:shadow-lg md:px-3 md:text-xl"
            >
              Carregar Imagem
            </button>
```
Por:
```html
            <PrimaryButton>Carregar Imagem</PrimaryButton>
```

**Botão "Gerar QR Code"**:
```html
      <!-- ===== Button generate CPF ===== -->
      <button
        type="button"
        class="rounded-xl border border-primary-500 bg-primary-500 py-2 px-6 text-lg text-white transition-all duration-200 hover:shadow-lg md:px-3 md:text-xl"
        @click="generateQRCode()"
      >
        Gerar QR Code
      </button>
```
Por:
```html
      <!-- ===== Button generate CPF ===== -->
      <PrimaryButton @click="generateQRCode()">Gerar QR Code</PrimaryButton>
```

**Botão "Baixar QR Code"** (dentro do slot `#download`):
```html
          <button
            type="button"
            class="rounded-xl border border-primary-500 bg-primary-500 py-2 px-6 text-lg text-white transition-all duration-200 hover:shadow-lg md:px-3 md:text-xl"
            @click="() => pluginInstance.download()"
          >
            Baixar QR Code
          </button>
```
Por:
```html
          <PrimaryButton @click="() => pluginInstance.download()">Baixar QR Code</PrimaryButton>
```

**Botão "Gerar um novo"**:
```html
      <button
        type="button"
        class="rounded-xl border border-primary-500 bg-primary-500 py-2 px-6 text-lg text-white transition-all duration-200 hover:shadow-lg md:px-3 md:text-xl"
        @click="generateNew()"
      >
        Gerar um novo
      </button>
```
Por:
```html
      <PrimaryButton @click="generateNew()">Gerar um novo</PrimaryButton>
```

- [ ] **Step 5: Verificar visualmente**

```bash
npm run dev
```

Abrir `http://localhost:3000/gerador-cpf`, `http://localhost:3000/gerador-cnpj` e `http://localhost:3000/gerador-qr-code`. Confirmar que todos os botões mantêm aparência e comportamento idênticos ao anterior.

- [ ] **Step 6: Commitar**

```bash
git add components/primary-button.vue pages/gerador-cpf.vue pages/gerador-cnpj.vue pages/gerador-qr-code.vue
git commit -m "feat: extrai PrimaryButton e adota nas páginas de ferramentas"
```

---

### Task 2: ToggleCheckbox

**Files:**
- Create: `components/toggle-checkbox.vue`
- Modify: `pages/gerador-cpf.vue` (1 instância, remove `toggleGenerateWithPoints`)
- Modify: `pages/gerador-cnpj.vue` (2 instâncias, remove `toggleGenerateWithPoints` e `toggleGenerateAlfa`)

**Interfaces:**
- Produces: `<ToggleCheckbox v-model="bool" label="Texto do toggle" />`

- [ ] **Step 1: Criar `components/toggle-checkbox.vue`**

```vue
<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean
  label: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <div
    class="flex cursor-pointer items-center gap-4 rounded-md border py-2 px-4 hover:border-primary-500 hover:bg-primary-100"
    :class="{
      'border-primary-500 bg-primary-100 text-primary-500': modelValue,
      'text-black-400': !modelValue,
    }"
    @click="emit('update:modelValue', !modelValue)"
  >
    <Icon
      :name="modelValue ? 'feather:check-square' : 'feather:square'"
      class="text-lg"
    />
    <span class="text-lg md:text-xl">{{ label }}</span>
  </div>
</template>
```

- [ ] **Step 2: Atualizar `pages/gerador-cpf.vue`**

No `<template>`, substituir o bloco do toggle "Gerar com Pontuação?":
```html
        <!-- ===== Checkbox generate with points ===== -->
        <div
          class="flex cursor-pointer items-center gap-4 rounded-md border py-2 px-4 hover:border-primary-500 hover:bg-primary-100"
          :class="{
            'border-primary-500 bg-primary-100 text-primary-500':
              generateWithPoints,
            'text-black-400': !generateWithPoints,
          }"
          @click="toggleGenerateWithPoints()"
        >
          <Icon
            :name="
              generateWithPoints ? 'feather:check-square' : 'feather:square'
            "
            class="text-lg"
          />

          <span class="text-lg md:text-xl">Gerar com Pontuação?</span>
        </div>
```
Por:
```html
        <!-- ===== Checkbox generate with points ===== -->
        <ToggleCheckbox v-model="generateWithPoints" label="Gerar com Pontuação?" />
```

No `<script>`, remover a função `toggleGenerateWithPoints`:
```js
const toggleGenerateWithPoints = () => {
  generateWithPoints.value = !generateWithPoints.value
}
```

- [ ] **Step 3: Atualizar `pages/gerador-cnpj.vue`**

No `<template>`, substituir o bloco do toggle "Formato Alfanumérico?":
```html
          <!-- ===== Checkbox generate alfa format ===== -->
          <div
            class="flex cursor-pointer items-center gap-4 rounded-md border py-2 px-4 hover:border-primary-500 hover:bg-primary-100"
            :class="{
              'border-primary-500 bg-primary-100 text-primary-500':
                generateAlfa,
              'text-black-400': !generateAlfa,
            }"
            @click="toggleGenerateAlfa()"
          >
            <Icon
              :name="generateAlfa ? 'feather:check-square' : 'feather:square'"
              class="text-lg"
            />

            <span class="text-lg md:text-xl">Formato Alfanumérico?</span>
          </div>
```
Por:
```html
          <!-- ===== Checkbox generate alfa format ===== -->
          <ToggleCheckbox v-model="generateAlfa" label="Formato Alfanumérico?" />
```

Substituir o bloco do toggle "Gerar com Pontuação?":
```html
          <!-- ===== Checkbox generate with points ===== -->
          <div
            class="flex cursor-pointer items-center gap-4 rounded-md border py-2 px-4 hover:border-primary-500 hover:bg-primary-100"
            :class="{
              'border-primary-500 bg-primary-100 text-primary-500':
                generateWithPoints,
              'text-black-400': !generateWithPoints,
            }"
            @click="toggleGenerateWithPoints()"
          >
            <Icon
              :name="
                generateWithPoints ? 'feather:check-square' : 'feather:square'
              "
              class="text-lg"
            />

            <span class="text-lg md:text-xl">Gerar com Pontuação?</span>
          </div>
```
Por:
```html
          <!-- ===== Checkbox generate with points ===== -->
          <ToggleCheckbox v-model="generateWithPoints" label="Gerar com Pontuação?" />
```

No `<script>`, remover ambas as funções toggle:
```js
const toggleGenerateWithPoints = () => {
  generateWithPoints.value = !generateWithPoints.value
}

const toggleGenerateAlfa = () => {
  generateAlfa.value = !generateAlfa.value
}
```

- [ ] **Step 4: Verificar visualmente**

```bash
npm run dev
```

Em `http://localhost:3000/gerador-cpf` e `http://localhost:3000/gerador-cnpj`:
- Clicar no toggle → deve ficar com borda e texto `primary-500` e fundo `primary-100`
- Clicar novamente → deve voltar ao estado inativo (borda padrão, texto `black-400`)
- No CNPJ, confirmar que os dois toggles funcionam de forma independente

- [ ] **Step 5: Commitar**

```bash
git add components/toggle-checkbox.vue pages/gerador-cpf.vue pages/gerador-cnpj.vue
git commit -m "feat: extrai ToggleCheckbox e adota nas páginas de ferramentas"
```

---

### Task 3: CopyInput

**Files:**
- Create: `components/copy-input.vue`
- Modify: `pages/gerador-cpf.vue` (remove `copyToClipboard`, substitui bloco do input)
- Modify: `pages/gerador-cnpj.vue` (remove `copyToClipboard`, substitui bloco do input)

**Interfaces:**
- Produces: `<CopyInput v-model="str" placeholder="..." @copy="handler" />`
- Internamente: ao clicar no ícone, o componente verifica `modelValue`, escreve no clipboard e emite `copy`; se `modelValue` estiver vazio, não faz nada
- `update:modelValue` não é emitido (input é readonly) — o pai controla o valor diretamente via `v-model`

- [ ] **Step 1: Criar `components/copy-input.vue`**

```vue
<script lang="ts" setup>
const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  copy: []
}>()

const handleCopy = () => {
  if (!props.modelValue) return
  navigator.clipboard.writeText(props.modelValue)
  emit('copy')
}
</script>

<template>
  <div class="relative mt-8 w-full">
    <span
      class="duration-50 absolute top-[0.60rem] right-3 text-black-400 transition-all hover:cursor-pointer hover:text-primary-500 md:top-[0.82rem]"
      @click="handleCopy"
    >
      <Icon name="feather:copy" class="text-lg md:text-2xl" />
    </span>
    <input
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      autocomplete="off"
      readonly
      class="b-gray-500 duration-50 w-full rounded-xl border py-2 pr-9 pl-2 text-sm shadow-lg transition-all focus:outline-none focus:ring focus:ring-primary-500 md:py-3 md:pr-12 md:pl-4 md:text-xl"
    />
  </div>
</template>
```

- [ ] **Step 2: Atualizar `pages/gerador-cpf.vue`**

No `<script>`, remover a função `copyToClipboard`:
```js
const copyToClipboard = () => {
  if (!inputCpf.value) {
    return
  }
  navigator.clipboard.writeText(inputCpf.value)
  nuxtApp.$toast.info('CPF copiado para a área de transferência')
}
```

No `<template>`, substituir o bloco `div.relative` do input:
```html
      <div class="relative mt-8 w-full">
        <span
          class="duration-50 absolute top-[0.60rem] right-3 text-black-400 transition-all hover:cursor-pointer hover:text-primary-500 md:top-[0.82rem]"
          @click="copyToClipboard()"
        >
          <Icon name="feather:copy" class="text-lg md:text-2xl" />
        </span>
        <input
          id="cpf-input"
          type="text"
          v-model="inputCpf"
          placeholder="Gerar CPF"
          autocomplete="off"
          readonly
          class="b-gray-500 duration-50 w-full rounded-xl border py-2 pr-9 pl-2 text-sm shadow-lg transition-all focus:outline-none focus:ring focus:ring-primary-500 md:py-3 md:pr-12 md:pl-4 md:text-xl"
        />
      </div>
```
Por:
```html
      <CopyInput
        v-model="inputCpf"
        placeholder="Gerar CPF"
        @copy="nuxtApp.$toast.info('CPF copiado para a área de transferência')"
      />
```

- [ ] **Step 3: Atualizar `pages/gerador-cnpj.vue`**

No `<script>`, remover a função `copyToClipboard`:
```js
const copyToClipboard = () => {
  if (!inputCnpj.value) {
    return
  }
  navigator.clipboard.writeText(inputCnpj.value)
  nuxtApp.$toast.info('CNPJ copiado para a área de transferência')
}
```

No `<template>`, substituir o bloco `div.relative` do input:
```html
      <div class="relative mt-8 w-full">
        <span
          class="duration-50 absolute top-[0.60rem] right-3 text-black-400 transition-all hover:cursor-pointer hover:text-primary-500 md:top-[0.82rem]"
          @click="copyToClipboard()"
        >
          <Icon name="feather:copy" class="text-lg md:text-2xl" />
        </span>
        <input
          id="cnpj-input"
          type="text"
          v-model="inputCnpj"
          placeholder="Gerar CNPJ"
          autocomplete="off"
          readonly
          class="b-gray-500 duration-50 w-full rounded-xl border py-2 pr-9 pl-2 text-sm shadow-lg transition-all focus:outline-none focus:ring focus:ring-primary-500 md:py-3 md:pr-12 md:pl-4 md:text-xl"
        />
      </div>
```
Por:
```html
      <CopyInput
        v-model="inputCnpj"
        placeholder="Gerar CNPJ"
        @copy="nuxtApp.$toast.info('CNPJ copiado para a área de transferência')"
      />
```

- [ ] **Step 4: Verificar visualmente**

```bash
npm run dev
```

Em `http://localhost:3000/gerador-cpf` e `http://localhost:3000/gerador-cnpj`:
1. Clicar no ícone de cópia sem valor → nada deve acontecer (sem toast, sem erro)
2. Gerar um valor → clicar no ícone → toast deve aparecer com a mensagem correta
3. Colar o valor em qualquer campo de texto → confirmar que o valor gerado foi copiado corretamente

- [ ] **Step 5: Commitar**

```bash
git add components/copy-input.vue pages/gerador-cpf.vue pages/gerador-cnpj.vue
git commit -m "feat: extrai CopyInput e adota nas páginas de ferramentas"
```

---

### Task 4: PageHero

**Files:**
- Create: `components/page-hero.vue`
- Modify: `pages/index.vue`
- Modify: `pages/gerador-cpf.vue`
- Modify: `pages/gerador-cnpj.vue`
- Modify: `pages/gerador-qr-code.vue`

**Interfaces:**
- Produces: `<PageHero title="str" image-src="str" image-alt="str"><slot description /></PageHero>`
- Slot default: conteúdo descritivo renderizado dentro de `<p>` — suporta texto simples e markup inline como `<br />`

- [ ] **Step 1: Criar `components/page-hero.vue`**

```vue
<script lang="ts" setup>
defineProps<{
  title: string
  imageSrc: string
  imageAlt: string
}>()
</script>

<template>
  <header class="z-20 flex w-full flex-col-reverse px-8 pt-2 md:flex-row">
    <div class="mt-4 md:mt-40">
      <h2 class="text-2xl text-dark-purple-500 md:text-4xl">
        {{ title }}
      </h2>
      <p class="text-md my-3 text-black-400 md:my-8 md:text-lg">
        <slot />
      </p>
    </div>
    <img
      :src="imageSrc"
      :alt="imageAlt"
      class="mx-auto w-10/12 md:w-5/12"
    />
  </header>
</template>
```

- [ ] **Step 2: Substituir header em `pages/gerador-cpf.vue`**

Substituir o bloco `<header>`:
```html
    <header class="z-20 flex w-full flex-col-reverse px-8 pt-2 md:flex-row">
      <div class="mt-4 md:mt-40">
        <h2 class="text-2xl text-dark-purple-500 md:text-4xl">
          Gerador de CPF
        </h2>

        <p class="text-md my-3 text-black-400 md:my-8 md:text-lg">
          Este gerador de CPF tem como objetivo auxiliar programadores,
          estudantes e testadores a gerar CPF`s válidos para utilização em
          testes de softwares em desenvolvimento.
        </p>
      </div>

      <img
        src="/cover-page-gerador-cpf.png"
        alt="Gerador de CPF"
        class="mx-auto w-10/12 md:w-5/12"
      />
    </header>
```
Por:
```html
    <PageHero
      title="Gerador de CPF"
      image-src="/cover-page-gerador-cpf.png"
      image-alt="Gerador de CPF"
    >
      Este gerador de CPF tem como objetivo auxiliar programadores,
      estudantes e testadores a gerar CPF`s válidos para utilização em
      testes de softwares em desenvolvimento.
    </PageHero>
```

- [ ] **Step 3: Substituir header em `pages/gerador-cnpj.vue`**

Substituir o bloco `<header>`:
```html
    <header class="z-20 flex w-full flex-col-reverse px-8 pt-2 md:flex-row">
      <div class="mt-4 md:mt-40">
        <h2 class="text-2xl text-dark-purple-500 md:text-4xl">
          Gerador de CNPJ
        </h2>

        <p class="text-md my-3 text-black-400 md:my-8 md:text-lg">
          Este gerador de CNPJ tem como objetivo auxiliar programadores,
          estudantes e testadores a gerar CNPJs válidos, tanto no padrão atual
          quanto no padrão alfanumérico.
        </p>
      </div>

      <img
        src="/cover-page-gerador-cpf.png"
        alt="Gerador de CPF"
        class="mx-auto w-10/12 md:w-5/12"
      />
    </header>
```
Por:
```html
    <PageHero
      title="Gerador de CNPJ"
      image-src="/cover-page-gerador-cpf.png"
      image-alt="Gerador de CNPJ"
    >
      Este gerador de CNPJ tem como objetivo auxiliar programadores,
      estudantes e testadores a gerar CNPJs válidos, tanto no padrão atual
      quanto no padrão alfanumérico.
    </PageHero>
```

- [ ] **Step 4: Substituir header em `pages/gerador-qr-code.vue`**

Substituir o bloco `<header>`:
```html
    <header class="z-20 flex w-full flex-col-reverse px-8 pt-2 md:flex-row">
      <div class="mt-4 md:mt-40">
        <h2 class="text-2xl text-dark-purple-500 md:text-4xl">
          Gerador de QR Code
        </h2>

        <p class="text-md my-3 text-black-400 md:my-8 md:text-lg">
          Crie QR Codes únicos, GRÁTIS! <br /><br />
          Além de ser 100% gratuito, você pode inserir imagens no QR Code para
          personalizá-lo e deixá-lo com a sua cara.
        </p>
      </div>

      <img
        src="/cover-page-qr-code.png"
        alt="Gerador de CPF"
        class="mx-auto w-10/12 md:w-5/12"
      />
    </header>
```
Por:
```html
    <PageHero
      title="Gerador de QR Code"
      image-src="/cover-page-qr-code.png"
      image-alt="Gerador de QR Code"
    >
      Crie QR Codes únicos, GRÁTIS! <br /><br />
      Além de ser 100% gratuito, você pode inserir imagens no QR Code para
      personalizá-lo e deixá-lo com a sua cara.
    </PageHero>
```

- [ ] **Step 5: Substituir header em `pages/index.vue`**

Substituir o bloco `<header>`:
```html
    <header class="z-20 flex w-full flex-col-reverse px-8 pt-2 md:flex-row">
      <div class="mt-4 md:mt-40">
        <h2 class="text-2xl text-dark-purple-500 md:text-4xl">
          Um Blog voltado para a comunidade dev
        </h2>

        <p class="text-md my-3 text-black-400 md:my-8 md:text-lg">
          Bem vindo(a) ao Blog Papo Digital! <br />
          Aqui você terá acesso a informações e tutoriais sobre tecnologia,
          programação e boas dicas sobre Carreira Tech
        </p>
      </div>

      <img
        src="/undraw_In_the_office.png"
        alt=""
        class="mx-auto w-10/12 md:w-5/12"
      />
    </header>
```
Por:
```html
    <PageHero
      title="Um Blog voltado para a comunidade dev"
      image-src="/undraw_In_the_office.png"
      image-alt=""
    >
      Bem vindo(a) ao Blog Papo Digital! <br />
      Aqui você terá acesso a informações e tutoriais sobre tecnologia,
      programação e boas dicas sobre Carreira Tech
    </PageHero>
```

- [ ] **Step 6: Verificar visualmente**

```bash
npm run dev
```

Verificar as 4 páginas (`http://localhost:3000`, `/gerador-cpf`, `/gerador-cnpj`, `/gerador-qr-code`):
- Desktop: título e descrição à esquerda, imagem à direita
- Mobile (redimensionar janela abaixo de 768px): imagem acima, título e descrição abaixo

- [ ] **Step 7: Commitar**

```bash
git add components/page-hero.vue pages/index.vue pages/gerador-cpf.vue pages/gerador-cnpj.vue pages/gerador-qr-code.vue
git commit -m "feat: extrai PageHero e adota em todas as páginas principais"
```
