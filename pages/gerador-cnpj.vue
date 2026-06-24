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

const toggleGenerateWithPoints = () => {
  generateWithPoints.value = !generateWithPoints.value
}

const toggleGenerateAlfa = () => {
  generateAlfa.value = !generateAlfa.value
}

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

const copyToClipboard = () => {
  if (!inputCnpj.value) {
    return
  }
  navigator.clipboard.writeText(inputCnpj.value)
  nuxtApp.$toast.info('CNPJ copiado para a área de transferência')
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
        </div>

        <!-- ===== Button generate CNPJ ===== -->
        <button
          type="button"
          class="rounded-xl border border-primary-500 bg-primary-500 py-2 px-6 text-lg text-white transition-all duration-200 hover:shadow-lg md:px-3 md:text-xl"
          @click="generateNewCnpj()"
        >
          Gerar Novo CNPJ
        </button>
      </div>

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
