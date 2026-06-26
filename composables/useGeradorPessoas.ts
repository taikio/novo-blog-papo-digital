import { reactive, ref } from 'vue'
import { generatePessoa } from '@/utils/gerador-pessoas/pessoa'
import { exportJSON, exportCSV } from '@/utils/gerador-pessoas/export-utils'
import type { PersonParams, PersonProfile } from '@/utils/gerador-pessoas/types'

export function useGeradorPessoas() {
  const params = reactive<PersonParams>({
    sex: 'random',
    ageMin: 18,
    ageMax: 65,
    uf: null,
    useMask: true,
    quantity: 1,
    showPis: false,
    showTituloEleitor: false,
    showProfissao: false,
    showNaturalidade: false,
  })

  const profiles = ref<PersonProfile[]>([])

  function generate() {
    profiles.value = Array.from({ length: params.quantity }, () =>
      generatePessoa({
        sex: params.sex,
        ageMin: params.ageMin,
        ageMax: params.ageMax,
        uf: params.uf,
        showPis: params.showPis,
        showTituloEleitor: params.showTituloEleitor,
        showProfissao: params.showProfissao,
        showNaturalidade: params.showNaturalidade,
      }),
    )
  }

  function getDoc(field: { raw: string; formatted: string } | undefined): string {
    if (!field) return ''
    return params.useMask ? field.formatted : field.raw
  }

  function profileToText(p: PersonProfile): string {
    const lines = [
      `Nome: ${p.nome}`,
      `Sexo: ${p.sexo}`,
      `Data de Nascimento: ${p.dataNascimento}`,
      `Idade: ${p.idade}`,
      `CPF: ${getDoc(p.cpf)}`,
      `RG: ${getDoc(p.rg)}`,
      `Nome da Mãe: ${p.nomeMae}`,
      `E-mail: ${p.email}`,
      `Telefone: ${getDoc(p.telefone)}`,
      `Endereço: ${p.endereco.logradouro}, ${p.endereco.numero}`,
      `Bairro: ${p.endereco.bairro}`,
      `Cidade: ${p.endereco.cidade} - ${p.endereco.uf}`,
      `CEP: ${getDoc(p.endereco.cep)}`,
    ]
    if (p.pis) lines.push(`PIS: ${getDoc(p.pis)}`)
    if (p.tituloEleitor) lines.push(`Título de Eleitor: ${getDoc(p.tituloEleitor)}`)
    if (p.profissao) lines.push(`Profissão: ${p.profissao}`)
    if (p.naturalidade) lines.push(`Naturalidade: ${p.naturalidade}`)
    return lines.join('\n')
  }

  function allProfilesToText(): string {
    return profiles.value.map((p, i) => `=== Pessoa ${i + 1} ===\n${profileToText(p)}`).join('\n\n')
  }

  function doExportJSON() {
    exportJSON(profiles.value)
  }

  function doExportCSV() {
    exportCSV(profiles.value, params.useMask)
  }

  return {
    params,
    profiles,
    generate,
    getDoc,
    profileToText,
    allProfilesToText,
    doExportJSON,
    doExportCSV,
  }
}
