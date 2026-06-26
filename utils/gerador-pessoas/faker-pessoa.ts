import { fakerPT_BR as faker } from '@faker-js/faker'
import { BAIRRO_PREFIXES } from './data'

export function getPersonName(sex: 'male' | 'female'): { first: string; last: string } {
  return {
    first: faker.person.firstName({ sex }),
    last: faker.person.lastName(),
  }
}

export function getMotherName(): string {
  return `${faker.person.firstName({ sex: 'female' })} ${faker.person.lastName()}`
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
  const prefix = BAIRRO_PREFIXES[Math.floor(Math.random() * BAIRRO_PREFIXES.length)]
  const suffix = faker.person.lastName()
  return {
    logradouro: faker.location.street(),
    numero: faker.location.buildingNumber(),
    bairro: `${prefix} ${suffix}`,
    cidade: faker.location.city(),
  }
}

export function getProfissao(): string {
  return faker.person.jobTitle()
}

export function getNaturalidade(uf: string): string {
  return `${faker.location.city()} - ${uf}`
}
