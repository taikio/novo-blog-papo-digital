import { generateCPF } from '../utils/gerador-pessoas/cpf'
import { generatePIS } from '../utils/gerador-pessoas/pis'
import { generateTituloEleitor, validateTitulo } from '../utils/gerador-pessoas/titulo-eleitor'
import { generateTelefone } from '../utils/gerador-pessoas/telefone'
import { isValidCPF, isValidPIS } from '@brazilian-utils/brazilian-utils'
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

// 3. Verify 1000 random PIS numbers
for (let i = 0; i < 1000; i++) {
  const { raw } = generatePIS()
  if (!isValidPIS(raw)) {
    console.error(`PIS FAIL: ${raw}`)
    failures++
  }
}
console.log(`PIS: 1000 generated, ${failures} total failures so far`)

// 4. Known test vectors — HARD GATE: verify all five at https://www.4devs.com.br/validador_titulo_de_eleitor
const vectors: [string, boolean][] = [
  ['123456780190', true],  // SP, standard
  ['000000000115', true],  // SP, DV1 exception (remainder=0)
  ['123456780498', true],  // RS
  ['123456780292', true],  // MG, standard
  ['000000000218', true],  // MG, DV1 exception (remainder=0)
]
for (const [titulo, expected] of vectors) {
  const result = validateTitulo(titulo)
  if (result !== expected) {
    console.error(`Título vector FAIL: ${titulo} expected=${expected} got=${result}`)
    failures++
  }
}
console.log('Título known vectors: checked')

// 5. Consistency check (generator and validator share the same rule — NOT a correctness proof)
for (let i = 0; i < 1000; i++) {
  const { raw } = generateTituloEleitor()
  if (!validateTitulo(raw)) {
    console.error(`Título round-trip FAIL: ${raw}`)
    failures++
  }
}
console.log(`Título: 1000 generated, ${failures} total failures so far`)

// 6. Verify DDD belongs to the correct UF's list
const dddTestUfs = ['SP', 'MG', 'RS', 'CE', 'AM']
for (const uf of dddTestUfs) {
  for (let i = 0; i < 50; i++) {
    const { raw } = generateTelefone(uf)
    const ddd = parseInt(raw.slice(0, 2), 10)  // raw = DDD (2 chars) + 9-digit number
    if (!UF_TO_DDDS[uf].includes(ddd)) {
      console.error(`DDD FAIL: UF=${uf}, DDD=${ddd} not in [${UF_TO_DDDS[uf]}]`)
      failures++
    }
  }
}
console.log(`DDD: ${dddTestUfs.length * 50} generated, ${failures} total failures so far`)

if (failures > 0) {
  console.error(`\n${failures} TOTAL FAILURES`)
  process.exit(1)
}
console.log('\nAll CPF + PIS + Título + DDD checks PASSED')
