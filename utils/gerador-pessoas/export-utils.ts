import type { PersonProfile } from './types'

function getDoc(
  field: { raw: string; formatted: string } | undefined,
  useMask: boolean,
): string {
  if (!field) return ''
  return useMask ? field.formatted : field.raw
}

function profileToRecord(p: PersonProfile, useMask: boolean): Record<string, string> {
  return {
    Nome: p.nome,
    Sexo: p.sexo,
    'Data de Nascimento': p.dataNascimento,
    Idade: String(p.idade),
    CPF: getDoc(p.cpf, useMask),
    RG: getDoc(p.rg, useMask),
    'Nome da Mãe': p.nomeMae,
    Email: p.email,
    Telefone: getDoc(p.telefone, useMask),
    Logradouro: p.endereco.logradouro,
    Número: p.endereco.numero,
    Bairro: p.endereco.bairro,
    Cidade: p.endereco.cidade,
    UF: p.endereco.uf,
    CEP: getDoc(p.endereco.cep, useMask),
    PIS: getDoc(p.pis, useMask),
    'Título de Eleitor': getDoc(p.tituloEleitor, useMask),
    Profissão: p.profissao ?? '',
    Naturalidade: p.naturalidade ?? '',
  }
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob(['﻿' + content], { type: `${mimeType};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportJSON(profiles: PersonProfile[]): void {
  const json = JSON.stringify(profiles, null, 2)
  downloadBlob(json, 'pessoas-ficticias.json', 'application/json')
}

export function exportCSV(profiles: PersonProfile[], useMask: boolean): void {
  if (profiles.length === 0) return
  const records = profiles.map((p) => profileToRecord(p, useMask))
  const headers = Object.keys(records[0])
  const rows = records.map((r) =>
    headers.map((h) => `"${r[h].replace(/"/g, '""')}"`).join(','),
  )
  const csv = [headers.join(','), ...rows].join('\r\n')
  downloadBlob(csv, 'pessoas-ficticias.csv', 'text/csv')
}
