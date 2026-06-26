import { UF_TO_TITULO_CODE } from './data'
import type { DocumentField } from './types'

function calcDV1(seq: number[], ufCode: number): number {
  const weights = [9, 8, 7, 6, 5, 4, 3, 2]
  const sum = seq.reduce((acc, d, i) => acc + d * weights[i], 0)
  const remainder = sum % 11
  const isSpMg = ufCode === 1 || ufCode === 2
  if (remainder === 0 && isSpMg) return 1
  if (11 - remainder > 9) return 0
  return 11 - remainder
}

function calcDV2(ufCode: number, dv1: number): number {
  const uf1 = Math.floor(ufCode / 10)
  const uf2 = ufCode % 10
  const sum = uf1 * 7 + uf2 * 8 + dv1 * 9
  const remainder = sum % 11
  const isSpMg = ufCode === 1 || ufCode === 2
  if (remainder === 0 && isSpMg) return 1
  if (11 - remainder > 9) return 0
  return 11 - remainder
}

export function validateTitulo(titulo: string): boolean {
  if (titulo.length !== 12) return false
  const seq = Array.from(titulo.slice(0, 8), Number)
  const ufCode = parseInt(titulo.slice(8, 10), 10)
  const dv1 = parseInt(titulo[10], 10)
  const dv2 = parseInt(titulo[11], 10)
  return calcDV1(seq, ufCode) === dv1 && calcDV2(ufCode, dv1) === dv2
}

function isAllSame(digits: number[]): boolean {
  return digits.every((d) => d === digits[0])
}

export function generateTituloEleitor(uf?: string | null): DocumentField {
  const ufKeys = Object.keys(UF_TO_TITULO_CODE)
  const resolvedUf =
    uf && UF_TO_TITULO_CODE[uf] !== undefined
      ? uf
      : ufKeys[Math.floor(Math.random() * ufKeys.length)]
  const ufCode = UF_TO_TITULO_CODE[resolvedUf]
  const ufStr = String(ufCode).padStart(2, '0')

  let seq: number[]
  let dv1: number
  let dv2: number
  do {
    seq = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10))
    dv1 = calcDV1(seq, ufCode)
    dv2 = calcDV2(ufCode, dv1)
  } while (isAllSame(seq))

  const raw = seq.join('') + ufStr + dv1 + dv2
  const formatted = `${raw.slice(0, 4)} ${raw.slice(4, 8)} ${raw.slice(8, 12)}`
  return { raw, formatted }
}
