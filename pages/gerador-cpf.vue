<script lang="ts" setup>
import { generateCPF, formatCPF } from '@brazilian-utils/brazilian-utils'
import generateMeta from '@/utils/generateMeta'

const inputCpf = ref('')
const generateWithPoints = ref(false)
const nuxtApp = useNuxtApp()

const pageTitle = 'Gerador de CPF | Papo Digital'
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


const generateNewCpf = () => {
  inputCpf.value = generateWithPoints.value
    ? formatCPF(generateCPF())
    : generateCPF()
}

</script>

<template>
  <div>
    <PageHero
      title="Gerador de CPF"
      image-src="/cover-page-gerador-cpf.png"
      image-alt="Gerador de CPF"
    >
      Este gerador de CPF tem como objetivo auxiliar programadores,
      estudantes e testadores a gerar CPF`s válidos para utilização em
      testes de softwares em desenvolvimento.
    </PageHero>

    <!-- ===== CPF generator container ===== -->
    <section
      class="flex w-full flex-col items-center px-8 py-4 md:py-2 md:px-40"
    >
      <div
        class="flex w-full flex-col gap-4 md:flex-row md:justify-between md:gap-0"
      >
        <!-- ===== Checkbox generate with points ===== -->
        <ToggleCheckbox v-model="generateWithPoints" label="Gerar com Pontuação?" />

        <!-- ===== Button generate CPF ===== -->
        <PrimaryButton @click="generateNewCpf()">Gerar Novo CPF</PrimaryButton>
      </div>

      <CopyInput
        v-model="inputCpf"
        placeholder="Gerar CPF"
        @copy="nuxtApp.$toast.info('CPF copiado para a área de transferência')"
      />
    </section>

    <!-- ===== Page Description ===== -->
    <section class="mt-48 flex w-full flex-col gap-6 px-8">
      <AdBanner ad-slot="5036362920" />

      <h2 class="text-xl text-black-500 md:text-2xl">
        Saiba como são gerados os CPF`s
      </h2>

      <p class="text-xs text-black-400 md:text-lg">
        O CPF é composto por onze algarismos em que os dois últimos são chamados
        de dígitos verificadores (DV's), criados a partir dos nove primeiros,
        validando o número como um todo.
        <br />
        O cálculo destes dígitos é realizado em duas etapas utilizando o módulo
        de divisão 11.
      </p>

      <h2 class="text-xl text-black-500 md:text-2xl">
        Como conferir a origem de um CPF
      </h2>

      <p class="text-xs text-black-400 md:text-lg">
        Um meio interessante para a conferência do número de um CPF é
        identificar o ESTADO em que este foi emitido.
        <br />
        Esse número corresponde ao último algarismo anterior aos dois dígitos de
        controle. No exemplo CPF nº 000.000.006-00, o número 6 mostra que esse
        documento foi emitido no estado de Minas Gerais.
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
