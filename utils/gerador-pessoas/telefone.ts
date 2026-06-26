import { UF_TO_DDDS } from './data'
import type { DocumentField } from './types'

const ALL_DDDS = Object.values(UF_TO_DDDS).flat()

function randomDigits(n: number): string {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('')
}

export function generateTelefone(uf?: string | null): DocumentField {
  const ddds = uf && UF_TO_DDDS[uf] ? UF_TO_DDDS[uf] : ALL_DDDS
  const ddd = ddds[Math.floor(Math.random() * ddds.length)]
  const number = '9' + randomDigits(4) + randomDigits(4)
  const raw = String(ddd) + number
  const formatted = `(${ddd}) ${number.slice(0, 5)}-${number.slice(5)}`
  return { raw, formatted }
}
