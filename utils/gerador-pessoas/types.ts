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
