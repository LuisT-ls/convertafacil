/**
 * Módulo para gerenciar a funcionalidade da página de FAQ
 */

document.addEventListener('DOMContentLoaded', function () {
  initFaqToggles()
  initCategoryTabs()
  initSearch()
})

/**
 * Inicializa a funcionalidade de abrir/fechar itens de FAQ
 */
function initFaqToggles() {
  const faqItems = document.querySelectorAll('.faq-item')

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question')
    const answer = item.querySelector('.faq-answer')

    // Define a altura inicial para 0
    answer.style.height = '0px'

    question.addEventListener('click', () => {
      // Verifica se o item está ativo
      const isActive = item.classList.contains('active')

      // Fecha todos os itens abertos
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active')
          otherItem.querySelector('.faq-answer').style.height = '0px'
        }
      })

      // Alterna o estado do item atual
      if (isActive) {
        item.classList.remove('active')
        answer.style.height = '0px'
      } else {
        item.classList.add('active')
        answer.style.height = answer.scrollHeight + 'px'
      }
    })
  })
}

/**
 * Inicializa as abas de categorias para filtrar perguntas
 */
function initCategoryTabs() {
  const categoryButtons = document.querySelectorAll(
    '.faq-categories .category-btn'
  )
  const faqGroups = document.querySelectorAll('.faq-group')

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove a classe active de todos os botões
      categoryButtons.forEach(btn => btn.classList.remove('active'))

      // Adiciona a classe active ao botão clicado
      button.classList.add('active')

      // Obtém a categoria selecionada
      const selectedCategory = button.getAttribute('data-category')

      // Esconde todos os grupos de perguntas
      faqGroups.forEach(group => {
        group.style.display = 'none'
      })

      // Mostra o grupo de perguntas correspondente à categoria selecionada
      const selectedGroup = document.querySelector(
        `.faq-group[data-category="${selectedCategory}"]`
      )
      if (selectedGroup) {
        selectedGroup.style.display = 'block'
      }

      // Adiciona animação suave
      if (selectedGroup) {
        selectedGroup.style.opacity = '0'
        selectedGroup.style.transform = 'translateY(10px)'

        setTimeout(() => {
          selectedGroup.style.transition =
            'opacity 0.3s ease, transform 0.3s ease'
          selectedGroup.style.opacity = '1'
          selectedGroup.style.transform = 'translateY(0)'
        }, 50)
      }
    })
  })
}

/**
 * Inicializa a funcionalidade de busca
 */
function initSearch() {
  const searchInput = document.getElementById('faqSearch')
  const faqItems = document.querySelectorAll('.faq-item')
  const categoryButtons = document.querySelectorAll(
    '.faq-categories .category-btn'
  )
  const noResultsMessage = createNoResultsMessage()

  // Armazenamento do conteúdo original para restauração após a busca
  faqItems.forEach(item => {
    const answer = item.querySelector('.faq-answer')
    answer.originalHTML = answer.innerHTML
  })

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase().trim()

    if (searchTerm.length < 2) {
      // Se o termo de busca for muito curto, restaura a visualização padrão
      resetView()

      // Esconde a mensagem de nenhum resultado
      if (document.contains(noResultsMessage)) {
        noResultsMessage.remove()
      }

      return
    }

    // Exibe todos os grupos para pesquisar em todos eles
    document.querySelectorAll('.faq-group').forEach(group => {
      group.style.display = 'block'
    })

    let hasResults = false

    faqItems.forEach(item => {
      const questionText = item
        .querySelector('.faq-question h3')
        .textContent.toLowerCase()
      const answerText = item
        .querySelector('.faq-answer')
        .textContent.toLowerCase()
      const isMatch =
        questionText.includes(searchTerm) || answerText.includes(searchTerm)

      if (isMatch) {
        item.style.display = 'block'
        hasResults = true

        // Destaca os termos de busca
        highlightSearchTerms(item, searchTerm)

        // Abre o item que corresponde à busca
        item.classList.add('active')
        const answerElem = item.querySelector('.faq-answer')
        answerElem.style.height = answerElem.scrollHeight + 'px'
      } else {
        item.style.display = 'none'
      }
    })

    // Desativa os botões de categoria durante a busca
    categoryButtons.forEach(btn => {
      btn.classList.remove('active')
      btn.disabled = true
    })

    // Exibe mensagem de nenhum resultado se necessário
    if (!hasResults) {
      document.querySelector('.faq-items').appendChild(noResultsMessage)
    } else if (document.contains(noResultsMessage)) {
      noResultsMessage.remove()
    }
  })

  // Detecta quando o campo de busca é limpo
  searchInput.addEventListener('keydown', e => {
    if (
      e.key === 'Escape' ||
      (e.key === 'Backspace' && searchInput.value.length <= 1)
    ) {
      searchInput.value = ''
      resetView()

      // Esconde a mensagem de nenhum resultado
      if (document.contains(noResultsMessage)) {
        noResultsMessage.remove()
      }
    }
  })

  // Função para restaurar a visualização padrão
  function resetView() {
    // Restaura a exibição de todos os itens
    faqItems.forEach(item => {
      item.style.display = 'block'

      // Remove as marcações de destaque
      const question = item.querySelector('.faq-question h3')
      const answer = item.querySelector('.faq-answer')

      question.innerHTML = question.textContent
      if (answer.originalHTML) {
        answer.innerHTML = answer.originalHTML
      }

      // Fecha os itens abertos durante a busca
      item.classList.remove('active')
      answer.style.height = '0px'
    })

    // Reativa os botões de categoria
    categoryButtons.forEach(btn => {
      btn.disabled = false
    })

    // Restaura a categoria ativa
    const activeCategory =
      document.querySelector('.category-btn.active') ||
      document.querySelector('.category-btn')
    if (activeCategory) {
      activeCategory.classList.add('active')
      activeCategory.click()
    }
  }

  // Função para destacar os termos de busca
  function highlightSearchTerms(item, searchTerm) {
    const question = item.querySelector('.faq-question h3')
    const answer = item.querySelector('.faq-answer')

    // Destaca os termos na pergunta
    const questionText = question.textContent
    const highlightedQuestion = questionText.replace(
      new RegExp(escapeRegExp(searchTerm), 'gi'),
      match => `<span class="highlight">${match}</span>`
    )
    question.innerHTML = highlightedQuestion

    // Destaca os termos na resposta
    const answerHTML = answer.originalHTML || answer.innerHTML
    const tempElement = document.createElement('div')
    tempElement.innerHTML = answerHTML

    // Função recursiva para encontrar e destacar texto
    function highlightNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
          const newNode = document.createElement('span')
          const content = node.textContent
          newNode.innerHTML = content.replace(
            new RegExp(escapeRegExp(searchTerm), 'gi'),
            match => `<span class="highlight">${match}</span>`
          )
          node.parentNode.replaceChild(newNode, node)
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Não processa elementos highlight já criados para evitar aninhamento
        if (node.classList && node.classList.contains('highlight')) {
          return
        }
        // Processa filhos recursivamente
        Array.from(node.childNodes).forEach(child => highlightNode(child))
      }
    }

    // Processa todos os nós do conteúdo
    Array.from(tempElement.childNodes).forEach(node => highlightNode(node))

    // Atualiza o conteúdo da resposta
    answer.innerHTML = tempElement.innerHTML
  }

  // Função para escapar caracteres especiais em expressões regulares
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
}

/**
 * Cria o elemento de mensagem para quando não há resultados
 */
function createNoResultsMessage() {
  const noResults = document.createElement('div')
  noResults.className = 'no-results'
  noResults.innerHTML = `
    <p>Nenhum resultado encontrado.</p>
    <p>Tente uma pesquisa diferente ou navegue pelas categorias acima.</p>
  `
  return noResults
}

// Adiciona ícones de busca e outros que possam faltar
;(function addSearchIcon() {
  const styleElement = document.createElement('style')
  styleElement.textContent = `
    .icon-search {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
      display: inline-block;
      width: 1.25rem;
      height: 1.25rem;
      vertical-align: middle;
      background-repeat: no-repeat;
      background-position: center;
    }
  `
  document.head.appendChild(styleElement)
})()
