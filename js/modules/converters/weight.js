/**
 * Módulo de conversão de peso
 */

// Lista de unidades de peso disponíveis
const weightUnits = [
  { code: 'kg', name: 'Quilograma' },
  { code: 'g', name: 'Grama' },
  { code: 'mg', name: 'Miligrama' },
  { code: 't', name: 'Tonelada' },
  { code: 'lb', name: 'Libra' },
  { code: 'oz', name: 'Onça' },
  { code: 'st', name: 'Stone (Reino Unido)' }
]

// Unidades padrão
const defaultFrom = 'kg'
const defaultTo = 'lb'

// Fatores de conversão para quilogramas (unidade base)
const toKilograms = {
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  t: 1000,
  lb: 0.45359237,
  oz: 0.028349523125,
  st: 6.35029318
}

// Função para converter peso
async function convert(value, fromUnit, toUnit) {
  // Se as unidades são iguais, retorna o mesmo valor
  if (fromUnit === toUnit) {
    return value
  }

  // Converte para quilogramas primeiro (unidade base)
  const valueInKilograms = value * toKilograms[fromUnit]

  // Converte de quilogramas para a unidade alvo
  return valueInKilograms / toKilograms[toUnit]
}

// Função para obter a fórmula de conversão
async function getFormula(value, fromUnit, toUnit) {
  // Se as unidades são iguais, não há conversão
  if (fromUnit === toUnit) {
    return `${value} ${fromUnit} = ${value} ${toUnit}`
  }

  // Calcula o fator de conversão direta
  const conversionFactor = toKilograms[fromUnit] / toKilograms[toUnit]

  // Formata o fator para exibição
  let formattedFactor
  if (conversionFactor < 0.0001 || conversionFactor > 10000) {
    formattedFactor = conversionFactor
      .toExponential(4)
      .replace('e+', ' × 10^')
      .replace('e-', ' × 10^-')
  } else {
    formattedFactor = conversionFactor.toFixed(7).replace(/\.?0+$/, '')
  }

  return `1 ${fromUnit} = ${formattedFactor} ${toUnit}`
}

// Exporta o módulo de conversão de peso
export const weightConverter = {
  units: weightUnits,
  defaultFrom,
  defaultTo,
  convert,
  getFormula
}
