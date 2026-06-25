import type { DocumentField } from './types'

function isAllSame(digits: number[]): boolean {
  return digits.every((d) => d === digits[0])
}

export function generateRG(): DocumentField {
  let digits: number[]
  let dv: string
  do {
    digits = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10))
    const sum = digits.reduce((acc, d, i) => acc + d * (2 + i), 0)
    const remainder = sum % 11
    if (remainder === 0) dv = '0'
    else if (remainder === 1) dv = 'X'
    else dv = String(11 - remainder)
  } while (isAllSame(digits))

  const raw = digits.join('') + dv
  const formatted = `${raw.slice(0, 2)}.${raw.slice(2, 5)}.${raw.slice(5, 8)}-${dv}`
  return { raw, formatted }
}
