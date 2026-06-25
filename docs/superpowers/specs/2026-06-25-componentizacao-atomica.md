# Componentização Atômica — Papo Digital

**Data:** 2026-06-25  
**Branch:** feature/refatoracao-arquitetural  
**Status:** Aprovado

## Contexto

O projeto é um blog Nuxt 3 (`papodigital.net.br`) sem pasta `layouts/` — toda estrutura global está em `app.vue`. Uma varredura nas páginas identificou 4 blocos de código repetidos que justificam extração para componentes reutilizáveis.

Páginas envolvidas: `pages/index.vue`, `pages/gerador-cpf.vue`, `pages/gerador-cnpj.vue`, `pages/gerador-qr-code.vue`.

A página `pages/gerador-de-pessoas.vue` está **fora do escopo** — será refatorada inteiramente em momento futuro.

## Decisões de escopo

- **Sem `ToolPageLayout`:** as páginas de ferramentas futuras podem ter estruturas diferentes, então criar um layout para apenas 2–3 páginas não justifica o custo de abstração.
- **`PrimaryButton` como componente Vue:** preferido a `@apply` no Tailwind para garantir consistência visual centralizada.

---

## Componentes a criar

### 1. `components/primary-button.vue`

Encapsula o estilo de botão primário repetido em todas as páginas de ferramentas.

**Props:**

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo nativo do botão |

**Slot default:** conteúdo/label do botão.

**Eventos:** `click` e demais eventos nativos caem via `$attrs` sem necessidade de declaração explícita.

**Uso:**
```vue
<PrimaryButton @click="generateNewCpf">Gerar Novo CPF</PrimaryButton>
<PrimaryButton type="submit">Enviar</PrimaryButton>
```

**Páginas que adotarão:** `gerador-cpf.vue`, `gerador-cnpj.vue`, `gerador-qr-code.vue`

---

### 2. `components/toggle-checkbox.vue`

Encapsula o padrão de checkbox estilizado como botão com borda, ícone feather e texto, usado nas páginas de geração de CPF e CNPJ.

**Props:**

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `modelValue` | `boolean` | sim | Estado ativo/inativo (v-model) |
| `label` | `string` | sim | Texto exibido ao lado do ícone |

**Emite:** `update:modelValue`

**Comportamento visual:**
- Ativo: borda e texto `primary-500`, fundo `primary-100`
- Inativo: texto `black-400`, borda padrão
- Ícone: `feather:check-square` (ativo) / `feather:square` (inativo)

**Uso:**
```vue
<ToggleCheckbox v-model="generateWithPoints" label="Gerar com Pontuação?" />
<ToggleCheckbox v-model="generateAlfa" label="Formato Alfanumérico?" />
```

**Páginas que adotarão:** `gerador-cpf.vue` (1 instância), `gerador-cnpj.vue` (2 instâncias)

---

### 3. `components/copy-input.vue`

Encapsula o input readonly com ícone de cópia absoluto à direita. O componente escreve no clipboard internamente e emite `copy` para que a página exiba o toast com mensagem específica.

**Props:**

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `modelValue` | `string` | sim | Valor exibido no input (v-model) |
| `placeholder` | `string` | não | Placeholder do input |

**Emite:**
- `update:modelValue` — para compatibilidade com v-model
- `copy` — disparado após a escrita no clipboard; a guarda `if (!modelValue) return` fica dentro do componente

**Uso:**
```vue
<CopyInput
  v-model="inputCpf"
  placeholder="Gerar CPF"
  @copy="nuxtApp.$toast.info('CPF copiado para a área de transferência')"
/>
```

**Páginas que adotarão:** `gerador-cpf.vue`, `gerador-cnpj.vue`

---

### 4. `components/page-hero.vue`

Encapsula o bloco `<header>` com título à esquerda e imagem à direita, presente em todas as páginas principais. Usa slot default para o conteúdo descritivo, permitindo markup livre (incluindo `<br />` usado no `index.vue`).

**Props:**

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `title` | `string` | sim | Título principal do hero |
| `imageSrc` | `string` | sim | Caminho da imagem (ex: `/cover-page-gerador-cpf.png`) |
| `imageAlt` | `string` | sim | Texto alternativo da imagem |

**Slot default:** corpo da descrição — texto, `<br />`, qualquer markup inline.

**Uso:**
```vue
<!-- Página de ferramenta -->
<PageHero
  title="Gerador de CPF"
  image-src="/cover-page-gerador-cpf.png"
  image-alt="Gerador de CPF"
>
  Este gerador tem como objetivo auxiliar programadores...
</PageHero>

<!-- index.vue -->
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

**Páginas que adotarão:** `index.vue`, `gerador-cpf.vue`, `gerador-cnpj.vue`, `gerador-qr-code.vue`

---

## Ordem de implementação sugerida

1. `PrimaryButton` — mais simples, sem dependências
2. `ToggleCheckbox` — isolado, fácil de testar visualmente
3. `CopyInput` — lógica de clipboard
4. `PageHero` — maior impacto (4 páginas)

## Fora do escopo desta spec

- Refatoração de `gerador-de-pessoas.vue`
- Criação de `ToolPageLayout`
- Novos componentes além dos 4 listados
- Testes automatizados (projeto não tem test runner configurado)
