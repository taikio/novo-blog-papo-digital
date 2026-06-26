import { generateCPF } from './cpf'
import { generateRG } from './rg'
import { generatePIS } from './pis'
import { generateTituloEleitor } from './titulo-eleitor'
import { generateTelefone } from './telefone'
import {
  getPersonName,
  getMotherName,
  getEmail,
  getEndereco,
  getProfissao,
  getNaturalidade,
} from './faker-pessoa'
import { UF_TO_CPF_REGION } from './data'
import type { PersonParams, PersonProfile } from './types'

type GenerateParams = Omit<PersonParams, 'useMask' | 'quantity'>

function randomUFKey(): string {
  const ufs = Object.keys(UF_TO_CPF_REGION)
  return ufs[Math.floor(Math.random() * ufs.length)]
}

function randomDigits(n: number): string {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('')
}

function generateBirthDate(ageMin: number, ageMax: number): {
  formatted: string
  idade: number
} {
  const today = new Date()
  // Generate date uniformly in [today - ageMax years, today - ageMin years] so the
  // recomputed age always falls within [ageMin, ageMax] — avoids off-by-one when
  // the birthday has not yet occurred in the current calendar year.
  const maxDate = new Date(today.getFullYear() - ageMin, today.getMonth(), today.getDate())
  const minDate = new Date(today.getFullYear() - ageMax, today.getMonth(), today.getDate())
  const range = maxDate.getTime() - minDate.getTime()
  const birth = new Date(minDate.getTime() + Math.random() * range)
  const idade = Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  const dd = String(birth.getDate()).padStart(2, '0')
  const mm = String(birth.getMonth() + 1).padStart(2, '0')
  const yyyy = birth.getFullYear()
  return { formatted: `${dd}/${mm}/${yyyy}`, idade }
}

export function generatePessoa(params: GenerateParams): PersonProfile {
  const resolvedSex: 'male' | 'female' =
    params.sex === 'random' ? (Math.random() < 0.5 ? 'male' : 'female') : params.sex
  const sexLabel: 'Masculino' | 'Feminino' = resolvedSex === 'male' ? 'Masculino' : 'Feminino'

  // Resolve UF once so CPF region digit, phone DDD, and address.uf are all coherent.
  // Never null after this line — random pick when params.uf is null (Aleatório).
  const resolvedUf: string = params.uf ?? randomUFKey()

  const { first, last } = getPersonName(resolvedSex)
  const nome = `${first} ${last}`
  const { formatted: dataNascimento, idade } = generateBirthDate(params.ageMin, params.ageMax)
  const cpf = generateCPF(resolvedUf)
  const rg = generateRG()
  const nomeMae = getMotherName()
  const email = getEmail(first, last)
  const telefone = generateTelefone(resolvedUf)
  const { logradouro, numero, bairro, cidade } = getEndereco(resolvedUf)
  const uf = resolvedUf
  const cepRaw = randomDigits(8)
  const cep = { raw: cepRaw, formatted: `${cepRaw.slice(0, 5)}-${cepRaw.slice(5)}` }

  const profile: PersonProfile = {
    nome,
    sexo: sexLabel,
    dataNascimento,
    idade,
    cpf,
    rg,
    nomeMae,
    email,
    telefone,
    endereco: { logradouro, numero, bairro, cidade, uf, cep },
  }

  if (params.showPis) profile.pis = generatePIS()
  if (params.showTituloEleitor) profile.tituloEleitor = generateTituloEleitor(resolvedUf)
  if (params.showProfissao) profile.profissao = getProfissao()
  if (params.showNaturalidade) profile.naturalidade = getNaturalidade(uf)

  return profile
}
