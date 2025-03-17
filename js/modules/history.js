/**
 * Módulo para gerenciar o histórico de conversões
 */

// Chave para armazenar o histórico no localStorage
const HISTORY_STORAGE_KEY = 'convertafacil_history'

// Limite máximo de itens no histórico
const MAX_HISTORY_ITEMS = 10

// Variável para armazenar o histórico em memória
let conversionHistory = []

// Função para renderizar o histórico na interface - movida para escopo global
function renderHistory() {
  const historyList = document.getElementById('historyList')
  if (!historyList) return

  // Limpa a lista atual
  historyList.innerHTML = ''

  // Verifica se há itens no histórico
  if (conversionHistory.length === 0) {
    const emptyMessage = document.createElement('li')
    emptyMessage.className = 'empty-history'
    emptyMessage.textContent = 'Nenhuma conversão no histórico'
    historyList.appendChild(emptyMessage)
    return
  }

  // Adiciona cada item do histórico à lista
  conversionHistory.forEach((item, index) => {
    const historyItem = document.createElement('li')
    historyItem.className = 'history-item'

    // Formata os valores para exibição
    const fromValue = formatValue(item.fromValue)
    const toValue = formatValue(item.toValue)

    // Adiciona o conteúdo do item
    historyItem.innerHTML = `
      <div class="history-item-details">
        <span class="history-item-conversion">${fromValue} ${
      item.fromUnit
    } = ${toValue} ${item.toUnit}</span>
        <span class="history-item-date">${formatDate(
          new Date(item.timestamp)
        )}</span>
      </div>
      <button class="btn-icon history-item-delete" data-index="${index}" aria-label="Remover item">
        <i class="icon icon-trash"></i>
      </button>
    `

    historyList.appendChild(historyItem)
  })

  // Adiciona listeners para os botões de excluir
  const deleteButtons = document.querySelectorAll('.history-item-delete')
  deleteButtons.forEach(button => {
    button.addEventListener('click', e => {
      const index = parseInt(e.currentTarget.getAttribute('data-index'), 10)
      removeHistoryItem(index)
      renderHistory()
    })
  })

  // Adiciona listeners para clicar em um item do histórico
  const historyItems = document.querySelectorAll('.history-item-details')
  historyItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      // Carrega a conversão selecionada
      loadConversion(conversionHistory[index])
    })
  })
}

// Função para carregar uma conversão do histórico - movida para escopo global
function loadConversion(item) {
  // Dispara um evento personalizado para carregar a conversão
  const event = new CustomEvent('history:loadConversion', {
    detail: item
  })

  document.dispatchEvent(event)
}

// Inicializa o módulo de histórico
export function initHistory() {
  // Carrega o histórico do localStorage
  loadHistory()

  // Elementos DOM
  const clearHistoryBtn = document.getElementById('clearHistoryBtn')

  // Renderiza o histórico inicial
  renderHistory()

  // Adiciona listener para o botão de limpar histórico
  clearHistoryBtn.addEventListener('click', () => {
    clearHistory()
    renderHistory()
  })
}

// Função para salvar um novo item no histórico
export function saveToHistory(item) {
  // Verifica se o item é válido
  if (!item || !item.fromValue || !item.toValue) {
    return
  }

  // Verifica se já existe um item idêntico
  const existingIndex = conversionHistory.findIndex(
    existingItem =>
      existingItem.category === item.category &&
      existingItem.fromValue === item.fromValue &&
      existingItem.fromUnit === item.fromUnit &&
      existingItem.toUnit === item.toUnit
  )

  // Se existir, remove o item antigo
  if (existingIndex !== -1) {
    conversionHistory.splice(existingIndex, 1)
  }

  // Adiciona o novo item no início do array
  conversionHistory.unshift(item)

  // Limita o tamanho do histórico
  if (conversionHistory.length > MAX_HISTORY_ITEMS) {
    conversionHistory = conversionHistory.slice(0, MAX_HISTORY_ITEMS)
  }

  // Salva no localStorage
  saveHistory()

  // Renderiza o histórico atualizado
  renderHistory()
}

// Função para remover um item do histórico
function removeHistoryItem(index) {
  // Remove o item do array
  conversionHistory.splice(index, 1)

  // Salva no localStorage
  saveHistory()
}

// Função para limpar todo o histórico
function clearHistory() {
  // Limpa o array
  conversionHistory = []

  // Remove do localStorage
  localStorage.removeItem(HISTORY_STORAGE_KEY)
}

// Função para carregar o histórico do localStorage
function loadHistory() {
  try {
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY)

    if (savedHistory) {
      conversionHistory = JSON.parse(savedHistory)
    }
  } catch (error) {
    console.error('Erro ao carregar histórico:', error)
    conversionHistory = []
  }
}

// Função para salvar o histórico no localStorage
function saveHistory() {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(conversionHistory))
  } catch (error) {
    console.error('Erro ao salvar histórico:', error)
  }
}

// Função auxiliar para formatar valores
function formatValue(value) {
  // Converte para número para garantir que é um valor numérico
  const num = parseFloat(value)

  // Verifica se é um número inteiro
  if (Number.isInteger(num)) {
    return num.toString()
  }

  // Formata números grandes ou pequenos com notação científica
  if (Math.abs(num) < 0.0001 || Math.abs(num) > 100000) {
    return num.toExponential(4)
  }

  // Remove zeros no final
  return num.toFixed(6).replace(/\.?0+$/, '')
}

// Função auxiliar para formatar datas
function formatDate(date) {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
