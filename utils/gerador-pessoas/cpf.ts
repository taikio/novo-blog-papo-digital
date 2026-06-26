import { UF_TO_CPF_REGION } from './data'
import type { DocumentField } from './types'

function calcDV(digits: number[], weights: number[]): number {
  const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0)
  const remainder = sum % 11
  return remainder < 2 ? 0 : 11 - remainder
}

function isAllSame(digits: number[]): boolean {
  return digits.every((d) => d === digits[0])
}

export function generateCPF(uf?: string | null): DocumentField {
  let digits: number[]
  do {
    const base = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10))
    const region =
      uf && UF_TO_CPF_REGION[uf] !== undefined
        ? UF_TO_CPF_REGION[uf]
        : Math.floor(Math.random() * 10)
    const nine = [...base, region]
    const dv1 = calcDV(nine, [10, 9, 8, 7, 6, 5, 4, 3, 2])
    const dv2 = calcDV([...nine, dv1], [11, 10, 9, 8, 7, 6, 5, 4, 3, 2])
    digits = [...nine, dv1, dv2]
  } while (isAllSame(digits))

  const raw = digits.join('')
  const formatted = `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9)}`
  return { raw, formatted }
}
