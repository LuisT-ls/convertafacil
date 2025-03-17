/**
 * Módulo para gerenciar a funcionalidade da página de documentação
 */

document.addEventListener('DOMContentLoaded', function () {
  initSidebarNav()
  initScrollSpy()
  setupSmoothScrolling()
})

/**
 * Inicializa a navegação na sidebar da documentação
 */
function initSidebarNav() {
  const navLinks = document.querySelectorAll('.docs-nav a')

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault()

      // Remove a classe active de todos os links
      navLinks.forEach(navLink => navLink.classList.remove('active'))

      // Adiciona a classe active ao link clicado
      this.classList.add('active')

      // Obtém o destino do link
      const targetId = this.getAttribute('href').substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        // Scroll suave até o elemento de destino
        const headerOffset = 80
        const elementPosition = targetElement.getBoundingClientRect().top
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    })
  })
}

/**
 * Inicializa o scroll spy para destacar o item de navegação atual
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('.docs-section, .subsection')
  const navLinks = document.querySelectorAll('.docs-nav a')

  // Função para verificar qual seção está visível na tela
  function highlightNavigation() {
    const scrollPosition = window.scrollY

    // Encontra a seção atualmente visível
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100
      const sectionBottom = sectionTop + section.offsetHeight

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        const targetId = section.getAttribute('id')

        // Remove a classe active de todos os links
        navLinks.forEach(link => link.classList.remove('active'))

        // Adiciona a classe active ao link correspondente
        const activeLink = document.querySelector(
          `.docs-nav a[href="#${targetId}"]`
        )
        if (activeLink) {
          activeLink.classList.add('active')
        }
      }
    })
  }

  // Adiciona o evento de scroll
  window.addEventListener('scroll', highlightNavigation)

  // Executa uma vez ao carregar a página
  highlightNavigation()
}

/**
 * Configura o comportamento de rolagem suave para links internos
 */
function setupSmoothScrolling() {
  // Adiciona rolagem suave para todos os links internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Pula se for um link da sidebar, já tratado em initSidebarNav
      if (this.closest('.docs-nav')) {
        return
      }

      e.preventDefault()

      const targetId = this.getAttribute('href').substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const headerOffset = 80
        const elementPosition = targetElement.getBoundingClientRect().top
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })

        // Atualiza a URL sem recarregar a página
        history.pushState(null, null, `#${targetId}`)
      }
    })
  })
}
