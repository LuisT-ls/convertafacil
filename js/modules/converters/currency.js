/**
 * Módulo de conversão de moedas
 * Utiliza APIs atualizadas para obter taxas de câmbio em tempo real
 */

// APIs para taxas de câmbio (com fallbacks para garantir disponibilidade)
const API_SOURCES = [
  {
    name: 'ExchangeRate-API',
    url: 'https://open.er-api.com/v6/latest/',
    processResponse: (data, baseCurrency) => data.rates,
    needsKey: false
  },
  {
    name: 'Frankfurter',
    url: 'https://api.frankfurter.app/latest?from=',
    processResponse: (data, baseCurrency) => data.rates,
    needsKey: false
  },
  {
    name: 'ExchangeRate-Host',
    url: 'https://api.exchangerate.host/latest?base=',
    processResponse: (data, baseCurrency) => data.rates,
    needsKey: false
  }
]

// Cache para armazenar as taxas de câmbio
let exchangeRates = {}
let lastUpdate = null
let currentApiIndex = 0 // Para alternar entre APIs em caso de falha

// Lista de moedas disponíveis com símbolos
const currencies = [
  { code: 'USD', name: 'Dólar Americano', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$' },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£' },
  { code: 'JPY', name: 'Iene Japonês', symbol: '¥' },
  { code: 'CAD', name: 'Dólar Canadense', symbol: 'C$' },
  { code: 'AUD', name: 'Dólar Australiano', symbol: 'A$' },
  { code: 'CNY', name: 'Yuan Chinês', symbol: '¥' },
  { code: 'CHF', name: 'Franco Suíço', symbol: 'Fr' },
  { code: 'ARS', name: 'Peso Argentino', symbol: '$' },
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$' },
  { code: 'KRW', name: 'Won Sul-Coreano', symbol: '₩' },
  { code: 'INR', name: 'Rupia Indiana', symbol: '₹' },
  { code: 'RUB', name: 'Rublo Russo', symbol: '₽' },
  { code: 'NZD', name: 'Dólar Neozelandês', symbol: 'NZ$' }
]

// Moedas padrão
const defaultFrom = 'USD'
const defaultTo = 'BRL'

// Tempo máximo de validade do cache em milissegundos (10 minutos para taxas em tempo real)
const CACHE_MAX_AGE = 10 * 60 * 1000

// Tempo de verificação em segundo plano para taxas atualizadas (a cada 5 minutos)
const BACKGROUND_UPDATE_INTERVAL = 5 * 60 * 1000

/**
 * Busca taxas de câmbio atualizadas de várias APIs com fallback
 * @param {string} baseCurrency - Moeda base para a conversão
 * @returns {Promise<Object>} - Objeto com taxas de câmbio
 */
async function fetchExchangeRates(baseCurrency = 'USD') {
  // Verifica se já temos taxas em cache e se estão dentro do período de validade
  const now = new Date()
  if (
    exchangeRates[baseCurrency] &&
    lastUpdate &&
    now.getTime() - lastUpdate.getTime() < CACHE_MAX_AGE
  ) {
    console.log('Usando taxas em cache recentes')
    return exchangeRates[baseCurrency]
  }

  // Tenta cada API em sequência até obter sucesso
  let apiError = null
  for (let i = 0; i < API_SOURCES.length; i++) {
    // Usa um índice rotativo para começar por diferentes APIs
    const apiIndex = (currentApiIndex + i) % API_SOURCES.length
    const api = API_SOURCES[apiIndex]

    try {
      console.log(`Buscando taxas de ${api.name}...`)

      // Constrói a URL da API
      const url = `${api.url}${baseCurrency}`

      // Adiciona timeout para evitar esperar muito tempo
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      // Faz a requisição
      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Falha na API ${api.name}: ${response.status}`)
      }

      const data = await response.json()

      // Processa a resposta conforme o formato da API
      const rates = api.processResponse(data, baseCurrency)

      if (rates) {
        // Atualiza o índice para a próxima vez começar com a API que funcionou
        currentApiIndex = apiIndex

        // Armazena as taxas em cache
        exchangeRates[baseCurrency] = rates
        lastUpdate = now

        // Armazena a data da última atualização no localStorage
        localStorage.setItem('exchangeRatesLastUpdate', now.toISOString())
        localStorage.setItem(
          `exchangeRates_${baseCurrency}`,
          JSON.stringify(rates)
        )
        localStorage.setItem('exchangeRatesSource', api.name)

        console.log(`Taxas obtidas com sucesso de ${api.name}`)
        return rates
      }

      throw new Error(`Formato de resposta inválido de ${api.name}`)
    } catch (error) {
      console.error(`Erro ao buscar taxas de ${api.name}:`, error)
      apiError = error
      // Continua para a próxima API
    }
  }

  console.error('Todas as APIs falharam. Usando dados de fallback...')

  // Se todas as APIs falharam, tenta usar taxas em cache mesmo que antigas
  if (exchangeRates[baseCurrency]) {
    console.log('Usando taxas em cache (possivelmente desatualizadas)')
    return exchangeRates[baseCurrency]
  }

  // Tenta usar taxas armazenadas no localStorage
  const savedRates = localStorage.getItem(`exchangeRates_${baseCurrency}`)
  if (savedRates) {
    try {
      exchangeRates[baseCurrency] = JSON.parse(savedRates)
      console.log('Usando taxas salvas no localStorage')
      return exchangeRates[baseCurrency]
    } catch (e) {
      console.error('Erro ao analisar taxas salvas:', e)
    }
  }

  // Se tudo falhar, retorna taxas fixas atualizadas (março 2025)
  console.warn('Usando taxas fixas de fallback (podem não estar atualizadas)')
  return getFixedRates(baseCurrency)
}

/**
 * Retorna taxas fixas para fallback, ajustadas para a moeda base
 * @param {string} baseCurrency - Moeda base
 * @returns {Object} - Objeto com taxas de câmbio
 */
function getFixedRates(baseCurrency) {
  // Taxas fixas de referência (atualizadas em março de 2025)
  const usdRates = {
    USD: 1,
    EUR: 0.92,
    BRL: 5.12,
    GBP: 0.78,
    JPY: 150.65,
    CAD: 1.35,
    AUD: 1.5,
    CNY: 7.22,
    CHF: 0.88,
    ARS: 900.5,
    MXN: 16.85,
    KRW: 1340.2,
    INR: 83.45,
    RUB: 92.3,
    NZD: 1.62
  }

  // Se a moeda base já for USD, retorna diretamente
  if (baseCurrency === 'USD') {
    return usdRates
  }

  // Converte para a moeda base especificada
  const baseRate = usdRates[baseCurrency]
  if (!baseRate) {
    return usdRates // Fallback para USD se a moeda base não for encontrada
  }

  const convertedRates = {}
  for (const [currency, rate] of Object.entries(usdRates)) {
    convertedRates[currency] = rate / baseRate
  }

  return convertedRates
}

/**
 * Converte valor entre moedas
 * @param {number} amount - Valor a ser convertido
 * @param {string} fromCurrency - Moeda de origem
 * @param {string} toCurrency - Moeda de destino
 * @returns {Promise<number>} - Valor convertido
 */
async function convert(amount, fromCurrency, toCurrency) {
  // Se as moedas são iguais, retorna o mesmo valor
  if (fromCurrency === toCurrency) {
    return amount
  }

  try {
    // Estratégia 1: Tentar conversão direta com a moeda de origem como base
    const rates = await fetchExchangeRates(fromCurrency)

    if (rates[toCurrency]) {
      return amount * rates[toCurrency]
    }

    // Estratégia 2: Se não encontrou taxa direta, tenta com USD como intermediário
    if (fromCurrency !== 'USD') {
      const usdRates = await fetchExchangeRates('USD')

      if (usdRates[fromCurrency] && usdRates[toCurrency]) {
        const amountInUSD = amount / usdRates[fromCurrency]
        return amountInUSD * usdRates[toCurrency]
      }
    }

    throw new Error(
      `Taxa de câmbio não disponível para ${fromCurrency} -> ${toCurrency}`
    )
  } catch (error) {
    console.error(
      `Erro na conversão de ${fromCurrency} para ${toCurrency}:`,
      error
    )
    throw error
  }
}

/**
 * Obtém a fórmula de conversão para exibição
 * @param {number} amount - Valor a ser convertido
 * @param {string} fromCurrency - Moeda de origem
 * @param {string} toCurrency - Moeda de destino
 * @returns {Promise<string>} - Fórmula formatada
 */
async function getFormula(amount, fromCurrency, toCurrency) {
  try {
    // Obtém taxa de conversão
    let rate
    let formulaPath = ''

    // Tentativa direta
    const rates = await fetchExchangeRates(fromCurrency)

    if (rates[toCurrency]) {
      rate = rates[toCurrency]
    } else if (fromCurrency !== 'USD') {
      // Via USD como intermediário
      const usdRates = await fetchExchangeRates('USD')

      if (usdRates[fromCurrency] && usdRates[toCurrency]) {
        rate = usdRates[toCurrency] / usdRates[fromCurrency]
        formulaPath = ' (via USD)'
      } else {
        throw new Error('Taxa não disponível')
      }
    } else {
      throw new Error('Taxa não disponível')
    }

    // Formata a taxa para exibição com precisão adequada
    const formattedRate = formatRate(rate)

    // Obtém símbolos das moedas
    const fromSymbol = getCurrencySymbol(fromCurrency)
    const toSymbol = getCurrencySymbol(toCurrency)

    // Obtém fonte dos dados e timestamp
    const source = localStorage.getItem('exchangeRatesSource') || 'API'
    const lastUpdateTime = lastUpdate ? formatTimestamp(lastUpdate) : 'N/D'

    return `1 ${fromCurrency} (${fromSymbol}) = ${formattedRate} ${toCurrency} (${toSymbol})${formulaPath} [Fonte: ${source}, Atualizado: ${lastUpdateTime}]`
  } catch (error) {
    return `1 ${fromCurrency} = ? ${toCurrency} (Taxa indisponível)`
  }
}

/**
 * Formata a taxa de câmbio com a precisão adequada
 * @param {number} rate - Taxa de câmbio
 * @returns {string} - Taxa formatada
 */
function formatRate(rate) {
  if (rate >= 1000) {
    return rate.toFixed(2)
  } else if (rate >= 100) {
    return rate.toFixed(3)
  } else if (rate >= 10) {
    return rate.toFixed(4)
  } else if (rate >= 1) {
    return rate.toFixed(4)
  } else if (rate >= 0.1) {
    return rate.toFixed(5)
  } else if (rate >= 0.01) {
    return rate.toFixed(6)
  } else if (rate >= 0.001) {
    return rate.toFixed(7)
  } else {
    return rate.toExponential(4)
  }
}

/**
 * Formata um timestamp para exibição amigável
 * @param {Date} date - Data a ser formatada
 * @returns {string} - Timestamp formatado
 */
function formatTimestamp(date) {
  if (!date) return 'N/D'

  const now = new Date()
  const diffMs = now - date
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 1) {
    return 'agora'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} min atrás`
  } else if (diffMinutes < 1440) {
    // Menos de 24 horas
    const hours = Math.floor(diffMinutes / 60)
    return `${hours} hora${hours > 1 ? 's' : ''} atrás`
  } else {
    // Formata como data
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

/**
 * Obtém o símbolo da moeda
 * @param {string} currencyCode - Código da moeda
 * @returns {string} - Símbolo da moeda
 */
function getCurrencySymbol(currencyCode) {
  const currency = currencies.find(c => c.code === currencyCode)
  return currency ? currency.symbol : currencyCode
}

/**
 * Inicia atualizações periódicas em segundo plano
 */
function startBackgroundUpdates() {
  // Primeira atualização após 1 minuto
  setTimeout(() => {
    fetchExchangeRates('USD').catch(() => {}) // Silencia erros

    // Atualizações subsequentes no intervalo definido
    setInterval(() => {
      fetchExchangeRates('USD').catch(() => {})
    }, BACKGROUND_UPDATE_INTERVAL)
  }, 60000)
}

// Carrega as taxas do localStorage ao inicializar
function loadSavedRates() {
  const savedLastUpdate = localStorage.getItem('exchangeRatesLastUpdate')

  if (savedLastUpdate) {
    lastUpdate = new Date(savedLastUpdate)

    // Verifica se as taxas estão muito desatualizadas (mais de 24 horas)
    const now = new Date()
    const isOutdated =
      now.getTime() - lastUpdate.getTime() > 24 * 60 * 60 * 1000

    // Se estiverem desatualizadas, força uma nova busca em breve
    if (isOutdated) {
      console.log('Taxas de câmbio muito desatualizadas, agendando atualização')
      setTimeout(() => fetchExchangeRates('USD'), 1000)
    }

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
  } else {
    // Se não houver dados salvos, agenda busca imediata
    setTimeout(() => fetchExchangeRates('USD'), 500)
  }
}

// Inicializa o carregamento das taxas salvas
loadSavedRates()

// Inicia atualizações em segundo plano
startBackgroundUpdates()

// Exporta o módulo de conversão de moedas
export const currencyConverter = {
  units: currencies,
  defaultFrom,
  defaultTo,
  convert,
  getFormula,
  getLastUpdate: () => lastUpdate
}
