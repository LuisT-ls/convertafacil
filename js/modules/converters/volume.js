/**
 * Módulo de conversão de volume
 */

// Lista de unidades de volume disponíveis
const volumeUnits = [
  { code: 'l', name: 'Litro' },
  { code: 'ml', name: 'Mililitro' },
  { code: 'm3', name: 'Metro cúbico' },
  { code: 'cm3', name: 'Centímetro cúbico' },
  { code: 'gal', name: 'Galão (EUA)' },
  { code: 'qt', name: 'Quarto (EUA)' },
  { code: 'pt', name: 'Pinta (EUA)' },
  { code: 'fl_oz', name: 'Onça fluida (EUA)' },
  { code: 'cup', name: 'Xícara (EUA)' },
  { code: 'tbsp', name: 'Colher de sopa' },
  { code: 'tsp', name: 'Colher de chá' }
]

// Unidades padrão
const defaultFrom = 'l'
const defaultTo = 'ml'

// Fatores de conversão para litros (unidade base)
const toLiters = {
  l: 1,
  ml: 0.001,
  m3: 1000,
  cm3: 0.001,
  gal: 3.78541,
  qt: 0.946353,
  pt: 0.473176,
  fl_oz: 0.0295735,
  cup: 0.24,
  tbsp: 0.0147868,
  tsp: 0.00492892
}

// Função para converter volume
async function convert(value, fromUnit, toUnit) {
  // Se as unidades são iguais, retorna o mesmo valor
  if (fromUnit === toUnit) {
    return value
  }

  // Converte para litros primeiro (unidade base)
  const valueInLiters = value * toLiters[fromUnit]

  // Converte de litros para a unidade alvo
  return valueInLiters / toLiters[toUnit]
}

// Função para obter a fórmula de conversão
async function getFormula(value, fromUnit, toUnit) {
  // Se as unidades são iguais, não há conversão
  if (fromUnit === toUnit) {
    return `${value} ${fromUnit} = ${value} ${toUnit}`
  }

  // Calcula o fator de conversão direta
  const conversionFactor = toLiters[fromUnit] / toLiters[toUnit]

  // Formata o fator para exibição
  let formattedFactor
  if (conversionFactor < 0.0001 || conversionFactor > 10000) {
    formattedFactor = conversionFactor
      .toExponential(4)
      .replace('e+', ' × 10^')
      .replace('e-', ' × 10^-')
  } else {
    formattedFactor = conversionFactor.toFixed(6).replace(/\.?0+$/, '')
  }

  return `1 ${fromUnit} = ${formattedFactor} ${toUnit}`
}

// Exporta o módulo de conversão de volume
export const volumeConverter = {
  units: volumeUnits,
  defaultFrom,
  defaultTo,
  convert,
  getFormula
}
