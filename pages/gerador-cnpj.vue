<script lang="ts" setup>
import { generateCNPJ, formatCNPJ } from '@brazilian-utils/brazilian-utils'
import generateMeta from '@/utils/generateMeta'
import { useCnpjAlfa } from '#imports'

const inputCnpj = ref('')
const generateWithPoints = ref(false)
const generateAlfa = ref(false)
const nuxtApp = useNuxtApp()

const pageTitle = 'Gerador de CNPJ | Papo Digital'
const pageDescription = `Este gerador de CNPJ tem como objetivo auxiliar programadores, estudantes e
          testadores a gerar CNPJs válidos tanto no padrão atual quanto no padrão alfanumérico.`
const pageUrl = 'https://papodigital.net.br/gerador-cnpj'

const pageMetaTags = generateMeta({
  pageTitle,
  description: pageDescription,
  contentType: 'website',
  url: pageUrl,
  twitterUrl: pageUrl,
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})

useHead({
  title: 'Papo Digital | Gerador de CNPJ',
  meta: pageMetaTags,
})


const { generate: generateCNPJAlfa } = useCnpjAlfa()

const generateNewCnpj = () => {
  if (generateAlfa.value) {
    inputCnpj.value = generateCNPJAlfa({ formatted: generateWithPoints.value })
  } else {
    inputCnpj.value = generateWithPoints.value
      ? formatCNPJ(generateCNPJ())
      : generateCNPJ()
  }
}

</script>

<template>
  <div>
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

    <!-- ===== CNPJ generator container ===== -->
    <section
      class="flex w-full flex-col items-center px-8 py-4 md:py-2 md:px-40"
    >
      <div
        class="flex w-full flex-col gap-4 lg:flex-row lg:justify-between lg:gap-0"
      >
        <div class="flex w-full flex-col lg:flex-row lg:w-auto gap-2">
          <!-- ===== Checkbox generate alfa format ===== -->
          <ToggleCheckbox v-model="generateAlfa" label="Formato Alfanumérico?" />

          <!-- ===== Checkbox generate with points ===== -->
          <ToggleCheckbox v-model="generateWithPoints" label="Gerar com Pontuação?" />
        </div>

        <!-- ===== Button generate CNPJ ===== -->
        <PrimaryButton @click="generateNewCnpj()">Gerar Novo CNPJ</PrimaryButton>
      </div>

      <CopyInput
        v-model="inputCnpj"
        placeholder="Gerar CNPJ"
        @copy="nuxtApp.$toast.info('CNPJ copiado para a área de transferência')"
      />
    </section>

    <!-- ===== Page Description ===== -->
    <section class="mt-48 flex w-full flex-col gap-6 px-8">
      <AdBanner ad-slot="5036362920" />

      <h2 class="text-xl text-black-500 md:text-2xl">
        Saiba mais sobre o algoritmo do CNPJ
      </h2>

      <p class="text-xs text-black-400 md:text-lg">
        O CNPJ é composto por quatorze algarismos, divididos em três blocos:
      </p>

      <ol class="text-xs text-black-400 md:text-lg">
        <li>
          o primeiro, que representa o número da inscrição propriamente dito;
        </li>
        <li>
          o segundo, localizado após a barra, que representa um código único
          para a matrix ou filial;
        </li>
        <li>
          o terceiro, representados pelos dois últimos valores chamados de
          dígitos verificadores (DV).
        </li>
      </ol>

      <p class="text-xs text-black-400 md:text-lg">
        Os dígitos verificadores (DV's) são criados a partir dos doze primeiros.
        O cálculo é feito em duas etapas utilizando o módulo de divisão 11.
      </p>

      <h2 class="text-xl text-black-500 md:text-2xl">
        Conheça o novo CNPJ Alfanumérico
      </h2>

      <p class="text-xs leading-3 text-black-400 md:text-lg">
        O CNPJ Alfanumérico mantém 14 posições: 12 caracteres alfanuméricos
        (0–9, A–Z) seguidos de 2 dígitos verificadores (DVs) numéricos.
        <br />
        A implantação está prevista para 2026 pela Receita Federal, com período
        de convivência entre o formato atual (apenas numérico) e o novo padrão.
        <br />
        Na geração/validação, continua o Módulo 11 com os mesmos pesos do CNPJ
        clássico;
        <br />
        a mudança está na conversão dos caracteres: cada símbolo é transformado
        em valor pelo seu código ASCII 48 (ex.: A=17, Z=42) antes do cálculo dos
        DVs (DV1 pelas 12 posições; DV2 pelas 12 + DV1; regra: resto<2 ⇒ 0,
        senão 11−resto). A máscara permanece AA.AAA.AAA/AAAA-DV.
      </p>
    </section>
  </div>
</template>
