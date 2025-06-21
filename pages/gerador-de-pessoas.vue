<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue' // Make sure watch is imported
import generateMeta from '@/utils/generateMeta'
import {
  useBrazilianStates,
  type BrazilianState,
} from '@/composables/useBrazilianStates' // Import composable and type
import { Faker, pt_BR } from '@faker-js/faker'
import { generateCPF } from '@brazilian-utils/brazilian-utils'
import { useToast } from 'vue-toastification'

const pageTitle = 'Gerador de Pessoas Online | Crie Dados Fictícios'
const pageDescription =
  'Gere dados de pessoas fictícias de forma rápida e fácil, incluindo nome, idade, CPF, endereço e mais, para testes e simulações.'
// IMPORTANT: Update this URL to be the actual final URL for this page if it's different
const pageUrl = 'https://papodigital.net.br/gerador-de-pessoas'

const pageMetaTags = generateMeta({
  pageTitle,
  description: pageDescription,
  contentType: 'website',
  url: pageUrl,
  twitterUrl: pageUrl, // Often the same as url
  twitterTitle: pageTitle, // Often the same as pageTitle
  twitterDescription: pageDescription, // Often the same as description
  // image: 'https://papodigital.net.br/path-to-social-share-image-for-gerador-de-pessoas.png' // Optional: social sharing image
})

useHead({
  title: pageTitle,
  meta: pageMetaTags,
})

// Interface for the generated person data
interface PersonData {
  name: string
  age: number
  gender: string // This will be the actual gender generated, not necessarily the input selection (e.g., if 'Aleatório')
  email: string
  phone: string
  cpf: string
  address: {
    street: string
    number: string
    complement?: string
    cep: string
    city: string // City used for generation
    state: string // State UF used for generation
  }
}

const isPageInDraft = ref(true)
const showResults = ref(false)
const selectedGender = ref<string>('Aleatório') // Default to Aleatório
const selectedState = ref<string>('') // Stores UF of the selected state
const selectedCity = ref<string>('') // Stores name of the selected city

const statesList = ref<BrazilianState[]>([])
const citiesList = ref<string[]>([])
const isLoadingCities = ref(false)

const generatedPersonData = ref<PersonData | null>(null)

const { getStates, getCitiesByState } = useBrazilianStates()
const faker = new Faker({ locale: [pt_BR] })
const toast = useToast()

onMounted(() => {
  statesList.value = getStates()
})

// Watch for changes in selectedState to fetch cities
watch(selectedState, async (newStateUF) => {
  if (newStateUF) {
    isLoadingCities.value = true
    citiesList.value = [] // Clear previous cities
    selectedCity.value = '' // Reset selected city
    try {
      const cities = await getCitiesByState(newStateUF)
      citiesList.value = cities
    } catch (error) {
      console.error('Failed to fetch cities:', error)
      citiesList.value = [] // Ensure it's an empty array on error
    } finally {
      isLoadingCities.value = false
    }
  } else {
    citiesList.value = []
    selectedCity.value = ''
  }
})

const copyToClipboard = async (
  text: string | number | undefined,
  fieldName: string,
) => {
  if (text === undefined || text === null) {
    toast.error(`Nenhum valor para copiar para ${fieldName}.`)
    return
  }
  const textToCopy = typeof text === 'number' ? text.toString() : text
  try {
    await navigator.clipboard.writeText(textToCopy)
    toast.success(`${fieldName} copiado para a área de transferência!`)
  } catch (err) {
    console.error('Failed to copy text: ', err)
    toast.error(`Falha ao copiar ${fieldName}.`)
  }
}

const generatePersonDataInternal = () => {
  if (!selectedState.value || !selectedCity.value) {
    toast.error(
      'Por favor, selecione o estado e a cidade antes de gerar os dados.',
    )
    return
  }

  const genderForFaker =
    selectedGender.value === 'Masculino'
      ? 'male'
      : selectedGender.value === 'Feminino'
        ? 'female'
        : undefined

  const actualGenderGenerated =
    genderForFaker || (faker.datatype.boolean() ? 'male' : 'female')
  const firstName = faker.person.firstName(actualGenderGenerated)
  const lastName = faker.person.lastName(actualGenderGenerated)

  const person: PersonData = {
    name: `${firstName} ${lastName}`,
    age: faker.number.int({ min: 18, max: 80 }),
    gender:
      selectedGender.value === 'Aleatório'
        ? actualGenderGenerated === 'male'
          ? 'Masculino'
          : 'Feminino'
        : selectedGender.value,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phone: faker.phone.number('## #####-####'),
    cpf: generateCPF(),
    address: {
      street: faker.location.street(),
      number: faker.number.int({ min: 1, max: 2000 }).toString(),
      complement: faker.datatype.boolean(0.3)
        ? faker.location.secondaryAddress()
        : undefined,
      cep: faker.location.zipCode('#####-###'),
      city: selectedCity.value,
      state: selectedState.value,
    },
  }

  generatedPersonData.value = person
  showResults.value = true
}

const triggerPersonGeneration = () => {
  generatePersonDataInternal()
}

const resetForm = () => {
  showResults.value = false
  generatedPersonData.value = null

  selectedGender.value = 'Aleatório'
  selectedState.value = ''
  // selectedCity and citiesList are reset by the selectedState watcher
}
</script>

<template>
  <div
    v-if="isPageInDraft"
    class="flex w-full h-96 items-center justify-center"
  >
    <h1 class="text-3xl font-bold text-dark-purple-500 md:text-5xl">
      Página em Construção
    </h1>
  </div>
  <div v-else>
    <header
      class="z-20 flex w-full flex-col-reverse px-8 pt-2 md:flex-row md:items-center"
    >
      <div class="mt-4 md:mt-20 md:w-1/2">
        <h1 class="text-3xl font-bold text-dark-purple-500 md:text-5xl">
          Gerador de Pessoas
        </h1>
        <p class="text-md my-3 text-black-400 md:my-8 md:text-lg">
          Crie dados de pessoas fictícias de forma rápida e fácil para seus
          testes, layouts e simulações. Selecione as opções abaixo e gere uma
          pessoa instantaneamente.
        </p>
      </div>
      <div class="mt-4 md:mt-12 md:w-1/2 flex justify-center">
        <div
          class="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500"
        >
          Imagem (placeholder)
        </div>
      </div>
    </header>

    <main class="w-full flex flex-col items-center px-8 py-10">
      <div class="w-full max-w-2xl bg-white shadow-xl rounded-lg p-6 md:p-8">
        <div v-if="!showResults">
          <h2 class="text-2xl font-semibold text-gray-700 mb-6 text-center">
            Configure os Dados
          </h2>
          <form @submit.prevent="triggerPersonGeneration">
            <div class="space-y-6">
              <div>
                <label
                  for="gender"
                  class="block text-sm font-medium text-gray-700"
                  >Gênero</label
                >
                <select
                  id="gender"
                  v-model="selectedGender"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                >
                  <option value="Aleatório">Aleatório</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>
              <div>
                <label
                  for="state"
                  class="block text-sm font-medium text-gray-700"
                  >Estado (UF)</label
                >
                <select
                  id="state"
                  v-model="selectedState"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                >
                  <option value="">Selecione um estado</option>
                  <option
                    v-for="state in statesList"
                    :key="state.uf"
                    :value="state.uf"
                  >
                    {{ state.name }}
                  </option>
                </select>
              </div>
              <div>
                <label
                  for="city"
                  class="block text-sm font-medium text-gray-700"
                  >Cidade</label
                >
                <select
                  id="city"
                  v-model="selectedCity"
                  :disabled="
                    !selectedState ||
                    isLoadingCities ||
                    (citiesList.length === 0 && !!selectedState)
                  "
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 disabled:bg-gray-100"
                >
                  <option v-if="isLoadingCities" value="">
                    Carregando cidades...
                  </option>
                  <option v-else-if="!selectedState" value="">
                    Selecione um estado primeiro
                  </option>
                  <option
                    v-else-if="
                      citiesList.length === 0 &&
                      !!selectedState &&
                      !isLoadingCities
                    "
                    value=""
                  >
                    Nenhuma cidade encontrada ou estado sem cidades
                  </option>
                  <option v-for="city in citiesList" :key="city" :value="city">
                    {{ city }}
                  </option>
                </select>
              </div>
              <div class="pt-4">
                <button
                  type="submit"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Gerar Pessoa
                </button>
              </div>
            </div>
          </form>
        </div>
        <div v-else>
          <h2 class="text-2xl font-semibold text-gray-700 mb-6 text-center">
            Pessoa Gerada
          </h2>
          <div v-if="generatedPersonData" class="space-y-4">
            <div>
              <strong class="block text-sm font-medium text-gray-600"
                >Nome:</strong
              >
              <div class="flex items-center mt-1">
                <p
                  class="text-lg text-gray-800 bg-gray-50 p-2 rounded-l-md flex-grow break-all"
                >
                  {{ generatedPersonData.name }}
                </p>
                <button
                  @click="copyToClipboard(generatedPersonData.name, 'Nome')"
                  aria-label="Copiar Nome"
                  class="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-r-md border-l border-gray-300 whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
            </div>
            <div>
              <strong class="block text-sm font-medium text-gray-600"
                >Idade:</strong
              >
              <div class="flex items-center mt-1">
                <p
                  class="text-lg text-gray-800 bg-gray-50 p-2 rounded-l-md flex-grow"
                >
                  {{ generatedPersonData.age }}
                </p>
                <button
                  @click="copyToClipboard(generatedPersonData.age, 'Idade')"
                  aria-label="Copiar Idade"
                  class="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-r-md border-l border-gray-300 whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
            </div>
            <div>
              <strong class="block text-sm font-medium text-gray-600"
                >Gênero:</strong
              >
              <div class="flex items-center mt-1">
                <p
                  class="text-lg text-gray-800 bg-gray-50 p-2 rounded-l-md flex-grow"
                >
                  {{ generatedPersonData.gender }}
                </p>
                <button
                  @click="copyToClipboard(generatedPersonData.gender, 'Gênero')"
                  aria-label="Copiar Gênero"
                  class="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-r-md border-l border-gray-300 whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
            </div>
            <div>
              <strong class="block text-sm font-medium text-gray-600"
                >Email:</strong
              >
              <div class="flex items-center mt-1">
                <p
                  class="text-lg text-gray-800 bg-gray-50 p-2 rounded-l-md flex-grow break-all"
                >
                  {{ generatedPersonData.email }}
                </p>
                <button
                  @click="copyToClipboard(generatedPersonData.email, 'Email')"
                  aria-label="Copiar Email"
                  class="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-r-md border-l border-gray-300 whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
            </div>
            <div>
              <strong class="block text-sm font-medium text-gray-600"
                >Telefone:</strong
              >
              <div class="flex items-center mt-1">
                <p
                  class="text-lg text-gray-800 bg-gray-50 p-2 rounded-l-md flex-grow"
                >
                  {{ generatedPersonData.phone }}
                </p>
                <button
                  @click="
                    copyToClipboard(generatedPersonData.phone, 'Telefone')
                  "
                  aria-label="Copiar Telefone"
                  class="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-r-md border-l border-gray-300 whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
            </div>
            <div>
              <strong class="block text-sm font-medium text-gray-600"
                >CPF:</strong
              >
              <div class="flex items-center mt-1">
                <p
                  class="text-lg text-gray-800 bg-gray-50 p-2 rounded-l-md flex-grow"
                >
                  {{ generatedPersonData.cpf }}
                </p>
                <button
                  @click="copyToClipboard(generatedPersonData.cpf, 'CPF')"
                  aria-label="Copiar CPF"
                  class="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-r-md border-l border-gray-300 whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
            </div>
            <div>
              <strong class="block text-sm font-medium text-gray-600"
                >Endereço Completo:</strong
              >
              <div class="mt-1 bg-gray-50 p-3 rounded-md space-y-1">
                <p>
                  <strong>Rua:</strong>
                  {{ generatedPersonData.address.street }},
                  {{ generatedPersonData.address.number }}
                </p>
                <p v-if="generatedPersonData.address.complement">
                  <strong>Complemento:</strong>
                  {{ generatedPersonData.address.complement }}
                </p>
                <p>
                  <strong>CEP:</strong> {{ generatedPersonData.address.cep }}
                </p>
                <p>
                  <strong>Cidade:</strong>
                  {{ generatedPersonData.address.city }}
                </p>
                <p>
                  <strong>Estado:</strong>
                  {{ generatedPersonData.address.state }}
                </p>
              </div>
              <button
                @click="
                  copyToClipboard(
                    `Rua: ${generatedPersonData.address.street}, ${generatedPersonData.address.number}\n` +
                      (generatedPersonData.address.complement
                        ? `Complemento: ${generatedPersonData.address.complement}\n`
                        : '') +
                      `CEP: ${generatedPersonData.address.cep}\n` +
                      `Cidade: ${generatedPersonData.address.city}\n` +
                      `Estado: ${generatedPersonData.address.state}`,
                    'Endereço Completo',
                  )
                "
                aria-label="Copiar Endereço Completo"
                class="mt-2 w-full p-2 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-md"
              >
                Copiar Endereço Completo
              </button>
            </div>

            <!-- Gerar Nova Pessoa Button -->
            <div class="mt-8 text-center">
              <button
                @click="resetForm"
                type="button"
                class="py-2 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Gerar Nova Pessoa
              </button>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">
            Nenhum dado gerado ainda.
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
