/**
 * Módulo principal de conversão de unidades
 */

import { currencyConverter } from './converters/currency.js'
import { temperatureConverter } from './converters/temperature.js'
import { lengthConverter } from './converters/length.js'
import { weightConverter } from './converters/weight.js'
import { volumeConverter } from './converters/volume.js'
import { areaConverter } from './converters/area.js'
import { saveToHistory } from './history.js'

// Variáveis para controle do estado atual
let currentCategory = 'moeda'
let currentConverter = null

// Inicializa o conversor
export function initConverter() {
  // Elementos DOM
  const categoryButtons = document.querySelectorAll('.category-btn')
  const inputValue = document.getElementById('inputValue')
  const outputValue = document.getElementById('outputValue')
  const inputUnit = document.getElementById('inputUnit')
  const outputUnit = document.getElementById('outputUnit')
  const swapButton = document.getElementById('swapButton')
  const conversionFormula = document.getElementById('conversionFormula')
  const lastUpdateSpan = document
    .getElementById('lastUpdate')
    .querySelector('span')

  // Mapeamento de conversores por categoria
  const converters = {
    moeda: currencyConverter,
    temperatura: temperatureConverter,
    comprimento: lengthConverter,
    peso: weightConverter,
    volume: volumeConverter,
    area: areaConverter
  }

  // Define o conversor inicial
  currentConverter = converters[currentCategory]

  // Popula as opções iniciais
  updateUnitOptions()

  // Adiciona listeners para os botões de categoria
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove a classe ativa de todos os botões
      categoryButtons.forEach(btn => btn.classList.remove('active'))

      // Adiciona a classe ativa ao botão clicado
      button.classList.add('active')

      // Atualiza a categoria atual
      currentCategory = button.getAttribute('data-category')

      // Atualiza o conversor atual
      currentConverter = converters[currentCategory]

      // Atualiza as opções das unidades
      updateUnitOptions()

      // Realiza a conversão com os novos valores
      convertValues()
    })
  })

  // Adiciona listeners para os inputs e selects
  inputValue.addEventListener('input', convertValues)
  inputUnit.addEventListener('change', convertValues)
  outputUnit.addEventListener('change', convertValues)

  // Adiciona listener para o botão de troca
  swapButton.addEventListener('click', () => {
    // Troca as unidades selecionadas
    const tempUnit = inputUnit.value
    inputUnit.value = outputUnit.value
    outputUnit.value = tempUnit

    // Realiza a conversão com as unidades trocadas
    convertValues()
  })

  // Função para atualizar as opções das unidades
  function updateUnitOptions() {
    // Limpa as opções atuais
    inputUnit.innerHTML = ''
    outputUnit.innerHTML = ''

    // Adiciona as novas opções baseadas no conversor atual
    if (currentConverter && currentConverter.units) {
      currentConverter.units.forEach(unit => {
        const inputOption = document.createElement('option')
        inputOption.value = unit.code
        inputOption.textContent = `${unit.code} - ${unit.name}`
        inputUnit.appendChild(inputOption)

        const outputOption = document.createElement('option')
        outputOption.value = unit.code
        outputOption.textContent = `${unit.code} - ${unit.name}`
        outputUnit.appendChild(outputOption)
      })

      // Seleciona as opções padrão
      if (currentConverter.defaultFrom) {
        inputUnit.value = currentConverter.defaultFrom
      }

      if (currentConverter.defaultTo) {
        outputUnit.value = currentConverter.defaultTo
      }
    }

    // Realiza a conversão inicial
    convertValues()
  }

  // Função para realizar a conversão
  function convertValues() {
    if (!currentConverter || !currentConverter.convert) {
      return
    }

    const fromValue = parseFloat(inputValue.value) || 0
    const fromUnit = inputUnit.value
    const toUnit = outputUnit.value

    // Realiza a conversão
    currentConverter
      .convert(fromValue, fromUnit, toUnit)
      .then(result => {
        // Atualiza o valor de saída
        outputValue.value = result.toFixed(6).replace(/\.?0+$/, '')

        // Atualiza a fórmula de conversão
        if (currentConverter.getFormula) {
          currentConverter
            .getFormula(fromValue, fromUnit, toUnit)
            .then(formula => {
              conversionFormula.textContent = formula
            })
        }

        // Atualiza a data da última atualização
        const now = new Date()
        lastUpdateSpan.textContent = now.toLocaleTimeString()

        // Salva no histórico
        if (fromValue !== 0) {
          const historyItem = {
            category: currentCategory,
            fromValue,
            fromUnit,
            toValue: result,
            toUnit,
            timestamp: now.getTime()
          }

          saveToHistory(historyItem)
        }
      })
      .catch(error => {
        console.error('Erro na conversão:', error)
        outputValue.value = 'Erro'
        conversionFormula.textContent = 'Erro na conversão'
      })
  }

  // Realiza a conversão inicial
  convertValues()
}
