/**
 * Módulo de conversão de moedas
 */

// URL da API de taxas de câmbio
const API_URL = 'https://open.er-api.com/v6/latest/'
const API_KEY = '' // A API que estamos usando não requer chave para o plano gratuito

// Cache para armazenar as taxas de câmbio
let exchangeRates = {}
let lastUpdate = null

// Lista de moedas disponíveis
const currencies = [
  { code: 'USD', name: 'Dólar Americano' },
  { code: 'EUR', name: 'Euro' },
  { code: 'BRL', name: 'Real Brasileiro' },
  { code: 'GBP', name: 'Libra Esterlina' },
  { code: 'JPY', name: 'Iene Japonês' },
  { code: 'CAD', name: 'Dólar Canadense' },
  { code: 'AUD', name: 'Dólar Australiano' },
  { code: 'CNY', name: 'Yuan Chinês' },
  { code: 'CHF', name: 'Franco Suíço' },
  { code: 'ARS', name: 'Peso Argentino' }
]

// Moedas padrão
const defaultFrom = 'USD'
const defaultTo = 'BRL'

// Função para buscar as taxas de câmbio
async function fetchExchangeRates(baseCurrency = 'USD') {
  // Verifica se já temos taxas em cache e se foram atualizadas nas últimas 24 horas
  const now = new Date()
  if (
    exchangeRates[baseCurrency] &&
    lastUpdate &&
    now.getTime() - lastUpdate.getTime() < 24 * 60 * 60 * 1000
  ) {
    console.log('Usando taxas em cache')
    return exchangeRates[baseCurrency]
  }

  try {
    const response = await fetch(`${API_URL}${baseCurrency}`)
    const data = await response.json()

    if (data && data.rates) {
      // Armazena as taxas em cache
      exchangeRates[baseCurrency] = data.rates
      lastUpdate = now

      // Armazena a data da última atualização no localStorage
      localStorage.setItem('exchangeRatesLastUpdate', now.toISOString())
      localStorage.setItem(
        `exchangeRates_${baseCurrency}`,
        JSON.stringify(data.rates)
      )

      return data.rates
    } else {
      throw new Error('Formato de resposta inválido')
    }
  } catch (error) {
    console.error('Erro ao buscar taxas de câmbio:', error)

    // Tenta usar taxas em cache mesmo que antigas
    if (exchangeRates[baseCurrency]) {
      return exchangeRates[baseCurrency]
    }

    // Tenta usar taxas armazenadas no localStorage
    const savedRates = localStorage.getItem(`exchangeRates_${baseCurrency}`)
    if (savedRates) {
      try {
        exchangeRates[baseCurrency] = JSON.parse(savedRates)
        return exchangeRates[baseCurrency]
      } catch (e) {
        console.error('Erro ao analisar taxas salvas:', e)
      }
    }

    // Se tudo falhar, retorna taxas fixas para algumas moedas principais
    return {
      USD: 1,
      EUR: 0.92,
      BRL: 5.2,
      GBP: 0.79,
      JPY: 149.75,
      CAD: 1.36,
      AUD: 1.52,
      CNY: 7.24,
      CHF: 0.89,
      ARS: 870.5
    }
  }
}

// Função para converter entre moedas
async function convert(amount, fromCurrency, toCurrency) {
  // Busca as taxas com base na moeda de origem
  const rates = await fetchExchangeRates(fromCurrency)

  // Se as moedas são iguais, retorna o mesmo valor
  if (fromCurrency === toCurrency) {
    return amount
  }

  // Realiza a conversão
  if (rates[toCurrency]) {
    return amount * rates[toCurrency]
  } else {
    throw new Error(`Taxa de câmbio não disponível para ${toCurrency}`)
  }
}

// Função para obter a fórmula de conversão
async function getFormula(amount, fromCurrency, toCurrency) {
  // Busca as taxas com base na moeda de origem
  const rates = await fetchExchangeRates(fromCurrency)

  // Formata o valor da taxa
  const rate = rates[toCurrency]
  const formattedRate = rate.toFixed(4)

  return `1 ${fromCurrency} = ${formattedRate} ${toCurrency}`
}

// Carrega as taxas do localStorage ao inicializar
const loadSavedRates = () => {
  const savedLastUpdate = localStorage.getItem('exchangeRatesLastUpdate')

  if (savedLastUpdate) {
    lastUpdate = new Date(savedLastUpdate)

    // Carrega as taxas para cada moeda base que tenhamos salvo
    currencies.forEach(currency => {
      const savedRates = localStorage.getItem(`exchangeRates_${currency.code}`)
      if (savedRates) {
        try {
          exchangeRates[currency.code] = JSON.parse(savedRates)
        } catch (e) {
          console.error(`Erro ao carregar taxas para ${currency.code}:`, e)
        }
      }
    })
  }
}

// Inicializa o carregamento das taxas salvas
loadSavedRates()

// Exporta o módulo de conversão de moedas
export const currencyConverter = {
  units: currencies,
  defaultFrom,
  defaultTo,
  convert,
  getFormula
}
