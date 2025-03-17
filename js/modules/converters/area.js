/**
 * Módulo de conversão de área
 */

// Lista de unidades de área disponíveis
const areaUnits = [
  { code: 'm2', name: 'Metro quadrado' },
  { code: 'km2', name: 'Quilômetro quadrado' },
  { code: 'cm2', name: 'Centímetro quadrado' },
  { code: 'mm2', name: 'Milímetro quadrado' },
  { code: 'ha', name: 'Hectare' },
  { code: 'acre', name: 'Acre' },
  { code: 'ft2', name: 'Pé quadrado' },
  { code: 'in2', name: 'Polegada quadrada' },
  { code: 'yd2', name: 'Jarda quadrada' },
  { code: 'mi2', name: 'Milha quadrada' }
]

// Unidades padrão
const defaultFrom = 'm2'
const defaultTo = 'ft2'

// Fatores de conversão para metros quadrados (unidade base)
const toSquareMeters = {
  m2: 1,
  km2: 1000000,
  cm2: 0.0001,
  mm2: 0.000001,
  ha: 10000,
  acre: 4046.86,
  ft2: 0.092903,
  in2: 0.00064516,
  yd2: 0.836127,
  mi2: 2589988.11
}

// Função para converter área
async function convert(value, fromUnit, toUnit) {
  // Se as unidades são iguais, retorna o mesmo valor
  if (fromUnit === toUnit) {
    return value
  }

  // Converte para metros quadrados primeiro (unidade base)
  const valueInSquareMeters = value * toSquareMeters[fromUnit]

  // Converte de metros quadrados para a unidade alvo
  return valueInSquareMeters / toSquareMeters[toUnit]
}

// Função para obter a fórmula de conversão
async function getFormula(value, fromUnit, toUnit) {
  // Se as unidades são iguais, não há conversão
  if (fromUnit === toUnit) {
    return `${value} ${fromUnit} = ${value} ${toUnit}`
  }

  // Calcula o fator de conversão direta
  const conversionFactor = toSquareMeters[fromUnit] / toSquareMeters[toUnit]

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

// Exporta o módulo de conversão de área
export const areaConverter = {
  units: areaUnits,
  defaultFrom,
  defaultTo,
  convert,
  getFormula
}
