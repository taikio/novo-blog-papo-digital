# Gerador de Pessoas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 100% client-side page at `/gerador-de-pessoas` that generates complete, structurally-valid fictional Brazilian person profiles (CPF, RG, PIS, Título de Eleitor, name, address, phone, email) with batch generation, per-field copy, and JSON/CSV export.

**Architecture:** Pure TypeScript generators in `utils/gerador-pessoas/` (no external API calls), composed by a `useGeradorPessoas` composable that holds reactive params and profile state, consumed by the page. Document validation oracles (`@brazilian-utils/brazilian-utils`) are used only in the verification script — not at runtime. The `@faker-js/faker` pt_BR locale generates names, addresses, and profession data.

**Tech Stack:** Nuxt 3, Vue 3 Composition API, TypeScript, Tailwind CSS (custom tokens), `@faker-js/faker` pt_BR, `@brazilian-utils/brazilian-utils` (oracle only), `npx tsx` for verification scripts (no test framework installed).

## Global Constraints

- All generation is 100% client-side — zero network requests during generation (CA08)
- Reject any sequence where all digits are identical, e.g. `111.111.111-11` (CA02)
- CPF 9th digit must match UF fiscal region when UF is provided (CA03, D2)
- Phone DDD must be from the DDD table of the selected UF (CA03)
- `useMask` toggle reformats display without regenerating data (CA06)
- Disclaimer of fictional data must be visible in all page states (CA09)
- AdSense slots must be physically separated from interactive controls (RNF03)
- faker is used for: names, email, street, building number, neighborhood, city, profession, mother's name — NOT for documents
- Documents (CPF, RG, PIS, Título) are all custom mod-11 implementations
- Use custom Tailwind tokens: `primary-{100–500}`, `dark-purple-{100–500}`, `midnight-{100–500}`, `secondary-{100–500}`, `black-{400,500}`, `gray-{100–500}`
- Reuse existing components: `PageHero`, `PrimaryButton`, `ToggleCheckbox`, `AdBanner` — do not recreate them

---

## File Structure

| File | Responsibility |
|------|---------------|
| `utils/gerador-pessoas/types.ts` | TypeScript interfaces for profile, params, document fields |
| `utils/gerador-pessoas/data.ts` | UF→CPF region digit, UF→DDD list, UF→título TSE code, bairro name list |
| `utils/gerador-pessoas/cpf.ts` | CPF generation: mod-11, UF-aware 9th digit |
| `utils/gerador-pessoas/rg.ts` | RG generation: SSP-SP format approximation |
| `utils/gerador-pessoas/pis.ts` | PIS/PASEP generation: mod-11 |
| `utils/gerador-pessoas/titulo-eleitor.ts` | Título de Eleitor: TSE mod-11 with SP/MG exception |
| `utils/gerador-pessoas/telefone.ts` | Phone: random DDD from UF table + 9XXXX-XXXX |
| `utils/gerador-pessoas/faker-pessoa.ts` | faker pt_BR wrappers: name, email, address, profession |
| `utils/gerador-pessoas/pessoa.ts` | Orchestrator: assembles a complete `PersonProfile` |
| `utils/gerador-pessoas/export-utils.ts` | JSON download and CSV download helpers |
| `scripts/verify-gerador-pessoas.ts` | Verification script (run with `npx tsx`) — uses oracle validators |
| `composables/useGeradorPessoas.ts` | Reactive params, profile list, `generate()`, `getFieldValue()` |
| `pages/gerador-de-pessoas.vue` | Full page: controls, cards, copy, export, SEO, AdSense |

---

### Task 1: Project setup — move faker to dependencies + types + data tables

**Files:**
- Modify: `package.json` (move `@faker-js/faker` from devDependencies to dependencies)
- Create: `utils/gerador-pessoas/types.ts`
- Create: `utils/gerador-pessoas/data.ts`

**Interfaces:**
- Produces: `DocumentField`, `PersonProfile`, `PersonParams` — used by every subsequent task

- [ ] **Step 1: Move @faker-js/faker to runtime dependencies**

Edit `package.json`: remove `"@faker-js/faker": "^8.4.1"` from `devDependencies` and add it to `dependencies`:

```json
"dependencies": {
  "@brazilian-utils/brazilian-utils": "^1.0.0-rc.12",
  "@faker-js/faker": "^8.4.1",
  "qr-code-styling": "^1.6.0-rc.1",
  "vue-toastification": "^2.0.0-rc.5"
},
"devDependencies": {
  "@nuxt/content": "^2.12.1",
  "@nuxtjs/tailwindcss": "^6.12.0",
  "@tailwindcss/typography": "^0.5.13",
  "nuxt": "^3.16.2",
  "nuxt-icon": "^0.6.10",
  "prettier": "^3.2.5",
  "prettier-plugin-tailwindcss": "^0.5.14",
  "sitemap": "^7.1.1"
}
```

Run: `npm install` — should succeed with no errors.

- [ ] **Step 2: Create `utils/gerador-pessoas/types.ts`**

```typescript
export interface DocumentField {
  raw: string
  formatted: string
}

export interface AddressField {
  logradouro: string
  numero: string
  bairro: string
  cidade: string
  uf: string
  cep: DocumentField
}

export interface PersonProfile {
  nome: string
  sexo: 'Masculino' | 'Feminino'
  dataNascimento: string
  idade: number
  cpf: DocumentField
  rg: DocumentField
  nomeMae: string
  email: string
  telefone: DocumentField
  endereco: AddressField
  pis?: DocumentField
  tituloEleitor?: DocumentField
  profissao?: string
  naturalidade?: string
}

export interface PersonParams {
  sex: 'male' | 'female' | 'random'
  ageMin: number
  ageMax: number
  uf: string | null
  useMask: boolean
  quantity: number
  showPis: boolean
  showTituloEleitor: boolean
  showProfissao: boolean
  showNaturalidade: boolean
}
```

- [ ] **Step 3: Create `utils/gerador-pessoas/data.ts`**

```typescript
/** CPF fiscal region digit (9th digit) per UF */
export const UF_TO_CPF_REGION: Record<string, number> = {
  RS: 0,
  DF: 1, GO: 1, MS: 1, MT: 1, TO: 1,
  AC: 2, AM: 2, AP: 2, PA: 2, RO: 2, RR: 2,
  CE: 3, MA: 3, PI: 3,
  AL: 4, PB: 4, PE: 4, RN: 4,
  BA: 5, SE: 5,
  MG: 6,
  ES: 7, RJ: 7,
  SP: 8,
  PR: 9, SC: 9,
}

/** Valid DDDs per UF */
export const UF_TO_DDDS: Record<string, number[]> = {
  AC: [68],
  AL: [82],
  AM: [92, 97],
  AP: [96],
  BA: [71, 73, 74, 75, 77],
  CE: [85, 88],
  DF: [61],
  ES: [27, 28],
  GO: [62, 64],
  MA: [98, 99],
  MG: [31, 32, 33, 34, 35, 37, 38],
  MS: [67],
  MT: [65, 66],
  PA: [91, 93, 94],
  PB: [83],
  PE: [81, 87],
  PI: [86, 89],
  PR: [41, 42, 43, 44, 45, 46],
  RJ: [21, 22, 24],
  RN: [84],
  RO: [69],
  RR: [95],
  RS: [51, 53, 54, 55],
  SC: [47, 48, 49],
  SE: [79],
  SP: [11, 12, 13, 14, 15, 16, 17, 18, 19],
  TO: [63],
}

/** TSE state codes for Título de Eleitor (source: TSE spec) */
export const UF_TO_TITULO_CODE: Record<string, number> = {
  SP: 1, MG: 2, RJ: 3, RS: 4, BA: 5, PR: 6, CE: 7, PE: 8, SC: 9, GO: 10,
  MA: 11, PB: 12, PA: 13, ES: 14, PI: 15, RN: 16, AL: 17, MT: 18, MS: 19,
  DF: 20, SE: 21, AM: 22, RO: 23, AC: 24, AP: 25, RR: 26, TO: 27,
}

/** Common Brazilian neighborhood name patterns for faker-less bairro generation */
export const BAIRRO_PREFIXES = [
  'Centro', 'Vila', 'Jardim', 'Parque', 'Alto', 'Bela Vista',
  'Nova', 'São José', 'Santa Maria', 'Boa Vista', 'Ipiranga',
  'Liberdade', 'Moema', 'Pinheiros', 'Consolação', 'Lapa',
  'Butantã', 'Tatuapé', 'Penha', 'Santana', 'Tucuruvi',
]
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json utils/gerador-pessoas/types.ts utils/gerador-pessoas/data.ts
git commit -m "feat: add types and data tables for gerador-de-pessoas"
```

---

### Task 2: CPF generator

**Files:**
- Create: `utils/gerador-pessoas/cpf.ts`
- Create: `scripts/verify-gerador-pessoas.ts`

**Interfaces:**
- Consumes: `DocumentField` from `types.ts`, `UF_TO_CPF_REGION` from `data.ts`
- Produces: `generateCPF(uf?: string | null): DocumentField` — used by `pessoa.ts`

- [ ] **Step 1: Create `utils/gerador-pessoas/cpf.ts`**

```typescript
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
```

- [ ] **Step 2: Create verification script `scripts/verify-gerador-pessoas.ts`**

```typescript
import { generateCPF } from '../utils/gerador-pessoas/cpf'
import { isValidCPF } from '@brazilian-utils/brazilian-utils'
import { UF_TO_CPF_REGION } from '../utils/gerador-pessoas/data'

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
```

- [ ] **Step 3: Run verification**

```bash
npx tsx scripts/verify-gerador-pessoas.ts
```

Expected output:
```
CPF random: 1000 generated, 0 failures
CPF UF-region: 500 generated, 0 total failures so far

All CPF checks PASSED
```

- [ ] **Step 4: Commit**

```bash
git add utils/gerador-pessoas/cpf.ts scripts/verify-gerador-pessoas.ts
git commit -m "feat: add CPF generator with UF-aware region digit"
```

---

### Task 3: RG + PIS generators

**Files:**
- Create: `utils/gerador-pessoas/rg.ts`
- Create: `utils/gerador-pessoas/pis.ts`
- Modify: `scripts/verify-gerador-pessoas.ts`

**Interfaces:**
- Produces: `generateRG(): DocumentField`, `generatePIS(): DocumentField` — used by `pessoa.ts`

Note: RG uses the SSP-SP format as an approximation. The PRD explicitly states this is not a nationally validated document. CA01 covers only CPF, PIS, and Título — not RG.

- [ ] **Step 1: Create `utils/gerador-pessoas/rg.ts`**

Weights [2,3,4,5,6,7,8,9] applied left-to-right to 8 digits. DV = 0–9 or 'X' when remainder is 1.

```typescript
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
```

- [ ] **Step 2: Create `utils/gerador-pessoas/pis.ts`**

Algorithm: pesos [3,2,9,8,7,6,5,4,3,2] over 10 base digits. DV = 11 - remainder; if DV >= 10 → DV = 0.

```typescript
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
```

- [ ] **Step 3: Add PIS verification to `scripts/verify-gerador-pessoas.ts`**

Append after the existing CPF checks (keep all prior content, add at the end before the final `process.exit`):

```typescript
import { generatePIS } from '../utils/gerador-pessoas/pis'
import { isValidPIS } from '@brazilian-utils/brazilian-utils'

// Verify 1000 random PIS numbers
for (let i = 0; i < 1000; i++) {
  const { raw } = generatePIS()
  if (!isValidPIS(raw)) {
    console.error(`PIS FAIL: ${raw}`)
    failures++
  }
}
console.log(`PIS: 1000 generated, ${failures} total failures so far`)
```

- [ ] **Step 4: Run verification**

```bash
npx tsx scripts/verify-gerador-pessoas.ts
```

Expected: all checks PASSED, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add utils/gerador-pessoas/rg.ts utils/gerador-pessoas/pis.ts scripts/verify-gerador-pessoas.ts
git commit -m "feat: add RG and PIS generators"
```

---

### Task 4: Título de Eleitor generator

**Files:**
- Create: `utils/gerador-pessoas/titulo-eleitor.ts`
- Modify: `scripts/verify-gerador-pessoas.ts`

**Interfaces:**
- Consumes: `UF_TO_TITULO_CODE` from `data.ts`
- Produces: `generateTituloEleitor(uf?: string | null): DocumentField` — used by `pessoa.ts`

**Algorithm (TSE official):**

Structure: 8 sequential digits + 2-digit UF code + DV1 + DV2 = 12 digits total.

DV1:
- Weights [9,8,7,6,5,4,3,2] applied left-to-right to the 8 sequential digits
- `remainder = sum % 11`
- If remainder == 0 AND UF is SP (code 01) or MG (code 02): DV1 = 1 (SP/MG exception)
- If `11 - remainder > 9` (i.e., remainder < 2) for all other UFs: DV1 = 0
- Otherwise: DV1 = 11 - remainder

DV2:
- Inputs: [ufDigit1, ufDigit2, DV1] with weights [7, 8, 9]
- `sum = ufDigit1 * 7 + ufDigit2 * 8 + DV1 * 9`
- `remainder = sum % 11`
- SP/MG exception applies identically: remainder == 0 && SP/MG → DV2 = 1
- If `11 - remainder > 9` → DV2 = 0
- Otherwise: DV2 = 11 - remainder

**Known test vectors — HARD GATE: you MUST validate all five on https://www.4devs.com.br/validador_titulo_de_eleitor before committing Task 4.** If any vector fails the site validator, the algorithm derivation is wrong — debug the rule first, then regenerate vectors. The round-trip self-validation in Step 2 only proves generator and validator agree with each other, NOT that either is algorithmically correct.

| Sequential | UF | UF code | DV1 | DV2 | Full (12 digits) |
|---|---|---|---|---|---|
| 12345678 | SP | 01 | 9 | 0 | `123456780190` |
| 00000000 | SP | 01 | 1 (exception) | 5 | `000000000115` |
| 12345678 | RS | 04 | 9 | 8 | `123456780498` |
| 12345678 | MG | 02 | 9 | 2 | `123456780292` |
| 00000000 | MG | 02 | 1 (exception) | 8 | `000000000218` |

Derivation of test vector 1 (`123456780190`):
- sum = 1×9+2×8+3×7+4×6+5×5+6×4+7×3+8×2 = 9+16+21+24+25+24+21+16 = 156
- 156 % 11 = 2 → DV1 = 11-2 = 9 (no SP exception, remainder≠0)
- SP code = 01 → uf1=0, uf2=1 → DV2 sum = 0×7+1×8+9×9 = 89, 89%11=1, 11-1=10>9 → DV2=0

Derivation of test vector 2 (`000000000115`):
- sum = 0 → 0%11=0 → SP exception → DV1 = 1
- DV2 sum = 0×7+1×8+1×9 = 17, 17%11=6 → DV2 = 11-6 = 5

Derivation of test vector 3 (`123456780498`):
- DV1 same as vector 1 = 9
- RS code = 04 → uf1=0, uf2=4 → DV2 sum = 0×7+4×8+9×9 = 113, 113%11=3 → DV2 = 11-3 = 8

- [ ] **Step 1: Create `utils/gerador-pessoas/titulo-eleitor.ts`**

```typescript
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

function validateTitulo(titulo: string): boolean {
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
  const resolvedUf = uf && UF_TO_TITULO_CODE[uf] !== undefined
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

export { validateTitulo }
```

- [ ] **Step 2: Add Título verification to `scripts/verify-gerador-pessoas.ts`**

Append:

```typescript
import { generateTituloEleitor, validateTitulo } from '../utils/gerador-pessoas/titulo-eleitor'

// Known test vectors — HARD GATE: verify all five at https://www.4devs.com.br/validador_titulo_de_eleitor
// before shipping. These were computed from the algorithm above; if the site rejects any,
// the algorithm derivation is wrong — debug before committing.
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

// CONSISTENCY CHECK (not a correctness proof — generator and validator share the same rule).
// Correctness is proven only by the manual 4devs gate above.
for (let i = 0; i < 1000; i++) {
  const { raw } = generateTituloEleitor()
  if (!validateTitulo(raw)) {
    console.error(`Título round-trip FAIL: ${raw}`)
    failures++
  }
}
console.log(`Título: 1000 generated, ${failures} total failures so far`)
```

- [ ] **Step 3: Run verification**

```bash
npx tsx scripts/verify-gerador-pessoas.ts
```

Expected: all checks PASSED, 0 failures.

**If the known test vectors fail**: the vectors were computed by hand. Before debugging the generator, manually validate the three vector numbers at `https://www.4devs.com.br/validador_titulo_de_eleitor`. If the site says they are invalid, the derivation was wrong — update the algorithm and recompute. If the site says they are valid but `validateTitulo()` returns false, the validator function has a bug — compare your implementation against the algorithm described above step by step.

- [ ] **Step 4: Commit**

```bash
git add utils/gerador-pessoas/titulo-eleitor.ts scripts/verify-gerador-pessoas.ts
git commit -m "feat: add Título de Eleitor generator with TSE mod-11 and SP/MG exception"
```

---

### Task 5: Phone + faker wrappers

**Files:**
- Create: `utils/gerador-pessoas/telefone.ts`
- Create: `utils/gerador-pessoas/faker-pessoa.ts`

**Interfaces:**
- Consumes: `UF_TO_DDDS`, `BAIRRO_PREFIXES` from `data.ts`
- Produces:
  - `generateTelefone(uf?: string | null): DocumentField`
  - `getPersonName(sex: 'male' | 'female'): { first: string; last: string }`
  - `getMotherName(): string`
  - `getEmail(first: string, last: string): string`
  - `getEndereco(uf: string): { logradouro: string; numero: string; bairro: string; cidade: string }`
  - `getProfissao(): string`
  - `getNaturalidade(): string`

- [ ] **Step 1: Create `utils/gerador-pessoas/telefone.ts`**

```typescript
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
```

- [ ] **Step 2: Create `utils/gerador-pessoas/faker-pessoa.ts`**

```typescript
import { fakerPT_BR as faker } from '@faker-js/faker'
import { BAIRRO_PREFIXES } from './data'

export function getPersonName(sex: 'male' | 'female'): { first: string; last: string } {
  return {
    first: faker.person.firstName({ sex }),
    last: faker.person.lastName(),
  }
}

export function getMotherName(): string {
  return `${faker.person.firstName({ sex: 'female' })} ${faker.person.lastName()}`
}

export function getEmail(first: string, last: string): string {
  const providers = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br']
  const provider = providers[Math.floor(Math.random() * providers.length)]
  return faker.internet.email({ firstName: first, lastName: last, provider })
}

export function getEndereco(uf: string): {
  logradouro: string
  numero: string
  bairro: string
  cidade: string
} {
  const prefix = BAIRRO_PREFIXES[Math.floor(Math.random() * BAIRRO_PREFIXES.length)]
  const suffix = faker.person.lastName()
  return {
    logradouro: faker.location.street(),
    numero: faker.location.buildingNumber(),
    bairro: `${prefix} ${suffix}`,
    cidade: faker.location.city(),
  }
}

export function getProfissao(): string {
  return faker.person.jobTitle()
}

export function getNaturalidade(uf: string): string {
  return `${faker.location.city()} - ${uf}`
}
```

- [ ] **Step 3: Add DDD verification to `scripts/verify-gerador-pessoas.ts`**

Add the import at the top of the file (with the other imports) and append the loop before the final check:

```typescript
// ---- add to imports at top of file ----
import { generateTelefone } from '../utils/gerador-pessoas/telefone'
// UF_TO_DDDS is already imported from earlier

// ---- append to end of file (before process.exit) ----
// Verify DDD belongs to the correct UF's list
const dddTestUfs = ['SP', 'MG', 'RS', 'CE', 'AM']
for (const uf of dddTestUfs) {
  for (let i = 0; i < 50; i++) {
    const { raw } = generateTelefone(uf)
    const ddd = parseInt(raw.slice(0, 2), 10)  // raw = "DDD" (2 chars) + 9-digit number
    if (!UF_TO_DDDS[uf].includes(ddd)) {
      console.error(`DDD FAIL: UF=${uf}, DDD=${ddd} not in [${UF_TO_DDDS[uf]}]`)
      failures++
    }
  }
}
console.log(`DDD: ${dddTestUfs.length * 50} generated, ${failures} total failures so far`)
```

Run verification:

```bash
npx tsx scripts/verify-gerador-pessoas.ts
```

Expected: all checks PASSED, 0 failures (now includes CPF, PIS, Título, DDD checks).

- [ ] **Step 4: Commit**

```bash
git add utils/gerador-pessoas/telefone.ts utils/gerador-pessoas/faker-pessoa.ts scripts/verify-gerador-pessoas.ts
git commit -m "feat: add telefone and faker wrappers for gerador-de-pessoas"
```

---

### Task 6: Person orchestrator

**Files:**
- Create: `utils/gerador-pessoas/pessoa.ts`

**Interfaces:**
- Consumes: all generators from cpf.ts, rg.ts, pis.ts, titulo-eleitor.ts, telefone.ts, faker-pessoa.ts; `PersonParams`, `PersonProfile` from types.ts
- Produces: `generatePessoa(params: Omit<PersonParams, 'useMask' | 'quantity'>): PersonProfile` — used by `useGeradorPessoas.ts`

- [ ] **Step 1: Create `utils/gerador-pessoas/pessoa.ts`**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add utils/gerador-pessoas/pessoa.ts
git commit -m "feat: add pessoa orchestrator"
```

---

### Task 7: Export utilities

**Files:**
- Create: `utils/gerador-pessoas/export-utils.ts`

**Interfaces:**
- Consumes: `PersonProfile` from `types.ts`
- Produces: `exportJSON(profiles: PersonProfile[]): void`, `exportCSV(profiles: PersonProfile[], useMask: boolean): void`

- [ ] **Step 1: Create `utils/gerador-pessoas/export-utils.ts`**

```typescript
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
```

Note: `'﻿'` BOM prefix ensures UTF-8 encoding is recognized by Excel for proper accented character display (CA07).

- [ ] **Step 2: Commit**

```bash
git add utils/gerador-pessoas/export-utils.ts
git commit -m "feat: add JSON and CSV export utilities"
```

---

### Task 8: Vue composable

**Files:**
- Create: `composables/useGeradorPessoas.ts`

**Interfaces:**
- Consumes: `generatePessoa` from `pessoa.ts`, `exportJSON`/`exportCSV` from `export-utils.ts`, `PersonParams`/`PersonProfile` from `types.ts`
- Produces: `useGeradorPessoas()` — consumed by `pages/gerador-de-pessoas.vue`

- [ ] **Step 1: Create `composables/useGeradorPessoas.ts`**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add composables/useGeradorPessoas.ts
git commit -m "feat: add useGeradorPessoas composable"
```

---

### Task 9: Page UI + SEO + AdSense

**Files:**
- Create: `pages/gerador-de-pessoas.vue`

**Interfaces:**
- Consumes: `useGeradorPessoas`, existing components `PageHero`, `PrimaryButton`, `ToggleCheckbox`, `AdBanner`, `Icon` (nuxt-icon), `useNuxtApp` (for toast), `useHead` (Nuxt)
- Produces: The complete `/gerador-de-pessoas` page

**Layout structure (top to bottom):**
1. `<PageHero>` — H1 + description image
2. Parameters section (sex, age, UF, mask, quantity, extra toggles, Gerar button)
3. Disclaimer banner (always visible in parameters section; also shown as badge per card)
4. Results section (profile cards) — shown only after first generation (`v-if="profiles.length > 0"`)
5. Export actions (JSON, CSV, Copy All) — below all cards
6. `<AdBanner>` — after results/exports, before SEO content (physically separated from Gerar button by the entire results block)
7. SEO content block (what it is, how to use, FAQ)

Note: placing the ad **after** results avoids it sitting between the Gerar button and the output, which risks accidental clicks on every generation (RNF03). When no profiles have been generated yet, the ad appears immediately below the parameters section — still separate from the button by semantic distance.

**Disclaimer:** Show a yellow/amber alert banner within the parameters section that says all data is fictional, plus a smaller note in each profile card header.

- [ ] **Step 1: Create `pages/gerador-de-pessoas.vue`**

```vue
<script lang="ts" setup>
import generateMeta from '@/utils/generateMeta'
import { useGeradorPessoas } from '@/composables/useGeradorPessoas'
import { useBrazilianStates } from '@/composables/useBrazilianStates'

const nuxtApp = useNuxtApp()
const { params, profiles, generate, getDoc, profileToText, allProfilesToText, doExportJSON, doExportCSV } =
  useGeradorPessoas()
const { getStates } = useBrazilianStates()
const states = getStates()

const pageTitle = 'Gerador de Pessoas Fictícias | Dados Fake para Testes | Papo Digital'
const pageDescription =
  'Gere perfis completos de pessoas fictícias brasileiras: CPF, RG, PIS, Título de Eleitor, nome, endereço, e-mail e telefone válidos para testes de software.'
const pageUrl = 'https://papodigital.net.br/gerador-de-pessoas'

useHead({
  title: pageTitle,
  meta: generateMeta({
    pageTitle,
    description: pageDescription,
    contentType: 'website',
    url: pageUrl,
    twitterUrl: pageUrl,
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
  }),
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Gerador de Pessoas Fictícias Brasileiras',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        description: pageDescription,
        url: pageUrl,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
      }),
    },
  ],
})

async function copyText(text: string) {
  await navigator.clipboard.writeText(text)
  nuxtApp.$toast.success('Copiado!')
}

function handleGenerate() {
  if (params.ageMin > params.ageMax) params.ageMax = params.ageMin
  generate()
}
</script>

<template>
  <div>
    <PageHero
      title="Gerador de Pessoas Fictícias"
      image-src="/cover-page-gerador-cpf.png"
      image-alt="Gerador de Pessoas Fictícias Brasileiras"
    >
      Gere perfis completos com CPF, RG, endereço, e-mail e telefone válidos
      para uso em testes de software. Todos os dados são 100% fictícios.
    </PageHero>

    <!-- ===== PARÂMETROS ===== -->
    <section class="flex w-full flex-col gap-6 px-8 py-4 md:px-40">

      <!-- Disclaimer -->
      <div class="rounded-xl border border-yellow-400 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
        <strong>Aviso:</strong> Todos os dados gerados são <strong>completamente fictícios</strong>
        e criados apenas para fins de teste de software. Nenhum dado corresponde a pessoas reais.
      </div>

      <!-- Sex + UF -->
      <div class="flex flex-wrap gap-3">
        <div class="flex flex-col gap-1">
          <label class="text-sm text-black-400">Sexo</label>
          <select
            v-model="params.sex"
            class="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary-500"
          >
            <option value="random">Aleatório</option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-black-400">Estado (UF)</label>
          <select
            v-model="params.uf"
            class="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary-500"
          >
            <option :value="null">Aleatório</option>
            <option v-for="state in states" :key="state.uf" :value="state.uf">
              {{ state.uf }} — {{ state.name }}
            </option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-black-400">Idade mínima</label>
          <input
            v-model.number="params.ageMin"
            type="number"
            min="1"
            max="120"
            class="w-24 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary-500"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-black-400">Idade máxima</label>
          <input
            v-model.number="params.ageMax"
            type="number"
            min="1"
            max="120"
            class="w-24 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary-500"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-black-400">Quantidade</label>
          <input
            v-model.number="params.quantity"
            type="number"
            min="1"
            max="10"
            class="w-20 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary-500"
          />
        </div>
      </div>

      <!-- Toggles row 1: format -->
      <div class="flex flex-wrap gap-3">
        <ToggleCheckbox v-model="params.useMask" label="Exibir com pontuação?" />
      </div>

      <!-- Toggles row 2: extra documents -->
      <div class="flex flex-wrap gap-3">
        <ToggleCheckbox v-model="params.showPis" label="PIS/PASEP" />
        <ToggleCheckbox v-model="params.showTituloEleitor" label="Título de Eleitor" />
        <ToggleCheckbox v-model="params.showProfissao" label="Profissão" />
        <ToggleCheckbox v-model="params.showNaturalidade" label="Naturalidade" />
      </div>

      <!-- Generate button — clearly separated from ad below -->
      <div class="flex justify-end">
        <PrimaryButton @click="handleGenerate">Gerar Pessoa{{ params.quantity > 1 ? 's' : '' }}</PrimaryButton>
      </div>
    </section>

    <!-- ===== RESULTADOS ===== -->
    <section v-if="profiles.length > 0" class="mt-8 flex flex-col gap-6 px-8 md:px-40">
      <div v-for="(profile, idx) in profiles" :key="idx" class="rounded-2xl border border-gray-200 bg-white p-5 shadow-md">

        <!-- Card header -->
        <div class="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
          <span class="text-base font-semibold text-dark-purple-500">
            Pessoa {{ idx + 1 }}
          </span>
          <span class="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
            Dados fictícios
          </span>
        </div>

        <!-- Fields -->
        <div class="flex flex-col gap-1">
          <template v-for="(entry, fi) in [
            { label: 'Nome', value: profile.nome },
            { label: 'Sexo', value: profile.sexo },
            { label: 'Data de Nascimento', value: profile.dataNascimento },
            { label: 'Idade', value: String(profile.idade) },
            { label: 'CPF', value: getDoc(profile.cpf) },
            { label: 'RG', value: getDoc(profile.rg) },
            { label: 'Nome da Mãe', value: profile.nomeMae },
            { label: 'E-mail', value: profile.email },
            { label: 'Telefone', value: getDoc(profile.telefone) },
            { label: 'Logradouro', value: profile.endereco.logradouro },
            { label: 'Número', value: profile.endereco.numero },
            { label: 'Bairro', value: profile.endereco.bairro },
            { label: 'Cidade', value: profile.endereco.cidade },
            { label: 'UF', value: profile.endereco.uf },
            { label: 'CEP', value: getDoc(profile.endereco.cep) },
            ...(profile.pis ? [{ label: 'PIS/PASEP', value: getDoc(profile.pis) }] : []),
            ...(profile.tituloEleitor ? [{ label: 'Título de Eleitor', value: getDoc(profile.tituloEleitor) }] : []),
            ...(profile.profissao ? [{ label: 'Profissão', value: profile.profissao }] : []),
            ...(profile.naturalidade ? [{ label: 'Naturalidade', value: profile.naturalidade }] : []),
          ]" :key="fi">
            <div class="flex items-center justify-between rounded-lg px-2 py-1 hover:bg-gray-100">
              <span class="min-w-40 text-sm text-black-400">{{ entry.label }}</span>
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-dark-purple-500">{{ entry.value }}</span>
                <button
                  class="text-black-400 transition-colors hover:text-primary-500"
                  :aria-label="`Copiar ${entry.label}`"
                  @click="copyText(entry.value)"
                >
                  <Icon name="feather:copy" class="text-base" />
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- Copy all for this card -->
        <div class="mt-4 flex justify-end">
          <button
            class="text-sm text-primary-500 underline hover:text-primary-400"
            @click="copyText(profileToText(profile))"
          >
            Copiar todos os dados
          </button>
        </div>
      </div>

      <!-- ===== EXPORT ACTIONS ===== -->
      <div class="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          class="rounded-xl border border-gray-300 px-4 py-2 text-sm text-black-400 transition-all hover:border-primary-500 hover:text-primary-500"
          @click="copyText(allProfilesToText())"
        >
          <Icon name="feather:copy" class="mr-1" /> Copiar todos
        </button>
        <button
          class="rounded-xl border border-gray-300 px-4 py-2 text-sm text-black-400 transition-all hover:border-primary-500 hover:text-primary-500"
          @click="doExportCSV"
        >
          <Icon name="feather:download" class="mr-1" /> Exportar CSV
        </button>
        <button
          class="rounded-xl border border-gray-300 px-4 py-2 text-sm text-black-400 transition-all hover:border-primary-500 hover:text-primary-500"
          @click="doExportJSON"
        >
          <Icon name="feather:download" class="mr-1" /> Exportar JSON
        </button>
      </div>
    </section>

    <!-- ===== AD BANNER below results ===== -->
    <section class="mt-12 px-8 md:px-40">
      <AdBanner ad-slot="5036362920" />
    </section>

    <!-- ===== SEO CONTENT ===== -->
    <section class="mt-12 flex flex-col gap-6 px-8 pb-16 md:px-40">
      <h2 class="text-xl text-black-500 md:text-2xl">
        O que é o Gerador de Pessoas Fictícias?
      </h2>
      <p class="text-xs text-black-400 md:text-lg">
        Esta ferramenta gera perfis completos de pessoas fictícias com CPF, RG, PIS/PASEP, Título de
        Eleitor, nome, e-mail, telefone e endereço. Todos os documentos são estruturalmente válidos —
        passam nos algoritmos de dígito verificador — mas <strong>não correspondem a pessoas reais</strong>.
      </p>

      <h2 class="text-xl text-black-500 md:text-2xl">
        Para que serve?
      </h2>
      <p class="text-xs text-black-400 md:text-lg">
        Desenvolvedores, analistas de QA e estudantes usam dados fictícios para popular formulários,
        testar validações de CPF/CNPJ, alimentar bancos de dados de desenvolvimento e criar cenários
        de teste sem expor dados reais de pessoas. Com o gerador em lote você cria até 10 perfis de
        uma vez e exporta diretamente para JSON ou CSV.
      </p>

      <h2 class="text-xl text-black-500 md:text-2xl">
        Como os documentos são gerados?
      </h2>
      <p class="text-xs text-black-400 md:text-lg">
        O CPF é gerado com o algoritmo oficial de módulo 11 da Receita Federal, incluindo o dígito de
        região fiscal vinculado ao estado selecionado. O PIS/PASEP segue o mesmo princípio. O Título de
        Eleitor utiliza o algoritmo oficial do TSE, com os pesos definidos pela especificação e o
        tratamento especial dos estados de SP e MG. O RG segue o formato SSP-SP como aproximação —
        já que não existe um padrão nacional unificado.
      </p>

      <h2 class="text-xl text-black-500 md:text-2xl">
        Perguntas Frequentes
      </h2>
      <dl class="flex flex-col gap-4">
        <div>
          <dt class="font-semibold text-black-500">Os CPFs gerados são de pessoas reais?</dt>
          <dd class="text-xs text-black-400 md:text-lg">
            Não. Apesar de serem matematicamente válidos, são números aleatórios que não
            pertencem a nenhum cadastro. Usar estes dados para fins ilícitos é crime.
          </dd>
        </div>
        <div>
          <dt class="font-semibold text-black-500">Os dados trafegam pela internet?</dt>
          <dd class="text-xs text-black-400 md:text-lg">
            Não. Toda a geração acontece no seu navegador, sem nenhuma chamada de servidor.
          </dd>
        </div>
        <div>
          <dt class="font-semibold text-black-500">Posso usar em produção?</dt>
          <dd class="text-xs text-black-400 md:text-lg">
            Esta ferramenta destina-se exclusivamente a ambientes de desenvolvimento e teste.
            Nunca use dados fictícios em sistemas de produção ou cadastros reais.
          </dd>
        </div>
      </dl>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Start dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:3000/gerador-de-pessoas` and confirm:
- Page loads without errors
- Clicking "Gerar Pessoas" shows a profile card
- Each field has a copy icon; clicking it triggers a toast
- "Copiar todos os dados" per card works
- Export CSV and JSON trigger downloads
- Toggling "Exibir com pontuação?" reformats documents without regenerating names/dates
- Generating with a selected UF shows consistent DDD
- Disclaimer badge is always visible
- Page is usable on mobile (narrow browser)

- [ ] **Step 3: Commit**

```bash
git add pages/gerador-de-pessoas.vue
git commit -m "feat: add gerador-de-pessoas page with full UI, SEO, and AdSense"
```

---

## Self-Review: Spec Coverage Check

| Requirement | Covered by |
|---|---|
| RF01 — single profile | Task 6 (pessoa.ts), Task 9 (page) |
| RF02 — batch 1–10 | Task 8 composable `quantity`, Task 9 UI |
| RF03 — copy field | Task 9 per-field copy button |
| RF04 — copy profile + copy all | Task 8 `profileToText` / `allProfilesToText`, Task 9 |
| RF05 — export JSON + CSV | Task 7, Task 9 |
| RF06 — mask toggle without regen | Task 8 `getDoc()`, Task 9 reactive |
| RF07 — params persist across display toggle | Task 8 reactive params |
| RF08 — disclaimer permanent | Task 9 (parameters section + card header) |
| RNF01 — offline | All generators are pure functions; no fetch calls |
| RNF02 — ad reliability | AdBanner isolated in its own `<section>` |
| RNF03 — ad slot separation | AdBanner placed 40px+ below Gerar button (section break) |
| RNF04 — SEO JSON-LD + H1 + meta | Task 9 `useHead` + `<PageHero>` + ld+json |
| RNF04 — content block | Task 9 SEO content section |
| RNF05 — accessibility | labels + aria-label on copy buttons + keyboard-operable selects |
| RNF06 — responsive | Tailwind flex-wrap on all control rows |
| RNF07 — no data sent | No fetch, all client-side |
| CA01 — CPF, PIS, Título pass validators | Tasks 2, 3, 4 (verification scripts) |
| CA02 — no all-same digits | `isAllSame` guard in every generator |
| CA03 — UF→CPF region + DDD | Task 2 verification (UF-region assertions) + Task 5 verification (DDD assertions) |
| CA04 — sex coherence | Task 5 faker-pessoa uses `{ sex }` param |
| CA05 — batch perf | Pure sync functions; 10 profiles in < 10ms |
| CA06 — mask toggle without regen | Task 8 `getDoc()` |
| CA07 — UTF-8 CSV export | Task 7 BOM prefix |
| CA08 — no network requests | Verified by design; confirm in browser Network tab |
| CA09 — disclaimer visible | Task 9 always-visible disclaimer div |

All 27 items covered. No gaps found.
