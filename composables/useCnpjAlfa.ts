/**
 * Composable: useCnpjAlfa
 * Geração e validação de CNPJ alfanumérico (12 posições alfanuméricas + 2 DVs numéricos).
 * Regra do DV: Módulo 11 sobre valores (ASCII - 48). Pesos:
 *  - DV1: [5,4,3,2,9,8,7,6,5,4,3,2]
 *  - DV2: [6,5,4,3,2,9,8,7,6,5,4,3,2]
 *  - Ajuste padrão do Módulo 11: se (soma % 11) < 2 => DV = 0; senão DV = 11 - (soma % 11)
 */

const ALLOWED = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' as const
const WEIGHTS_DV1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const
const WEIGHTS_DV2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const

/** Remove tudo que não é [A-Za-z0-9] e uppercasa */
function normalize(input: string): string {
  return (input ?? '').replace(/[^0-9a-z]/gi, '').toUpperCase()
}

/** Converte caractere para valor usado no Módulo 11: (ASCII - 48) */
function charToM11Value(ch: string): number {
  return ch.toUpperCase().charCodeAt(0) - 48
}

/** Calcula DV (Módulo 11) para vetor de valores usando pesos informados */
function calcM11(
  values: readonly number[],
  weights: readonly number[],
): number {
  const sum = values.reduce((acc, v, i) => acc + v * (weights[i] ?? 0), 0)
  const rest = sum % 11
  return rest < 2 ? 0 : 11 - rest // regra tradicional do CNPJ
}

/** Calcula os dois DVs a partir dos 12 caracteres-base */
function calcDvPair(base12: string): [number, number] {
  if (base12.length !== 12)
    throw new Error('calcDvPair: base12 deve ter 12 caracteres alfanuméricos')

  const vals1 = [...base12].map(charToM11Value)
  const dv1 = calcM11(vals1, WEIGHTS_DV1)

  const vals2 = [...base12, String(dv1)].map(charToM11Value)
  const dv2 = calcM11(vals2, WEIGHTS_DV2)

  return [dv1, dv2]
}

/** Formata no padrão AA.AAA.AAA/AAAA-DV */
function formatCnpj14(clean14: string): string {
  const c = clean14.toUpperCase()
  const base = c.slice(0, 12)
  const dv = c.slice(12)
  return `${base.slice(0, 2)}.${base.slice(2, 5)}.${base.slice(5, 8)}/${base.slice(8, 12)}-${dv}`
}

/** Gera 12 caracteres alfanuméricos [0-9A-Z] */
function randomBase12(rng: () => number): string {
  let out = ''
  for (let i = 0; i < 12; i++) {
    const idx = Math.floor(rng() * ALLOWED.length)
    out += ALLOWED[idx]
  }
  return out
}

export type GenerateOptions = {
  /** se true, retorna "AA.AAA.AAA/AAAA-DV"; senão, retorna 14 chars sem máscara */
  formatted?: boolean
  /** RNG custom (p/ testes); default: Math.random */
  rng?: () => number
}

export type ValidateResult = {
  valid: boolean
  /** versão formatada se o input pôde ser normalizado para 14 chars */
  formatted: string | null
  /** motivo do erro (se inválido): 'empty' | 'length' | 'charset' | 'checksum' */
  reason?: 'empty' | 'length' | 'charset' | 'checksum'
  /** DVs calculados a partir do base12, útil para debug */
  dv?: [number, number]
}

export function useCnpjAlfa() {
  /** Gera CNPJ alfanumérico válido */
  function generate(opts: GenerateOptions = {}): string {
    const { formatted = true, rng = Math.random } = opts
    const base12 = randomBase12(rng)
    const [d1, d2] = calcDvPair(base12)
    const clean14 = base12 + String(d1) + String(d2)
    return formatted ? formatCnpj14(clean14) : clean14
  }

  /** Valida um CNPJ alfanumérico (com ou sem máscara) */
  function validate(input: string): ValidateResult {
    if (!input) return { valid: false, formatted: null, reason: 'empty' }

    const clean = normalize(input)
    if (clean.length !== 14)
      return { valid: false, formatted: null, reason: 'length' }

    // 12 primeiros: alfanumérico; 2 últimos: numéricos
    if (!/^[0-9A-Z]{12}[0-9]{2}$/.test(clean))
      return { valid: false, formatted: null, reason: 'charset' }

    const base12 = clean.slice(0, 12)
    const dvIn = clean.slice(12)
    const [d1, d2] = calcDvPair(base12)
    const dvOk = dvIn === `${d1}${d2}`

    return {
      valid: dvOk,
      formatted: formatCnpj14(clean),
      reason: dvOk ? undefined : 'checksum',
      dv: [d1, d2],
    }
  }

  /** Normaliza & formata se possível */
  function format(input: string): string {
    const clean = normalize(input)
    return clean.length === 14 ? formatCnpj14(clean) : input
  }

  return {
    generate,
    validate,
    format,
    // helpers expostos para eventuais testes
    _internal: { normalize, charToM11Value, calcM11, calcDvPair },
  } as const
}
