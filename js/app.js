// Importa os módulos da aplicação
import { initDarkMode } from './modules/darkMode.js'
import { initConverter } from './modules/converter.js'
import { initHistory } from './modules/history.js'

// Inicializa a aplicação quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
  console.log('ConvertaFacil iniciado!')

  // Inicializa os módulos da aplicação
  initDarkMode()
  initConverter()
  initHistory()

  // Adiciona efeito de scroll ao header
  initScrollEffect()

  // Inicializa animações de entrada
  initEntryAnimations()
})

// Função para adicionar efeito de scroll ao header
function initScrollEffect() {
  const header = document.querySelector('.header')

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled')
    } else {
      header.classList.remove('scrolled')
    }
  })
}

// Função para animar elementos na entrada da página
function initEntryAnimations() {
  // Animação para categorias
  const categoryButtons = document.querySelectorAll('.category-btn')
  categoryButtons.forEach((button, index) => {
    button.style.opacity = '0'
    button.style.transform = 'translateY(20px)'

    setTimeout(() => {
      button.style.transition = 'all 0.5s ease'
      button.style.opacity = '1'
      button.style.transform = 'translateY(0)'
    }, 100 + index * 100)
  })

  // Animação para o conversor
  const converterInterface = document.querySelector('.converter-interface')
  if (converterInterface) {
    converterInterface.style.opacity = '0'
    converterInterface.style.transform = 'translateY(20px)'

    setTimeout(() => {
      converterInterface.style.transition = 'all 0.7s ease'
      converterInterface.style.opacity = '1'
      converterInterface.style.transform = 'translateY(0)'
    }, 600)
  }

  // Animação para o histórico
  const historySection = document.querySelector('.conversion-history')
  if (historySection) {
    historySection.style.opacity = '0'
    historySection.style.transform = 'translateY(30px)'

    setTimeout(() => {
      historySection.style.transition = 'all 0.8s ease'
      historySection.style.opacity = '1'
      historySection.style.transform = 'translateY(0)'
    }, 800)
  }

  // Efeito de hover no botão swap
  const swapButton = document.getElementById('swapButton')
  if (swapButton) {
    swapButton.addEventListener('mouseenter', () => {
      swapButton.classList.add('hover-effect')
    })

    swapButton.addEventListener('mouseleave', () => {
      swapButton.classList.remove('hover-effect')
    })

    // Efeito de rotação ao clicar
    swapButton.addEventListener('click', () => {
      // A animação é tratada via CSS
    })
  }

  // Adiciona efeito de pulsação ao redor dos inputs quando focados
  const inputs = document.querySelectorAll(
    '.converter-input, .converter-select'
  )
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('input-focus')
    })

    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('input-focus')
    })
  })

  // Animar o logo
  animateLogo()
}

// Função para animar o logo
function animateLogo() {
  const logoSvg = document.querySelector('.logo svg')
  if (!logoSvg) return

  // Adiciona classe de animação ao logo
  logoSvg.classList.add('logo-animated')

  // Animação sutil do círculo interno
  const innerCircle = logoSvg.querySelector('circle:nth-child(2)')
  if (innerCircle) {
    setInterval(() => {
      innerCircle.setAttribute('r', Math.random() > 0.5 ? '19' : '20')
    }, 2000)
  }
}
