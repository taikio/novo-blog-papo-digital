import type { DocumentField } from './types'

function isAllSame(digits: number[]): boolean {
  return digits.every((d) => d === digits[0])
}

export function generatePIS(): DocumentField {
  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let base: number[]
  let dv: number
  do {
    base = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))
    const sum = base.reduce((acc, d, i) => acc + d * weights[i], 0)
    const candidate = 11 - (sum % 11)
    dv = candidate >= 10 ? 0 : candidate
  } while (isAllSame(base))

  const raw = base.join('') + dv
  const formatted = `${raw.slice(0, 3)}.${raw.slice(3, 8)}.${raw.slice(8, 10)}-${dv}`
  return { raw, formatted }
}
