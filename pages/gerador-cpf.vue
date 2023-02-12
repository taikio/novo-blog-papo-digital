<script lang="ts" setup>
import { generateCPF, formatCPF } from '@brazilian-utils/brazilian-utils'
import generateMeta from '@/utils/generateMeta'

const inputCpf = ref('')
const generateWithPoints = ref(false)
const nuxtApp = useNuxtApp()

const pageTitle = 'Papo Digital | Gerador de CPF'
const pageDescription = `Este gerador de CPF tem como objetivo auxiliar programadores, estudantes e 
          testadores a gerar CPFs válidos para utilização em testes de softwares em desenvolvimento.`
const pageUrl = 'https://papodigital.net.br/gerador-cpf'

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
  title: 'Papo Digital | Gerador de CPF',
  meta: pageMetaTags,
})

const toggleGenerateWithPoints = () => {
  generateWithPoints.value = !generateWithPoints.value
}

const generateNewCpf = () => {
  inputCpf.value = generateWithPoints.value ? formatCPF(generateCPF()) : generateCPF()
}

const copyToClipboard = () => {
  if (!inputCpf.value) {
    return
  }
  navigator.clipboard.writeText(inputCpf.value)
  nuxtApp.$toast.info('CPF copiado com sucesso!')
}
</script>

<template>
  <div>
    <header class="z-20 flex w-full flex-col-reverse px-8 pt-2 md:flex-row">
      <div class="mt-4 md:mt-40">
        <h2 class="text-2xl text-dark-purple-500 md:text-4xl">Gerador de CPF</h2>

        <p class="text-md my-3 text-black-400 md:my-8 md:text-lg">
          Este gerador de CPF tem como objetivo auxiliar programadores, estudantes e testadores a
          gerar CPF`s válidos para utilização em testes de softwares em desenvolvimento.
        </p>
      </div>

      <img
        src="/cover-page-gerador-cpf.png"
        alt="Gerador de CPF"
        class="mx-auto w-10/12 md:w-5/12"
      />
    </header>

    <!-- ===== CPF generator container ===== -->
    <section class="flex w-full flex-col items-center px-8 py-4 md:py-2 md:px-40">
      <div class="flex w-full flex-col gap-4 md:flex-row md:justify-between md:gap-0">
        <!-- ===== Checkbox generate with points ===== -->
        <div
          class="flex cursor-pointer items-center gap-4 rounded-md border py-2 px-4 hover:border-primary-500 hover:bg-primary-100"
          :class="{
            'border-primary-500 bg-primary-100 text-primary-500': generateWithPoints,
            'text-black-400': !generateWithPoints,
          }"
          @click="toggleGenerateWithPoints()"
        >
          <Icon
            :name="generateWithPoints ? 'feather:check-square' : 'feather:square'"
            class="text-lg"
          />

          <span class="text-lg md:text-xl">Gerar com Pontuação?</span>
        </div>

        <!-- ===== Button generate CPF ===== -->
        <button
          type="button"
          class="rounded-xl border border-primary-500 bg-primary-500 py-2 px-6 text-lg text-white transition-all duration-200 hover:shadow-lg md:px-3 md:text-xl"
          @click="generateNewCpf()"
        >
          Gerar Novo CPF
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
          id="cpf-input"
          type="text"
          v-model="inputCpf"
          placeholder="Gerar CPF"
          autocomplete="off"
          readonly
          class="b-gray-500 duration-50 w-full rounded-xl border py-2 pr-9 pl-2 text-sm shadow-lg transition-all focus:outline-none focus:ring focus:ring-primary-500 md:py-3 md:pr-12 md:pl-4 md:text-xl"
        />
      </div>
    </section>

    <!-- ===== Page Description ===== -->
    <section class="mt-48 flex w-full flex-col gap-6 px-8">
      <h2 class="text-xl text-black-500 md:text-2xl">Saiba como são gerados os CPF`s</h2>

      <p class="text-xs text-black-400 md:text-lg">
        O CPF é composto por onze algarismos em que os dois últimos são chamados de dígitos
        verificadores (DV's), criados a partir dos nove primeiros, validando o número como um todo.
        <br />
        O cálculo destes dígitos é realizado em duas etapas utilizando o módulo de divisão 11.
      </p>

      <h2 class="text-xl text-black-500 md:text-2xl">Como conferir a origem de um CPF</h2>

      <p class="text-xs text-black-400 md:text-lg">
        Um meio interessante para a conferência do número de um CPF é identificar o ESTADO em que
        este foi emitido.
        <br />
        Esse número corresponde ao último algarismo anterior aos dois dígitos de controle. No
        exemplo CPF nº 000.000.006-00, o número 6 mostra que esse documento foi emitido no estado de
        Minas Gerais.
        <br />
        Veja abaixo os códigos correspondentes a outros estados brasileiros:
      </p>

      <ul class="text-xs text-black-400 md:text-lg">
        <li>1 - Distrito Federal, Goiás, Mato Grosso do Sul e Tocantins;</li>
        <li>2 - Pará, Amazonas, Acre, Amapá, Rondônia e Roraima;</li>
        <li>3 - Ceará, Maranhão e Piauí;</li>
        <li>4 - Pernambuco, Rio Grande do Norte, Paraíba e Alagoas;</li>
        <li>5 - Bahia e Sergipe;</li>
        <li>6 - Minas Gerais;</li>
        <li>7 - Rio de Janeiro e Espírito Santo;</li>
        <li>8 - São Paulo;</li>
        <li>9 - Paraná e Santa Catarina;</li>
        <li>0 - Rio Grande do Sul.</li>
      </ul>
    </section>
  </div>
</template>
