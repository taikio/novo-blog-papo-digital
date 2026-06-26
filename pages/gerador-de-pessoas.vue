<script lang="ts" setup>
import generateMeta from '@/utils/generateMeta'
import { useGeradorPessoas } from '@/composables/useGeradorPessoas'
import { useBrazilianStates } from '@/composables/useBrazilianStates'

const nuxtApp = useNuxtApp()
const { params, profiles, generate, getDoc, profileToText, allProfilesToText, doExportJSON, doExportCSV } =
  useGeradorPessoas()
const { getStates } = useBrazilianStates()
const states = getStates()

const pageTitle = 'Gerador de Pessoas Fictícias | Dados Fake para Testes | Papo Digital'
const pageDescription =
  'Gere perfis completos de pessoas fictícias brasileiras: CPF, RG, PIS, Título de Eleitor, nome, endereço, e-mail e telefone válidos para testes de software.'
const pageUrl = 'https://papodigital.net.br/gerador-de-pessoas'

useHead({
  title: pageTitle,
  meta: generateMeta({
    pageTitle,
    description: pageDescription,
    contentType: 'website',
    url: pageUrl,
    twitterUrl: pageUrl,
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
  }),
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Gerador de Pessoas Fictícias Brasileiras',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        description: pageDescription,
        url: pageUrl,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
      }),
    },
  ],
})

async function copyText(text: string) {
  await navigator.clipboard.writeText(text)
  nuxtApp.$toast.success('Copiado!')
}

function handleGenerate() {
  if (params.ageMin > params.ageMax) params.ageMax = params.ageMin
  generate()
}
</script>

<template>
  <div>
    <PageHero
      title="Gerador de Pessoas Fictícias"
      image-src="/cover-page-gerador-cpf.png"
      image-alt="Gerador de Pessoas Fictícias Brasileiras"
    >
      Gere perfis completos com CPF, RG, endereço, e-mail e telefone válidos
      para uso em testes de software. Todos os dados são 100% fictícios.
    </PageHero>

    <!-- ===== PARÂMETROS ===== -->
    <section class="flex w-full flex-col gap-6 px-8 py-4 md:px-40">

      <!-- Disclaimer -->
      <div class="rounded-xl border border-yellow-400 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
        <strong>Aviso:</strong> Todos os dados gerados são <strong>completamente fictícios</strong>
        e criados apenas para fins de teste de software. Nenhum dado corresponde a pessoas reais.
      </div>

      <!-- Sex + UF + ages + quantity -->
      <div class="flex flex-wrap gap-3">
        <div class="flex flex-col gap-1">
          <label class="text-sm text-black-400">Sexo</label>
          <select
            v-model="params.sex"
            class="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary-500"
          >
            <option value="random">Aleatório</option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-black-400">Estado (UF)</label>
          <select
            v-model="params.uf"
            class="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary-500"
          >
            <option :value="null">Aleatório</option>
            <option v-for="state in states" :key="state.uf" :value="state.uf">
              {{ state.uf }} — {{ state.name }}
            </option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-black-400">Idade mínima</label>
          <input
            v-model.number="params.ageMin"
            type="number"
            min="1"
            max="120"
            class="w-24 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary-500"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-black-400">Idade máxima</label>
          <input
            v-model.number="params.ageMax"
            type="number"
            min="1"
            max="120"
            class="w-24 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary-500"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-black-400">Quantidade</label>
          <input
            v-model.number="params.quantity"
            type="number"
            min="1"
            max="10"
            class="w-20 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary-500"
          />
        </div>
      </div>

      <!-- Toggles row 1: format -->
      <div class="flex flex-wrap gap-3">
        <ToggleCheckbox v-model="params.useMask" label="Exibir com pontuação?" />
      </div>

      <!-- Toggles row 2: extra documents -->
      <div class="flex flex-wrap gap-3">
        <ToggleCheckbox v-model="params.showPis" label="PIS/PASEP" />
        <ToggleCheckbox v-model="params.showTituloEleitor" label="Título de Eleitor" />
        <ToggleCheckbox v-model="params.showProfissao" label="Profissão" />
        <ToggleCheckbox v-model="params.showNaturalidade" label="Naturalidade" />
      </div>

      <!-- Generate button -->
      <div class="flex justify-end">
        <PrimaryButton @click="handleGenerate">
          Gerar Pessoa{{ params.quantity > 1 ? 's' : '' }}
        </PrimaryButton>
      </div>
    </section>

    <!-- ===== RESULTADOS ===== -->
    <section v-if="profiles.length > 0" class="mt-8 flex flex-col gap-6 px-8 md:px-40">
      <div
        v-for="(profile, idx) in profiles"
        :key="idx"
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-md"
      >
        <!-- Card header -->
        <div class="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
          <span class="text-base font-semibold text-dark-purple-500">
            Pessoa {{ idx + 1 }}
          </span>
          <span class="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
            Dados fictícios
          </span>
        </div>

        <!-- Fields -->
        <div class="flex flex-col gap-1">
          <template
            v-for="(entry, fi) in [
              { label: 'Nome', value: profile.nome },
              { label: 'Sexo', value: profile.sexo },
              { label: 'Data de Nascimento', value: profile.dataNascimento },
              { label: 'Idade', value: String(profile.idade) },
              { label: 'CPF', value: getDoc(profile.cpf) },
              { label: 'RG', value: getDoc(profile.rg) },
              { label: 'Nome da Mãe', value: profile.nomeMae },
              { label: 'E-mail', value: profile.email },
              { label: 'Telefone', value: getDoc(profile.telefone) },
              { label: 'Logradouro', value: profile.endereco.logradouro },
              { label: 'Número', value: profile.endereco.numero },
              { label: 'Bairro', value: profile.endereco.bairro },
              { label: 'Cidade', value: profile.endereco.cidade },
              { label: 'UF', value: profile.endereco.uf },
              { label: 'CEP', value: getDoc(profile.endereco.cep) },
              ...(profile.pis ? [{ label: 'PIS/PASEP', value: getDoc(profile.pis) }] : []),
              ...(profile.tituloEleitor ? [{ label: 'Título de Eleitor', value: getDoc(profile.tituloEleitor) }] : []),
              ...(profile.profissao ? [{ label: 'Profissão', value: profile.profissao }] : []),
              ...(profile.naturalidade ? [{ label: 'Naturalidade', value: profile.naturalidade }] : []),
            ]"
            :key="fi"
          >
            <div class="flex items-center justify-between rounded-lg px-2 py-1 hover:bg-gray-100">
              <span class="min-w-40 text-sm text-black-400">{{ entry.label }}</span>
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-dark-purple-500">{{ entry.value }}</span>
                <button
                  class="text-black-400 transition-colors hover:text-primary-500"
                  :aria-label="`Copiar ${entry.label}`"
                  @click="copyText(entry.value)"
                >
                  <Icon name="feather:copy" class="text-base" />
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- Copy all for this card -->
        <div class="mt-4 flex justify-end">
          <button
            class="text-sm text-primary-500 underline hover:text-primary-400"
            @click="copyText(profileToText(profile))"
          >
            Copiar todos os dados
          </button>
        </div>
      </div>

      <!-- ===== EXPORT ACTIONS ===== -->
      <div class="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          class="rounded-xl border border-gray-300 px-4 py-2 text-sm text-black-400 transition-all hover:border-primary-500 hover:text-primary-500"
          @click="copyText(allProfilesToText())"
        >
          <Icon name="feather:copy" class="mr-1" /> Copiar todos
        </button>
        <button
          class="rounded-xl border border-gray-300 px-4 py-2 text-sm text-black-400 transition-all hover:border-primary-500 hover:text-primary-500"
          @click="doExportCSV"
        >
          <Icon name="feather:download" class="mr-1" /> Exportar CSV
        </button>
        <button
          class="rounded-xl border border-gray-300 px-4 py-2 text-sm text-black-400 transition-all hover:border-primary-500 hover:text-primary-500"
          @click="doExportJSON"
        >
          <Icon name="feather:download" class="mr-1" /> Exportar JSON
        </button>
      </div>
    </section>

    <!-- ===== AD BANNER — after results, before SEO content ===== -->
    <section class="mt-12 px-8 md:px-40">
      <AdBanner ad-slot="5036362920" />
    </section>

    <!-- ===== SEO CONTENT ===== -->
    <section class="mt-12 flex flex-col gap-6 px-8 pb-16 md:px-40">
      <h2 class="text-xl text-black-500 md:text-2xl">
        O que é o Gerador de Pessoas Fictícias?
      </h2>
      <p class="text-xs text-black-400 md:text-lg">
        Esta ferramenta gera perfis completos de pessoas fictícias com CPF, RG, PIS/PASEP, Título de
        Eleitor, nome, e-mail, telefone e endereço. Todos os documentos são estruturalmente válidos —
        passam nos algoritmos de dígito verificador — mas <strong>não correspondem a pessoas reais</strong>.
      </p>

      <h2 class="text-xl text-black-500 md:text-2xl">
        Para que serve?
      </h2>
      <p class="text-xs text-black-400 md:text-lg">
        Desenvolvedores, analistas de QA e estudantes usam dados fictícios para popular formulários,
        testar validações de CPF/CNPJ, alimentar bancos de dados de desenvolvimento e criar cenários
        de teste sem expor dados reais de pessoas. Com o gerador em lote você cria até 10 perfis de
        uma vez e exporta diretamente para JSON ou CSV.
      </p>

      <h2 class="text-xl text-black-500 md:text-2xl">
        Como os documentos são gerados?
      </h2>
      <p class="text-xs text-black-400 md:text-lg">
        O CPF é gerado com o algoritmo oficial de módulo 11 da Receita Federal, incluindo o dígito de
        região fiscal vinculado ao estado selecionado. O PIS/PASEP segue o mesmo princípio. O Título de
        Eleitor utiliza o algoritmo oficial do TSE, com os pesos definidos pela especificação e o
        tratamento especial dos estados de SP e MG. O RG segue o formato SSP-SP como aproximação —
        já que não existe um padrão nacional unificado.
      </p>

      <h2 class="text-xl text-black-500 md:text-2xl">
        Perguntas Frequentes
      </h2>
      <dl class="flex flex-col gap-4">
        <div>
          <dt class="font-semibold text-black-500">Os CPFs gerados são de pessoas reais?</dt>
          <dd class="text-xs text-black-400 md:text-lg">
            Não. Apesar de serem matematicamente válidos, são números aleatórios que não
            pertencem a nenhum cadastro. Usar estes dados para fins ilícitos é crime.
          </dd>
        </div>
        <div>
          <dt class="font-semibold text-black-500">Os dados trafegam pela internet?</dt>
          <dd class="text-xs text-black-400 md:text-lg">
            Não. Toda a geração acontece no seu navegador, sem nenhuma chamada de servidor.
          </dd>
        </div>
        <div>
          <dt class="font-semibold text-black-500">Posso usar em produção?</dt>
          <dd class="text-xs text-black-400 md:text-lg">
            Esta ferramenta destina-se exclusivamente a ambientes de desenvolvimento e teste.
            Nunca use dados fictícios em sistemas de produção ou cadastros reais.
          </dd>
        </div>
      </dl>
    </section>
  </div>
</template>
