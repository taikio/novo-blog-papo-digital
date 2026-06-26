import { fakerPT_BR as faker } from '@faker-js/faker'
import { BAIRRO_PREFIXES, MALE_FIRST_NAMES, FEMALE_FIRST_NAMES, UF_TO_CITIES } from './data'

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function getPersonName(sex: 'male' | 'female'): { first: string; last: string } {
  // faker pt_BR does not filter firstName by sex reliably; use curated lists instead
  const first = sex === 'male' ? pickRandom(MALE_FIRST_NAMES) : pickRandom(FEMALE_FIRST_NAMES)
  return { first, last: `${faker.person.lastName()} ${faker.person.lastName()}` }
}

export function getMotherName(): string {
  return `${pickRandom(FEMALE_FIRST_NAMES)} ${faker.person.lastName()} ${faker.person.lastName()}`
}

export function getEmail(first: string, last: string): string {
  const providers = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br']
  const provider = providers[Math.floor(Math.random() * providers.length)]
  return faker.internet.email({ firstName: first, lastName: last, provider })
}

export function getEndereco(uf: string): {
  logradouro: string
  numero: string
  bairro: string
  cidade: string
} {
  const prefix = pickRandom(BAIRRO_PREFIXES)
  const suffix = faker.person.lastName()
  const cities = UF_TO_CITIES[uf] ?? UF_TO_CITIES['SP']
  return {
    logradouro: faker.location.street(),
    numero: faker.location.buildingNumber(),
    bairro: `${prefix} ${suffix}`,
    cidade: pickRandom(cities),
  }
}

export function getProfissao(): string {
  return faker.person.jobTitle()
}

export function getNaturalidade(uf: string): string {
  const cities = UF_TO_CITIES[uf] ?? UF_TO_CITIES['SP']
  return `${pickRandom(cities)} - ${uf}`
}
