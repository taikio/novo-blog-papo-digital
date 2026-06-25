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

/** Common Brazilian neighborhood name patterns for bairro generation */
export const BAIRRO_PREFIXES = [
  'Centro', 'Vila', 'Jardim', 'Parque', 'Alto', 'Bela Vista',
  'Nova', 'São José', 'Santa Maria', 'Boa Vista', 'Ipiranga',
  'Liberdade', 'Moema', 'Pinheiros', 'Consolação', 'Lapa',
  'Butantã', 'Tatuapé', 'Penha', 'Santana', 'Tucuruvi',
]
