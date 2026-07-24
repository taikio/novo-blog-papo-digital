---
title: Quando uma regra de negócio merece virar um Composable?
lowercaseTitle: quando uma regra de negócio merece virar um composable?
description: Se você já trabalha com Vue há um tempo, provavelmente deve associar composable com regra de negócio. É aqui que mora um erro arquitetural silencioso, que só aparece meses depois, quando o projeto tem 40 composables e ninguém mais sabe onde uma regra específica realmente vive. Neste post vou te mostrar de forma prática quando uma regra deve realmente ir para um composable.
cover: cover-quando-usar-composables.png
coverAlt: Quando usar composables no Vue
publishDate: 2026-07-24T19:30:00.003Z
tag: VueJS
---

# Introdução

Se você já trabalha com Vue e Nuxt há um tempo, provavelmente já ouviu (ou repetiu) a seguinte frase: "isso é regra de negócio, então bora extrair pra um composable". É aqui que mora um erro arquitetural silencioso, que só aparece meses depois, quando o projeto tem 40 composables e ninguém mais sabe onde uma regra específica realmente vive.

Neste post eu quero desconstruir essa associação automática. Regra de negócio e composable não são sinônimos. Composable é uma ferramenta de reuso. Regra de negócio é um conceito de domínio. Elas só se encontram quando existe uma condição bem específica — e é justamente essa condição que vamos mapear aqui.

Vou usar como base a arquitetura que costumo aplicar nos meus projetos: **Smart / Dumb Components** com uma **Store** central de dados. Se você ainda não conhece esse padrão, a explicação rápida abaixo já é suficiente pra acompanhar o resto do post.

# Revisando a Arquitetura: Smart, Dumb e a Store

Nesse padrão, cada peça tem uma responsabilidade fechada:

- **Dumb Component** — é puramente apresentacional. Recebe `props`, emite eventos, não sabe nada sobre a origem dos dados nem sobre as regras que os geraram. Ele é, propositalmente, burro.
- **Smart Component** — é o orquestrador. Ele lida com regras de negócio: validação, transformação de dados, decisões condicionais, e é quem conversa com a Store.
- **Store** — é a camada de dados. Faz as requisições HTTP, normaliza e disponibiliza o estado que os Smart Components consomem.

Repare que, nessa divisão, a responsabilidade pela regra de negócio já tem um lar: o Smart Component. Isso é importante porque muda completamente a pergunta que você deveria estar fazendo. Não é "essa lógica é regra de negócio?", é **"essa regra de negócio precisa existir em mais de um lugar ao mesmo tempo?"**

# O que é, de fato, uma Regra de Negócio

Antes de ir pro gatilho de extração, vale alinhar o conceito, porque é fácil confundir regra de negócio com lógica de apresentação.

**Regra de negócio** é uma decisão do domínio, independente de como ela é exibida. Exemplos: calcular elegibilidade a um desconto, validar se um CPF pode realizar determinada operação, decidir se uma cobrança está vencida.

**Lógica de apresentação** é sobre como algo aparece na tela: formatar uma data, abrir/fechar um accordion, controlar um estado de loading local. Mesmo que essa lógica se repita entre componentes, ela **não** é candidata natural a composable de domínio — na maioria das vezes ela nem deveria sair do Dumb Component, ou no máximo vira um composable de UI (`useToggle`, por exemplo), que é uma categoria completamente diferente da que estamos discutindo aqui.

Essa distinção importa porque é comum ver times extraindo composables de UI com o mesmo critério que deveriam usar para regra de negócio, e isso polui a camada errada.

# O Composable Não é o Lar Padrão — é a Exceção

Aqui está o ponto que eu mais quero que fique claro: **se cada Smart Component já isola sua própria responsabilidade, extrair uma regra para um composable antes de ela ser reutilizada é abstração prematura.**

E abstração prematura tem custo real:

- **Indireção desnecessária** — pra entender a regra, agora você precisa pular do Smart Component pro composable, e às vezes do composable pra outro composable.
- **Acoplamento escondido** — um composable "genérico demais" tende a acumular parâmetros e flags condicionais pra atender casos que na verdade são regras diferentes disfarçadas de uma só.
- **Debugging mais caro** — regra de negócio dentro do Smart Component é rastreável em um único arquivo. Regra espalhada em composables aninhados exige reconstruir o fluxo mentalmente.

Isso não é purismo teórico — é o princípio do **YAGNI** (_You Aren't Gonna Need It_) aplicado à arquitetura de componentes. Reuso hipotético não é reuso. E o composable que você criou "porque um dia outro componente pode precisar" é, na prática, um componente Smart escondido atrás de uma abstração que ninguém pediu.

# O Verdadeiro Gatilho: Duplicação Real, Não Antecipação

A regra prática que eu sigo é simples: **a extração acontece quando a duplicação acontece — não antes.**

Na primeira vez que você escreve a regra, ela fica no Smart Component. Se um segundo Smart Component precisar exatamente da mesma regra, _aí sim_ você tem sinal suficiente pra extrair. Isso é uma variação do "Rule of Three" que muita gente usa pra decidir quando refatorar duplicação de código — mas para regra de negócio, eu prefiro ser ainda mais rígido e considerar a segunda ocorrência real já como gatilho válido, porque regra de negócio duplicada tem um risco adicional que duplicação de UI não tem: **divergência silenciosa**. Se a regra existe em dois lugares e um deles for atualizado sem o outro, você não tem um bug visual — você tem uma inconsistência de domínio, que em contextos sensíveis (finanças, saúde) é especialmente perigosa.

# Checklist: Quando uma Regra de Negócio Merece um Composable

Use esses pontos como filtro antes de extrair. Se a resposta for "sim" pra pelo menos os três primeiros, a extração se justifica.

1. **Reuso simultâneo e real** — dois ou mais Smart Components _já_ precisam da mesma regra, agora, não "possivelmente no futuro". Reuso hipotético não conta.
2. **A regra é pura o suficiente pra ser testada isoladamente** — você consegue escrever um teste que chama a função/composable diretamente, sem montar componente nenhum, e validar entrada e saída de forma determinística.
3. **A regra não depende do ciclo de vida específico de um único componente** — ela não está amarrada a uma ref de template, a um hook de lifecycle particular ou a um contexto que só faz sentido dentro daquele Smart Component específico.
4. **Uma mudança na regra precisa refletir em todos os pontos de uso ao mesmo tempo** — ou seja, ela é uma fonte única de verdade do domínio, e mantê-la duplicada é um risco de divergência, não só de repetição de código.
5. **(Sinal complementar) A regra, se deixada no Smart Component, prejudicaria a legibilidade da orquestração** — isso sozinho não justifica a extração, mas reforça a decisão quando combinado com os pontos acima.

# Exemplo Prático

Vamos usar um cenário realista: uma regra de **elegibilidade a desconto por pagamento antecipado** de uma fatura. Ela precisa aparecer em dois lugares:

- No **Checkout**, mostrando o desconto em tempo real antes da confirmação do pagamento.
- No **Dashboard**, resumindo quanto o usuário economizaria se pagasse todas as faturas em aberto antecipadamente.

Dois Smart Components, mesma regra. É exatamente o gatilho que definimos no checklist.

# Passo 1: A Regra, Pura e Testável

```typescript
// composables/useEarlyPaymentDiscount.ts
import { computed, type Ref } from 'vue'

interface Invoice {
  amount: number
  dueDate: Date
  paymentDate: Date
}

interface DiscountTier {
  minDaysEarly: number
  percentage: number
}

const DISCOUNT_TIERS: DiscountTier[] = [
  { minDaysEarly: 10, percentage: 0.05 },
  { minDaysEarly: 5, percentage: 0.02 },
]

export function useEarlyPaymentDiscount(invoice: Ref<Invoice>) {
  const daysEarly = computed(() => {
    const diffMs =
      invoice.value.dueDate.getTime() - invoice.value.paymentDate.getTime()
    return Math.floor(diffMs / (1000 * 60 * 60 * 24))
  })

  const discountPercentage = computed(() => {
    const tier = DISCOUNT_TIERS.find((t) => daysEarly.value >= t.minDaysEarly)
    return tier?.percentage ?? 0
  })

  const isEligible = computed(() => discountPercentage.value > 0)

  const discountedAmount = computed(() => {
    return invoice.value.amount * (1 - discountPercentage.value)
  })

  return { daysEarly, discountPercentage, isEligible, discountedAmount }
}
```

Repare que esse composable não sabe nada sobre HTTP, nada sobre UI. Ele recebe um `Ref<Invoice>` e devolve valores computados. Isso é o que te permite testá-lo isoladamente, sem montar nenhum componente:

```typescript
// composables/useEarlyPaymentDiscount.test.ts
import { ref } from 'vue'
import { describe, it, expect } from 'vitest'
import { useEarlyPaymentDiscount } from './useEarlyPaymentDiscount'

describe('useEarlyPaymentDiscount', () => {
  it('aplica 5% de desconto quando o pagamento ocorre 10 dias ou mais antes do vencimento', () => {
    const invoice = ref({
      amount: 1000,
      dueDate: new Date('2026-08-20'),
      paymentDate: new Date('2026-08-08'),
    })

    const { isEligible, discountPercentage, discountedAmount } =
      useEarlyPaymentDiscount(invoice)

    expect(isEligible.value).toBe(true)
    expect(discountPercentage.value).toBe(0.05)
    expect(discountedAmount.value).toBe(950)
  })
})
```

# Passo 2: O Smart Component do Checkout

```vue
<!-- CheckoutSmart.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useInvoiceStore } from '@/stores/invoice'
import { useEarlyPaymentDiscount } from '@/composables/useEarlyPaymentDiscount'
import CheckoutSummaryDumb from './CheckoutSummaryDumb.vue'

const props = defineProps<{ invoiceId: string }>()

const invoiceStore = useInvoiceStore()
const invoice = computed(() => invoiceStore.getById(props.invoiceId))

const { isEligible, discountPercentage, discountedAmount } =
  useEarlyPaymentDiscount(invoice)

function handleConfirmPayment() {
  invoiceStore.pay(props.invoiceId, discountedAmount.value)
}
</script>

<template>
  <CheckoutSummaryDumb
    :original-amount="invoice.amount"
    :discounted-amount="discountedAmount"
    :discount-percentage="discountPercentage"
    :is-eligible="isEligible"
    @confirm="handleConfirmPayment"
  />
</template>
```

# Passo 3: O Segundo Smart Component, no Dashboard

```vue
<!-- DashboardSavingsSmart.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useInvoiceStore } from '@/stores/invoice'
import { useEarlyPaymentDiscount } from '@/composables/useEarlyPaymentDiscount'
import DashboardSavingsDumb from './DashboardSavingsDumb.vue'

const invoiceStore = useInvoiceStore()

const totalPotentialSavings = computed(() => {
  return invoiceStore.openInvoices.reduce((total, invoice) => {
    const { isEligible, originalAmount, discountedAmount } =
      useEarlyPaymentDiscount(ref(invoice))
    if (!isEligible.value) return total
    return total + (originalAmount - discountedAmount.value)
  }, 0)
})
</script>

<template>
  <DashboardSavingsDumb :total-potential-savings="totalPotentialSavings" />
</template>
```

É aqui que a decisão se prova certa: a mesma regra, chamada duas vezes, em contextos de UI completamente diferentes, sem duplicar uma linha da lógica de elegibilidade. Se amanhã a política de desconto mudar — digamos, um novo tier de 7% para pagamentos com 15 dias de antecedência — você altera um único arquivo, e Checkout e Dashboard refletem a mudança automaticamente. Se essa regra tivesse ficado duplicada nos dois Smart Components, essa mesma mudança exigiria lembrar de tocar em dois lugares — e "lembrar" não é uma estratégia de arquitetura confiável.

# Conclusão

A pergunta certa nunca é "isso é regra de negócio?". Dentro de uma arquitetura Smart/Dumb bem definida, toda regra de negócio já tem endereço fixo: o Smart Component. A pergunta certa é "essa regra já está sendo demandada por mais de um Smart Component, agora, de forma real?". Só quando a resposta é sim — e a regra é pura, testável e desacoplada do ciclo de vida de um componente específico — o composable deixa de ser sobre-engenharia e passa a ser a ferramenta certa pro trabalho.

Guarde o checklist, aplique nos seus próprios projetos, e desconfie de qualquer composable criado "por precaução". Arquitetura boa não é sobre extrair cedo — é sobre extrair na hora certa.

Espero que este post tenha te ajudado a repensar essa decisão no seu próprio código. Até a próxima 😉
