/**
 * Módulo de conversão de temperatura
 */

// Lista de unidades de temperatura disponíveis
const temperatureUnits = [
  { code: 'C', name: 'Celsius' },
  { code: 'F', name: 'Fahrenheit' },
  { code: 'K', name: 'Kelvin' }
]

// Unidades padrão
const defaultFrom = 'C'
const defaultTo = 'F'

// Funções de conversão
const temperatureConverters = {
  // Celsius para outras unidades
  C_F: celsius => (celsius * 9) / 5 + 32,
  C_K: celsius => celsius + 273.15,

  // Fahrenheit para outras unidades
  F_C: fahrenheit => ((fahrenheit - 32) * 5) / 9,
  F_K: fahrenheit => ((fahrenheit - 32) * 5) / 9 + 273.15,

  // Kelvin para outras unidades
  K_C: kelvin => kelvin - 273.15,
  K_F: kelvin => ((kelvin - 273.15) * 9) / 5 + 32
}

// Fórmulas para exibição
const temperatureFormulas = {
  C_F: '°C × (9/5) + 32 = °F',
  C_K: '°C + 273.15 = K',
  F_C: '(°F - 32) × (5/9) = °C',
  F_K: '(°F - 32) × (5/9) + 273.15 = K',
  K_C: 'K - 273.15 = °C',
  K_F: '(K - 273.15) × (9/5) + 32 = °F'
}

// Função para converter temperatura
async function convert(value, fromUnit, toUnit) {
  // Se as unidades são iguais, retorna o mesmo valor
  if (fromUnit === toUnit) {
    return value
  }

  // Identifica o conversor correto
  const converterKey = `${fromUnit}_${toUnit}`
  const converter = temperatureConverters[converterKey]

  if (converter) {
    return converter(value)
  } else {
    throw new Error(`Conversão não suportada: ${fromUnit} para ${toUnit}`)
  }
}

// Função para obter a fórmula de conversão
async function getFormula(value, fromUnit, toUnit) {
  // Se as unidades são iguais, não há conversão
  if (fromUnit === toUnit) {
    return `${value} ${fromUnit} = ${value} ${toUnit}`
  }

  // Identifica a fórmula correta
  const formulaKey = `${fromUnit}_${toUnit}`
  const formula = temperatureFormulas[formulaKey]

  if (formula) {
    return formula
  } else {
    return `Conversão de ${fromUnit} para ${toUnit}`
  }
}

// Exporta o módulo de conversão de temperatura
export const temperatureConverter = {
  units: temperatureUnits,
  defaultFrom,
  defaultTo,
  convert,
  getFormula
}
