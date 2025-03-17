/**
 * Módulo de conversão de comprimento
 */

// Lista de unidades de comprimento disponíveis
const lengthUnits = [
  { code: 'm', name: 'Metro' },
  { code: 'km', name: 'Quilômetro' },
  { code: 'cm', name: 'Centímetro' },
  { code: 'mm', name: 'Milímetro' },
  { code: 'in', name: 'Polegada' },
  { code: 'ft', name: 'Pé' },
  { code: 'yd', name: 'Jarda' },
  { code: 'mi', name: 'Milha' }
]

// Unidades padrão
const defaultFrom = 'm'
const defaultTo = 'cm'

// Fatores de conversão para metros (unidade base)
const toMeters = {
  m: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344
}

// Função para converter comprimento
async function convert(value, fromUnit, toUnit) {
  // Se as unidades são iguais, retorna o mesmo valor
  if (fromUnit === toUnit) {
    return value
  }

  // Converte para metros primeiro (unidade base)
  const valueInMeters = value * toMeters[fromUnit]

  // Converte de metros para a unidade alvo
  return valueInMeters / toMeters[toUnit]
}

// Função para obter a fórmula de conversão
async function getFormula(value, fromUnit, toUnit) {
  // Se as unidades são iguais, não há conversão
  if (fromUnit === toUnit) {
    return `${value} ${fromUnit} = ${value} ${toUnit}`
  }

  // Calcula o fator de conversão direta
  const conversionFactor = toMeters[fromUnit] / toMeters[toUnit]
  const formattedFactor = conversionFactor
    .toExponential(4)
    .replace('e+', ' × 10^')
    .replace('e-', ' × 10^-')

  return `1 ${fromUnit} = ${formattedFactor} ${toUnit}`
}

// Exporta o módulo de conversão de comprimento
export const lengthConverter = {
  units: lengthUnits,
  defaultFrom,
  defaultTo,
  convert,
  getFormula
}
