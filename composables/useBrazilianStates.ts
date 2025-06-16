export interface BrazilianState {
  uf: string;
  name: string;
}

const brazilianStates: BrazilianState[] = [
  { uf: 'AC', name: 'Acre' },
  { uf: 'AL', name: 'Alagoas' },
  { uf: 'AP', name: 'Amapá' },
  { uf: 'AM', name: 'Amazonas' },
  { uf: 'BA', name: 'Bahia' },
  { uf: 'CE', name: 'Ceará' },
  { uf: 'DF', name: 'Distrito Federal' },
  { uf: 'ES', name: 'Espírito Santo' },
  { uf: 'GO', name: 'Goiás' },
  { uf: 'MA', name: 'Maranhão' },
  { uf: 'MT', name: 'Mato Grosso' },
  { uf: 'MS', name: 'Mato Grosso do Sul' },
  { uf: 'MG', name: 'Minas Gerais' },
  { uf: 'PA', name: 'Pará' },
  { uf: 'PB', name: 'Paraíba' },
  { uf: 'PR', name: 'Paraná' },
  { uf: 'PE', name: 'Pernambuco' },
  { uf: 'PI', name: 'Piauí' },
  { uf: 'RJ', name: 'Rio de Janeiro' },
  { uf: 'RN', name: 'Rio Grande do Norte' },
  { uf: 'RS', name: 'Rio Grande do Sul' },
  { uf: 'RO', name: 'Rondônia' },
  { uf: 'RR', name: 'Roraima' },
  { uf: 'SC', name: 'Santa Catarina' },
  { uf: 'SP', name: 'São Paulo' },
  { uf: 'SE', name: 'Sergipe' },
  { uf: 'TO', name: 'Tocantins' },
];

export const useBrazilianStates = () => {
  const getStates = () => {
    return brazilianStates;
  };

  // Placeholder for city fetching logic
  // In a real scenario, this might fetch from an API or a larger dataset
  const getCitiesByState = async (uf: string): Promise<string[]> => {
    console.warn(`Fetching cities for UF: ${uf} - Using placeholder data.`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));

    if (uf === 'SP') {
      return ['São Paulo', 'Campinas', 'Guarulhos', 'Santos'];
    }
    if (uf === 'RJ') {
      return ['Rio de Janeiro', 'Niterói', 'Duque de Caxias'];
    }
    if (uf === 'MG') {
        return ['Belo Horizonte', 'Uberlândia', 'Contagem'];
    }
    return ['Cidade Exemplo 1', 'Cidade Exemplo 2']; // Default placeholder
  };

  return {
    getStates,
    getCitiesByState,
  };
};
