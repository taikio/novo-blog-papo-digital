import { generateCPF } from '../utils/gerador-pessoas/cpf'
import { isValidCPF } from '@brazilian-utils/brazilian-utils'
import { UF_TO_CPF_REGION, UF_TO_DDDS } from '../utils/gerador-pessoas/data'

let failures = 0

// 1. Verify 1000 random CPFs pass isValidCPF
for (let i = 0; i < 1000; i++) {
  const { raw } = generateCPF()
  if (!isValidCPF(raw)) {
    console.error(`CPF FAIL: ${raw}`)
    failures++
  }
}
console.log(`CPF random: 1000 generated, ${failures} failures`)

// 2. Verify UF-region coupling: 9th digit must match UF
const ufTests: [string, number][] = [
  ['SP', 8], ['MG', 6], ['RS', 0], ['PR', 9], ['RJ', 7],
  ['BA', 5], ['CE', 3], ['AM', 2], ['AL', 4], ['DF', 1],
]
for (const [uf, expectedRegion] of ufTests) {
  for (let i = 0; i < 50; i++) {
    const { raw } = generateCPF(uf)
    const regionDigit = parseInt(raw[8], 10)
    if (regionDigit !== expectedRegion) {
      console.error(`CPF UF FAIL: UF=${uf}, expected region=${expectedRegion}, got ${regionDigit} in ${raw}`)
      failures++
    }
    if (!isValidCPF(raw)) {
      console.error(`CPF UF invalid: ${raw}`)
      failures++
    }
  }
}
console.log(`CPF UF-region: ${ufTests.length * 50} generated, ${failures} total failures so far`)

if (failures > 0) {
  console.error(`\n${failures} TOTAL FAILURES`)
  process.exit(1)
}
console.log('\nAll CPF checks PASSED')
