/**
 * Módulo para gerenciar o modo escuro da aplicação
 */

// Inicializa o modo escuro
export function initDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle')
  const darkModeIcon = darkModeToggle.querySelector('i')

  // Verifica a preferência do usuário no localStorage
  const savedTheme = localStorage.getItem('theme')

  // Verifica a preferência do sistema
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  // Aplica o tema inicial
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
    document.documentElement.setAttribute('data-theme', 'dark')
    darkModeIcon.classList.remove('icon-moon')
    darkModeIcon.classList.add('icon-sun')
  }

  // Adiciona o evento de clique ao botão de alternar o tema
  darkModeToggle.addEventListener('click', () => {
    // Adiciona animação ao botão
    darkModeToggle.classList.add('theme-toggle-active')

    // Verifica o tema atual
    const currentTheme = document.documentElement.getAttribute('data-theme')

    // Adiciona classe para animação de transição
    document.body.classList.add('theme-transition')

    if (currentTheme === 'dark') {
      // Muda para o tema claro
      document.documentElement.setAttribute('data-theme', 'light')

      // Troca ícone com animação
      animateIconChange(darkModeIcon, 'icon-sun', 'icon-moon')

      // Salva preferência
      localStorage.setItem('theme', 'light')
    } else {
      // Muda para o tema escuro
      document.documentElement.setAttribute('data-theme', 'dark')

      // Troca ícone com animação
      animateIconChange(darkModeIcon, 'icon-moon', 'icon-sun')

      // Salva preferência
      localStorage.setItem('theme', 'dark')
    }

    // Remove a classe de animação do botão após a transição
    setTimeout(() => {
      darkModeToggle.classList.remove('theme-toggle-active')
      document.body.classList.remove('theme-transition')
    }, 500)
  })

  // Adiciona listener para mudanças na preferência do sistema
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', event => {
      if (!localStorage.getItem('theme')) {
        // Se o usuário não definiu uma preferência, segue a do sistema
        const newTheme = event.matches ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', newTheme)

        if (newTheme === 'dark') {
          darkModeIcon.classList.remove('icon-moon')
          darkModeIcon.classList.add('icon-sun')
        } else {
          darkModeIcon.classList.remove('icon-sun')
          darkModeIcon.classList.add('icon-moon')
        }
      }
    })
}

// Função para animar a troca de ícones
function animateIconChange(iconElement, fromClass, toClass) {
  // Adiciona classe de fade out
  iconElement.classList.add('icon-fade-out')

  // Aguarda a animação de fade out
  setTimeout(() => {
    // Troca as classes dos ícones
    iconElement.classList.remove(fromClass)
    iconElement.classList.add(toClass)

    // Remove classe de fade out
    iconElement.classList.remove('icon-fade-out')

    // Adiciona classe de fade in
    iconElement.classList.add('icon-fade-in')

    // Remove classe de fade in após a animação
    setTimeout(() => {
      iconElement.classList.remove('icon-fade-in')
    }, 300)
  }, 300)
}

// Adiciona estilos dinâmicos para as animações
;(function addDynamicStyles() {
  const styleElement = document.createElement('style')
  styleElement.textContent = `
    .icon-fade-out {
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .icon-fade-in {
      opacity: 1;
      transition: opacity 0.3s ease;
    }
    
    .theme-toggle-active {
      transform: scale(1.1);
    }
    
    .theme-transition {
      transition: background-color 0.5s ease, color 0.5s ease;
    }
    
    .logo-animated {
      animation: float 5s ease-in-out infinite;
    }
  `
  document.head.appendChild(styleElement)
})()
